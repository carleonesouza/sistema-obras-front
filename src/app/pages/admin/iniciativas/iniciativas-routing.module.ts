import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IniciativasComponent } from './iniciativas.component';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { IniciativasResolver, IniciativaResolver } from './iniciativas.resolver';

const routes: Routes = [{
  path: '',
  component: IniciativasComponent,
  children: [
    {
      path: 'lista',
      component: ListComponent,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      resolve: {IniciativasResolver},
      children: [
        {
          path: ':id',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          resolve: {IniciativaResolver},
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
export class IniciativasRoutingModule { }
