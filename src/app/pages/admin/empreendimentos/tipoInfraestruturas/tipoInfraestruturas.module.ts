import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoInfraestruturasRoutingModule } from './tipoInfraestruturas-routing.module';
import { ListTipoInfraestruturasComponent } from './list/list.component';
import { DetailsTipoInfraestruturaComponent } from './details/details.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { TipoInfraestruturaComponent } from './tipoInfraestrutura.component';
import { TipoInfraestruturaService } from './tipo-infraestrutura.service';
import { TipoEmpreendimentosResolver, TipoInfraestruturaResolver } from './tipoInfraestrutura.resolver';
import { SetorsService } from '../../setors/setors.service';
import { HandleError } from 'app/utils/handleErrors';


@NgModule({
  declarations: [
    ListTipoInfraestruturasComponent,
    TipoInfraestruturaComponent,
    DetailsTipoInfraestruturaComponent,
  ],
  imports: [
    CommonModule,
    TipoInfraestruturasRoutingModule,
    SharedModule,
    MaterialAppModule,
  ],
  providers:[
    TipoInfraestruturaService,
    TipoInfraestruturaResolver,
    TipoEmpreendimentosResolver,
    SetorsService,
    HandleError,
  ]
})
export class TipoInfraestruturasModule { }
