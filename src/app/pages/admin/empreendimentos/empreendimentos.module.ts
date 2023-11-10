import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';

import { CurrencyPipe } from '@angular/common';
import { EmpreendimentosRoutingModule } from './empreendimentos-routing.module';
import { ListEmpreendimentosComponent } from './list-Empreendimentos/list-empreendimentos.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { EmpreendimentosComponent } from './Empreendimentos.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { EmpreendimentosService } from './empreendimentos.service';
import { ProductResolver, EmpreendimentosResolver } from './empreendimentos.resolver';
import { HandleError } from 'app/utils/handleErrors';

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
    ListEmpreendimentosComponent,
    ProductDetailsComponent,
    EmpreendimentosComponent
  ],
  imports: [
    CommonModule,
    EmpreendimentosRoutingModule,
    SharedModule,
    MaterialAppModule,
    CurrencyMaskModule
  ],
  providers:[
    EmpreendimentosService,
    EmpreendimentosResolver,
    ProductResolver,
    HandleError,
    CurrencyPipe,
    { provide: CURRENCY_MASK_CONFIG, useValue: customCurrencyMaskConfig }
  ]
})
export class EmpreendimentosModule { }
