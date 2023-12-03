import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpreendimentosComponent } from './empreendimentos.component';
import { ListComponent } from './list/list.component';
import { EmpreendimentoResolver, EmpreendimentosResolver } from './empreendimentos.resolver';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: '',
    component: EmpreendimentosComponent,
    children: [
      {
        path: 'lista',
        component: ListComponent,
        resolve: {
          list: EmpreendimentosResolver
        },
        children: [
          {
            path: ':id',
            component: DetailsComponent,
            resolve:{
              product: EmpreendimentoResolver
            }
          }
        ]
      },     
    ],
  },
  {
    path: 'tipo-infraestrutura', loadChildren: () => import('app/pages/admin/empreendimentos/tipoInfraestruturas/tipoInfraestruturas.module' ).then(tipo => tipo.TipoInfraestruturasModule),
  },
  {
    path: 'intervencoes', loadChildren: () => import('app/pages/admin/empreendimentos/intervencoes/intervencao.module' ).then(intervencao => intervencao.IntervencaoModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpreendimentosRoutingModule { }
