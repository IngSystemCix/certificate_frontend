import { HttpClient } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import { Observable } from "rxjs"
import { environment } from "../../../../environments/environment"
import { ApiResponse, Participant, Reniec } from "../../domain"

@Injectable({
  providedIn: "root",
})
export class ParticipantService {
  private apiUrlBase = environment.apiUrlBase
  private http = inject(HttpClient)

  getDataPerson(dni: string): Observable<ApiResponse<Reniec>> {
    return this.http.get<ApiResponse<Reniec>>(
      `${this.apiUrlBase}/reniec/data?dni=${dni}`,
    )
  }

  createParticipant(data: Participant): Observable<ApiResponse<Participant>> {
    return this.http.post<ApiResponse<Participant>>(
      `${this.apiUrlBase}/participante/create`,
      data,
    )
  }

  getParticipantByDni(
    dni: string,
  ): Observable<
    ApiResponse<Omit<Participant, "numDocumento" | "idTipoDocumento">>
  > {
    return this.http.get<
      ApiResponse<Omit<Participant, "numDocumento" | "idTipoDocumento">>
    >(`${this.apiUrlBase}/participante/${dni}`)
  }
}
