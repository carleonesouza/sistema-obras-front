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
import { AuthSignUpComponent } from 'app/pages/auth/sign-up/sign-up.component';
import { authSignupRoutes } from 'app/pages/auth/sign-up/sign-up.routing';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { MaterialAppModule } from 'material-app.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DirectiveModule } from 'app/directives/directive.module';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from 'environments/environment';


const maskConfig: Partial<IConfig> = { validation: false};

@NgModule({
    declarations: [
        AuthSignUpComponent,
        
    ],
    imports     : [
        RouterModule.forChild(authSignupRoutes),
        NgxMaskModule.forRoot(maskConfig),
        MatButtonModule,
        MatCheckboxModule,
        ClipboardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        DirectiveModule,
        FuseAlertModule,
        RecaptchaV3Module,
        FuseCardModule,
        RecaptchaFormsModule,
        RecaptchaModule,
        SharedModule,
        FuseDrawerModule,
        FuseSplashScreenModule,
        NgApexchartsModule,
        FuseFindByKeyPipeModule,
        MaterialAppModule,
    
    ],
    providers:[
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: {
              siteKey: environment.recaptcha.siteKey,
            } as RecaptchaSettings,
        }]
})
export class AuthSignUpModule
{
}
