
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IniciativasRoutingModule } from './iniciativas-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { IniciativasService } from './iniciativas.service';


import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { HandleError } from 'app/utils/handleErrors';
import { IniciativasResolver, IniciativaResolver } from './iniciativas.resolver';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';



@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    IniciativasRoutingModule,
    SharedModule,
    MaterialAppModule,
    CurrencyMaskModule
  ],
  providers:[
    IniciativasService,
    HandleError,
    IniciativasResolver,
    IniciativaResolver,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ]
})
export class IniciativasModule { }
