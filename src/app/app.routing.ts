import { Route } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const appRoutes: Route[] = [

    {path: '', pathMatch : 'full', redirectTo: 'home'},

    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'inicio'},

    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '', loadChildren: () => import('app/pages/pages.module').then(page => page.PagesModule),
            },
        ]
    }

];
