import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { LogsService } from '../logs.service';
import 'moment/locale/pt-br';
moment.locale('pt-br');

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent {

  activities$: Observable<any[]>;

  /**
   * Constructor
   */
  constructor(public _activityService: LogsService)
  {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      // Get the activities
      this.activities$ = this._activityService.getLogs();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Returns whether the given dates are different days
   *
   * @param current
   * @param compare
   */
  isSameDay(current: string, compare: string): boolean
  {
      return moment(current, moment.ISO_8601).isSame(moment(compare, moment.ISO_8601), 'day');
  }

  /**
   * Get the relative format of the given date
   *
   * @param date
   */
  getRelativeFormat(date: string): string
  {
      const today = moment().startOf('day');
      const yesterday = moment().subtract(1, 'day').startOf('day');

      // Is today?
      if ( moment(date, moment.ISO_8601).isSame(today, 'day') )
      {
          return 'Hoje';
      }

      // Is yesterday?
      if ( moment(date, moment.ISO_8601).isSame(yesterday, 'day') )
      {
          return 'Ontem';
      }

      return moment(date, moment.ISO_8601).fromNow();
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }
}
