import { Routes } from '@angular/router';
import { authGuard } from '../core/auth.guard';
import { LoginComponent } from '../features/auth/login.component';
import { ProductListComponent } from '../features/products/product-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', canActivate: [authGuard], component: ProductListComponent },
  { path: '**', redirectTo: '' },
];

