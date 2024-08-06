import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControllersComponent } from './controllers.component';
import { RouterModule } from '@angular/router';
import { controllersRoutes } from './controllers.routing';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { ControllersService } from './controllers.service';



@NgModule({
  declarations: [
    ControllersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(controllersRoutes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MaterialAppModule,
    MatSidenavModule,
    MatSlideToggleModule,
    FuseAlertModule,
    SharedModule
  ],
  providers:[ControllersService]
})
export class ControllersModule { }
