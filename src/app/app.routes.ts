import { Routes } from '@angular/router';PublicHomeComponent
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { PublicHomeComponent } from './component/public-home/public-home.component';
import { UserHomeComponent } from './component/user-home/user-home.component';
import { AdminHomeComponent } from './component/admin-home/admin-home.component';
import { authGuard } from '../services/auth.guard';
import { AddDriverComponent } from './component/add-driver/add-driver.component';
import { AddConductorComponent } from './component/add-conductor/add-conductor.component';
import { AddBusComponent } from './component/add-bus/add-bus.component';
import { ViewBusComponent } from './component/view-bus/view-bus.component';
import { ViewDriverComponent } from './component/view-driver/view-driver.component';
import { ViewConductorComponent } from './component/view-conductor/view-conductor.component';
import { ViewUserComponent } from './component/view-user/view-user.component';
import { ProfileComponent } from './component/profile/profile.component';

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
      {
        path: 'add-bus',
        component: AddBusComponent,
        canActivate: [authGuard], 
        data: { role: 'ROLE_ADMIN' }
      },
      {
        path: 'view-bus',
        component: ViewBusComponent,
        canActivate: [authGuard], 
        data: { role: 'ROLE_ADMIN' }
      },
      {
        path: 'view-driver',
        component: ViewDriverComponent,
        canActivate: [authGuard], 
        data: { role: 'ROLE_ADMIN' }
      },
      {
        path: 'view-conductor',
        component: ViewConductorComponent,
        canActivate: [authGuard], 
        data: { role: 'ROLE_ADMIN' }
      },
      {
        path: 'view-user',
        component: ViewUserComponent,
        canActivate: [authGuard], 
        data: { role: 'ROLE_ADMIN' }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard], 
        data: { role: ['ROLE_ADMIN', 'ROLE_USER'] }  
      }
      
      
];
