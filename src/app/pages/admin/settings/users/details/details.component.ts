/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import { Usuario } from 'app/models/usuario';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Perfil } from 'app/models/perfil';
import { RolesService } from '../../roles/roles.service';
import { cpfValida } from 'app/utils/validaCpf';
import { Address } from 'app/models/address';
import { User } from 'app/models/user';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  @Input() userForm: FormGroup;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  displayedColumns: string[] = ['position', 'name'];
  editMode: boolean = false;
  title: string;
  user: User;
  regex = /(?=.*[a-z]).*(?=[0-9]).*(?=[A-Z]).*(?=[!?*])[a-zA-Z0-9!?*#]{8,}/g;
  creating: boolean = false;
  loading: boolean = false;
  hide = true;
  user$: Observable<any>;
  roles$: Observable<any[]>;
  rotas$: Observable<any[]>;
  isLoadingPerfis: boolean = false;
  rotas: any[];
  perfis$: Observable<any>;
  perfis: any;
  saving: boolean;
  useDefault = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _listItemsComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _usersService: UsersService,
    private _route: ActivatedRoute,
    private _perfilService: RolesService,
    private _router: Router,
    public _dialog: DialogMessage,
    public dialog: MatDialog) {
     

  }

  ngOnInit(): void {
    // Open the drawer
    this._listItemsComponent.matDrawer.open();
    this._changeDetectorRef.markForCheck();

    if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Usuário';
      this.perfis$ = this._perfilService.getAllRoles();
      this.perfis$.subscribe((result) =>{
        this.perfis = result.data
      }) 
      this.createUserForm();

    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.user$ = this._usersService.user$;    
      this.perfis$ = this._perfilService.getAllRoles();
      this.perfis$.subscribe((result) =>{
        this.perfis = result.data
      }) 
      
      this._usersService.user$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((user: any) => {

          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createUserForm();
          this.userForm.reset();

          // Get the Lista
          this.user = user;

          if (this.user) {
            this.userForm.patchValue(this.user);
            this.userForm.patchValue({
              tipo_usuario_id: user.tipoUsuario
            })
            
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
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


  createUserForm() {
    this.userForm = this._formBuilder.group({
      id: new FormControl(''),
      nome: new FormControl('', Validators.required),
      instituicao_setor: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefone: new FormControl(''),
      senha: new FormControl(''),
      senha_confirmation: new FormControl(''),
      tipo_usuario_id: new FormControl('')
    });
  }

  get userControls() {
    return this.userForm.controls;
  }


  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2 : c2 === c1.id;
  }

  get userControlsForm(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  createFormRoles() {
    return new FormGroup({
      role: new FormControl('', Validators.required)
    });
  }

  get enderecosControls() {
    return (this.userForm.get('endereco') as FormGroup).controls;
  }

  itemDisplayFn(item: Perfil) {
    return item ? item.descricao : '';
  }
  /**
   * Close the drawer
   */
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._listItemsComponent.matDrawer.close();
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
      this.title = 'Editar Usuário';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  validateCPF(control: AbstractControl): { [key: string]: any } | null {
    if (control !== null) {
      return cpfValida(control);
    }
  }

  cancelEdit() {
    if (this.creating) {
      this.closeDrawer();
      this._router.navigate(['/admin/conta/lista']);
    }
    this.editMode = false;
  }

  updateUser() {
    if (this.userForm.valid) {
      const user = new User(this.userForm.value);
     this.saving = true;
      const perfil =  new Perfil(this.userForm.get('tipo_usuario_id').value);
      user.tipo_usuario_id = perfil.id;
      
      if(user.senha == null && this.user.senha_confirmation == null){
        delete user.senha
        delete user.senha_confirmation
      }
       
      if (user) {
        this._usersService
          .updateUser(user)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            () => {
              this.saving = false;
              this.toggleEditMode(false);
              this.closeDrawer().then(() => true);
              this._router.navigate(['/admin/conta/lista']);
              this._snackBar.open('Usuário Atualizado com Sucesso', 'Fechar', {
                duration: 3000
              });
              this.userForm.reset();
            },
          );
      }
    }
  }

 
  removerUser(){
    if (this.userForm.valid) {
      const user = new User(this.userForm.value);
      this.saving = true;
      user.status = false;     

      if (user) {
        this._usersService
          .removeUser(user)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            () => {
              this.saving = false;
              this.toggleEditMode(false);
              this.closeDrawer().then(() => true);
              this._router.navigate(['/admin/conta/lista']);
              this._snackBar.open('Usuário Removido com Sucesso', 'Fechar', {
                duration: 3000
              });
              this.userForm.reset();
            },
          );
      }
    }
  }


  onSubmit() {
    if (this.userForm.valid) {
      const user = new User(this.userForm.value);
     this.saving = true;
      const perfil =  new Perfil(this.userForm.get('tipo_usuario_id').value);
      user.tipo_usuario_id = perfil.id;

      if (user) {
        this._usersService
          .addUser(user)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            () => {
              this.saving = false;
              this.toggleEditMode(false);
              this.closeDrawer().then(() => true);
              this._router.navigate(['/admin/conta/lista']);
              this._snackBar.open('Usuário Salvo com Sucesso', 'Fechar', {
                duration: 3000
              });
              this.userForm.reset();
            },
          );
      }
    }
  }
}
