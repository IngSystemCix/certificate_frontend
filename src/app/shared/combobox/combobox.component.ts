import { Component, EventEmitter, Input, Output } from '@angular/core';

type OptionType = {
  label: string;
  value: string | number;
  action?: () => void;
};

@Component({
  selector: 'app-combobox',
  imports: [],
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.css',
})
export class ComboboxComponent {
  @Input() options!: OptionType[];
  @Input() index!: number;
  @Input() rowData!: Array<unknown>;
  @Output() onChange: EventEmitter<Event> = new EventEmitter<Event>();

  handleChange(event: Event, idx: number) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    this.rowData[idx] = selectedValue as unknown;
    this.onChange.emit(event);
  }
}
