import { CommonModule, NgStyle } from "@angular/common"
import { Component, OnInit, inject, signal } from "@angular/core"
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
import { Message } from "primeng/message"
import { SelectModule } from "primeng/select"
import { TableLazyLoadEvent, TableModule } from "primeng/table"
import { TagModule } from "primeng/tag"
import {
  EventData,
  KeyValueTypeEvent,
  Participant,
  TypeEvent,
} from "../../../core/domain"
import { ParticipantService } from "../../../core/infrastructure"
import { EventService } from "../../../core/infrastructure/api/event.service"
import { NavbarComponent, SidebarComponent } from "../../shared"

enum statusEnum {
  EMITIDO = "Emitido",
  REEMITIDO = "Reemitido",
  ANULADO = "Anulado",
}

enum typeModeEventEnum {
  PRESENCIAL = 1,
  VIRTUAL = 2,
  HIBRIDO = 3,
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
  eventURL: string
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
  eventURL?: FormControl<string>
}

interface FormParticipantType {
  participantName: FormControl<string>
  participantPaternalSurname: FormControl<string>
  participantMaternalSurname: FormControl<string>
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
    Message,
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
  protected participantService = inject(ParticipantService)
  protected eventService = inject(EventService)
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
  protected eventURL: string = ""
  protected eventType!: KeyValueTypeEvent[]
  eventMode = [
    { id: 1, name: "PRESENCIAL" },
    { id: 2, name: "VIRTUAL" },
    { id: 3, name: "HIBRIDO" },
  ]

  getNameById(id: number): string {
    const modality = this.eventMode.find((m) => m.id === id)
    return modality ? modality.name : ""
  }

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
      eventURL: this.fb.control(this.eventURL),
    })

  onClickCreateEvent() {
    if (this.formCreatedEvent.invalid) {
      this.formCreatedEvent.markAllAsTouched()
      return
    }

    const formValue = this.formCreatedEvent.getRawValue()

    const newEvent: EventData = {
      nombre: formValue.eventName,
      descripcion: formValue.eventDescription,
      fechaInicio: formValue.eventStartDate,
      fechaFin: formValue.eventEndDate,
      duracion: formValue.eventHours,
      idTipoEvento: formValue.eventSelectedTypeEvent,
      idModalidad: Number(formValue.eventSelectedModeEvent),
      enlaceEvento: formValue.eventURL || undefined,
      lugar: formValue.eventLocation || undefined,
      activo: "ACTIVADO",
    }

    this.eventService.createEvent(newEvent).subscribe({
      next: (response) => {
        if (response.success) {
          // Puedes limpiar el formulario o redirigir
          this.formCreatedEvent.reset()
          this.isVisibleFormCreateEvent = false
        } else {
          console.error("Error en la respuesta:", response.message)
        }
      },
      error: (err) => {
        console.error("Error al crear el evento:", err)
      },
    })
  }

  protected participantTypeDocument: string = "DNI"
  protected participantNumberDocument: string = ""
  protected isDisabledButtonSearchNumberDocument: boolean = true
  protected participantName: string = ""
  protected participantPaternalSurname: string = ""
  protected participantMaternalSurname: string = ""
  protected participantEmail: string = ""

  protected formAddParticipant: FormGroup<FormParticipantType> =
    this.fb.group<FormParticipantType>({
      participantName: this.fb.control(this.participantName, {
        validators: [Validators.required],
      }),
      participantPaternalSurname: this.fb.control(
        this.participantPaternalSurname,
        {
          validators: [Validators.required],
        },
      ),
      participantMaternalSurname: this.fb.control(
        this.participantMaternalSurname,
        {
          validators: [Validators.required],
        },
      ),
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
    const dni = this.formAddParticipant
      .get("participantNumberDocument")
      ?.value?.trim()

    if (!dni || dni.length !== 8 || !/^\d{8}$/.test(dni)) {
      console.error("DNI inválido. Debe contener 8 dígitos numéricos.")
      return
    }

    this.participantService.getDataPerson(dni).subscribe({
      next: (response) => {
        const data = response.data
        this.formAddParticipant.patchValue({
          participantName: data.nombres ?? "",
          participantPaternalSurname: data.apellidoPaterno ?? "",
          participantMaternalSurname: data.apellidoMaterno ?? "",
          participantTypeDocument: this.participantTypeDocument,
          participantNumberDocument: dni,
          participantEmail: "",
        })
      },
      error: (err) => {
        console.error("Error al buscar datos del participante:", err)
      },
    })
  }

  onClickAddParticipant() {
    if (this.formAddParticipant.valid) {
      const formValue = this.formAddParticipant.getRawValue()

      const participantData: Participant = {
        numDocumento: formValue.participantNumberDocument,
        idTipoDocumento: 1,
        nombre: formValue.participantName,
        apellidoPat: formValue.participantPaternalSurname,
        apellidoMat: formValue.participantMaternalSurname,
        email: formValue.participantEmail,
      }

      this.participantService.createParticipant(participantData).subscribe({
        next: (_response) => {
          this.formAddParticipant.reset({ participantTypeDocument: "DNI" })
          this.isVisibleFormAddParticipant = false
        },
        error: (err) => {
          console.error("Error al crear participante:", err)
        },
      })
    } else {
      console.error("Formulario de participante inválido")
    }
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
    if (this.formCreatedEventType.valid) {
      const formValue = this.formCreatedEventType.getRawValue()

      const newTypeEvent: TypeEvent = {
        nombre: formValue.eventTypeName,
        descripcion: formValue.eventTypeDescription,
        vigente: true, // asumimos que todo nuevo tipo de evento es vigente por defecto
      }

      this.eventService.createTypeEvent(newTypeEvent).subscribe({
        next: (response) => {
          console.log("Tipo de evento creado:", response.data)
          this.formCreatedEventType.reset() // limpia el formulario
          this.isVisibleFormEventType = false // oculta el modal
        },
        error: (err) => {
          console.error("Error al crear el tipo de evento:", err)
        },
      })
    } else {
      console.error("Formulario de tipo de evento inválido")
    }
  }

  onClickCancelForm() {
    this.isVisibleFormEventType = false
    this.titleModalCreateEvent = "Crear Evento"
  }

  onChangeSelectModality(modeId: string) {
    const mode = Number(modeId) as typeModeEventEnum
    console.log("Modalidad seleccionada:", mode)

    const modeCtrl = this.formCreatedEvent.get(
      "eventSelectedModeEvent",
    ) as FormControl<typeModeEventEnum>

    if (modeCtrl) {
      modeCtrl.setValue(mode)

      this.showLocationField =
        mode === typeModeEventEnum.PRESENCIAL ||
        mode === typeModeEventEnum.HIBRIDO

      this.showLinkField =
        mode === typeModeEventEnum.VIRTUAL || mode === typeModeEventEnum.HIBRIDO

      const locationCtrl = this.formCreatedEvent.get(
        "eventLocation",
      ) as FormControl<string>

      if (locationCtrl) {
        this.updateLocationValidators(mode, locationCtrl)
        locationCtrl.updateValueAndValidity()
      }
    }
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

    this.eventService.getAllTypeEvents().subscribe({
      next: (response) => {
        if (response.success) {
          this.eventTypeOptions = response.data.map((eventType) => ({
            id: eventType.id ?? 0,
            nombre: eventType.nombre,
          }))
          this.eventType = this.eventTypeOptions.map((type) => ({
            id: type.id,
            nombre: type.nombre,
          }))
        }
      },
      error: (err) => {
        console.error("Error al cargar tipos de eventos", err)
      },
    })
  }
  private updateLocationValidators(
    mode: typeModeEventEnum,
    control: FormControl<string>,
  ): void {
    if (mode === typeModeEventEnum.VIRTUAL) {
      control.clearValidators()
    } else {
      control.setValidators(Validators.required)
    }
    control.updateValueAndValidity()
  }

  showLocationField = true
  showLinkField = false

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

  editingRowId: number | null = null

  onRowEditInit(data: DataItem) {
    this.clonedData[data.id] = { ...data }
    this.editingRowId = data.id
  }

  onRowEditSave(data: DataItem) {
    delete this.clonedData[data.id]
    this.editingRowId = null
    this.addMessage("success", `Se ha modificado la fila N° ${data.id}`)
  }

  onRowEditCancel(data: DataItem, ri: number) {
    const original = this.clonedData[data.id]
    if (original) {
      this.data[ri] = original
      delete this.clonedData[data.id]
    }
    this.editingRowId = null
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
    "LINK",
    "ACCIONES",
  ]
  protected dataEvents!: DataSeeAllEvent[]
  totalRecords: number = 0

  loadEvents(event: TableLazyLoadEvent): void {
    const page = (event.first ?? 0) / (event.rows ?? 7)
    const size = event.rows ?? 7

    this.eventService.getEventosPaginados(page, size).subscribe({
      next: (response) => {
        this.dataEvents = (response.data ?? []).map((e, index) => ({
          id: index + 1 + page * size,
          eventName: e.nombre,
          eventStartDate: e.fechaInicio,
          eventEndDate: e.fechaFin,
          eventMode:
            e.idModalidad == "PRESENCIAL"
              ? typeModeEventEnum.PRESENCIAL
              : e.idModalidad == "VIRTUAL"
                ? typeModeEventEnum.VIRTUAL
                : typeModeEventEnum.HIBRIDO,
          eventHours: `${e.duracion} horas`,
          eventType: e.tipoEvento,
          eventLocation: e.lugar ?? "N/A",
          eventURL: e.enlaceEvento ?? "N/A",
          actions: "acciones",
        }))
        this.totalRecords = response.totalElements ?? 0
      },
      error: (err) => {
        console.error("Error al cargar eventos", err)
      },
    })
  }

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
      case typeModeEventEnum.VIRTUAL:
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

  protected eventModeOptions = [
    { label: "PRESENCIAL", value: 1 },
    { label: "VIRTUAL", value: 2 },
    { label: "HIBRIDO", value: 3 },
  ]

  protected eventTypeOptions: KeyValueTypeEvent[] = []

  editingRowEventId: number | null = null

  onRowEditInitEvent(data: DataSeeAllEvent) {
    this.clonedDataEvent[data.id] = { ...data }
    this.editingRowEventId = data.id // Cambiado de isEditingEvent a editingRowId
  }

  onRowEditSaveEvent(data: DataSeeAllEvent) {
    delete this.clonedDataEvent[data.id]
    this.editingRowEventId = null // Salimos del modo edición para esta fila
    this.addMessage("success", `Se ha modificado la fila N° ${data.id}`)
  }

  onRowEditCancelEvent(data: DataSeeAllEvent, ri: number) {
    const original = this.clonedDataEvent[data.id]
    if (original) {
      this.dataEvents[ri] = original
      delete this.clonedDataEvent[data.id]
    }
    this.editingRowEventId = null // Salimos del modo edición
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
