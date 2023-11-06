import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { CategoriesResolver, CategoryResolver } from './categories.resolver';

const routes: Routes = [{
  path: '',
  component: CategoriesComponent,
  children: [
    {
      path: 'lista',
      component: ListComponent,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      resolve: {CategoriesResolver},
      children: [
        {
          path: ':id',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          resolve: {CategoryResolver},
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
export class CategoriesRoutingModule { }
