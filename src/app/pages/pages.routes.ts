import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageComponent } from './page.component';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { Error401Component } from 'app/shared/error/error-401/error-401.component';
import { Error500Component } from 'app/shared/error/error-500/error-500.component';


export const pagesRoutes: Route[] = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                component: LayoutComponent,
                canActivateChild: [AuthGuard],
                children: [
                    {
                        path: 'inicio',
                        component: HomeComponent,
                    },
                    {
                        path: '', loadChildren: () => import('app/pages/admin/admin.module').then(admin => admin.AdminModule),
                    },
                    {
                        path: 'sign-out', loadChildren: () => import('app/pages/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)
                    },
                    {
                        path: '', loadChildren: () => import('app/pages/profile/profile.module').then(p => p.ProfileModule),
                    },
                    { path: '401-unauthorized', component: Error401Component },
                    { path: 'error-500', component: Error500Component },
                    { path: '**', redirectTo: '404-not-found', pathMatch: 'full' },

                ]
            }            
        ]
    },
    {
        path: '',
        component: PageComponent,
        data: {
            layout: 'empty'
        },
        children: [

            { path: 'sign-in', loadChildren: () => import('app/pages/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },

        ]
    }

];
