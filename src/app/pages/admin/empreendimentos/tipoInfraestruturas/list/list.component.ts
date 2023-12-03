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
    this.infras$
    .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.infras = result;
        this.infraCount = result.length;
        this.pageSize = result.length;
        this.totalElements = result.length;
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

    this._tipoInfraService.getAllInfras(event?.pageIndex + 1, endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result) {
          this.infras = result;
          this.infraCount = result.length;
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

  associaItem(event){
    this.openDialog(event);
  }

  //Associar Produto a Contrato
  openDialog(event): void {
    if(this.infras && event){
      const dialogRef = this.dialog.open(DialogAssociateComponent, {
        width: '550px',
        data: this.infras,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if(result != null || result !== undefined){
          const association = {
            cliente: result,
            keycloakId: event?.id
          };

          //this._accountService.associateUserCustomer(association);

          console.log(association);
        }
      });
    }

  }

  syncListas(event){
      console.log(event);
  }

  searchItem(event) {
    if (event.target.value !== '' && event.target.valeu !== null && event.target.value !== undefined) {
      this.infras$.pipe(
        take(1),
        takeUntil(this._unsubscribeAll),
        switchMap(() =>
          this._tipoInfraService.searchTipoObraByDescription(event.target.value)
        )
      ).subscribe();
    }
  }
}
