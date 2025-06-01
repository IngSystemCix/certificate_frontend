import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpEvent,
} from "@angular/common/http"
import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { Observable, catchError, switchMap, throwError } from "rxjs"
import { AuthService } from "../api/auth.service"

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService)
  const router = inject(Router)

  const bypassUrls = ["/auth/login", "/auth/refresh-token", "/auth/logout"]
  if (bypassUrls.some((url) => req.url.includes(url))) {
    return next(req)
  }

  const accessToken = localStorage.getItem("accessToken")
  const clonedReq = accessToken
    ? req.clone({
        headers: req.headers.set("Authorization", `Bearer ${accessToken}`),
      })
    : req

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          router.navigate(["/login"])
          return throwError(() => error)
        }

        return authService.refreshToken(refreshToken).pipe(
          switchMap((response) => {
            const tokens = response?.data

            if (!tokens || !tokens.newAccessToken || !tokens.newRefreshToken) {
              console.error("Tokens de refresco inválidos:", tokens)
              router.navigate(["/login"])
              return throwError(
                () => new Error("No se pudo refrescar el token"),
              )
            }

            const newAccessToken = tokens.newAccessToken
            const newRefreshToken = tokens.newRefreshToken

            localStorage.setItem("accessToken", newAccessToken)
            localStorage.setItem("refreshToken", newRefreshToken)

            const retryReq = req.clone({
              headers: req.headers.set(
                "Authorization",
                `Bearer ${newAccessToken}`,
              ),
            })

            return next(retryReq)
          }),
          catchError((refreshError) => {
            console.error("Error al refrescar token:", refreshError)
            router.navigate(["/login"])
            return throwError(() => refreshError)
          }),
        )
      }

      return throwError(() => error)
    }),
  )
}
