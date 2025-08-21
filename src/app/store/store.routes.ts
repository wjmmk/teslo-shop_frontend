import { Routes } from "@angular/router";
import { StoreFrontLayoutComponent } from "./layout/store-front-layout/store-front-layout.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { GenderPageComponent } from "./pages/gender-page/gender-page.component";
import { ProductPageComponent } from "./pages/product-page/product-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";
import { AboutComponent } from "./pages/about/about.component";
import { PaymentComponent } from "./pages/payment/payment.component";


export const stroreRoutes: Routes = [
  {
    path: "",
    component: StoreFrontLayoutComponent,
    children: [
      {
        path: "",
        title: 'Inicio',
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
        path: "**",
        component: NotFoundPageComponent
      }
    ]
  }
]

export  default stroreRoutes;
