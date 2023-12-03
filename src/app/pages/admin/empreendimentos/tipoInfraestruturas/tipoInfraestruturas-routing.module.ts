import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTipoInfraestruturasComponent } from './list/list.component';
import { TipoEmpreendimentosResolver, TipoInfraestruturaResolver } from './tipoInfraestrutura.resolver';
import { DetailsTipoInfraestruturaComponent } from './details/details.component';
import { TipoInfraestruturaComponent } from './tipoInfraestrutura.component';

const routes: Routes = [
  {
    path: '', 
    component: TipoInfraestruturaComponent,
    children: [
      {
        path: 'lista',
        component: ListTipoInfraestruturasComponent,
        resolve: {
          list: TipoEmpreendimentosResolver 
        },
        children: [
          {
            path: ':id',
            component: DetailsTipoInfraestruturaComponent,
            resolve:{
              product: TipoInfraestruturaResolver
            }
          }
        ]
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoInfraestruturasRoutingModule { }
