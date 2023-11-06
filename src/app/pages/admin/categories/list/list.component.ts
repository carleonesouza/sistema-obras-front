import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  categories: any[];
  categories$: Observable<any[]>;
  categoriesCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _categoryService: CategoriesService
  ) {  }

  ngOnInit() {

    this.categories$ = this._categoryService.categories$;

    this.categories$
    .pipe(
      takeUntil(this._unsubscribeAll))
    .subscribe((result) => {
      this.categories = result;
      this.categoriesCount = result.length;
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


