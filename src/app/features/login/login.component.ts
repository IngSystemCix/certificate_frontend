import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MessageComponent } from '../../shared/message/message.component';
import { MessagePosition } from '../../enums';

@Component({
  selector: 'app-login',
  imports: [MessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  protected isNext: boolean = false;
  protected amountInputs = Array(6).fill(0);
  protected disableButton: boolean = true;
  protected disableButtonContinue: boolean = true;
  protected nowYear = new Date().getFullYear();
  protected MessagePosition = MessagePosition;

  @ViewChildren('codeInput') codeInputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  protected handleNext = () => {
    this.isNext = true;
  };

  protected handleBack = () => {
    this.isNext = false;
  };

  protected handleContinue = (email: HTMLInputElement) => {
    const emailValue = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailValue)) {
      this.disableButtonContinue = false;
    } else {
      this.disableButtonContinue = true;
    }
  };

  handleInput(input: HTMLInputElement, index: number): void {
    const value = input.value;

    if (value.length === 1 && index < this.codeInputs.length - 1) {
      this.codeInputs.toArray()[index + 1].nativeElement.focus();
    }
    this.checkIfAllInputsFilled();
  }

  handleBackspace(input: HTMLInputElement, index: number): void {
    if (input.value === '' && index > 0) {
      this.codeInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  private checkIfAllInputsFilled(): void {
    const allFilled = this.codeInputs
      .toArray()
      .every((inputRef) => inputRef.nativeElement.value.trim().length === 1);

    this.disableButton = !allFilled;
  }
}
