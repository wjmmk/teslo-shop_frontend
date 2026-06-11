import { Routes } from "@angular/router";
import { StoreFrontLayoutComponent } from "./layout/store-front-layout/store-front-layout.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";
import { GenderPageComponent } from "./pages/gender-page/gender-page.component";
import { ProductPageComponent } from "./pages/product-page/product-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";
import { AboutComponent } from "./pages/about/about.component";
import { PaymentComponent } from "../payment/payment.component";
import { PaymentSuccessComponent } from "../payment/components/payment-success/payment-success.component";
import { PaymentFailureComponent } from "../payment/components/payment-failure/payment-failure.component";
import { PaymentPendingComponent } from "../payment/components/payment-pending/payment-pending.component";


const stroreRoutes: Routes = [
  {
    path: "",
    component: StoreFrontLayoutComponent,
    children: [
      {
        path: "",
        title: 'Inicio',
        component: LandingPageComponent
      },
      {
        path: "catalog",
        title: 'Catálogo',
        component: HomePageComponent
      },
      {
        path: "about",
        title: 'Nosotros',
        component: AboutComponent
      },
      {
        path: "gender/:gender",
        title: 'Categoria',
        component: GenderPageComponent
      },
      {
        path: "product/:idSlug",
        title: 'Producto',
        component: ProductPageComponent
      },
      {
        path: "payment",
        title: 'Pago',
        component: PaymentComponent
      },
      {
        path: "payment/success",
        title: 'Pago Exitoso',
        component: PaymentSuccessComponent
      },
      {
        path: "payment/failure",
        title: 'Pago Rechazado',
        component: PaymentFailureComponent
      },
      {
        path: "payment/pending",
        title: 'Pago Pendiente',
        component: PaymentPendingComponent
      },
      {
        path: "**",
        component: NotFoundPageComponent
      }
    ]
  }
]

export  default stroreRoutes;
