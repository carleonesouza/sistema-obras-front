import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { NgApexchartsModule } from 'ng-apexcharts';
import {MatTableModule} from '@angular/material/table';
import { StoreComponent } from './store.component';
import { VendasComponent } from './vendas/vendas.component';
import { CaixaComponent } from './caixa/caixa.component';
import { StoreRoutingModule } from './store.routes';
import { FuseCardModule } from '@fuse/components/card';
import { ProductsService } from '../admin/products/products.service';
import { HandleError } from '../../utils/handleErrors';
import { StoreService } from './store.service';
import { CaixaDetailsComponent } from './caixa/details/details.component';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import { StoreResolver } from './store.resolve';
import { MatSnackBarComponent } from 'app/shared/mat-snack-bar/mat-snack-bar.component';
import { ReportsComponent } from './reports/reports.component';
import { CdkTableModule } from '@angular/cdk/table';


export const customCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  decimal: ',',
  precision: 2,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.'
};

@NgModule({
  declarations: [
    StoreComponent,
    VendasComponent,
    CaixaComponent,
    CaixaDetailsComponent,
    ReportsComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    FuseNavigationModule,
    StoreRoutingModule,
    CdkTableModule,
    SharedModule,
    FuseDrawerModule,
    FuseCardModule,
    MatTableModule,
    FuseSplashScreenModule,
    NgApexchartsModule,
    FuseFindByKeyPipeModule,
    MaterialAppModule,
    FuseAlertModule,
    CurrencyMaskModule
  ],
  providers: [MatSnackBarComponent,
  { provide: StoreResolver },
  { provide: LOCALE_ID, useValue: 'pt-br'},
  { provide: MAT_DATE_LOCALE, useValue: 'pt-br'}, ProductsService, HandleError, CurrencyPipe, StoreService,
  { provide: CURRENCY_MASK_CONFIG, useValue: customCurrencyMaskConfig }, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}]
})
export class StoreModule { }
