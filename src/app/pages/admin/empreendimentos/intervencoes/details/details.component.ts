import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Setor } from 'app/models/setor';
import { SetorsService } from 'app/pages/admin/setors/setors.service';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IntervencoesService } from '../intervencoes.service';
import { Intervencao } from 'app/models/intervencao';

@Component({
  selector: 'app-intevencao-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsIntervencaoComponent implements OnInit {

  @Input() intervencaoForm: FormGroup;
  editMode: boolean = false;
  saving: boolean;
  creating: boolean = false;
  loading: boolean = false;
  isLoading: boolean = false;
  setores$: Observable<any>;
  setores: any;
  title: string;
  intervencao: any;
  intervencao$: Observable<any>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _listItemsComponent: ListItemsComponent,
    public _snackBar: MatSnackBar,
    private _setoresService: SetorsService,
    private _intervencaoService: IntervencoesService,
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
      this.title = 'Nova Intervenção';

      this.creating = true;
      this.createInterncaoaForm();

    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.intervencao$ = this._intervencaoService.intervencao$;


      this._intervencaoService.intervencao$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((intervencao: any) => {

          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createInterncaoaForm();
          this.intervencaoForm.reset();

          // Get the Lista
          this.intervencao = intervencao;

          if (this.intervencao) {

            this.intervencaoForm.patchValue(this.intervencao);
            this.intervencaoForm.patchValue({
              setor: this.intervencao.setor.setor,
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

  createInterncaoaForm() {
    this.intervencaoForm = this._formBuilder.group({
      id: new FormControl(''),
      descricao: new FormControl('', Validators.required),
      setor: new FormControl('', Validators.required),
      status: new FormControl()
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get intervencaoControls() {
    return this.intervencaoForm.controls;
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

      this._router.navigate(['/admin/empreendimentos/intervencoes/lista']);
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
      this.title = 'Editar Intervenção';
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
    if (this.intervencaoForm.valid) {
      const intervencao = new Intervencao(this.intervencaoForm.value);
      const setor = new Setor(this.intervencaoForm.get('setor').value)
      intervencao.setor = setor.id;


      this._intervencaoService
        .addIntervencao(intervencao)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {
            this.closeDrawer().then(() => true);
            this._router.navigate(['/admin/empreendimentos/intervencoes/lista']);
            this._snackBar.open('Intervenção Salva com Sucesso', 'Fechar', {
              duration: 3000
            });           
            this.intervencaoForm.reset();
          });
    }
  }
}

