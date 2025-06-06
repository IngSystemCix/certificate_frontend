import { NgClass } from "@angular/common"
import { Component, EventEmitter, inject, Input, Output } from "@angular/core"
import { AuthService } from "../../../core/infrastructure"
import { Router } from "@angular/router"
import { jwtDecode } from "jwt-decode"
import { JwtPayload } from "../../../core/domain"

/**
 * Representa un ítem del sidebar.
 * Cada ítem contiene información como etiqueta, ícono, ruta y roles permitidos.
 */
type SidebarItem = {
  /** Etiqueta del ítem que se muestra en el sidebar. */
  label: string
  /** Clase del ícono que se utiliza para representar el ítem. */
  icon: string
  /** Ruta de navegación asociada al ítem. */
  routerLink: string
  /** Lista de roles que tienen acceso al ítem. */
  role: string[]
}

/**
 * Componente Sidebar
 *
 * Este componente representa el sidebar de la aplicación.
 * Permite mostrar ítems de navegación basados en los roles del usuario y manejar su estado de apertura/cierre.
 */
@Component({
  selector: "app-sidebar",
  imports: [NgClass],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent {
  /**
   * Token de acceso almacenado en el localStorage.
   * Se utiliza para decodificar los roles del usuario.
   */
  protected token = localStorage.getItem("accessToken")

  /**
   * Servicio de autenticación inyectado.
   * Se utiliza para manejar el logout del usuario.
   */
  protected authService = inject(AuthService)

  /**
   * Servicio de enrutamiento inyectado.
   * Se utiliza para redirigir al usuario a diferentes rutas.
   */
  protected router = inject(Router)

  /**
   * Indica si el sidebar está abierto o cerrado.
   * Este valor se recibe como entrada desde el componente padre.
   */
  @Input() isOpen: boolean = false

  /**
   * Evento que emite cambios en el estado de apertura/cierre del sidebar.
   * Este evento se utiliza para comunicar el estado al componente padre.
   */
  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>()

  /**
   * Roles del usuario actual, obtenidos del token decodificado.
   */
  protected rol: string[] = this.getRole(
    jwtDecode<JwtPayload>(this.token || "").roles,
  )

  /**
   * Obtiene los roles del usuario en formato simplificado.
   *
   * @param role - Rol del usuario obtenido del token.
   * @returns Lista de roles simplificados.
   */
  getRole(role: string): string[] {
    switch (role) {
      case "PERSONAL":
        return ["PE"]
      case "ADMINISTRADOR":
        return ["AD"]
      default:
        return []
    }
  }

  /**
   * Lista de ítems que se muestran en el sidebar.
   * Cada ítem incluye información como etiqueta, ícono, ruta y roles permitidos.
   */
  protected sidebarItems: SidebarItem[] = [
    {
      label: "Inicio",
      icon: "bi bi-house",
      routerLink: "/home",
      role: ["PE", "AD"],
    },
    {
      label: "Persona",
      icon: "bi bi-person-plus",
      routerLink: "/add-user",
      role: ["AD"],
    },
  ]

  /**
   * Maneja el evento de toggle del sidebar.
   * Cambia el estado de apertura/cierre y emite el nuevo estado.
   */
  handleSidebarToggle() {
    this.isOpen = !this.isOpen
    this.isOpenChange.emit(this.isOpen)
  }

  /**
   * Maneja el evento de logout del usuario.
   * Limpia los tokens almacenados y redirige al usuario a la página de login.
   * Si hay un token de refresh, intenta realizar el logout en el servidor.
   */
  handleLogout(): void {
    const token = localStorage.getItem("refreshToken")

    if (!token) {
      // Si no hay token, solo limpia y redirige
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      this.router.navigate(["/login"])
      return
    }

    this.authService.logout(token).subscribe({
      next: () => {
        // Limpia tokens al cerrar sesión
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        this.router.navigate(["/login"])
      },
      error: (err) => {
        console.error("Error al hacer logout:", err)
        // También limpiar y redirigir aunque haya error
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        this.router.navigate(["/login"])
      },
    })
  }

  /**
   * Verifica si el usuario tiene acceso a un ítem del sidebar basado en sus roles.
   *
   * @param itemRol - Lista de roles permitidos para el ítem.
   * @returns `true` si el usuario tiene al menos uno de los roles permitidos, `false` en caso contrario.
   */
  hasRole(itemRol: string[]): boolean {
    return this.rol.some((rol) => itemRol.includes(rol))
  }
}
