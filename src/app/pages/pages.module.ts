import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialAppModule } from 'material-app.module';
import { pagesRoutes } from './pages.routes';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { SharedModule } from 'app/shared/shared.module';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';

import { HomeComponent } from './home/home.component';
import { PageComponent } from './page.component';
import { PagesService } from './pages.service';
import { PagesResolver } from './pages.resolver';


registerLocaleData(localePt, 'pt-BR');



export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
const maskConfig: Partial<IConfig> = { validation: false};




@NgModule({
  declarations: [
    HomeComponent,
    PageComponent,

  ],
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule.forChild(pagesRoutes),
    NgxMaskModule.forRoot(maskConfig),
    FuseNavigationModule,
    FuseLoadingBarModule,
    SharedModule,
    FuseSplashScreenModule,
    NgApexchartsModule,
    FuseFindByKeyPipeModule,
    MaterialAppModule,
    FuseNavigationModule,
    FuseFindByKeyPipeModule,
    FuseAlertModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-br' },{
    provide: MAT_DATE_FORMATS,
    useValue: {
      display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      }
    }
  }, PagesService, PagesResolver,  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}]
})
export class PagesModule { }
