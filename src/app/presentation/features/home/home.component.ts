import { CommonModule, NgClass, NgStyle } from "@angular/common"
import { Component, inject, OnInit, Signal, signal } from "@angular/core"
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import { ButtonModule } from "primeng/button"
import { Dialog } from "primeng/dialog"
import { Menu } from "primeng/menu"
import { SelectModule } from "primeng/select"
import { TableModule } from "primeng/table"
import { TagModule } from "primeng/tag"
import { Message } from "primeng/message"
import { NavbarComponent, SidebarComponent } from "../../shared"

enum statusEnum {
  EMITIDO = "Emitido",
  REEMITIDO = "Reemitido",
  ANULADO = "Anulado",
}

enum typeModeEventEnum {
  PRESENCIAL = "Presencial",
  REMOTO = "Remoto",
  HIBRIDO = "Híbrido",
}

interface DataItem {
  id: number
  certificate: string
  participant: string
  status: statusEnum
  date: string
  actions: string
}

interface DataSeeAllEvent {
  id: number
  eventName: string
  eventStartDate: string
  eventEndDate: string
  eventMode: typeModeEventEnum
  eventHours: string
  eventType: string
  eventLocation: string
  actions: string
}

interface MenuItems {
  label: string
  icon: string
  command: () => void
}

interface FormCreateEventType {
  eventName: FormControl<string>
  eventDescription: FormControl<string>
  eventStartDate: FormControl<string>
  eventEndDate: FormControl<string>
  eventHours: FormControl<string>
  eventSelectedTypeEvent: FormControl<string>
  eventSelectedModeEvent: FormControl<typeModeEventEnum>
  eventLocation?: FormControl<string>
}

interface FormParticipantType {
  participantTypeDocument: FormControl<string>
  participantNumberDocument: FormControl<string>
  participantEmail: FormControl<string>
}

interface FormEmitCertificateType {
  emitTypeDocument: FormControl<string>
  emitNumberDocument: FormControl<string>
  emitSelectedTypeEvent: FormControl<string>
  emitParticipantNote: FormControl<number>
}

interface FormEventType {
  eventTypeName: FormControl<string>
  eventTypeDescription: FormControl<string>
}

@Component({
  selector: "app-home",
  imports: [
    NavbarComponent,
    SidebarComponent,
    FormsModule,
    TableModule,
    CommonModule,
    SelectModule,
    NgStyle,
    TagModule,
    Menu,
    ButtonModule,
    Dialog,
    ReactiveFormsModule,
    NgClass,
    Message,
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
  protected titleModalCreateEvent: string = "Crear Evento"
  protected isMessageModifyData: boolean = false
  protected isMessageCancelModifyData: boolean = false
  protected fb = inject(NonNullableFormBuilder)
  protected eventName: string = ""
  protected eventDescription: string = ""
  protected eventStartDate: string = ""
  protected eventEndDate: string = ""
  protected eventHours: string = ""
  protected eventSelectedTypeEvent: string = ""
  protected eventSelectedModeEvent: typeModeEventEnum =
    typeModeEventEnum.PRESENCIAL
  protected eventLocation: string = ""
  protected eventType: string[] = [
    "Capacitación",
    "Taller",
    "Curso",
    "Seminario",
    "Conferencia",
  ]
  protected eventMode: typeModeEventEnum[] = [
    typeModeEventEnum.PRESENCIAL,
    typeModeEventEnum.REMOTO,
    typeModeEventEnum.HIBRIDO,
  ]

  protected formCreatedEvent: FormGroup<FormCreateEventType> =
    this.fb.group<FormCreateEventType>({
      eventName: this.fb.control(this.eventName, Validators.required),
      eventDescription: this.fb.control(
        this.eventDescription,
        Validators.required,
      ),
      eventStartDate: this.fb.control(this.eventStartDate, Validators.required),
      eventEndDate: this.fb.control(this.eventEndDate, Validators.required),
      eventHours: this.fb.control(this.eventHours, Validators.required),
      eventSelectedTypeEvent: this.fb.control(
        this.eventSelectedTypeEvent,
        Validators.required,
      ),
      eventSelectedModeEvent: this.fb.control(
        this.eventSelectedModeEvent,
        Validators.required,
      ),
      eventLocation: this.fb.control(this.eventLocation), // inicialmente sin validadores
    })

  protected participantTypeDocument: string = "DNI"
  protected participantNumberDocument: string = ""
  protected isDisabledButtonSearchNumberDocument: boolean = true
  protected participantName: string = ""
  protected participantPaternalSurname: string = ""
  protected participantMaternalSurname: string = ""
  protected participantEmail: string = ""

  protected formAddParticipant: FormGroup<FormParticipantType> =
    this.fb.group<FormParticipantType>({
      participantTypeDocument: this.fb.control(this.participantTypeDocument, {
        validators: [Validators.required],
      }),
      participantNumberDocument: this.fb.control(
        this.participantNumberDocument,
        {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(8),
            Validators.pattern(/^[0-9]+$/),
          ],
        },
      ),
      participantEmail: this.fb.control(this.participantEmail, {
        validators: [Validators.required],
      }),
    })

  documentType: string[] = ["DNI"]

  onClickSearchParticipant() {
    this.participantName = "Juan"
    this.participantPaternalSurname = "Romero"
    this.participantMaternalSurname = "Collazos"
  }

  onChangeNumberDocument(form: FormGroup, input: string) {
    const number = form.get(input)?.value
    const type = this.participantTypeDocument

    if (form === this.formAddParticipant) {
      if (type === "DNI" && number?.length === 8 && /^[0-9]+$/.test(number)) {
        this.isDisabledButtonSearchNumberDocument = false
      } else {
        this.isDisabledButtonSearchNumberDocument = true
      }
    }
    if (form === this.formEmitCertificate) {
      if (type === "DNI" && number?.length === 8 && /^[0-9]+$/.test(number)) {
        this.isDisabledButtonSearchEmitNumberDocument = false
      } else {
        this.isDisabledButtonSearchEmitNumberDocument = true
      }
    }
  }

  protected emitTypeDocument: string = "DNI"
  protected emitNumberDocument: string = ""
  protected isDisabledButtonSearchEmitNumberDocument: boolean = true
  protected emitFullName: string = ""
  protected emitSelectedTypeEvent: string = ""
  protected emitParticipantNote: number = 0

  protected formEmitCertificate: FormGroup<FormEmitCertificateType> =
    this.fb.group<FormEmitCertificateType>({
      emitTypeDocument: this.fb.control(this.emitTypeDocument, {
        validators: [Validators.required],
      }),
      emitNumberDocument: this.fb.control(this.emitNumberDocument, {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern(/^[0-9]+$/),
        ],
      }),
      emitSelectedTypeEvent: this.fb.control(this.emitSelectedTypeEvent, {
        validators: [Validators.required],
      }),
      emitParticipantNote: this.fb.control(this.emitParticipantNote, {
        validators: [Validators.required],
      }),
    })

  protected typeEventName: string = ""
  protected typeEventDescription: string = ""
  protected isVisibleFormEventType: boolean = false

  protected formCreatedEventType: FormGroup<FormEventType> =
    this.fb.group<FormEventType>({
      eventTypeName: this.fb.control(this.typeEventName, Validators.required),
      eventTypeDescription: this.fb.control(
        this.typeEventDescription,
        Validators.required,
      ),
    })

  onClickCreateEventType() {
    this.isVisibleFormEventType = true
    this.titleModalCreateEvent = "Crear Tipo de Evento"
  }

  onClickAddEventType() {
    console.log("Se agrego un tipo de evento")
  }

  onClickCancelForm() {
    this.isVisibleFormEventType = false
    this.titleModalCreateEvent = "Crear Evento"
  }

  ngOnInit(): void {
    const modeCtrl = this.formCreatedEvent.get(
      "eventSelectedModeEvent",
    ) as FormControl<typeModeEventEnum>
    const locationCtrl = this.formCreatedEvent.get(
      "eventLocation",
    ) as FormControl<string>
    if (!modeCtrl || !locationCtrl) return

    // Suscripción reactiva
    modeCtrl.valueChanges.subscribe((mode) => {
      this.updateLocationValidators(mode, locationCtrl)
    })

    // Validación inicial
    this.updateLocationValidators(modeCtrl.value, locationCtrl)
  }
  private updateLocationValidators(
    mode: typeModeEventEnum,
    control: FormControl<string>,
  ): void {
    if (mode === typeModeEventEnum.REMOTO) {
      control.clearValidators()
    } else {
      control.setValidators(Validators.required)
    }
    control.updateValueAndValidity()
  }

  get showLocationField(): boolean {
    const mode = this.formCreatedEvent.get("eventSelectedModeEvent")?.value
    return (
      mode === typeModeEventEnum.PRESENCIAL ||
      mode === typeModeEventEnum.HIBRIDO
    )
  }

  getErrorMessage(control: string): string {
    const formControl = this.formCreatedEvent.get(control)
    const formAddParticipantControl = this.formAddParticipant.get(control)
    const formEmitCertificateControl = this.formEmitCertificate.get(control)
    const formEventTypeControl = this.formCreatedEventType.get(control)
    if (formControl?.hasError("required")) {
      return "Este campo es requerido"
    }
    if (formAddParticipantControl?.hasError("required")) {
      return "Este campo es requerido"
    }
    if (formAddParticipantControl?.hasError("minlength")) {
      return "El número de documento debe tener 8 dígitos"
    }
    if (formAddParticipantControl?.hasError("maxlength")) {
      return "El número de documento debe tener 8 dígitos"
    }
    if (formAddParticipantControl?.hasError("pattern")) {
      return "El número de documento solo puede contener números"
    }
    if (formEmitCertificateControl?.hasError("required")) {
      return "Este campo es requerido"
    }
    if (formEmitCertificateControl?.hasError("minlength")) {
      return "El número de documento debe tener 8 dígitos"
    }
    if (formEmitCertificateControl?.hasError("maxlength")) {
      return "El número de documento debe tener 8 dígitos"
    }
    if (formEmitCertificateControl?.hasError("pattern")) {
      return "El número de documento solo puede contener números"
    }
    if (formEventTypeControl?.hasError("required")) {
      return "Este campo es requerido"
    }

    return ""
  }

  protected isVisibleFormCreateEvent: boolean = false
  protected isVisibleFormAddParticipant: boolean = false
  protected isVisibleFormIssueCertificate: boolean = false
  protected searchQuery: string = ""
  protected isOpen: boolean = false
  protected statusOptions: statusEnum[] = [
    statusEnum.EMITIDO,
    statusEnum.REEMITIDO,
    statusEnum.ANULADO,
  ]
  protected isEditing: boolean = false
  protected headers: string[] = [
    "N°",
    "CERTIFICADO",
    "PARTICIPANTE",
    "ESTADO",
    "FECHA",
    "ACCIONES",
  ]
  protected statuses: statusEnum[] = [
    statusEnum.EMITIDO,
    statusEnum.REEMITIDO,
    statusEnum.ANULADO,
  ]
  protected values!: undefined
  protected items: MenuItems[] = [
    {
      label: "Crear evento",
      icon: "pi pi-plus",
      command: () => {
        this.isVisibleFormCreateEvent = true
      },
    },
    {
      label: "Agregar participante",
      icon: "pi pi-user-plus",
      command: () => {
        this.isVisibleFormAddParticipant = true
      },
    },
    {
      label: "Emitir el certificado",
      icon: "pi pi-check",
      command: () => {
        this.isVisibleFormIssueCertificate = true
      },
    },
  ]
  protected data: DataItem[] = [
    {
      id: 1,
      certificate: "Capacitación de Angular",
      participant: "Juan Perez",
      status: statusEnum.EMITIDO,
      date: "2023-10-01",
      actions: "actions",
    },
    {
      id: 2,
      certificate: "Capacitación de React",
      participant: "Maria Gomez",
      status: statusEnum.REEMITIDO,
      date: "2023-10-02",
      actions: "actions",
    },
    {
      id: 3,
      certificate: "Curso de Java con Spring Boot",
      participant: "Luis Torres",
      status: statusEnum.ANULADO,
      date: "2023-10-05",
      actions: "actions",
    },
    {
      id: 4,
      certificate: "Taller de Git y GitHub",
      participant: "Carla Mendoza",
      status: statusEnum.EMITIDO,
      date: "2023-10-06",
      actions: "actions",
    },
    {
      id: 5,
      certificate: "Introducción a Docker",
      participant: "José Ramírez",
      status: statusEnum.REEMITIDO,
      date: "2023-10-07",
      actions: "actions",
    },
    {
      id: 6,
      certificate: "Curso de TypeScript",
      participant: "Lucía Fernández",
      status: statusEnum.ANULADO,
      date: "2023-10-08",
      actions: "actions",
    },
    {
      id: 7,
      certificate: "Capacitación en Node.js",
      participant: "Pedro Alvarez",
      status: statusEnum.ANULADO,
      date: "2023-10-09",
      actions: "actions",
    },
    {
      id: 8,
      certificate: "Curso de Seguridad Web",
      participant: "Sofía Chávez",
      status: statusEnum.EMITIDO,
      date: "2023-10-10",
      actions: "actions",
    },
    {
      id: 9,
      certificate: "Capacitación de Vue.js",
      participant: "Marco Rivas",
      status: statusEnum.REEMITIDO,
      date: "2023-10-11",
      actions: "actions",
    },
    {
      id: 10,
      certificate: "Fundamentos de Bases de Datos",
      participant: "Paola Paredes",
      status: statusEnum.EMITIDO,
      date: "2023-10-12",
      actions: "actions",
    },
    {
      id: 11,
      certificate: "Curso de DevOps",
      participant: "Daniel Herrera",
      status: statusEnum.ANULADO,
      date: "2023-10-13",
      actions: "actions",
    },
  ]

  rowStyle(data: DataItem): Record<string, string> {
    switch (data.status) {
      case statusEnum.EMITIDO:
        return {
          "background-color": "#B0EBB4",
          color: "#1B5E20",
          "font-weight": "bold",
          "border-left": "4px solid #388E3C",
        }
      case statusEnum.REEMITIDO:
        return {
          "background-color": "#A7C5EB",
          color: "#0D47A1",
          "font-weight": "bold",
          "border-left": "4px solid #1976D2",
        }
      default:
        return {
          "background-color": "#F38BA0",
          color: "#B71C1C",
          "font-weight": "bold",
          "border-left": "4px solid #D32F2F",
        }
    }
  }

  getSeverity(data: DataItem): string {
    return data.status === statusEnum.EMITIDO
      ? "success"
      : data.status === statusEnum.REEMITIDO
        ? "info"
        : "danger"
  }

  cleanSearch() {
    this.searchQuery = ""
  }

  onRowEditInit(data: DataItem) {
    this.clonedData[data.id] = { ...data }
    this.isEditing = true
  }

  onRowEditSave(data: DataItem) {
    delete this.clonedData[data.id]
    this.isEditing = false
    this.addMessage("success", `Se ha modificado la fila N° ${data.id}`)
  }

  onRowEditCancel(data: DataItem, ri: number) {
    const original = this.clonedData[data.id]
    if (original) {
      this.data[ri] = original
      delete this.clonedData[data.id]
    }
    this.isEditing = false
    this.addMessage(
      "info",
      `Se canceló la modificación de la fila N° ${data.id}`,
    )
  }

  getIcon(severity: string): string {
    switch (severity) {
      case "success":
        return "pi pi-check"
      case "info":
        return "pi pi-info"
      case "warn":
        return "pi pi-exclamation-triangle"
      case "danger":
        return "pi pi-times"
      default:
        return ""
    }
  }

  messages = signal<{ severity: string; content: string; id: number }[]>([])
  private messageIdCounter = 0

  private addMessage(severity: string, content: string) {
    const id = this.messageIdCounter++
    const newMsg = { id, severity, content }
    this.messages.update((msgs) => [...msgs, newMsg])

    setTimeout(() => {
      this.messages.update((msgs) => msgs.filter((msg) => msg.id !== id))
    }, 4000)
  }

  protected clonedData: { [id: number]: DataItem } = {}

  protected isVisibleTableSeeAllEvents: boolean = false
  protected valuesEventMode: string = ""
  protected valuesEventType: string = ""
  protected isEditingEvent: boolean = false
  protected headersEvents: string[] = [
    "N°",
    "NOMBRE DEL EVENTO",
    "FECHA DE INICIO",
    "FECHA DE FIN",
    "MODALIDAD",
    "HORAS",
    "TIPO DE EVENTO",
    "LOCACIÓN",
    "ACCIONES",
  ]
  protected dataEvents: DataSeeAllEvent[] = [
    {
      id: 1,
      eventName: "Capacitación de Angular",
      eventStartDate: "2023-10-01",
      eventEndDate: "2023-10-01",
      eventMode: typeModeEventEnum.PRESENCIAL,
      eventHours: "8 horas",
      eventType: "Capacitación",
      eventLocation: "Lima",
      actions: "actions",
    },
    {
      id: 2,
      eventName: "Capacitación de React",
      eventStartDate: "2023-10-02",
      eventEndDate: "2023-10-02",
      eventMode: typeModeEventEnum.HIBRIDO,
      eventHours: "8 horas",
      eventType: "Capacitación",
      eventLocation: "Lima",
      actions: "actions",
    },
    {
      id: 3,
      eventName: "Seminario de Ciberseguridad",
      eventStartDate: "2023-10-05",
      eventEndDate: "2023-10-05",
      eventMode: typeModeEventEnum.PRESENCIAL,
      eventHours: "6 horas",
      eventType: "Seminario",
      eventLocation: "Trujillo",
      actions: "actions",
    },
    {
      id: 4,
      eventName: "Taller de UX/UI",
      eventStartDate: "2023-10-07",
      eventEndDate: "2023-10-07",
      eventMode: typeModeEventEnum.REMOTO,
      eventHours: "4 horas",
      eventType: "Taller",
      eventLocation: "N/A",
      actions: "actions",
    },
    {
      id: 5,
      eventName: "Charla sobre Inteligencia Artificial",
      eventStartDate: "2023-10-10",
      eventEndDate: "2023-10-10",
      eventMode: typeModeEventEnum.REMOTO,
      eventHours: "3 horas",
      eventType: "Charla",
      eventLocation: "N/A",
      actions: "actions",
    },
    {
      id: 6,
      eventName: "Capacitación de Docker",
      eventStartDate: "2023-10-12",
      eventEndDate: "2023-10-12",
      eventMode: typeModeEventEnum.PRESENCIAL,
      eventHours: "7 horas",
      eventType: "Capacitación",
      eventLocation: "Arequipa",
      actions: "actions",
    },
    {
      id: 7,
      eventName: "Curso de Git y GitHub",
      eventStartDate: "2023-10-15",
      eventEndDate: "2023-10-16",
      eventMode: typeModeEventEnum.REMOTO,
      eventHours: "10 horas",
      eventType: "Curso",
      eventLocation: "N/A",
      actions: "actions",
    },
    {
      id: 8,
      eventName: "Workshop de Microservicios",
      eventStartDate: "2023-10-18",
      eventEndDate: "2023-10-18",
      eventMode: typeModeEventEnum.PRESENCIAL,
      eventHours: "5 horas",
      eventType: "Workshop",
      eventLocation: "Lima",
      actions: "actions",
    },
    {
      id: 9,
      eventName: "Webinar de Transformación Digital",
      eventStartDate: "2023-10-20",
      eventEndDate: "2023-10-20",
      eventMode: typeModeEventEnum.REMOTO,
      eventHours: "2 horas",
      eventType: "Webinar",
      eventLocation: "N/A",
      actions: "actions",
    },
    {
      id: 10,
      eventName: "Curso de Scrum y Agile",
      eventStartDate: "2023-10-22",
      eventEndDate: "2023-10-23",
      eventMode: typeModeEventEnum.PRESENCIAL,
      eventHours: "12 horas",
      eventType: "Curso",
      eventLocation: "Cusco",
      actions: "actions",
    },
    {
      id: 11,
      eventName: "Simposio de Ciencia de Datos",
      eventStartDate: "2023-10-25",
      eventEndDate: "2023-10-25",
      eventMode: typeModeEventEnum.REMOTO,
      eventHours: "8 horas",
      eventType: "Simposio",
      eventLocation: "N/A",
      actions: "actions",
    },
    {
      id: 12,
      eventName: "Foro de Innovación Tecnológica",
      eventStartDate: "2023-10-28",
      eventEndDate: "2023-10-28",
      eventMode: typeModeEventEnum.PRESENCIAL,
      eventHours: "6 horas",
      eventType: "Foro",
      eventLocation: "Chiclayo",
      actions: "actions",
    },
  ]
  protected searchQueryEvent: string = ""

  rowStyleAllEvent(data: DataSeeAllEvent): Record<string, string> {
    switch (data.eventMode) {
      case typeModeEventEnum.PRESENCIAL:
        return {
          "background-color": "#B0EBB4",
          color: "#1B5E20",
          "font-weight": "bold",
          "border-left": "4px solid #388E3C",
        }
      case typeModeEventEnum.REMOTO:
        return {
          "background-color": "#E1BEE7",
          color: "#6A1B9A",
          "font-weight": "bold",
          "border-left": "4px solid #8E24AA",
        }
      default:
        return {
          "background-color": "#FFF9C4",
          color: "#F57F17",
          "font-weight": "bold",
          "border-left": "4px solid #FBC02D",
        }
    }
  }

  protected eventModeOptions: typeModeEventEnum[] = [
    typeModeEventEnum.PRESENCIAL,
    typeModeEventEnum.REMOTO,
    typeModeEventEnum.HIBRIDO,
  ]

  protected eventTypeOptions: string[] = [
    "Capacitación",
    "Taller",
    "Curso",
    "Seminario",
    "Conferencia",
  ]

  onRowEditInitEvent(data: DataSeeAllEvent) {
    this.clonedDataEvent[data.id] = { ...data }
    this.isEditingEvent = true
  }

  onRowEditSaveEvent(data: DataSeeAllEvent) {
    delete this.clonedDataEvent[data.id]
    this.isEditingEvent = false
    this.addMessage("success", `Se ha modificado la fila N° ${data.id}`)
  }

  onRowEditCancelEvent(data: DataSeeAllEvent, ri: number) {
    const original = this.clonedDataEvent[data.id]
    if (original) {
      this.dataEvents[ri] = original
      delete this.clonedDataEvent[data.id]
    }
    this.isEditingEvent = false
    this.addMessage(
      "info",
      `Se canceló la modificación de la fila N° ${data.id}`,
    )
  }

  clonedDataEvent: { [id: number]: DataSeeAllEvent } = {}

  onClickSeeAllEvents() {
    this.isVisibleTableSeeAllEvents = true
    this.titleModalCreateEvent = "Todos los eventos"
  }

  onClickBackToCreateEvent() {
    this.isVisibleTableSeeAllEvents = false
    this.titleModalCreateEvent = "Crear Evento"
  }

  cleanSearchEvent() {
    this.searchQueryEvent = ""
  }

  onClickSearchEvent() {
    console.log("Se busco el evento")
  }

  onClickCleanForm() {
    this.formCreatedEvent.reset()
  }

  getPercentageWithCells(header: string[]): string {
    const percentage = 100 / header.length
    return `${percentage}%`
  }
}
