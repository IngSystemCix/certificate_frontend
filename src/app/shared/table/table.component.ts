import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MenuFloatComponent } from '../menu-float/menu-float.component';
import { ComboboxComponent } from '../combobox/combobox.component';

type OptionType = {
  label: string;
  value: string | number;
  action?: () => void;
};

type MenuItem = {
  label: string;
  icon: string;
  action: () => void;
};

@Component({
  selector: 'app-table',
  imports: [NgClass, MenuFloatComponent, ComboboxComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  protected menuIndexOpen: number | null = null;
  protected menuX = 0;
  protected menuY = 0;
  protected itemsMenu: Array<MenuItem> = [
    { label: 'Ver', icon: 'bi bi-eye', action: () => console.log('Ver') },
    {
      label: 'Emitir',
      icon: 'bi bi-file-earmark-text',
      action: () => console.log('Emitir'),
    },
    {
      label: 'Reemitir',
      icon: 'bi bi-file-earmark-text',
      action: () => console.log('Reemitir'),
    },
    {
      label: 'Cancelar',
      icon: 'bi bi-x-circle',
      action: () => console.log('Cancelar'),
    },
  ];
  protected rowData: Array<unknown> = [];
  protected rowDataOpen: Array<unknown> | null = [];

  @Input() headers: string[] = [];
  @Input() data: Array<unknown[]> = [];
  @Input() search: string = '';
  @Input() selectedColumnSearch: string[] = [];
  @Input() minWidth?: string = 'min-w-[640px]';
  @Input() itemsCombobox!: OptionType[];
  @Input() isModal!: boolean;
  onComboChange(event: Event, idx: number) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    this.rowData[idx] = selectedValue as unknown;
  }
  openMenu(event: MouseEvent, row: Array<unknown>, idx: number) {
    event.preventDefault();
    event.stopPropagation();

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

    if (this.isModal) {
      // Ajuste para modal: calcula la posición del contenedor modal
      const modalElement = (event.currentTarget as HTMLElement).closest(
        '.modal-class',
      );
      const modalRect = modalElement?.getBoundingClientRect() || {
        left: 0,
        top: 0,
      };
      const scrollTop = modalElement ? modalElement.scrollTop : 0;
      const scrollLeft = modalElement ? modalElement.scrollLeft : 0;

      // Calcular la posición relativa dentro del modal
      this.menuX = rect.left - modalRect.left + scrollLeft;
      this.menuY = rect.top - modalRect.top + scrollTop;
    } else {
      // Posición normal fuera del modal
      this.menuX = rect.left;
      this.menuY = rect.bottom;
    }

    this.menuIndexOpen = idx;
    this.rowDataOpen = row;
  }

  closeMenu() {
    this.menuIndexOpen = null;
    this.rowDataOpen = null;
  }

  get filteredData(): Array<unknown[]> {
    if (!this.search.trim()) return this.data;

    const searchLower = this.search.toLowerCase();

    return this.data.filter((row) =>
      row.some((cell, index) => {
        // Si se especificaron columnas a buscar, limitamos
        if (
          this.selectedColumnSearch.length > 0 &&
          !this.selectedColumnSearch.includes(this.headers[index])
        ) {
          return false;
        }
        return String(cell).toLowerCase().includes(searchLower);
      }),
    );
  }
}
