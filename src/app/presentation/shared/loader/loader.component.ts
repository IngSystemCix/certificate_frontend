import { Component, Input } from "@angular/core"

/**
 * LoaderComponent
 *
 * Este componente representa un indicador de carga que puede ser utilizado
 * en cualquier parte de la aplicación para mostrar que una operación está en progreso.
 */
@Component({
  selector: "app-loader",
  imports: [],
  templateUrl: "./loader.component.html",
  styleUrl: "./loader.component.css",
})
export class LoaderComponent {
  /**
   * Indica si el loader debe estar visible o no.
   *
   * @type {boolean}
   * @default false
   *
   * Este valor se recibe como entrada desde el componente padre.
   * Cuando es `true`, el loader se muestra; cuando es `false`, se oculta.
   */
  @Input() isLoading: boolean = false
}
