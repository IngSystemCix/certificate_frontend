import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core"
import { NavbarComponent } from "../../shared"
import { QRCodeComponent } from "angularx-qrcode"
import { NgClass } from "@angular/common"
import jsPDF from "jspdf"
import * as htmlToImage from "html-to-image"

@Component({
  selector: "app-certificate",
  imports: [NavbarComponent, QRCodeComponent, NgClass],
  templateUrl: "./certificate.component.html",
  styleUrl: "./certificate.component.css",
})
export class CertificateComponent implements OnInit, OnDestroy {
  protected isOpen: boolean = false
  protected name: string = "Daniel David Ramos Marrufo"
  protected description: string =
    "Por su participación en el curso de Angular desde cero a principiante. Extendemos nuestro agradecimiento por su dedicación y esfuerzo en el aprendizaje de esta tecnología."
  protected signature: string = "Ing. Juan Romero Collazos"
  protected idCertificate: string = "ADFF-1234-5678-90AB-CDEF12345678"
  protected qrCode: string =
    "http://localhost:4200/certificate/" + this.idCertificate

  ngOnInit(): void {
    // Se ejecuta al iniciar el componente
    document.addEventListener("fullscreenchange", this.handleFullscreenChange)
  }

  ngOnDestroy(): void {
    // Limpia el listener al destruir el componente (buena práctica)
    document.removeEventListener(
      "fullscreenchange",
      this.handleFullscreenChange,
    )
  }

  @ViewChild("contenedor") contenedorRef!: ElementRef
  isFullscreen = false

  @ViewChild("certificado") certificadoRef!: ElementRef

  handleFullscreenChange = () => {
    // Evalúa si hay un elemento en pantalla completa
    this.isFullscreen = !!document.fullscreenElement
  }

  toggleFullscreen() {
    const elem = this.contenedorRef.nativeElement

    if (!document.fullscreenElement) {
      elem
        .requestFullscreen()
        .then(() => {
          this.isFullscreen = true
        })
        .catch((err: undefined) => {
          console.error("Error al entrar en pantalla completa:", err)
        })
    } else {
      document.exitFullscreen().then(() => {
        this.isFullscreen = false
      })
    }
  }

  downloadCertificate() {
    const node = this.certificadoRef.nativeElement

    htmlToImage
      .toPng(node, { cacheBust: true, quality: 1 })
      .then((dataUrl: string) => {
        const pdf = new jsPDF("l", "mm", "a4")
        const img = new Image()
        img.src = dataUrl

        img.onload = () => {
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()

          const imgWidth = pdfWidth
          const imgHeight = (img.height * imgWidth) / img.width

          const x = 0
          const y = (pdfHeight - imgHeight) / 2

          pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight)
          // Obtener fecha y hora actual en formato YYYYMMDD_HHmmss
          const now = new Date()
          const pad = (n: number) => n.toString().padStart(2, "0")
          const fechaHora =
            now.getFullYear().toString() +
            pad(now.getMonth() + 1) +
            pad(now.getDate()) +
            "_" +
            pad(now.getHours()) +
            pad(now.getMinutes()) +
            pad(now.getSeconds())
          const nombreArchivo = `CERTIFICADO-${this.name.replace(/\s+/g, "-").toUpperCase()}-${fechaHora}.PDF`

          pdf.save(nombreArchivo)
        }
      })
      .catch((error: undefined) => {
        console.error("Error al generar el certificado:", error)
      })
  }
}
