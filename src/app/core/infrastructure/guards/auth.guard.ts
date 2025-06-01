import { inject } from "@angular/core"
import { CanActivateFn, Router } from "@angular/router"

export const authGuard: CanActivateFn = () => {
  const route = inject(Router)
  const token = localStorage.getItem("accessToken")
  if (!token) {
    route.navigate(["/login"])
    return false
  }
  return true
}
