import { Component, OnDestroy, OnInit } from '@angular/core';
import { IniciativasService } from '../iniciativas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  iniciativas: any[];
  iniciativas$: Observable<any[]>;
  iniciativasCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _iniciativasService: IniciativasService
  ) {  }

  ngOnInit() {

    this.iniciativas$ = this._iniciativasService.iniciativas$;

    this.iniciativas$
    .pipe(
      takeUntil(this._unsubscribeAll))
    .subscribe((result) => {
      this.iniciativas = result;
      this.iniciativasCount = result.length;
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


