import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type SidebarItem = {
  name: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;
  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  sidebarItems: SidebarItem[] = [
    { name: 'Inicio', icon: 'bi-house', route: '/dashboard' },
    { name: 'Cerrar sesión', icon: 'bi-box-arrow-right', route: '/logout' },
  ];

  handleOpenMenu(): void {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

}
