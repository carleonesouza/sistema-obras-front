import { Component, OnDestroy, OnInit } from '@angular/core';
import { SetorsService } from '../setors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  setores: any[];
  setores$: Observable<any[]>;
  setoresCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _setoresService: SetorsService
  ) {  }

  ngOnInit() {

    this.setores$ = this._setoresService.setores$;

    this.setores$
    .pipe(
      takeUntil(this._unsubscribeAll))
    .subscribe((result) => {
      this.setores = result;
      this.setoresCount = result.length;
    });

  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onPageChange(event): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;

    // this._exameService.getListasExames(0, endIndex)
    // .pipe(takeUntil(this._unsubscribeAll))
    // .subscribe((result) =>{
    //   if( result['content']){
    //     this.exames = result['content'];
    //     this.examesCount  = result['size'];
    //     if(endIndex >  result['content'].length){
    //       endIndex =  result['content'].length;
    //     }
    //   }
    // });
  }

  createItem(event) {
    if(event){
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }

}


