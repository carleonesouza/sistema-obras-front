import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Caixa } from 'app/models/caixa';
import { StoreService } from 'app/pages/store/store.service';
import { Observable } from 'rxjs';
import * as _moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { Produto } from 'app/models/produto';
import { Venda } from 'app/models/vendas';
import { Cesta } from 'app/models/cesta';
import { trigger, state, style, transition, animate } from '@angular/animations';

export class NormalizeProduct {
  produto: Produto
  nvenda: number;
  quantity: number = 0;
}


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReportsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<Caixa>;
  @ViewChild(MatTable) tableOrder: MatTable<Venda>;
  @ViewChild(MatTable) tableProduto: MatTable<Produto>;
  dataSource: MatTableDataSource<Caixa>;
  orderDataSource: MatTableDataSource<Venda>;
  cestaDataSource: MatTableDataSource<[Cesta]>;
  displayedColumns: string[] = ['usuario', 'abertura' ,'fechamento', 'data', 'status'];
  ordersColumns: string [] = ['venda','pagamento', 'valor', 'troco','total']
  intenalColumns: string [] = ['produto','vendidos', 'estoque']
  columnsToDisplayWithExpand = [...this.ordersColumns, 'expand'];
  expandedElement: Caixa | null;
 
  caixas: Caixa[] = [];
  data: Caixa;
  loading = true;
  orders: Venda [] = [];
  cesta: Cesta;
  produtos: Produto[] = [];
  normalize: NormalizeProduct[] = [];

  caixa$: Observable<Caixa>;
  caixas$: Observable<Caixa[]>;
  caixaDay$: Observable<Caixa>;

 
  constructor(private _storeService: StoreService) { }
 

  ngOnInit(): void {
    this.loading = true;
   
  }


  ngAfterViewInit(): void {
    this.caixas$ = this._storeService.getCaixas();
    const user = JSON.parse(localStorage.getItem('user'));
    const date = _moment().format('L');
    this.caixaDay$ = this._storeService.getCaixaToday(user?._id, date);

    this.caixaDay$.subscribe((data: Caixa) =>{

      this.caixas.push(data)
      this.orders = data.orders;
    
      this.orders.forEach((order: Venda) =>{
        order.cestas = [];        
        order.produtos.forEach((prd) =>{
        
          const isDuplicate = order.cestas.find((obj) => obj.produto._id === prd._id);
        if (!isDuplicate) {

          this.cesta = new Cesta();
          this.cesta.produto = prd;
          this.cesta.quantity += 1;

          order.cestas.push(this.cesta)
                  
        }else{
          order.cestas.map((cesta) =>{
            if(cesta.produto._id === prd._id){
              cesta.quantity +=1;
            }
         })   
         
        }
         
        })
    
      })

    
    
 

      this.dataSource = new MatTableDataSource<Caixa>([data])
      this.orderDataSource = new MatTableDataSource<Venda>(this.orders)
    
      this.loading = false;
   
    })

   
  }

     /**
      * Track by function for ngFor loops
      *
      * @param index
      * @param item
      */
     trackByFn(index: number, item: any): any {
      return item.id || index;
  }

}
