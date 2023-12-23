import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogComponent } from './log/log.component';
import { LogsRoutingModule } from './logs.routing';
import { HandleError } from 'app/utils/handleErrors';
import { LogsService } from './logs.service';
import { MaterialAppModule } from 'material-app.module';
import { SharedModule } from 'app/shared/shared.module';



@NgModule({
  declarations: [
    LogComponent
  ],
  imports: [
    CommonModule,
    LogsRoutingModule,
    MaterialAppModule,
    SharedModule
  ],
  providers:[
    HandleError,
    LogsService
  ]
})
export class LogsModule { }
