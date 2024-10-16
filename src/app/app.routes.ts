import { Routes } from '@angular/router';PublicHomeComponent
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { PublicHomeComponent } from './component/public-home/public-home.component';
import { UserHomeComponent } from './component/user-home/user-home.component';
import { AdminHomeComponent } from './component/admin-home/admin-home.component';
import { authGuard } from '../services/auth.guard';
import { AddDriverComponent } from './component/add-driver/add-driver.component';
import { AddConductorComponent } from './component/add-conductor/add-conductor.component';

export const routes: Routes = [
    {
        path:'',
        'component':PublicHomeComponent,
    },
    {
        path:'login',
        'component':LoginComponent,
    },
    {
        path:'register',
        'component':RegisterComponent,
    },
    {
        path: 'public-home',
        component: PublicHomeComponent
      },
      {
        path: 'user-home',
        component: UserHomeComponent,
        canActivate: [authGuard], 
        data: { role: 'ROLE_USER' } 
      },
      {
        path: 'admin-home',
        component: AdminHomeComponent,
        canActivate: [authGuard], // Protect this route
        data: { role: 'ROLE_ADMIN' } // Specify the required role
      },
      {
        path: 'add-driver',
        component: AddDriverComponent,
        canActivate: [authGuard], 
        data: { role: 'ROLE_ADMIN' } 
      },
      {
        path: 'add-conductor',
        component: AddConductorComponent,
        canActivate: [authGuard], 
        data: { role: 'ROLE_ADMIN' }
      },
];
