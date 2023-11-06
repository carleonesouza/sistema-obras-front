import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoComponent } from './logo-component/logo.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MaterialAppModule } from 'material-app.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { ListItemsComponent } from './list-items/list-items.component';
import { FuseCardModule } from '@fuse/components/card';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Error404Component } from './error/error-404/error-404.component';
import { Error401Component } from './error/error-401/error-401.component';
import { Error500Component } from './error/error-500/error-500.component';
import { AddIdentificadorComponent } from './add-identificador/add-identificador.component';
import { DialogAssociateComponent } from './dialog-association/dialog-associate.component';
import { MatSnackBarComponent } from './mat-snack-bar/mat-snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';

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
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        FuseAlertModule,
        MaterialAppModule,
        RouterModule,
        ReactiveFormsModule,
        FuseNavigationModule,
        FuseSplashScreenModule,
        NgApexchartsModule,
        FuseFindByKeyPipeModule,
        MaterialAppModule,
        FuseNavigationModule,
        FuseFindByKeyPipeModule,
        FuseAlertModule,
        FuseCardModule,
        FormsModule,
        MatSnackBarModule,
        CurrencyMaskModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LogoComponent,
        ListItemsComponent,
        Error404Component,
        Error500Component,
        Error401Component,
        AddIdentificadorComponent,
        DialogAssociateComponent,
        MatSnackBarComponent,
    ],
    declarations:[
        LogoComponent,
        ConfirmationDialogComponent,
        NotFoundComponent,
        Error404Component,
        Error500Component,
        Error401Component,
        ListItemsComponent,
        AddIdentificadorComponent,
        DialogAssociateComponent,
        MatSnackBarComponent,
    ],
    providers:[
        { provide: MAT_DATE_LOCALE, useValue: 'pt-br' },{
            provide: MAT_DATE_FORMATS,
            useValue: {
              display: {
                dateInput: 'DD/MM/YYYY',
                monthYearLabel: 'MMM YYYY',
                dateA11yLabel: 'LL',
                monthYearA11yLabel: 'MMMM YYYY',
              }
            }
          },
        CurrencyPipe,
  { provide: CURRENCY_MASK_CONFIG, useValue: customCurrencyMaskConfig }
    ]
})
export class SharedModule
{
}
