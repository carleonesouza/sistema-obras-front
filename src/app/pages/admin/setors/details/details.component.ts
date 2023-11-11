import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SetorsService } from '../setors.service';
import { Setor } from 'app/models/setor';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  @Input() setorsForm: FormGroup;
  @Input() checked: boolean;
  editMode: boolean = false;
  saving: boolean = false;
  title: string;
  setor: any;
  isActive: boolean;
  creating: boolean = false;
  loading: boolean = false;
  setors$: Observable<any>;
  setor$: Observable<any>;
  setores: any[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _listItemsComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _setorsService: SetorsService,
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
      this.title = 'Novo Setor';
      this.createPerfilForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.setor$ = this._setorsService.setor$;

      this.setor$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((setor: any) => {
          this.loading = false;
          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createPerfilForm();
          this.setorsForm.reset();

          this.setor = setor;

          if (this.setor) {
            this.setorsForm.patchValue(this.setor);

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
    this.setorsForm = this._formBuilder.group({
      id: new FormControl(''),
      descricao: new FormControl('', Validators.required),
    });
  }


  getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()];
}

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get setorsControls() {
    return this.setorsForm.controls;
  }


  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
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
      this.title = 'Editar Setor';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  deleteItem(){
    if(this.setor){
      this._setorsService.deleteSetor(this.setor)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        () => {
          this.saving = false;
          this.toggleEditMode(false);
          this.closeDrawer().then(() => true);
          this._router.navigate(['/admin/setores/lista']);
          this._dialogMessage.showMessageResponse('Setor Deletado com Sucesso!', 200);
        });
    }
  }

  updateRole(){
    if (this.setorsForm.valid) {
      this.saving = true;
      const setor = new Setor(this.setorsForm.value);

      this._setorsService.atualizaSetor(setor)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {
            this.saving = false;
            this.toggleEditMode(false);
            this.closeDrawer().then(() => true);
            this._router.navigate(['/admin/setores/lista']);
            this._dialogMessage.showMessageResponse('Setor Atualizado com Sucesso!', 200);
          });
    }
  }

  cancelEdit() {
    if (this.creating) {
      this.closeDrawer();
      this._router.navigate(['/admin/setores/lista']);
    }
    this.editMode = false;
  }


  onSubmit() {
    if (this.setorsForm.valid) {
      this.saving = true;
      const setor = new Setor(this.setorsForm.value);

      this._setorsService.addSetor(setor)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {
            this.saving = false;
            this.toggleEditMode(false);
            this.closeDrawer().then(() => true);
            this._router.navigate(['/admin/setores/lista']);
            this._dialogMessage.showMessageResponse('Setor Criado com Sucesso', 200);
            this.setorsForm.reset();
          });
    }
  }
}
