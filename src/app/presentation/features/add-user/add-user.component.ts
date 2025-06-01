import { Component } from "@angular/core"
import { NavbarComponent, SidebarComponent } from "../../shared"
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import { inject } from "@angular/core"
import { PersonalService } from "../../../core/infrastructure/api/personal.service"
import { PersonalData } from "../../../core/domain"
import { ParticipantService } from "../../../core/infrastructure"

enum UserTypeEnum {
  ADMIN = "AD",
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
  protected personalService = inject(PersonalService)
  protected participantService = inject(ParticipantService)
  protected isOpen: boolean = false
  protected fb = inject(NonNullableFormBuilder)
  protected name: string = ""
  protected paternalSurname: string = ""
  protected maternalSurname: string = ""
  protected email: string = ""
  protected documentType: string = "DNI"
  protected documentNumber: string = ""
  protected userType: UserTypeEnum = UserTypeEnum.PERSONAL

  protected selectDocumentType: SelectDocumentType[] = [
    { label: "DNI", value: "DNI" },
  ]

  protected selectUserType: UserTypeEnum[] = [UserTypeEnum.PERSONAL]

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

  addUser(): void {
    if (this.formAddUser.invalid) {
      this.formAddUser.markAllAsTouched()
      return
    }

    const formValue = this.formAddUser.getRawValue()

    const data: PersonalData = {
      nombre: formValue.name,
      apellidoPat: formValue.paternalSurname,
      apellidoMat: formValue.maternalSurname,
      correoElectronico: formValue.email,
      numDocumento: formValue.documentNumber,
      idTipoDocumento: 1,
      activo: true,
      tipoDeUsuario: formValue.userType,
    }

    this.personalService.createPersonal(data).subscribe({
      next: (response) => {
        // Mostrar mensaje de éxito o redirigir
        console.log("✅ Usuario creado:", response)
      },
      error: (err) => {
        // Mostrar mensaje de error
        console.error("❌ Error al crear usuario:", err)
      },
    })
  }
}
