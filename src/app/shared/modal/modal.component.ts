import { NgClass } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [NgClass],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() isOpen: boolean = false;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(): void {
    if (this.isOpen) {
      this.handleClose();
    }
  }

  handleClose() {
    this.isOpen = false;
    this.onClose.emit();
  }
}
