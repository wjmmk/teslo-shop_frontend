import { Routes } from "@angular/router";
import { AdminDashboardLayoutComponent } from "./layouts/admin-dashboard-layout/admin-dashboard-layout.component";
import { ProductsAdminPageComponent } from "./pages/products-admin-page/products-admin-page.component";
import { ProductAdminPageComponent } from "./pages/product-admin-page/product-admin-page.component";
import { IsAdminGuard } from "./guards/is-admin.guard";


const adminDashboardRoutes: Routes = [
  {
    path: '',
    title: 'Admin Dashboard',
    component: AdminDashboardLayoutComponent,
    canMatch: [IsAdminGuard],
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
