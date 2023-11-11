import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { AuthSignInComponent } from 'app/pages/auth/sign-in/sign-in.component';
import { authSignInRoutes } from 'app/pages/auth/sign-in/sign-in.routing';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from 'environments/environment';

@NgModule({
    declarations: [
        AuthSignInComponent
    ],
    imports     : [
        RouterModule.forChild(authSignInRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        RecaptchaFormsModule,
        RecaptchaModule,
        FuseAlertModule,
        SharedModule
    ],
    providers:[
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: {
              siteKey: environment.recaptcha.siteKey,
            } as RecaptchaSettings,
        }
    ]
})
export class AuthSignInModule
{
}
