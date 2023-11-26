import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpreendimentosComponent } from './empreendimentos.component';
import { ListComponent } from './list/list.component';
import { EmpreendimentoResolver, EmpreendimentosResolver } from './empreendimentos.resolver';
import { DetailsComponent } from './details/details.component';
import { ObraAereaComponent } from './obra-aerea/obra-aerea.component';
import { TipoInfraestruturaComponent } from './tipo-infraestrutura/tipo-infraestrutura.component';
import { IntervencoesComponent } from './intervencoes/intervencoes.component';
import { SituacaoComponent } from './situacao/situacao.component';


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
      {
        path: 'obras',
        component: ObraAereaComponent
      },
      {
        path: 'tipo-infraestrutura',
        component: TipoInfraestruturaComponent
      },
      {
        path: 'intervencao',
        component: IntervencoesComponent
      },
      {
        path: 'situacao',
        component: SituacaoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpreendimentosRoutingModule { }
