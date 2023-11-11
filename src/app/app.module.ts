import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { SharedModule } from './shared/shared.module';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { MaterialAppModule } from 'material-app.module';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { DirectiveModule } from './directives/directive.module';
import { RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from 'environments/environment';

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),

          //Shared Module
          SharedModule,
          DirectiveModule,
        // Core module of your application
        CoreModule,
        RecaptchaModule,
        RecaptchaFormsModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        FuseNavigationModule,
        MaterialAppModule,
        FuseFindByKeyPipeModule,
    ],
    providers:[
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: {
              siteKey: environment.recaptcha.siteKey,
            } as RecaptchaSettings,
          },
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
