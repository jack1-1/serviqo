import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Shell } from './core/layout/shell/shell';
import { permissionGuard } from './core/guards/permission.guard';
import { PERMISSIONS } from './core/constants/permissions';
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login-component/login-component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register-component/register-component').then(m => m.RegisterComponent),
    },

    // {
    //     path: 'dashboard',
    //     loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
    //     canActivate: [authGuard]
    // },
    {
        path: '',
        component: Shell,
        canActivate: [authGuard],

        children: [

            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: 'tickets/create',
                loadComponent: () =>
                    import('./features/tickets/create-ticket/create-ticket')
                        .then(m => m.CreateTicket),
                canActivate: [permissionGuard],
                data: {
                    permission: PERMISSIONS.CREATE_TICKET
                }
            },
            {
                path: 'tickets/list',
                loadComponent: () =>
                    import('./features/tickets/view-tickets/view-tickets')
                        .then(m => m.ViewTickets),

                canActivate: [permissionGuard],
                data: {
                    permission: PERMISSIONS.VIEW_TICKET
                }
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
