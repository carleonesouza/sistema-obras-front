import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, switchMap, take, takeUntil } from 'rxjs';
import { IntervencoesService } from '../intervencoes.service';
import { DialogAssociateComponent } from 'app/shared/dialog-association/dialog-associate.component';

@Component({
  selector: 'app-intervencao-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListIntevercoesComponent implements OnInit, OnDestroy {

  intervencoes: any[];
  intervencoes$: Observable<any[]>;
  intervencoesCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    private _intervencaoService: IntervencoesService
  ) { }

  ngOnInit() {
  
    this.intervencoes$ = this._intervencaoService.intervencoes$;
    this.intervencoes$
    .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result:any) => {
        this.intervencoes = result;
        this.intervencoesCount = result.length;
        this.intervencoesCount = result?.meta?.to;
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

    this._intervencaoService.getIntervencoes(endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result) {
          this.intervencoes = result.data;
          this.intervencoesCount = result?.meta?.to;
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
    if(this.intervencoes && event){
      const dialogRef = this.dialog.open(DialogAssociateComponent, {
        width: '550px',
        data: this.intervencoes,
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
        this.intervencoes$.pipe(
            take(1),
            takeUntil(this._unsubscribeAll),
            switchMap(() => this._intervencaoService.searchItemByDescription(searchTerm))
        ).subscribe(
            (result) => {
              this.intervencoesCount = result?.meta?.to;
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
