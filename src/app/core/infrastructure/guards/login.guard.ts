import { inject } from "@angular/core"
import { CanActivateFn, Router } from "@angular/router"

export const loginGuard: CanActivateFn = () => {
  const route = inject(Router)
  const token = localStorage.getItem("accessToken")
  if (token) {
    route.navigate(["/home"])
    return false
  }
  return true
}
