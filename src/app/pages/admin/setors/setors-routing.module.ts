import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetorsComponent } from './setors.component';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { SetorResolver, SetorsResolver } from './setors.resolver';

const routes: Routes = [{
  path: '',
  component: SetorsComponent,
  children: [
    {
      path: 'lista',
      resolve: {SetorsResolver},
      component: ListComponent,

      children: [
        {
          path: ':id',
          resolve: {SetorResolver},
          component: DetailsComponent,
        }
      ]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetorsRoutingModule { }
