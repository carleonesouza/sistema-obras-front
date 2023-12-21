import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, switchMap, take, takeUntil } from 'rxjs';
import { TipoInfraestruturaService } from '../tipo-infraestrutura.service';
import { DialogAssociateComponent } from 'app/shared/dialog-association/dialog-associate.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListTipoInfraestruturasComponent implements OnInit, OnDestroy {

  infras: any[];
  infras$: Observable<any[]>;
  infraCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    private _tipoInfraService: TipoInfraestruturaService
  ) { }

  ngOnInit() {

    this.infras$ = this._tipoInfraService.tiposInfras$;
    this._tipoInfraService.getAllInfras()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.infras = result.data;
        this.infraCount = result?.meta?.to;
        this.pageSize = result?.meta?.per_page;
        this.totalElements = 100;
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

    this._tipoInfraService.getAllInfras(endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result) {
          this.infras = result.data;
          this.infraCount = result?.meta?.to;
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

  associaItem(event) {
    this.openDialog(event);
  }

  //Associar Produto a Contrato
  openDialog(event): void {
    if (this.infras && event) {
      const dialogRef = this.dialog.open(DialogAssociateComponent, {
        width: '550px',
        data: this.infras,
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
        this.infras$.pipe(
            take(1),
            takeUntil(this._unsubscribeAll),
            switchMap(() => this._tipoInfraService.searchTipoInfraestrutura(searchTerm))
        ).subscribe(
            (result) => {
              this.infraCount = result?.meta?.to;
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
