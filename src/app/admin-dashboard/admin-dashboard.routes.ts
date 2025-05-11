import { Routes } from "@angular/router";
import { AdminDashboardLayoutComponent } from "./layouts/admin-dashboard-layout/admin-dashboard-layout.component";
import { ProductsAdminPageComponent } from "./pages/products-admin-page/products-admin-page.component";
import { ProductAdminPageComponent } from "./pages/product-admin-page/product-admin-page.component";


const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    children: [
      {
        path: 'products',
        title: 'Products',
        component: ProductsAdminPageComponent
      },
      {
        path: 'products/:id',
        title: 'Product by id',
        component: ProductAdminPageComponent
      },
      {
        path: '**',
        redirectTo: 'products'
      }
    ]
  }
];


export default adminDashboardRoutes;
