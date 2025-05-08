import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [NgStyle, NgClass],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
})
export class AvatarComponent {
  @Input() username!: string;
  @Input() width!: string;
  @Input() height!: string;
  @Input() fontSize!: string;

  getColor(name: string): string {
    return this.generatorColorHSLA(name);
  }

  getInitials(): string {
    return this.username
      .split(' ')
      .map((n) => n.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  generatorColorHSLA = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = Math.abs((hash % 40) * 9); // Hue
    const s = 30; // Saturation (puedes ajustarlo según necesidad)
    const l = 65; // Lightness (ajustable también)
    const a = 1; // Alpha (opacidad, 1 es completamente opaco)

    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  };
}
