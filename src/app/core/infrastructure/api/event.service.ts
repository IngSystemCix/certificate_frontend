import { HttpClient, HttpParams } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { environment } from "../../../../environments/environment"
import { ApiResponse, EventData, EventDataTable, TypeEvent } from "../../domain"
import { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class EventService {
  private apiUrlBase = environment.apiUrlBase
  private http = inject(HttpClient)

  createTypeEvent(data: TypeEvent): Observable<ApiResponse<TypeEvent>> {
    return this.http.post<ApiResponse<TypeEvent>>(
      `${this.apiUrlBase}/evento/create/tipo-evento`,
      data,
    )
  }

  getAllTypeEvents(): Observable<ApiResponse<TypeEvent[]>> {
    return this.http.get<ApiResponse<TypeEvent[]>>(
      `${this.apiUrlBase}/evento/tipo-eventos/all`,
    )
  }

  createEvent(data: EventData): Observable<ApiResponse<EventData>> {
    return this.http.post<ApiResponse<EventData>>(
      `${this.apiUrlBase}/evento/create`,
      data,
    )
  }

  getEventosPaginados(
    page: number,
    size: number,
  ): Observable<ApiResponse<EventDataTable[]>> {
    return this.http.get<ApiResponse<EventDataTable[]>>(
      `${this.apiUrlBase}/evento/all?page=${page}&size=${size}`,
    )
  }

  searchEventByName(name: string): Observable<ApiResponse<EventDataTable[]>> {
    const params = new HttpParams().set("nombre", name)
    return this.http.get<ApiResponse<EventDataTable[]>>(
      `${this.apiUrlBase}/evento/search`,
      { params },
    )
  }
}
