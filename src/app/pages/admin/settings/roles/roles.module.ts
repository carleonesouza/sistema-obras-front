import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MaterialAppModule } from 'material-app.module';
import { SharedModule } from 'app/shared/shared.module';
import { RolesRoutingModule } from './roles-routing.module';

import { RolesComponent } from './roles.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RolesService } from './roles.service';
import { RoleIdResolver, RolesResolver } from './roles.resolver';
import { HandleError } from 'app/utils/handleErrors';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';


@NgModule({
  declarations: [
    RolesComponent,
    RoleDetailsComponent,
    ListRolesComponent,
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    MaterialAppModule,
    SharedModule,
    HttpClientModule,
    CurrencyMaskModule
  ],
  providers:[RolesService, RolesResolver, RoleIdResolver, HandleError,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}]
})
export class RolesModule { }
