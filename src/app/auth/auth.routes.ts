import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { RegisterPageComponent } from "./pages/register-page/register-page.component";

export const authRoutes: Routes = [
  {
    path:'',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        title: 'Login',
        component: LoginPageComponent
      },
      {
        path: 'register',
        title: 'Register',
        component: RegisterPageComponent
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ]
  }
]

export default authRoutes;
