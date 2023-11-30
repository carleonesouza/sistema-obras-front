import { Route } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileResolver } from './profile.resolver';

export const profileRoutes: Route[] = [
    {
        path     : ':id',
        component: ProfileComponent,
        resolve:{
            user: ProfileResolver
        }
    }
];
