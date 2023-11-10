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
  iniciativa$: Observable<any>;
  iniciativa: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _activateRoute: ActivatedRoute,
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
    }

    if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.iniciativa$ = this._iniciativasService.iniciativas$;

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
      this.title = 'Editar iniciativa';
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

  updateItem() {
    if (this.iniciativaForm.valid) {
      console.log(this.iniciativaForm.value);
    }
  }

  onSubmit(){
    if(this.iniciativaForm.valid){
      const iniciativa = new Iniciativa(this.iniciativaForm.value);
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
