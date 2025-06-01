import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { environment } from "../../../../environments/environment"
import { ApiResponse, PersonalData } from "../../domain"
import { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class PersonalService {
  private apiUrlBase = environment.apiUrlBase
  private http = inject(HttpClient)

  createPersonal(data: PersonalData): Observable<ApiResponse<PersonalData>> {
    return this.http.post<ApiResponse<PersonalData>>(
      `${this.apiUrlBase}/personal/create`,
      data,
    )
  }
}
