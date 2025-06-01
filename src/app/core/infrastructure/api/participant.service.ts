import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { environment } from "../../../../environments/environment"
import { Observable } from "rxjs"
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
}
