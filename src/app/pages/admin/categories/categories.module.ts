
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CategoriesService } from './categories.service';


import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { HandleError } from 'app/utils/handleErrors';
import { CategoriesResolver, CategoryResolver } from './categories.resolver';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';



@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    CategoriesRoutingModule,
    SharedModule,
    MaterialAppModule,
    CurrencyMaskModule
  ],
  providers:[
    CategoriesService,
    HandleError,
    CategoriesResolver,
    CategoryResolver,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ]
})
export class CategoriesModule { }
