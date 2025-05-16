import { Component, EventEmitter, Input, Output } from "@angular/core"
import { AvatarModule } from "primeng/avatar"

@Component({
  selector: "app-navbar",
  imports: [AvatarModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent {
  @Input() isOpen: boolean = false
  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>()
  username: string = "Jhon Doe"

  get usernameInitials(): string {
    return this.username
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
  }

  generateColorHSLA(usr: string): string {
    let hash = 0
    for (let i = 0; i < usr.length; i++) {
      hash += usr.charCodeAt(i) + ((hash << 5) - hash)
    }

    const h = Math.abs((hash % 40) * 9)
    const s = 30
    const l = 50
    const a = 1
    return `hsla(${h}, ${s}%, ${l}%, ${a})`
  }

  handleSidebarToggle() {
    this.isOpen = !this.isOpen
    this.isOpenChange.emit(this.isOpen)
  }
}
