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
                        path: '', loadChildren: () => import('app/pages/store/store.module').then(store => store.StoreModule),
                    }
                ]
            },
            {
                path: '', loadChildren: () => import('app/pages/profile/profile.module').then(p => p.ProfileModule),
            },
            // Auth routes for guests
            {
                path: '',
                component: LayoutComponent,
                data: {
                    layout: 'empty'
                },
                children: [
                    {
                        path: 'confirmation-required', loadChildren:
                            () => import('app/pages/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)
                    },
                    { path: 'sign-in', loadChildren: () => import('app/pages/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
                    { path: 'forgot-password', loadChildren: () => import('app/pages/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
                    { path: 'reset-password', loadChildren: () => import('app/pages/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
                    { path: 'sign-up', loadChildren: () => import('app/pages/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) }
                ]
            },

            // Auth routes for authenticated users
            {
                path: '',
                component: LayoutComponent,
                data: {
                    layout: 'empty'
                },
                children: [
                    { path: 'sign-out', loadChildren: () => import('app/pages/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
                ]
            },

            // Landing routes
            {
                path: '',
                component: LayoutComponent,
                data: {
                    layout: 'empty'
                },
                children: [
                    { path: 'home', loadChildren: () => import('app/pages/landing/landing.module').then(m => m.LandingHomeModule) },
                    // Documents
                    { path: 'docs', loadChildren: () => import('app/pages/docs/docs.module').then(m => m.DocsModule) },

                    { path: 'help-center', loadChildren: () => import('app/pages/help-center/help-center.module').then(h => h.HelpCenterModule) },
                ]
            },

            // Admin routes
            {
                path: '',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                component: LayoutComponent,
                children: [
                    // 404 & Catch all
                    { path: '401-unauthorized', component: Error401Component },
                    { path: 'error-500', component: Error500Component },
                    { path: '**', redirectTo: '404-not-found', pathMatch: 'full' },
                ]
            }
        ]
    },

];
