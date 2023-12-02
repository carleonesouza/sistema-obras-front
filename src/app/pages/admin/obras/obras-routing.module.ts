import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObraComponent } from './obra.component';
import { ListObrasComponent } from './list/list.component';
import { ObraResolver, ObrasResolver } from './obra.resolver';
import { ObraDetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: '',
    component: ObraComponent,
    children:[
      {
        path:'lista',
        component: ListObrasComponent,
        resolve:{
          obras: ObrasResolver
        }
      },
      {
        path:'lista/:id',
        component: ObraDetailsComponent,
        resolve: { obra: ObraResolver }
      },
      {
        path:'lista/add',
        component: ObraDetailsComponent,
      }         
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObrasRoutingModule { }
