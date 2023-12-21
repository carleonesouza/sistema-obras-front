import { Component, OnDestroy, OnInit } from '@angular/core';
import { IniciativasService } from '../iniciativas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, switchMap, take, takeUntil } from 'rxjs';

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
  ) { }

  ngOnInit() {

    this.iniciativas$ = this._iniciativasService.iniciativas$;

    this.iniciativas$
      .pipe(
        takeUntil(this._unsubscribeAll))
      .subscribe((result: any) => {
        this.iniciativas = result.data;
        this.iniciativasCount = result.length;
        this.pageSize = result?.meta?.per_page;
        this.totalElements = 100;
      });

  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onPageChange(event): void {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;

    this._iniciativasService.getAllIniciativas(endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result) {
          this.iniciativas = result.data;
          this.iniciativasCount = result?.meta?.to;
          this.pageSize = result?.meta?.per_page;
          this.pageSize = result?.meta?.per_page;
          this.totalElements = 100;
          if (endIndex > result.data.length) {
            endIndex = result.data.length;
          }
        }
      });
  }

  createItem(event) {
    if (event) {
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }

  searchItem(event) {
    const searchTerm = event.target.value;

    if (searchTerm) {
      this.iniciativas$.pipe(
        take(1),
        takeUntil(this._unsubscribeAll),
        switchMap(() => this._iniciativasService.searchIniciativas(searchTerm))
      ).subscribe(
        (result) => {
          this.iniciativasCount = result?.meta?.to;
          this.pageSize = result?.meta?.per_page;
          this.totalElements = 100;
        },
        (error) => {
          console.error('Search error:', error);
        }
      );
    }
  }

}


