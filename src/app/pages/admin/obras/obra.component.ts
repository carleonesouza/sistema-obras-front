import { Component } from '@angular/core';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, DateAdapter, NativeDateAdapter } from '@angular/material/core';
import * as _moment from 'moment';
_moment.locale('en');

@Component({
  selector: 'app-obra-aerea',
  templateUrl: './obra.component.html',
  styleUrls: ['./obra.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  { provide: DateAdapter, useClass: NativeDateAdapter }],
})
export class ObraComponent {

 

  constructor() { }

}


