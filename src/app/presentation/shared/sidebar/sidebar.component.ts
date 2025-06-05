import { NgClass } from "@angular/common"
import { Component, EventEmitter, inject, Input, Output } from "@angular/core"
import { AuthService } from "../../../core/infrastructure"
import { Router } from "@angular/router"
import { jwtDecode } from "jwt-decode"
import { JwtPayload } from "../../../core/domain"

type SidebarItem = {
  label: string
  icon: string
  routerLink: string
  role: string[]
}

@Component({
  selector: "app-sidebar",
  imports: [NgClass],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent {
  protected token = localStorage.getItem("accessToken")
  protected authService = inject(AuthService)
  protected router = inject(Router)
  @Input() isOpen: boolean = false
  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>()
  protected rol: string[] = this.getRole(
    jwtDecode<JwtPayload>(this.token || "").roles,
  )

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

  handleSidebarToggle() {
    this.isOpen = !this.isOpen
    this.isOpenChange.emit(this.isOpen)
  }

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

  hasRole(itemRol: string[]): boolean {
    return this.rol.some((rol) => itemRol.includes(rol))
  }
}
