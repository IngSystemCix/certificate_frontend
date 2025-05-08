import { NgStyle } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

type MenuItem = {
  label: string;
  icon: string;
  action: () => void;
};


@Component({
  selector: 'app-menu-float',
  imports: [NgStyle],
  templateUrl: './menu-float.component.html',
  styleUrl: './menu-float.component.css',
})
export class MenuFloatComponent implements OnInit {
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() items: Array<MenuItem> = [];
  @Input() rowData: Array<unknown> = [];
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('menu') menuRef!: ElementRef;
  @Input() isModal: boolean = false;

  position: { top: string; left: string } = { top: '0px', left: '0px' };

  ngOnInit() {
    this.adjustPosition();
  }

  adjustPosition() {
    const menuHeight = 179;
    const menuWidth = 174;
    const margin = 10;

    let top = this.y;
    let left = this.x;

    if (this.isModal) {
      // Centrado relativo al punto clic
      top = this.y - menuHeight / 2;
      left = this.x - menuWidth / 2;

      // Corrección para evitar que se salga de los bordes de la ventana
      if (top < margin) top = margin;
      if (left < margin) left = margin;
      if (top + menuHeight > window.innerHeight) {
        top = window.innerHeight - menuHeight - margin;
      }
      if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - margin;
      }
    } else {
      // Normal: mostrar hacia abajo a la derecha, con correcciones si se sale
      if (this.y + menuHeight > window.innerHeight) {
        top = window.innerHeight - menuHeight - margin;
      }
      if (this.x + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - margin;
      }
    }

    this.position = {
      top: `${top}px`,
      left: `${left}px`,
    };
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.menuRef?.nativeElement.contains(event.target)) {
      this.onClose.emit();
    }
  }
}
