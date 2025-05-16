import { Component } from "@angular/core"
import { NavbarComponent, SidebarComponent } from "../../shared"
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import { inject } from "@angular/core"

enum UserTypeEnum {
  ADMIN = "AD",
  PARTICIPANT = "PA",
  PERSONAL = "PE",
}

interface FormAddUser {
  name: FormControl<string>
  paternalSurname: FormControl<string>
  maternalSurname: FormControl<string>
  email: FormControl<string>
  documentType: FormControl<string>
  documentNumber: FormControl<string>
  userType: FormControl<UserTypeEnum>
}

interface SelectDocumentType {
  label: string
  value: string
}

@Component({
  selector: "app-add-user",
  imports: [NavbarComponent, SidebarComponent, ReactiveFormsModule],
  templateUrl: "./add-user.component.html",
  styleUrl: "./add-user.component.css",
})
export class AddUserComponent {
  protected isOpen: boolean = false
  protected fb = inject(NonNullableFormBuilder)
  protected name: string = ""
  protected paternalSurname: string = ""
  protected maternalSurname: string = ""
  protected email: string = ""
  protected documentType: string = "DNI"
  protected documentNumber: string = ""
  protected userType: UserTypeEnum = UserTypeEnum.PARTICIPANT

  protected selectDocumentType: SelectDocumentType[] = [
    { label: "DNI", value: "DNI" },
  ]

  protected selectUserType: UserTypeEnum[] = [
    UserTypeEnum.PARTICIPANT,
    UserTypeEnum.PERSONAL,
  ]

  protected formAddUser: FormGroup<FormAddUser> = this.fb.group<FormAddUser>({
    name: this.fb.control<string>(this.name, {
      validators: [Validators.required],
    }),
    paternalSurname: this.fb.control<string>(this.paternalSurname, {
      validators: [Validators.required],
    }),
    maternalSurname: this.fb.control<string>(this.maternalSurname, {
      validators: [Validators.required],
    }),
    email: this.fb.control<string>(this.email, {
      validators: [Validators.required, Validators.email],
    }),
    documentType: this.fb.control<string>(this.documentType, {
      validators: [Validators.required],
    }),
    documentNumber: this.fb.control<string>(this.documentNumber, {
      validators: [Validators.required],
    }),
    userType: this.fb.control<UserTypeEnum>(this.userType, {
      validators: [Validators.required],
    }),
  })

  getErrorMessage(control: string): string {
    const formControl = this.formAddUser.get(control)
    if (formControl?.hasError("required")) {
      return "Campo requerido"
    } else if (formControl?.hasError("email")) {
      return "Email no válido"
    } else if (formControl?.hasError("minlength")) {
      return `Mínimo ${formControl.errors?.["minlength"].requiredLength} caracteres`
    } else if (formControl?.hasError("maxlength")) {
      return `Máximo ${formControl.errors?.["maxlength"].requiredLength} caracteres`
    }
    return ""
  }
}
