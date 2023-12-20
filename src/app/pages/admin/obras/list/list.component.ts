import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogAssociateComponent } from 'app/shared/dialog-association/dialog-associate.component';
import { Observable, Subject, switchMap, take, takeUntil } from 'rxjs';
import { ObrasService } from '../obras.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListObrasComponent implements OnInit, OnDestroy {

  obras: any[];
  obras$: Observable<any>;
  obraCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    private _obraService: ObrasService
  ) { }

  ngOnInit() {
    this.obras$ = this._obraService.obras$;
    this._obraService.getObras()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.obras = result.data;
        this.obraCount = result?.meta?.to;
        this.pageSize = result?.meta?.per_page;
        this.totalElements = result?.meta?.per_page;
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    //this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onPageChange(event): void {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;

    this._obraService.getObras(endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result) {
          this.obras = result.data;
          this.obraCount = result?.meta?.to;
          this.pageSize = result?.meta?.per_page;
          this.totalElements = result?.meta?.per_page;
          if (endIndex > result.length) {
            endIndex = result.length;
          }
        }
      });
  }

  createItem(event) {
    if (event) {
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }

  associaItem(event) {
    this.openDialog(event);
  }

  //Associar Produto a Contrato
  openDialog(event): void {
    if (this.obras && event) {
      const dialogRef = this.dialog.open(DialogAssociateComponent, {
        width: '550px',
        data: this.obras,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result != null || result !== undefined) {
          const association = {
            cliente: result,
            keycloakId: event?.id
          };
        }
      });
    }
  }

  syncListas(event) {
    console.log(event);
  }

  searchItem(event) {
    const searchTerm = event.target.value;

    if (searchTerm) {
        this.obras$.pipe(
            take(1),
            takeUntil(this._unsubscribeAll),
            switchMap(() => this._obraService.searchObra(searchTerm))
        ).subscribe(
            (result) => {
              this.obraCount = result?.meta?.to;
              this.pageSize = result?.meta?.per_page;
              this.totalElements = result?.meta?.per_page;
            },
            (error) => {
                console.error('Search error:', error);
            }
        );
    }
}

}
