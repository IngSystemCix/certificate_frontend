import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core"
import { provideRouter } from "@angular/router"
import { providePrimeNG } from "primeng/config"
import Aura from "@primeng/themes/aura"
import { provideAnimations } from "@angular/platform-browser/animations"
import { routes } from "./app.routes"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { authInterceptor } from "./core/infrastructure"

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: "body[data-theme='dark']",
        },
      },
      translation: {
        accept: "Aceptar",
        cancel: "Cancelar",
        apply: "Aplicar",
        clear: "Limpiar",
      },
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
}
