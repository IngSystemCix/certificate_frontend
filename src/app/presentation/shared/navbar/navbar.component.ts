import { Component, EventEmitter, Input, Output } from "@angular/core"
import { AvatarModule } from "primeng/avatar"
import { jwtDecode } from "jwt-decode"
import { JwtPayload } from "../../../core/domain"

/**
 * NavbarComponent
 *
 * Este componente representa la barra de navegación de la aplicación.
 * Incluye funcionalidades como mostrar el nombre del usuario, generar colores únicos
 * basados en el nombre y manejar el estado de apertura/cierre de un sidebar.
 */
@Component({
  selector: "app-navbar",
  imports: [AvatarModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent {
  /**
   * Token de acceso almacenado en el localStorage.
   * Se utiliza para decodificar información del usuario.
   */
  protected token = localStorage.getItem("accessToken")

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
   * Nombre completo del usuario, obtenido del token decodificado.
   */
  username: string = jwtDecode<JwtPayload>(this.token || "").fullName

  /**
   * Obtiene las iniciales del nombre del usuario.
   *
   * @returns Las iniciales en mayúsculas, formadas por las primeras letras
   * de las dos primeras palabras del nombre completo.
   */
  get usernameInitials(): string {
    const names = this.username.split(" ")
    // Tomar solo las dos primeras palabras y obtener la primera letra de cada una
    return names
      .slice(0, 2)
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
  }

  /**
   * Genera un color único en formato HSLA basado en el nombre del usuario.
   *
   * @param usr - Nombre del usuario.
   * @returns Un string que representa el color en formato HSLA.
   */
  generateColorHSLA(usr: string): string {
    let hash = 0
    for (let i = 0; i < usr.length; i++) {
      hash += usr.charCodeAt(i) + ((hash << 5) - hash)
    }

    const h = Math.abs((hash % 40) * 9) // Hue basado en el hash
    const s = 30 // Saturación fija
    const l = 50 // Luminosidad fija
    const a = 1 // Alpha fijo
    return `hsla(${h}, ${s}%, ${l}%, ${a})`
  }

  /**
   * Maneja el evento de toggle del sidebar.
   * Cambia el estado de apertura/cierre y emite el nuevo estado.
   */
  handleSidebarToggle() {
    this.isOpen = !this.isOpen
    this.isOpenChange.emit(this.isOpen)
  }
}
