import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  QueryList,
  ViewChildren,
} from "@angular/core"
import { Message } from "primeng/message"
import { AuthService } from "../../../core/infrastructure"
import { Router } from "@angular/router"

@Component({
  selector: "app-login",
  imports: [Message],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnDestroy {
  protected authService: AuthService = inject(AuthService)
  protected router = inject(Router)
  protected yearNow: number = new Date().getFullYear()
  protected inputEmail: string = ""
  protected isButtonContinueDisabled: boolean = true
  protected isButtonVerifyCodeDisabled: boolean = true
  protected isShowViewFormEmail: boolean = true
  protected codeDigits: string[] = Array(6).fill("")
  protected lengthCode = Array(6).fill(0)
  protected timeResendCode: number = 30
  protected isButtonResendCodeDisabled: boolean = true
  protected buttonResendCodeText: string = ""
  protected intervalId: ReturnType<typeof setInterval> | null = null
  protected step: number = 1
  protected isMessageSuccess: boolean = false
  protected isMessageInfo: boolean = false

  @ViewChildren("codeInput") codeInput!: QueryList<ElementRef<HTMLInputElement>>

  onChangeContinue(email: string) {
    this.inputEmail = email
    if (
      this.inputEmail.length > 0 &&
      this.inputEmail.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      this.isButtonContinueDisabled = false
    }
    if (this.inputEmail.length === 0) {
      this.isButtonContinueDisabled = true
    }
    if (
      this.inputEmail.length > 0 &&
      !this.inputEmail.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      this.isButtonContinueDisabled = true
    }
  }

  onClickContinue(email: string) {
    if (this.isButtonContinueDisabled) {
      return
    }

    this.authService.sendCodeValidation(email).subscribe({
      next: (response) => {
        if (response.success) {
          this.inputEmail = email
          this.isShowViewFormEmail = false
          this.startCountdown()
          this.step = 2
          this.isMessageSuccess = true
          // Puedes mostrar aquí el mensaje que viene en response.message
          console.log(response.message)
        } else {
          // Aquí podrías manejar errores, mostrar alertas, etc.
          console.error("Error:", response.message)
        }
      },
      error: (err) => {
        // Manejo de error HTTP o conexión
        console.error("Error en la petición:", err)
      },
    })
  }

  onChangeCode(input: HTMLInputElement, index: number): void {
    const value = input.value
    this.codeDigits[index] = value.substring(0, 1)
    if (value.length === 1 && index < this.codeDigits.length - 1) {
      this.codeInput.toArray()[index + 1].nativeElement.focus()
    }
    this.checkIfAllInputsFilled()
  }

  onChangeCodeBackspace(input: HTMLInputElement, index: number): void {
    if (input.value === "" && index > 0) {
      this.codeInput.toArray()[index - 1].nativeElement.focus()
    }
  }

  onClickBack(): void {
    this.isShowViewFormEmail = true
    this.inputEmail = ""
    this.isButtonContinueDisabled = true
    this.step = 1
    this.timeResendCode = 30
  }

  startCountdown(): void {
    this.timeResendCode = 30
    this.cleanupInterval()
    this.isButtonResendCodeDisabled = true
    this.buttonResendCodeText = `Reenviar código en ${this.timeResendCode} segundos`
    this.intervalId = setInterval(() => {
      this.timeResendCode--
      if (this.timeResendCode > 0) {
        this.buttonResendCodeText = `Reenviar código en ${this.timeResendCode} segundos`
      } else {
        this.buttonResendCodeText = "Reenviar código"
        this.isButtonResendCodeDisabled = false
        this.cleanupInterval()
      }
    }, 1000)
  }

  onClickResendCode(): void {
    if (!this.inputEmail) {
      console.warn("No email stored to resend code.")
      return
    }

    this.authService.sendCodeValidation(this.inputEmail).subscribe({
      next: (response) => {
        if (response.success) {
          this.timeResendCode = 30
          this.isMessageInfo = true
          this.startCountdown()
          console.log(response.message)
        } else {
          console.error("Error:", response.message)
          this.isMessageInfo = false
        }
      },
      error: (err) => {
        console.error("Error en la petición:", err)
        this.isMessageInfo = false
      },
    })
  }

  onSubmitAuth(event: Event): void {
    event.preventDefault()

    if (this.inputEmail.length === 0) {
      console.warn("Email requerido")
      return
    }

    if (this.step === 2) {
      const code = this.codeDigits.join("")

      if (code.length !== 6) {
        console.warn("Código incompleto")
        return
      }

      console.log("Verificando cuenta con código:", code)

      this.authService.login(this.inputEmail, code).subscribe({
        next: (response) => {
          if (response.success) {
            const { accessToken, refreshToken } = response.data

            // ✅ Aquí puedes guardar los tokens localmente
            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)

            // 🔄 Redirigir o cambiar de vista si es necesario
            this.router.navigate(["/home"])
          } else {
            this.router.navigate(["/"])
          }
        },
        error: (err) => {
          console.error("Error al iniciar sesión:", err)
        },
      })
    }
  }

  lockEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent
    if (this.step === 2) {
      keyboardEvent.preventDefault()
    }
  }

  get resendCode(): string {
    return this.codeDigits.join("")
  }

  private cleanupInterval(): void {
    if (this.intervalId != null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  private checkIfAllInputsFilled(): void {
    const allFilled = this.codeInput
      .toArray()
      .every((inputRef) => inputRef.nativeElement.value.length === 1)
    this.isButtonVerifyCodeDisabled = !allFilled
  }

  ngOnDestroy(): void {
    this.cleanupInterval()
  }
}
