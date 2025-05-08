import { Component, NgModule, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { TableComponent } from '../../shared/table/table.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from "../../shared/modal/modal.component";

type OptionType = {
  label: string;
  value: string | number;
  action?: () => void;
};

type DocumentTypes = {
  name: string;
  value: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    TableComponent,
    FormsModule,
    ModalComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  protected formEmmiterCertificate!: FormGroup;
  protected formCreateEvent!: FormGroup;
  protected formTypeEvent!: FormGroup;
  protected formAddParticipant!: FormGroup;

  protected titleModal: string = 'Emitir Nuevo Certificado';
  protected descriptionModal: string =
    'Complete los datos para emitir un nuevo certificado';
  protected isOpen: boolean = false;
  protected search: string = '';
  protected selectedColumnSearch: string[] = ['ID', 'Participante'];
  // atribute for the modal emmiter certificate
  protected isOpenModalEmmiterCertificate: boolean = false;
  protected documentNumber: string = '';
  protected documentNumberPattern: string = '^[0-9]{8,20}$';
  protected selectedDocumentType: string = 'dni';
  protected documentTypes: DocumentTypes[] = [
    { name: 'DNI', value: 'dni' },
    { name: 'RUC', value: 'ruc' },
    { name: 'Pasaporte', value: 'pasaporte' },
  ];
  protected selectedEvent: string = 'null';
  protected events: string[] = [
    'Curso de Capacitación',
    'Seminario de Actualización Profesional',
    'Diplomado de Especialización',
    'Taller de Formación',
  ];
  protected note: string = '0';
  // atribute for the modal create event
  protected isVisbleFormEvent: boolean = true;
  protected isOpenModalCreateEvent: boolean = false;
  protected titleModalCreateEvent: string = 'Crear Nuevo Evento';
  protected descriptionModalCreateEvent: string =
    'Complete los datos para crear un nuevo evento';
  protected isEventEnabled: boolean = false;
  protected eventName: string = '';
  protected eventDescription: string = '';
  protected eventStartDate: string = '';
  protected eventEndDate: string = '';
  protected minStartDate: string = '';
  protected minEndDate: string = '';
  protected eventHours: string = '';
  protected selectedTypeEvent: string = 'null';
  protected typeEvents: string[] = [
    'Curso de Capacitación',
    'Seminario de Actualización Profesional',
    'Diplomado de Especialización',
    'Taller de Formación',
  ];
  protected isShowAllEvents: boolean = false;
  // atribute for the modal create type event
  protected selectedModeEvent: string = 'null';
  protected modeEvents: string[] = ['Presencial', 'Remoto', 'Híbrido'];
  protected eventLocation: string = '';
  protected typeEventName: string = '';
  protected typeEventDescription: string = '';
  protected isInForceTypeEvent: boolean = false;
  // atribute for the modal add participant
  protected isOpenModalAddParticipant: boolean = false;
  protected titleModalAddParticipant: string = 'Agregar Participante';
  protected descriptionModalAddParticipant: string =
    'Complete los datos para agregar un nuevo participante';
  protected participantName: string = '';
  protected participantPaternalSurname: string = '';
  protected participantMaternalSurname: string = '';
  protected participantTypeDocument: string = 'dni';
  protected participantDocumentTypes: DocumentTypes[] = [
    { name: 'DNI', value: 'dni' },
    { name: 'RUC', value: 'ruc' },
    { name: 'Pasaporte', value: 'pasaporte' },
  ];
  protected participantDocumentNumber: string = '';
  protected participantEmail: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const now = new Date();
    this.minStartDate = this.toDatetimeLocal(now);
    this.minEndDate = this.minStartDate;
    this.formEmmiterCertificate = this.fb.group(
      {
        documentNumber: [
          this.documentNumber,
          [Validators.required, Validators.pattern(this.documentNumberPattern)],
        ],
        selectedDocumentType: [this.selectedDocumentType, Validators.required],
        selectedEvent: [this.selectedEvent, Validators.required],
        note: [this.note, [Validators.required, Validators.min(0)]],
      },
      {
        updateOn: 'blur',
      },
    );
    this.formCreateEvent = this.fb.group(
      {
        eventName: [this.eventName, Validators.required],
        eventDescription: [this.eventDescription, Validators.required],
        eventStartDate: [this.eventStartDate, Validators.required],
        eventEndDate: [this.eventEndDate, Validators.required],
        eventHours: [this.eventHours, Validators.required],
        selectedTypeEvent: [this.selectedTypeEvent, Validators.required],
        selectedModeEvent: [this.selectedModeEvent, Validators.required],
        eventLocation: [this.eventLocation, Validators.required],
      },
      {
        updateOn: 'blur',
      },
    );
    this.formTypeEvent = this.fb.group(
      {
        typeEventName: [this.typeEventName, Validators.required],
        typeEventDescription: [this.typeEventDescription, Validators.required],
        isInForceTypeEvent: [this.isInForceTypeEvent, Validators.required],
      },
      {
        updateOn: 'blur',
      },
    );
    this.formAddParticipant = this.fb.group(
      {
        participantName: [this.participantName, Validators.required],
        participantPaternalSurname: [
          this.participantPaternalSurname,
          Validators.required,
        ],
        participantMaternalSurname: [
          this.participantMaternalSurname,
          Validators.required,
        ],
        participantTypeDocument: [
          this.participantTypeDocument,
          Validators.required,
        ],
        participantDocumentNumber: [
          this.participantDocumentNumber,
          [Validators.required, Validators.pattern(this.documentNumberPattern)],
        ],
        participantEmail: [this.participantEmail, Validators.required],
      },
      {
        updateOn: 'blur',
      },
    );
  }

  getErrorMessageFormEmmiterCertificate(controlName: string): string {
    const control = this.formEmmiterCertificate.get(controlName);

    if (!control || !control.errors || !control.touched) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio.';
    }

    if (control.hasError('pattern')) {
      return 'Formato inválido. Solo se permiten números entre 8 y 20 dígitos.';
    }

    if (control.hasError('min')) {
      return 'Debe ingresar un valor mayor o igual a 0.';
    }

    return '';
  }

  getErrorMessageFormCreateEvent(controlName: string): string {
    const control = this.formCreateEvent.get(controlName);

    if (!control || !control.errors || !control.touched) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio.';
    }

    return '';
  }

  getErrorMessageFormTypeEvent(controlName: string): string {
    const control = this.formTypeEvent.get(controlName);

    if (!control || !control.errors || !control.touched) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio.';
    }

    return '';
  }

  getErrorMessageFormAddParticipant(controlName: string): string {
    const control = this.formAddParticipant.get(controlName);

    if (!control || !control.errors || !control.touched) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio.';
    }

    if (control.hasError('pattern')) {
      return 'Formato inválido. Solo se permiten números entre 8 y 20 dígitos.';
    }

    return '';
  }

  updateEndMinDate() {
    if (this.eventStartDate) {
      this.minEndDate = this.eventStartDate;
    }
  }

  toDatetimeLocal(date: Date): string {
    // Convierte a formato 'YYYY-MM-DDTHH:MM' compatible con datetime-local
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes())
    );
  }

  handleShowAllEvents(): void {
    if (!this.isShowAllEvents) {
      this.titleModalCreateEvent = 'Ver Eventos';
      this.descriptionModalCreateEvent =
        'Seleccione un evento para ver los detalles y participantes';
    } else {
      this.titleModalCreateEvent = 'Crear Nuevo Evento';
      this.descriptionModalCreateEvent =
        'Complete los datos para crear un nuevo evento';
    }
    this.isVisbleFormEvent = !this.isVisbleFormEvent;
    this.isShowAllEvents = !this.isShowAllEvents;
  }

  handleInputDocumentNumber(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.documentNumber = input;
  }

  preventNonNumericInput(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
    ];

    const isNumber = /^[0-9]$/.test(event.key);

    if (!isNumber && !allowedKeys.includes(event.key)) {
      event.preventDefault(); // Evita que se escriban letras o símbolos
    }
  }

  handleOpenModalEmmiterCertificate(): void {
    this.isOpenModalEmmiterCertificate = true;
  }

  handleOpenModalCreateEvent(): void {
    this.isOpenModalCreateEvent = true;
  }

  handleOpenModalAddParticipant(): void {
    this.isOpenModalAddParticipant = true;
  }

  handleCleanFormCreateEvent(): void {
    this.formCreateEvent.reset();
  }

  handleOpenModalCreateTypeEvent(): void {
    this.titleModalCreateEvent = 'Crear Tipo de Evento';
    this.descriptionModalCreateEvent =
      'Complete los datos para crear un nuevo tipo de evento';
    this.isVisbleFormEvent = false;
  }

  handleBackModalCreateEvent(): void {
    this.titleModalCreateEvent = 'Crear Nuevo Evento';
    this.descriptionModalCreateEvent =
      'Complete los datos para crear un nuevo evento';
    this.isVisbleFormEvent = true;
  }

  handleSearch(event: string): void {
    this.search = event;
  }

  clearSearch() {
    this.search = '';
  }

  protected headers: string[] = [
    'ID',
    'Certificado',
    'Participante',
    'Estado',
    'Fecha',
    'Acciones',
  ];

  protected data: Array<unknown[]> = [
    [
      'a375562a-3850-4757-b5e3-c751b1fca0c4',
      'Capacitación en Ciberseguridad',
      'Lucía Fernández',
      'E',
      '2023-01-01',
      'menu',
    ],
    [
      'b375562a-3850-4757-b5e3-c751b1fca0c4',
      'Curso de Desarrollo Web',
      'Juan Pérez',
      'C',
      '2023-01-02',
      'menu',
    ],
    [
      'c375562a-3850-4757-b5e3-c751b1fca0c4',
      'Taller de Inteligencia Artificial',
      'María Torres',
      'E',
      '2023-01-03',
      'menu',
    ],
    [
      'd375562a-3850-4757-b5e3-c751b1fca0c4',
      'Diplomado en Gestión de Proyectos',
      'Andrés Rivas',
      'E',
      '2023-01-04',
      'menu',
    ],
    [
      'e375562a-3850-4757-b5e3-c751b1fca0c4',
      'Capacitación en Big Data',
      'Valeria Gómez',
      'R',
      '2023-01-05',
      'menu',
    ],
    [
      'f375562a-3850-4757-b5e3-c751b1fca0c4',
      'Curso de Seguridad Informática',
      'Carlos Méndez',
      'E',
      '2023-01-06',
      'menu',
    ],
    [
      'g375562a-3850-4757-b5e3-c751b1fca0c4',
      'Seminario de UX/UI Design',
      'Sofía Herrera',
      'C',
      '2023-01-07',
      'menu',
    ],
    [
      'h375562a-3850-4757-b5e3-c751b1fca0c4',
      'Formación en Cloud Computing',
      'Diego Martínez',
      'C',
      '2023-01-08',
      'menu',
    ],
    [
      'i375562a-3850-4757-b5e3-c751b1fca0c4',
      'Curso de Ciencia de Datos',
      'Camila Ramírez',
      'C',
      '2023-01-09',
      'menu',
    ],
    [
      'j375562a-3850-4757-b5e3-c751b1fca0c4',
      'Capacitación en Machine Learning',
      'Esteban Salazar',
      'E',
      '2023-01-10',
      'menu',
    ],
  ];

  protected dataEvent: Array<unknown[]> = [
    [
      'Curso de Capacitación en Ciberseguridad',
      '2025-01-01',
      '2025-01-10',
      'combobox',
      '34h',
      'Chiclayo',
      'menu',
    ],
    [
      'Seminario de Actualización Profesional en Desarrollo Web',
      '2025-02-01',
      '2025-02-10',
      'combobox',
      '40h',
      'Lima',
      'menu',
    ],
    [
      'Diplomado de Especialización en Inteligencia Artificial',
      '2025-03-01',
      '2025-03-10',
      'combobox',
      '50h',
      'Arequipa',
      'menu',
    ],
    [
      'Taller de Formación en Gestión de Proyectos',
      '2025-04-01',
      '2025-04-10',
      'combobox',
      '20h',
      'Cusco',
      'menu',
    ],
  ];
  protected headersEvent: string[] = [
    'ID',
    'Nombre del Evento',
    'Fecha de Inicio',
    'Fecha de Fin',
    'Modalidad',
    'Horas',
    'Ubicación',
    'Acciones',
  ];
  protected selectedColumnSearchEvent: string[] = [
    'ID',
    'Nombre del Evento',
    'Ubicación',
  ];
  protected searchEvent: string = '';
  protected total = this.dataEvent.length;
  protected digits = this.total.toString().length;
  protected minWidthEvent = 'min-w-[1640px]';
  protected optionsCombobox: OptionType[] = [
    { label: 'Presencial', value: 'Presencial' },
    { label: 'Remoto', value: 'Remoto' },
    { label: 'Híbrido', value: 'Híbrido' },
  ];
  formattedDataEvent: Array<unknown[]> = this.dataEvent.map((event, index) => {
    const number = (index + 1).toString().padStart(this.digits, '0');
    return [`EVT-${number}`, ...event];
  });

  handleSearchEvent(event: string): void {
    this.searchEvent = event;
  }

  clearSearchEvent() {
    this.searchEvent = '';
  }
}
