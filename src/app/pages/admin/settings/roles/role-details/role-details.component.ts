import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RolesService } from '../roles.service';
import { Perfil } from 'app/models/perfil';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit, OnDestroy {

  @Input() perfilForm: FormGroup;
  @Input() checked: boolean;
  editMode: boolean = false;
  saving: boolean = false;
  title: string;
  perfil: any;
  isActive: boolean;
  creating: boolean = false;
  loading: boolean = false;
  perfil$: Observable<any>;
  perfis$: Observable<any>;
  perfis: any[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _listItemsComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _rolesService: RolesService,
    public _dialog: DialogMessage,
    private _dialogMessage: DialogMessage,
    private _route: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,) {  }

  ngOnInit(): void {
    // Open the drawer
    this._listItemsComponent.matDrawer.open();
    this._changeDetectorRef.markForCheck();

    if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Perfil';
      this.createPerfilForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.perfil$ = this._rolesService.role$;

      this.perfil$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((perfil: any) => {
          this.loading = false;
          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createPerfilForm();
          this.perfilForm.reset();

          this.isActive = perfil?.status;
          this.perfil = perfil;

          if (this.perfil) {
            this.perfilForm.patchValue({
              role: this.perfil.role
            });

          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    //this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createPerfilForm() {
    this.perfilForm = this._formBuilder.group({
      role: new FormControl('', Validators.required),
      status: new FormControl(true)
    });
  }


  getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()];
}

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get perfilControls() {
    return this.perfilForm.controls;
  }


  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.recId === c2.recId : c1 === c2;
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
      this.title = 'Editar Perfil';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if (this.creating) {
      this.closeDrawer();
      this._router.navigate(['/admin/configuracoes/perfil/lista']);
    }
    this.editMode = false;
  }


  onSubmit() {
    if (this.perfilForm.valid) {
      this.saving = true;
      const perfil = new Perfil(this.perfilForm.value);

      this._rolesService.addRoles(perfil)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {
            this.saving = false;
            this.toggleEditMode(false);
            this.closeDrawer().then(() => true);
            this._router.navigate(['/admin/configuracoes/perfil/lista']);
            this._dialogMessage.showMessageResponse('Perfil Criado com Sucesso', 200);
            this.perfilForm.reset();
          });
    }
  }
}
