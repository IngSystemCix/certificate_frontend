import { Routes } from "@angular/router"
import {
  HomeComponent,
  LoginComponent,
  NotFoundComponent,
  AddUserComponent,
  CertificateComponent,
} from "./presentation/features"
import { authGuard, loginGuard } from "./core/infrastructure"

export const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    canActivate: [loginGuard],
    component: LoginComponent,
    title: "Certificate :: Login",
  },
  {
    path: "home",
    canActivate: [authGuard],
    component: HomeComponent,
    title: "Certificate :: Home",
  },
  {
    path: "add-user",
    canActivate: [authGuard],
    component: AddUserComponent,
    title: "Certificate :: Add User",
  },
  {
    path: "certificate",
    canActivate: [authGuard],
    component: CertificateComponent,
    title: "Certificate",
  },
  { path: "**", redirectTo: "not-found" },
  {
    path: "not-found",
    component: NotFoundComponent,
    title: "Certificate :: 404",
  },
]
