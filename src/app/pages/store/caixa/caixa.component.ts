import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, Subject, filter, fromEvent, takeUntil } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Caixa } from 'app/models/caixa';
import { StoreService } from '../store.service';
import * as _moment from 'moment';
import { MatSort } from '@angular/material/sort';
import { ApexOptions } from 'ng-apexcharts';

_moment.locale('pt-br');

@Component({
    selector: 'app-caixa',
    templateUrl: './caixa.component.html',
    styleUrls: ['./caixa.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaixaComponent implements OnInit, OnDestroy {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;

    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    recentTransactionsTableColumns: string[] = ['numero', 'data', 'pagamento', 'total', 'status'];

    accountBalanceOptions: ApexOptions;
    caixas$: Observable<Caixa[]>;
    caixaDay$: Observable<Caixa>;
    caixaYesterday$: Observable<Caixa>;
    zeroValor = 0;
    ticketMedio=0;
    fechar= false;
    data=[];
    caixas: Caixa[];
    caixa$: Observable<Caixa>;
    drawerMode: 'side' | 'over';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _storeService: StoreService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {
        this.caixas$ = this._storeService.getCaixas();
        const user = JSON.parse(localStorage.getItem('user'));
        const date = _moment().format('L');
        const yesterday = _moment().subtract(1, 'day').format('L');
        this.caixaDay$ = this._storeService.getCaixaToday(user?._id, date);
        this.caixaYesterday$ = this._storeService.getCaixaYestarday(user?._id, yesterday);
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.caixaDay$.subscribe((data) => {
            if(data.status){
                this.fechar = true;
            }
            this.data = data.orders;

            this.data.map((vendas) =>{
                this.ticketMedio = this.ticketMedio + vendas.total;
            });
            this.recentTransactionsDataSource.data = data.orders;
        });

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected contact when drawer closed
                //this.selectedContact = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                }
                else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                    && (event.key === '/') // '/'
                )
            )
            .subscribe(() => {
                // this.createContact();
            });
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    getTotalCost() {
        return this.data.reduce((acc, venda) => acc + venda?.total, 0);
      }

    fecharCaixaDia(event): void{
        if (event) {
            this._router.navigate(['./close'], { relativeTo: this._activatedRoute });
            this._changeDetectorRef.markForCheck();
        }
    }


    /**
     * Create contact
     */
    createCaixa(event): void {
        if (event) {
            this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
            this._changeDetectorRef.markForCheck();
        }
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
