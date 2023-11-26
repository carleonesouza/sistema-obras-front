import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';

import { CurrencyPipe } from '@angular/common';
import { EmpreendimentosRoutingModule } from './empreendimentos-routing.module';

import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { EmpreendimentosService } from './empreendimentos.service';
import { EmpreendimentoResolver, EmpreendimentosResolver } from './empreendimentos.resolver';
import { HandleError } from 'app/utils/handleErrors';
import { EmpreendimentosComponent } from './empreendimentos.component';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { ObraAereaComponent } from './obra-aerea/obra-aerea.component';
import { ObraTipoComponent } from './obra-templates/obra-tipo.component';
import { IntervencoesService } from './intervencoes.service';
import { TipoInfraestruturaService } from './tipo-infraestrutura/tipo-infraestrutura.service';
import { IntervencoesComponent } from './intervencoes/intervencoes.component';
import { TipoInfraestruturaComponent } from './tipo-infraestrutura/tipo-infraestrutura.component';
import { SituacaoComponent } from './situacao/situacao.component';
import { SituacaoService } from './situacao.service';

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
   EmpreendimentosComponent,
   ListComponent,
   ObraTipoComponent,
   DetailsComponent,
   ObraAereaComponent,
   TipoInfraestruturaComponent,
   IntervencoesComponent,
   SituacaoComponent
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
    IntervencoesService,
    TipoInfraestruturaService,
    EmpreendimentoResolver,
    SituacaoService,
    HandleError,
    CurrencyPipe,
    { provide: CURRENCY_MASK_CONFIG, useValue: customCurrencyMaskConfig }
  ]
})
export class EmpreendimentosModule { }
