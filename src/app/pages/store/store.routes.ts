import { Route, RouterModule } from '@angular/router';
import { CaixaComponent } from './caixa/caixa.component';
import { VendasComponent } from './vendas/vendas.component';
import { LayoutComponent } from 'app/layout/layout.component';
import { CaixaDetailsComponent } from './caixa/details/details.component';
import { CanDeactivateCaixaDetails } from './store.guards';
import { NgModule } from '@angular/core';
import { ReportsComponent } from './reports/reports.component';



export const storeRoutes: Route[] = [
    {
        path: 'loja',
        component: LayoutComponent,
        data:{
            layout: 'empty'
        },
        children: [
            {
                path: 'caixa',
                component: CaixaComponent,
                children:[
                    {
                        path: ':id',
                        component: CaixaDetailsComponent,
                        canDeactivate: [CanDeactivateCaixaDetails]
                    }
                ]

            },
            {
                path: 'vendas',
                component: VendasComponent

            },
            {
                path: 'reports',
                component: ReportsComponent
            }

        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(storeRoutes)],
    exports: [RouterModule]
  })
  export class StoreRoutingModule { }
