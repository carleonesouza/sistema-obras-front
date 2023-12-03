import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntervencaoRoutingModule } from './intervencao-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { ListIntevercoesComponent } from './list/list.component';
import { DetailsIntervencaoComponent } from './details/details.component';
import { IntervencoesService } from './intervencoes.service';
import { IntervencaoResolver, IntervencoesResolver } from './intervencao.resolver';
import { IntervencoesComponent } from './intervencoes.component';
import { HandleError } from 'app/utils/handleErrors';


@NgModule({
  declarations: [
      ListIntevercoesComponent,
      DetailsIntervencaoComponent,
      IntervencoesComponent
  ],
  imports: [
    CommonModule,
    IntervencaoRoutingModule,
    SharedModule,
    MaterialAppModule,
  ],
  providers:[
    IntervencoesService,
    IntervencaoResolver,
    IntervencoesResolver,
    HandleError,
  ]
})
export class IntervencaoModule { }
