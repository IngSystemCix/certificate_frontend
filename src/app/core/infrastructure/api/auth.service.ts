import { inject, Injectable } from "@angular/core"
import { environment } from "../../../../environments/environment"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { ApiResponse, TokenData, TokenRefreshData } from "../../domain"
import { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrlBase = environment.apiUrlBase
  private http = inject(HttpClient)

  sendCodeValidation(email: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrlBase}/auth/send-code-validation`,
      { email },
    )
  }

  login(email: string, code: string): Observable<ApiResponse<TokenData>> {
    return this.http.post<ApiResponse<TokenData>>(
      `${this.apiUrlBase}/auth/login`,
      { email, code },
    )
  }

  refreshToken(token: string): Observable<ApiResponse<TokenRefreshData>> {
    return this.http.post<ApiResponse<TokenRefreshData>>(
      `${this.apiUrlBase}/auth/refresh-token`,
      { token },
    )
  }

  logout(token: string): Observable<ApiResponse<void>> {
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    return this.http.post<ApiResponse<void>>(
      `${this.apiUrlBase}/auth/logout`,
      null,
      { headers },
    )
  }
}
