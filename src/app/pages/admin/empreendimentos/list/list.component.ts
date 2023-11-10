import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogAssociateComponent } from 'app/shared/dialog-association/dialog-associate.component';
import { Observable, Subject } from 'rxjs';
import { takeUntil, switchMap, take  } from 'rxjs/operators';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit, OnDestroy {


  products: any[];
  products$: Observable<any[]>;
  productsCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    private _productsService: ProductsService
  ) {

    this.products$ = this._productsService.products$;
    this.products$
    .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.products = result;
        this.productsCount = result.length;
        this.pageSize = result.length;
        this.totalElements = result.length;
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

    this._productsService.getAllProducts(event?.pageIndex + 1, endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result) {
          this.products = result;
          this.productsCount = result.length;
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
    if(this.products && event){
      const dialogRef = this.dialog.open(DialogAssociateComponent, {
        width: '550px',
        data: this.products,
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
      this.products$.pipe(
        take(1),
        takeUntil(this._unsubscribeAll),
        switchMap(() =>
          this._productsService.searchProductByContract(event.target.value)
        )
      ).subscribe();
    }
  }
}
