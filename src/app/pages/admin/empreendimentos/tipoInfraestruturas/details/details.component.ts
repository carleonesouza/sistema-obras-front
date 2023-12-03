import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, pipe, takeUntil } from 'rxjs';
import { TipoInfraestrutura } from 'app/models/tipoInfra';
import { Setor } from 'app/models/setor';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogMessage } from 'app/utils/dialog-message ';
import { TipoInfraestruturaService } from '../tipo-infraestrutura.service';
import { SetorsService } from 'app/pages/admin/setors/setors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { MatDrawerToggleResult } from '@angular/material/sidenav';

@Component({
  selector: 'app-details-tipo-infraestrutura',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsTipoInfraestruturaComponent implements OnInit {

  @Input() tipoInfra: FormGroup;
  editMode: boolean = false;
  infra: any;
  infras$: Observable<any>;
  saving: boolean;
  creating: boolean = false;
  loading: boolean = false;
  isLoading: boolean = false;
  title: string;
  setores$: Observable<any>;
  setores: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _listItemsComponent: ListItemsComponent,
    private _tipoInfraService: TipoInfraestruturaService,
    public _snackBar: MatSnackBar,
    private _setoresService: SetorsService,
    private _route: ActivatedRoute,
    public _dialog: DialogMessage,
    private _router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    // Open the drawer



    this.setores$ = this._setoresService.getSetores();
    this.setores$.subscribe((result) => {
      this.setores = result.data;
    })


    // Open the drawer
    this._listItemsComponent.matDrawer.open();
    this._changeDetectorRef.markForCheck();

    if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Tipo de Infraestrutura';

      this.creating = true;
      this.createInfraForm();

    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.infras$ = this._tipoInfraService.tipoInfra$;


      this._tipoInfraService.tipoInfra$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((infra: any) => {

          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createInfraForm();
          this.tipoInfra.reset();

          // Get the Lista
          this.infra = infra;

          if (this.infra) {

            this.tipoInfra.patchValue(this.infra);
            this.tipoInfra.patchValue({
              setor: this.infra.setor.setor,
            });
            this.loading = false;
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    ///this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createInfraForm() {
    this.tipoInfra = this._formBuilder.group({
      id: new FormControl(''),
      descricao: new FormControl('', Validators.required),
      setor: new FormControl('', Validators.required),
      status: new FormControl()
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get tipoInfraControls() {
    return this.tipoInfra.controls;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  itemDisplayFn(item: Setor) {
    return item ? item.descricao : '';
  }

  itemDisplayFnStatus(item: any) {
    return item ? item.descricao : '';
  }

  /**
    * Close the drawer
    */
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._listItemsComponent.matDrawer.close();
  }

  cancelEdit() {
    if (this.creating) {

      this._router.navigate(['/admin/empreendimentos/tipo-infraestrutura/lista']);
    }
    this.editMode = false;
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
      this.title = 'Editar Tipo de Infraestrutura';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  // async desativaItem(event) {
  //   const ativaDesativa = parseInt(this.iniciativa.status) === 1 ? 'Inativar' : 'Ativar';
  //   const dialogRef = this._dialog.showDialog(`${ativaDesativa} Produto`, `Certeza que deseja ${ativaDesativa} Produto?`,
  //     this.iniciativa, true);

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {

  //       const iniciativa = new Iniciativa();
  //       const user = new User(JSON.parse(localStorage.getItem('user')));
  //       iniciativa.usuario_que_alterou = user.id;
  //       iniciativa.id = result?.item.id;
  //       iniciativa.status = parseInt(result?.item?.status) === 1 ? 0 : 1;

  //       this._iniciativasService.deactivateActiveItem(iniciativa)
  //         .subscribe(
  //           () => {
  //             this._router.navigate(['/admin/iniciativas/lista/']);
  //             this.closeDrawer();
  //             this._dialog.showMessageResponse('Atualizado com Sucesso!', 'OK');
  //           }
  //         );
  //     }
  //   });
  // }

  // deleteItem(){
  //   if (this.iniciativaForm.valid) {
  //     const iniciativa = new Iniciativa(this.iniciativaForm.value);  

  //     if (iniciativa) {
  //       this._iniciativasService
  //         .deleteIniciativa(iniciativa)
  //         .pipe(takeUntil(this._unsubscribeAll))
  //         .subscribe(
  //           () => {
  //             this.toggleEditMode(false);
  //             this.closeDrawer().then(() => true);
  //             this._router.navigate(['/admin/iniciativas/lista']);
  //             this._snackBar.open('Iniciativa Removido com Sucesso', 'Fechar', {
  //               duration: 3000
  //             });
  //             this.iniciativaForm.reset();
  //           },
  //         );
  //     }
  //   }
  // }

  // updateItem() {
  //   if (this.iniciativaForm.valid) {
  //     const iniciativa = new Iniciativa(this.iniciativaForm.value);
  //     const user = new User(JSON.parse(localStorage.getItem('user')));
  //     const setor = new Setor(this.iniciativaForm.get('setor').value);
  //     const status = new Status(this.iniciativaForm.get('status').value)
  //     iniciativa.usuario_que_alterou = user.id;
  //     iniciativa.setor = setor.id;
  //     iniciativa.status = status.id;

  //     delete iniciativa.usuario;

  //     if (iniciativa) {
  //       this._iniciativasService
  //         .editIniciativa(iniciativa)
  //         .pipe(takeUntil(this._unsubscribeAll))
  //         .subscribe(
  //           () => {
  //             this.toggleEditMode(false);
  //             this.closeDrawer().then(() => true);
  //             this._router.navigate(['/admin/iniciativas/lista']);
  //             this._snackBar.open('Iniciativa Atualizado com Sucesso', 'Fechar', {
  //               duration: 3000
  //             });
  //             this.iniciativaForm.reset();
  //           },
  //         );
  //     }
  //   }
  // }

  onSubmit() {
    if (this.tipoInfra.valid) {
      const tipoInfra = new TipoInfraestrutura(this.tipoInfra.value);
      const setor = new Setor(this.tipoInfra.get('setor').value)
      tipoInfra.setor = setor.id;

      delete tipoInfra.id;

      this._tipoInfraService
        .addTipoInfraestrutura(tipoInfra)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {
            this._router.navigate(['/admin/empreendimentos/tipo-infraestrutura/lista']);
            this._snackBar.open('Tipo Infraestrutura Salva com Sucesso', 'Fechar', {
              duration: 3000
            });
            this.tipoInfra.reset();
          });
    }
  }
}

