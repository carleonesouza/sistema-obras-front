import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogAssociateComponent } from 'app/shared/dialog-association/dialog-associate.component';
import { Observable, Subject } from 'rxjs';
import { takeUntil, switchMap, take  } from 'rxjs/operators';
import { EmpreendimentosService } from '../empreendimentos.service';


@Component({
  selector: 'app-list-empreendimento',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  empreendimentos: any[];
  empreendimentos$: Observable<any[]>;
  empreendimentoCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    private _empreendimentoService: EmpreendimentosService
  ) {

    this.empreendimentos$ = this._empreendimentoService.empreendimentos$;
    this._empreendimentoService.getAllEmpreendimentos()
    .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.empreendimentos = result.data;
        this.empreendimentoCount = result?.meta?.to;
        this.pageSize = result?.meta?.per_page;
        this.totalElements = 100;
      });

  }

  ngOnInit() { }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    //this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onPageChange(event): void {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;

    this._empreendimentoService.getAllEmpreendimentos(endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result) {
          this.empreendimentos = result.data;
          this.empreendimentoCount = result?.meta?.to;
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

  associaItem(event){
    this.openDialog(event);
  }

  //Associar Produto a Contrato
  openDialog(event): void {
    if(this.empreendimentos && event){
      const dialogRef = this.dialog.open(DialogAssociateComponent, {
        width: '550px',
        data: this.empreendimentos,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if(result != null || result !== undefined){
          const association = {
            cliente: result,
            keycloakId: event?.id
          };
        }
      });
    }

  }

  syncListas(event){
      console.log(event);
  }

  searchItem(event) {
    const searchTerm = event.target.value;

    if (searchTerm) {
        this.empreendimentos$.pipe(
            take(1),
            takeUntil(this._unsubscribeAll),
            switchMap(() => this._empreendimentoService.searchEmpreendimentoByObra(searchTerm))
        ).subscribe(
            (result) => {
              this.empreendimentoCount = result?.meta?.to;
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
