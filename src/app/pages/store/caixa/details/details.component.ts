import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { Caixa } from 'app/models/caixa';
import { CaixaComponent } from '../caixa.component';
import { Venda } from 'app/models/vendas';
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { StoreService } from '../../store.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Usuario } from 'app/models/usuario';
_moment.locale('pt-br');

export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'contacts-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class CaixaDetailsComponent implements OnInit, OnDestroy {

    editMode: boolean = false;
    tagsEditMode: boolean = false;
    title: string;
    caixa: Caixa;
    fechar = false;
    caixaDay: Caixa;
    caixaForm: FormGroup;
    caixas: Caixa[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _caixaComponent: CaixaComponent,
        private _route: ActivatedRoute,
        public _snackBar: MatSnackBar,
        public _dialog: DialogMessage,
        private _router: Router,
        private _storeService: StoreService,
        private _formBuilder: FormBuilder) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        if (this._route.snapshot.paramMap.get('id') === 'add') {
            this.editMode = true;
            this._caixaComponent.matDrawer.open();
            this.title = 'Abrir Caixa';
            this.createCaixa();
            this.caixaForm.get('user').setValue(JSON.parse(localStorage.getItem('user')));
        }
        if (this._route.snapshot.paramMap.get('id') === 'close') {
            this.editMode = true;
            this._caixaComponent.matDrawer.open();
            this.title = 'Fechar Caixa';
            this.fechar = true;
            this.defineFechamento();

        }
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
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._caixaComponent.matDrawer.close();
    }

    createCaixa() {

        // Create the caixa form
        this.caixaForm = this._formBuilder.group({
            user: new FormControl(''),
            orders: new FormControl(Array<Venda>()),
            valorAbertura: new FormControl('', Validators.required),
            valorFechamento: new FormControl({ value: '', disabled: true }),
            criadoEm: new FormControl({ value: _moment().format('L'), disabled: true }),
            fechadoEm: new FormControl({ value: '', disabled: true }),
            status: new FormControl(true)
        });
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    get caixaControlsForm(): { [key: string]: AbstractControl } {
        return this.caixaForm.controls;
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }


    defineFechamento() {
        const user = JSON.parse(localStorage.getItem('user'));
        const date = _moment().format('L');
        this.createCaixa();
        this._storeService.getCaixaToday(user?._id, date).subscribe((caixa) => {
            this.caixaDay = caixa;
            const totalVenda = this.getTotal(caixa.orders);

            this.caixaForm.get('valorAbertura').setValue(this.caixaDay.valorAbertura);
            this.caixaForm.get('valorFechamento').setValue(totalVenda);
        });

        this.caixaForm.controls['valorAbertura'].disable();
        this.caixaForm.controls['valorFechamento'].enable();
        this.caixaForm.get('fechadoEm').setValue(_moment().format('L'));
        this.caixaForm.get('user').setValue(JSON.parse(localStorage.getItem('user')));
    }

    getTotal(vendas) {
        return vendas.reduce((acc, venda) => acc + venda?.total, 0);
    }

    cancelCreate(): Promise<MatDrawerToggleResult> {
        // Go back to the list
        return this._caixaComponent.matDrawer.close();
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

    fecharCaixaDia() {
        if (this.caixaForm.valid) {
            const caixa = new Caixa(this.caixaForm.value);
            const user = new Usuario(this.caixaForm.get('user').value);
            const caixaID = localStorage.getItem('caixaId');
            caixa.criadoEm = this.caixaForm.get('criadoEm').value;
            caixa.fechadoEm = this.caixaForm.get('fechadoEm').value;
            caixa.status = false;
            caixa._id = caixaID;
           
            this.closeDrawer().then(() => true);
            this._storeService
                .closeCaixaDay(caixa)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    () => {
                        this.toggleEditMode(false);
                        this.closeDrawer().then(() => true);
                        this._router.navigate(['./inicio']);
                        this._snackBar.open('Caixa Fechado com Sucesso!', 'Fechar', {
                            duration: 3000
                        });
                        this.caixaForm.reset();
                    });
        }
    }


    saveCaixa() {
        if (this.caixaForm.valid) {
            const caixa = new Caixa(this.caixaForm.value);
            const user = new Usuario(this.caixaForm.get('user').value);
            caixa.criadoEm = this.caixaForm.get('criadoEm').value;
            delete caixa._id;
            caixa.user = user._id;
            this.closeDrawer().then(() => true);
            this._storeService
                .addCaixaDay(caixa)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    () => {
                        this.toggleEditMode(false);
                        this.closeDrawer().then(() => true);
                        this._router.navigate(['./inicio']);
                        this._snackBar.open('Caixa Aberto com Sucesso!', 'Fechar', {
                            duration: 3000
                        });
                        this.caixaForm.reset();
                    });
        }
    }
}
