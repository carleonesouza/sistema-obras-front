import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntervencoesComponent } from './intervencoes.component';
import { ListIntevercoesComponent } from './list/list.component';
import { IntervencaoResolver, IntervencoesResolver } from './intervencao.resolver';
import { DetailsIntervencaoComponent } from './details/details.component';

const routes: Routes = [
  {
    path: '',
    component: IntervencoesComponent,
    children: [
      {
        path: 'lista',
        component: ListIntevercoesComponent,
        resolve: {
          list: IntervencoesResolver 
        },
        children: [
          {
            path: ':id',
            component: DetailsIntervencaoComponent,
            resolve:{
              product: IntervencaoResolver
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
export class IntervencaoRoutingModule { }
