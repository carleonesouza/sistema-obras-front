import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Empreendimento } from 'app/models/empreendimento';
import { EmpreendimentosService } from '../empreendimentos.service';
import { Setor } from 'app/models/setor';
import * as _moment from 'moment';
_moment.locale('pt-br');
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { SetorsService } from '../../setors/setors.service';
import { User } from 'app/models/user';
import { NaturezaEmpreendimento } from 'app/models/naturezaEmpreendimento';

@Component({
  selector: 'app-details-empreendimentos',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  { provide: DateAdapter, useClass: NativeDateAdapter }]
})
export class DetailsComponent implements OnInit, OnDestroy {

  @Input() empreendimentoForm: FormGroup;
  @Input() formObra: FormGroup;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  displayedColumns: string[] = ['position', 'name'];
  editMode: boolean = false;
  title: string;
  user: any;
  creating: boolean = false;
  loading: boolean = false;
  isLoading: boolean = false;
  hide = true;
  events: string[] = [];
  tipoObraSelecionada: string;
  empreendimento$: Observable<any>;
  obras$: Observable<any[]>;
  obrasEmpreendimento: any;
  setores$: Observable<any>;
  setores: any;
  selectedNatureza:any;
  naturezas$: Observable<any>;
  naturezas: any;
  empreendimento: Empreendimento;
  saving: boolean;
  panelOpenState = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _listItemsComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _setoresService: SetorsService,
    public _tipoObraDialog: MatDialog,
    private _empreendimentoService: EmpreendimentosService,
    private _route: ActivatedRoute,
    public _dialog: DialogMessage,
    private _router: Router) {


  }

  ngOnInit(): void {
    
    this.isLoading = true;
    this._setoresService.getSetores().subscribe((result)=>{
      this.setores = result.data;
    });

    this._empreendimentoService.getNaturezaEmpreendimentos()
    .subscribe((nat)=>{
      this.naturezas = nat.data;
      this.isLoading = false;
    })
    // Open the drawer
    this._listItemsComponent.matDrawer.open();
    this._changeDetectorRef.markForCheck();

    if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Empreendimento';

      this.createEmpreendimentoForm();
  
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.empreendimento$ = this._empreendimentoService.empreendimento$;
   
     
      this._empreendimentoService.empreendimento$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((empreendimento: any) => {

          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createEmpreendimentoForm();
          this.empreendimentoForm.reset();

          // Get the Lista
          this.empreendimento = empreendimento.data;

          if (this.empreendimento) {

            this.obrasEmpreendimento = this.empreendimento?.obras;
            this.selectedNatureza = this.empreendimento?.natureza_empreendimento?.natureza_empreendimento
    
            this.empreendimentoForm.patchValue(this.empreendimento);
            this.empreendimentoForm.patchValue({
              setor: this.empreendimento.setor.setor,
              natureza_empreendimento: this.empreendimento?.natureza_empreendimento
            });
            this.loading = false;
          }

          // Toggle the edit mode off
          //this.toggleEditMode(false);

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


  createEmpreendimentoForm() {
    this.empreendimentoForm = this._formBuilder.group({
      id: [''],
      nome: ['', [Validators.required]],
      responsavel: ['', [Validators.required]],
      natureza_empreendimento: ['', [Validators.required]],      
      setor: ['', [Validators.required]],
      obras: this._formBuilder.array([]),
      user: [''],
      status:[true]
    });
  }

  get obras(): FormArray {
    return this.empreendimentoForm.controls['obra'] as FormArray;
  }

  get obrasControls() {
    return (this.empreendimentoForm.get('obra') as FormArray).controls;
  }

  get empreendimentoControlsForm(): { [key: string]: AbstractControl } {
    return this.empreendimentoForm.controls;
  }

  compareSetores(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  itemDisplayFn(item: Setor) {
    return item ? item.descricao : '';
  }

  trackByFn(index: number, item: any): any {
    return item || index;
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
      this.title = 'Editar Empreendimento';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if (this.creating) {
      this.closeDrawer();
      this._router.navigate(['/admin/empreendimentos/lista']);
    }
    this.editMode = false;
  }

  updateEmpreendimento() {

    if (this.empreendimentoForm.valid) {
      this.saving = true;
      const empreendimento = new Empreendimento(this.empreendimentoForm.value);
      const user = new User(JSON.parse(localStorage.getItem('user')));
      const naturezaEmpreendimento = new NaturezaEmpreendimento(this.empreendimentoForm.get('natureza_empreendimento').value)
      empreendimento.natureza_empreendimento = naturezaEmpreendimento?.id;
      empreendimento.usuario_que_alterou = user.id;
      this._empreendimentoService
        .editEmpreendimento(empreendimento)
        .subscribe(() => {
          this._router.navigate(['/admin/empreendimentos/lista/']);
          this.saving = false;
          this.toggleEditMode(false);
          this.closeDrawer().then(() => true);
          this._dialog.showMessageResponse('Atualizado com Sucesso!', 'OK');
        }
        );
    }
  }

  desativaEmpreendimento(event) {
    const ativaDesativa = this.empreendimento.status === true ? 'Inativar' : 'Ativar';
    const dialogRef = this._dialog.showDialog(`${ativaDesativa} Empreendimento`, `Certeza que deseja ${ativaDesativa} Empreendimento?`,
      this.empreendimento, event?.checked);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const empreendimento = new Empreendimento(result?.item);
        empreendimento.status = empreendimento.status === true ? false : true;
        this._empreendimentoService.deactivateActiveItem(empreendimento)
          .subscribe(
            () => {
              this._router.navigate(['/admin/empreendimentos/lista/']);
              this.closeDrawer();
              this._dialog.showMessageResponse('Atualizado com Sucesso!', 'OK');
            }
          );
      }
    });
  }

  onSubmit() {
    if (this.empreendimentoForm.valid) {
      const empreendimento = new Empreendimento(this.empreendimentoForm.value);
      const user = new User(JSON.parse(localStorage.getItem('user')));
      const setor = new Setor(this.empreendimentoForm.get('setor').value)
      const naturezaEmpreendimento = new NaturezaEmpreendimento(this.empreendimentoForm.get('natureza_empreendimento').value)
      empreendimento.natureza_empreendimento = naturezaEmpreendimento?.id;
      empreendimento.user = user?.id;
      empreendimento.setor = setor?.id;      
      delete empreendimento.id;
      this.saving = true;
      this.closeDrawer().then(() => true);
      this._empreendimentoService
        .addEmpreendimento(empreendimento)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {
            this.saving = false;
            this.toggleEditMode(false);
            this.closeDrawer().then(() => true);
            this._router.navigate(['/admin/empreendimentos/lista']);
            this._snackBar.open('Empreendimento Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });
            this.empreendimentoForm.reset();
          });
    }
  }

}