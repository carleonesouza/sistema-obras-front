import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObraResolver, ObrasResolver } from './obra.resolver';
import { ObrasRoutingModule } from './obras-routing.module';
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';

import { CurrencyPipe } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { HandleError } from 'app/utils/handleErrors';
import { ObrasService } from './obras.service';
import { ListObrasComponent } from './list/list.component';
import { ObraDetailsComponent } from './details/details.component';
import { ObraComponent } from './obra.component';
import { PercentageMaskDirective } from 'app/directives/parcentage-mask.directive';
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
    ListObrasComponent,
    ObraDetailsComponent,
    ObraComponent,
    PercentageMaskDirective
  ],
  imports: [
    CommonModule,
    ObrasRoutingModule,
    SharedModule,
    MaterialAppModule,
    CurrencyMaskModule,
    
  ],
  providers:[
    ObraResolver,
    ObrasResolver,
    ObrasService,
    HandleError,
    CurrencyPipe,
    { provide: CURRENCY_MASK_CONFIG, useValue: customCurrencyMaskConfig }
  ]
})
export class ObrasModule { }
