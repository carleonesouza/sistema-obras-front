import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IniciativasService } from '../iniciativas.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Iniciativa } from 'app/models/iniciativa';
import { SetorsService } from '../../setors/setors.service';
import { Setor } from 'app/models/setor';
import { User } from 'app/models/user';
import { DialogMessage } from 'app/utils/dialog-message ';

interface Expectativa {
  value: string;
}


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy{
  @Input() iniciativaForm: FormGroup;
  editMode: boolean = false;
  title: string;
  creating: boolean = false;
  loading: boolean = false;
  isLoading: boolean = false;
  checked: boolean = false;
  iniciativa$: Observable<any>;
  setores$: Observable<any>;
  setores: any;
  iniciativa: any;
  expectativas: Expectativa[] = [
    {value: 'SIM'},
    {value: 'NÃO'},
   
  ];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _activateRoute: ActivatedRoute,
    private _setoresService: SetorsService,
    public _dialog: DialogMessage,
    private _iniciativasService: IniciativasService,
    private _router: Router,
    public dialog: MatDialog) {}

  ngOnInit(): void {
     // Open the drawer
     this._listItemComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._activateRoute.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Nova Iniciativa';
      this.createIniciativaForm();

      this.setores$ = this._setoresService.getSetores();
      this.setores$.subscribe((result) =>{
        this.setores = result.data;
      })
    }

    if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.iniciativa$ = this._iniciativasService.iniciativa$;
      this.setores$ = this._setoresService.getSetores();
      this.setores$.subscribe((result) =>{
        this.setores = result.data;
      })

      this.iniciativa$
        .subscribe((iniciativa) => {

          // Open the drawer in case it is closed
          this._listItemComponent.matDrawer.open();
          this.createIniciativaForm();
          this.iniciativaForm.reset();
          this.iniciativa = iniciativa;    
          // Get the Lista
          if (this.iniciativa) {
            this.loading = false;              
            this.iniciativaForm.patchValue(this.iniciativa);
            this.iniciativaForm.patchValue({
              setor: this.iniciativa.setor.setor,
              status: parseInt(this.iniciativa.status)
            })
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

  createIniciativaForm(){
    this.iniciativaForm = this._formBuilder.group({
      id: new FormControl(''),
      nome: new FormControl('', Validators.required),
      responsavel: new FormControl('', Validators.required),
      ele_principal_afetado: new FormControl('', Validators.required),
      expectativa: new FormControl('', Validators.required),
      instrumento: new FormControl('', Validators.required),
      setor: new FormControl(''),
      usuario: new FormControl(''),
      usuario_alteracao: new FormControl(''),
      status: new FormControl(true)
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get iniciativaControls() {
    return this.iniciativaForm.controls;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1._id === c2._id : c1 === c2;
  }

  itemDisplayFn(item: Setor) {
    return item ? item.descricao : '';
  }


    /**
     * Close the drawer
     */
     async closeDrawer(): Promise<MatDrawerToggleResult> {
      return this._listItemComponent.matDrawer.close();
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
      this.title = 'Editar Iniciativa';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/admin/iniciativas/list']);
    }
    this.editMode = false;
  }


  async desativaItem(event) {
    const ativaDesativa = parseInt(this.iniciativa.status) === 1 ? 'Inativar' : 'Ativar';
    const dialogRef = this._dialog.showDialog(`${ativaDesativa} Produto`, `Certeza que deseja ${ativaDesativa} Produto?`,
      this.iniciativa, true);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        const iniciativa = new Iniciativa();
        const user = new User(JSON.parse(localStorage.getItem('user')));
        iniciativa.usuario_alteracao = user.id;
        iniciativa.id = result?.item.id;
        iniciativa.status = parseInt(result?.item?.status) === 1 ? 0 : 1;
        
        this._iniciativasService.deactivateActiveItem(iniciativa)
          .subscribe(
            () => {
              this._router.navigate(['/admin/iniciativas/lista/']);
              this.closeDrawer();
              this._dialog.showMessageResponse('Atualizado com Sucesso!', 'OK');
            }
          );
      }
    });
  }
  
  deleteItem(){
    if (this.iniciativaForm.valid) {
      const iniciativa = new Iniciativa(this.iniciativaForm.value);  
     
      if (iniciativa) {
        this._iniciativasService
          .deleteIniciativa(iniciativa)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            () => {
              this.toggleEditMode(false);
              this.closeDrawer().then(() => true);
              this._router.navigate(['/admin/iniciativas/lista']);
              this._snackBar.open('Iniciativa Removido com Sucesso', 'Fechar', {
                duration: 3000
              });
              this.iniciativaForm.reset();
            },
          );
      }
    }
  }

  updateItem() {
    if (this.iniciativaForm.valid) {
      const iniciativa = new Iniciativa(this.iniciativaForm.value);
      const user = new User(JSON.parse(localStorage.getItem('user')));
      const setor = new Setor(this.iniciativaForm.get('setor').value);
      iniciativa.usuario_alteracao = user.id;
      iniciativa.setor = setor.id;
      delete iniciativa.usuario;
           
      if (iniciativa) {
        this._iniciativasService
          .editIniciativa(iniciativa)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            () => {
              this.toggleEditMode(false);
              this.closeDrawer().then(() => true);
              this._router.navigate(['/admin/iniciativas/lista']);
              this._snackBar.open('Iniciativa Atualizado com Sucesso', 'Fechar', {
                duration: 3000
              });
              this.iniciativaForm.reset();
            },
          );
      }
    }
  }

  onSubmit(){
    if(this.iniciativaForm.valid){
      const iniciativa = new Iniciativa(this.iniciativaForm.value);
      const user = new User(JSON.parse(localStorage.getItem('user')));
      const setor = new Setor(this.iniciativaForm.get('setor').value)
      iniciativa.setor = setor.id;
      iniciativa.usuario = user.id;
      delete iniciativa.id;
      this.closeDrawer().then(() => true);
      this._iniciativasService
        .addIniciativa(iniciativa)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {
            this.toggleEditMode(false);
            this.closeDrawer().then(() => true);
            this._router.navigate(['/admin/iniciativas/lista']);
            this._snackBar.open('Iniciativa Salva com Sucesso','Fechar', {
              duration: 3000
            });
            this.iniciativaForm.reset();
          });
    }
  }
}
