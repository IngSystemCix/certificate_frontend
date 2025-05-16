import { Component } from "@angular/core"
import { NavbarComponent, SidebarComponent } from "../../shared"

@Component({
  selector: "app-certificate",
  imports: [NavbarComponent, SidebarComponent],
  templateUrl: "./certificate.component.html",
  styleUrl: "./certificate.component.css",
})
export class CertificateComponent {
  protected isOpen: boolean = false
  protected name: string = "Daniel Ramos Marrufo"
  protected description: string =
    "Por su participación en el curso de Angular desde cero a principiante. Extendemos nuestro agradecimiento por su dedicación y esfuerzo en el aprendizaje de esta tecnología."
  protected signature: string = "Ing. Juan Romero Collazos"
  protected idCertificate: string = "ADFF-1234-5678-90AB-CDEF12345678"
}
