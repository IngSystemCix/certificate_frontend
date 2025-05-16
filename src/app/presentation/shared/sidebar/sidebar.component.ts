import { NgClass } from "@angular/common"
import { Component, EventEmitter, Input, Output } from "@angular/core"

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
  @Input() isOpen: boolean = false
  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>()
  protected rol: string[] = ["AD"]

  protected sidebarItems: SidebarItem[] = [
    {
      label: "Inicio",
      icon: "bi bi-house",
      routerLink: "/home",
      role: ["PE", "AD"],
    },
    {
      label: "Agregar Usuario",
      icon: "bi bi-person-plus",
      routerLink: "/add-user",
      role: ["AD"],
    },
  ]

  handleSidebarToggle() {
    this.isOpen = !this.isOpen
    this.isOpenChange.emit(this.isOpen)
  }

  hasRole(itemRol: string[]): boolean {
    return this.rol.some((rol) => itemRol.includes(rol))
  }
}
