import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Categoria } from 'app/models/categoria';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy{
  @Input() caterogyForm: FormGroup;
  editMode: boolean = false;
  title: string;
  creating: boolean = false;
  loading: boolean = false;
  categoria$: Observable<any>;
  category: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _activateRoute: ActivatedRoute,
    private _categoryService: CategoriesService,
    private _router: Router,
    public dialog: MatDialog) {}

  ngOnInit(): void {
     // Open the drawer
     this._listItemComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._activateRoute.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Nova Categoria';
      this.createCategoryForm();
    }

    if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.categoria$ = this._categoryService.category$;

      this.categoria$
        .subscribe((category) => {

          // Open the drawer in case it is closed
          this._listItemComponent.matDrawer.open();
          this.createCategoryForm();
          this.caterogyForm.reset();
          this.category = category;
          // Get the Lista
          if (this.category) {
            this.loading = false;
            this.caterogyForm.patchValue(this.category);
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

  createCategoryForm(){
    this.caterogyForm = this._formBuilder.group({
      name: new FormControl(''),
      description: new FormControl(''),
      status: new FormControl(true)
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get categoryControls() {
    return this.caterogyForm.controls;
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
      this.title = 'Editar Categoria';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/admin/categorias/list']);
    }
    this.editMode = false;
  }

  updateItem() {
    if (this.caterogyForm.valid) {
      console.log(this.caterogyForm.value);
    }
  }

  onSubmit(){
    if(this.caterogyForm.valid){
      const product = new Categoria(this.caterogyForm.value);
      delete product._id;
      this.closeDrawer().then(() => true);
      this._categoryService
        .addCategory(product)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {
            this.toggleEditMode(false);
            this.closeDrawer().then(() => true);
            this._router.navigate(['/admin/categorias/lista']);
            this._snackBar.open('Categoria Salva com Sucesso','Fechar', {
              duration: 3000
            });
            this.caterogyForm.reset();
          });
    }
  }
}
