import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmpreendimentosService } from '../../empreendimentos.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogAssociateComponent } from 'app/shared/dialog-association/dialog-associate.component';
import { Observable, Subject, takeUntil, take, switchMap } from 'rxjs';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListObrasComponent implements OnInit, OnDestroy {

  obras: any[];
  obras$: Observable<any[]>;
  obraCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    private _obraService: EmpreendimentosService
  ) {

   

  }

  ngOnInit() {
    this.obras$ = this._obraService.obras$;
    this._obraService.getObras()
    .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.obras = result.data;
        this.obraCount = result.data.length;
        this.pageSize = result.data.length;
        this.totalElements = result.data.length;
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

    this._obraService.getObras(event?.pageIndex + 1, endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result) {
          this.obras = result;
          this.obraCount = result.length;
          this.obraCount = result.length;
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
    if(this.obras && event){
      const dialogRef = this.dialog.open(DialogAssociateComponent, {
        width: '550px',
        data: this.obras,
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
//     if (event.target.value !== '' && event.target.valeu !== null && event.target.value !== undefined) {
//       this.obras$.pipe(
//         take(1),
//         takeUntil(this._unsubscribeAll),
//         switchMap((e) => {
//  //this._obraService.searchEmpreendimentoByObra(event.target.value)
//         }
        
         
//         )
//       ).subscribe();
//     }
  }
}
