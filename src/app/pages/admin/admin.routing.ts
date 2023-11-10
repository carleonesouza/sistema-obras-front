import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '', loadChildren: () => import('app/pages/admin/settings/settings.module').then(m => m.SettingsModule),
      },
      // {
      //   path: 'produtos', loadChildren: () => import('app/pages/admin/products/products.module').then(p => p.ProductsModule),
      // },
      {
        path: 'iniciativas', loadChildren: () => import('app/pages/admin/iniciativas/iniciativas.module').then(c => c.IniciativasModule),
      },
      {
        path: 'setores', loadChildren: () => import('app/pages/admin/setors/setors.module').then(s => s.SetorsModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
