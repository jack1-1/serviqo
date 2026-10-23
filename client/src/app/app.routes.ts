import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Shell } from './core/layout/shell/shell';
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
            // {
            //     path: 'tickets',

            //     loadComponent: () =>
            //         import('./features/tickets/tickets.component')
            //             .then(m => m.TicketsComponent),

            //     canActivate: [permissionGuard],

            //     data: {
            //         permission: PERMISSIONS.TICKET_VIEW
            //     }
            // }
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
