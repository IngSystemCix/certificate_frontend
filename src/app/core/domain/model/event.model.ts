export interface TypeEvent {
  id?: number
  nombre: string
  descripcion: string
  vigente: boolean
}

export interface KeyValueTypeEvent {
  id: number
  nombre: string
}

export interface EventData {
  nombre: string
  activo: string
  descripcion: string
  duracion: string
  enlaceEvento?: string
  fechaInicio: string
  fechaFin: string
  idModalidad: number
  idTipoEvento: string
  lugar?: string
}

export interface EventDataTable {
  nombre: string
  fechaInicio: string
  fechaFin: string
  duracion: number
  tipoEvento: string
  lugar: string
  enlaceEvento: string
  idModalidad: string
}
