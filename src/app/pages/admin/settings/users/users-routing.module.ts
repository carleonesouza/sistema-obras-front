import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { UserResolver, UsersResolver } from './users.resolver';

const routes: Routes = [{
  path: '',
  component: UsersComponent,
  children: [
    {
      path: 'lista',
      component: ListComponent,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      resolve: {UsersResolver},
      children: [
        {
          path: ':id',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          resolve: {UserResolver},
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
export class UsersRoutingModule { }
