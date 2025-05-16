import { Routes } from "@angular/router"
import {
  HomeComponent,
  LoginComponent,
  NotFoundComponent,
  AddUserComponent,
  CertificateComponent,
} from "./presentation/features"

export const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent, title: "Certificate :: Login" },
  { path: "home", component: HomeComponent, title: "Certificate :: Home" },
  {
    path: "add-user",
    component: AddUserComponent,
    title: "Certificate :: Add User",
  },
  {
    path: "certificate",
    component: CertificateComponent,
    title: "Certificate :: Certificate",
  },
  { path: "**", redirectTo: "not-found" },
  {
    path: "not-found",
    component: NotFoundComponent,
    title: "Certificate :: 404",
  },
]
