import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RolesComponent } from './roles.component';
import { RoleIdResolver, RolesResolver } from './roles.resolver';

const routes: Routes = [
  {
  path: '',
  component: RolesComponent,
  children: [
    {
      path: 'lista',
      component: ListRolesComponent,
      resolve:{
        task: RolesResolver},
      children: [
        {
          path: ':id',
          component: RoleDetailsComponent,
          resolve:{
            task: RoleIdResolver
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
export class RolesRoutingModule { }
