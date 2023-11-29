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
import { ListObrasComponent } from './obra-aerea/list/list.component';
import { ObraDetailsComponent } from './obra-aerea/details/details.component';
import { ObraResolver } from './obra.resolver';


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
        path:'todas-obras',
        component: ListObrasComponent,
      },
      {
        path:'todas-obras/:id',
        component: ObraDetailsComponent,
        resolve: { obra: ObraResolver }
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
