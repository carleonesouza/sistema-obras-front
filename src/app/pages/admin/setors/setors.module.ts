import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetorsRoutingModule } from './setors-routing.module';
import { DetailsComponent } from './details/details.component';
import { ListComponent } from './list/list.component';
import { SetorsComponent } from './setors.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { IniciativasRoutingModule } from '../iniciativas/iniciativas-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import { HandleError } from 'app/utils/handleErrors';
import { SetorResolver, SetorsResolver } from './setors.resolver';
import { SetorsService } from './setors.service';


@NgModule({
  declarations: [
    SetorsComponent,
    ListComponent,
    DetailsComponent,
  ],
  imports: [
    CommonModule,
    SetorsRoutingModule,
    CommonModule,
    IniciativasRoutingModule,
    SharedModule,
    MaterialAppModule,
    CurrencyMaskModule
  ],
  providers:[
    HandleError,
    SetorsResolver,
    SetorResolver,
    SetorsService,    
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ]
})
export class SetorsModule { }
