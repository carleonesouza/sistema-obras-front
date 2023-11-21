import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpreendimentosComponent } from './empreendimentos.component';
import { ListComponent } from './list/list.component';
import { EmpreendimentoResolver, EmpreendimentosResolver } from './empreendimentos.resolver';
import { DetailsComponent } from './details/details.component';
import { ObraAereaComponent } from './obra-aerea/obra-aerea.component';


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
      },{
        path: 'obras',
        component: ObraAereaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpreendimentosRoutingModule { }
