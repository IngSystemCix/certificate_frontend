import {
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
} from "@angular/core"
import { Message } from "primeng/message"

@Component({
  selector: "app-login",
  imports: [Message],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnDestroy {
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
    this.inputEmail = email
    this.isShowViewFormEmail = false
    this.startCountdown()
    this.step = 2
    this.isMessageSuccess = true
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
    this.timeResendCode = 30
    this.isMessageInfo = true
    this.startCountdown()
  }

  onSubmitAuth(event: Event): void {
    if (this.inputEmail.length === 0) {
      event.preventDefault()
      return
    }

    if (this.step === 2) {
      const code = this.codeDigits.join("")
      if (code.length !== 6) {
        event.preventDefault()
        return
      }
      console.log("Verificando cuenta con código:", code)
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
