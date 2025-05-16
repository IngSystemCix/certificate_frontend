import { AfterViewInit, Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { LoaderComponent } from "./presentation/shared"

@Component({
  selector: "app-root",
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements AfterViewInit {
  title = "certificate"
  isLoading = true
  ngAfterViewInit() {
    window.addEventListener("load", () => {
      this.isLoading = false
    })
  }
}
