import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { Endereco } from 'app/models/endereco';
import * as _moment from 'moment';
_moment.locale('pt-br');
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ObraTipoComponent } from '../obra-templates/obra-tipo.component';

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
  setores$: Observable<any[]>;
  empreendimento: Empreendimento;
  saving: boolean;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _listItemsComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    public _tipoObraDialog: MatDialog,
    private _empreendimentoService: EmpreendimentosService,
    private _route: ActivatedRoute,
    public _dialog: DialogMessage,
    private _router: Router) {


  }

  ngOnInit(): void {
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
        .subscribe((empreendimento: Empreendimento) => {

          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createEmpreendimentoForm();
          this.empreendimentoForm.reset();

          // Get the Lista
          this.empreendimento = empreendimento;

          if (this.empreendimento) {
            this.empreendimentoForm.patchValue(this.empreendimento);
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
      respondente: ['', [Validators.required]],
      setor: ['', [Validators.required]],
      obra: this._formBuilder.array([]),
      status:[true]
    });
  }


  initializeObraForm(type: string): FormGroup {
    this.formObra = this._formBuilder.group({
      id: [''],
      empreendimento: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      nomeDaInfraestrutura: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      intervencao: ['', [Validators.required]],
      status: ['', [Validators.required]],
      instrumento: ['', [Validators.required]],
      dataInicio: [{ value: '', disabled: true }, [Validators.required]],
      dataConclusao: [{ value: '', disabled: true }, [Validators.required]],
      documentosAdicionais: [''],
      arquivoGeorreferenciado: [''],
      valorGlobal: ['', [Validators.required]],
      percentualFinanceiroExecutado: ['', [Validators.required]],

    });

    this.formObra.addControl('endereco', this._formBuilder.group({
      logradouro: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required),
      latitude: new FormControl('', Validators.required),
    })
    )

    if (type === 'aereo') {
      this.formObra.addControl('situacaoAeroporto', new FormControl('', Validators.required));
      this.formObra.addControl('codigoIATA', new FormControl('', Validators.required));
      this.formObra.addControl('tipoAviaoRecICAO', new FormControl('', Validators.required));
      this.formObra.addControl('novaExtensao', new FormControl('', Validators.required));
      this.formObra.addControl('novaLargura', new FormControl('', Validators.required));
      this.formObra.addControl('novaAreaCriada', new FormControl('', Validators.required));
    }

    // if (type === 'rodoviaria') {
    //     this.formObra.addControl('rodovia', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('kmInicial', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('kmFinal', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('extensao', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('codigo', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('versao', this._formBuilder.control('', [Validators.required]));
    // }

    // if (type === 'portuaria') {
    //     this.formObra.addControl('tipoEmbarcacao', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('ampliacaoCapacidade', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('tipoProduto', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('novoCalado', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('novaLargura', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('novoComprimento', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('capacidadeDinamica', this._formBuilder.control('', [Validators.required]));
    // }

    // if (type === 'hidroviaria') {
    //     this.formObra.addControl('situacaoHidrovia', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('temEclusa', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('temBarragem', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('tipoEmbarcacao', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('ampliacaoCapacidade', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('profundidadeMinima', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('profundidadeMaxima', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('comboiosCheia', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('comboiosEstiagem', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('novaLargura', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('novoComprimento', this._formBuilder.control('', [Validators.required]));
    // }

    // if (type === 'ferroviaria') {
    //     this.formObra.addControl('kmInicial', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('kmFinal', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('extensao', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('novaBitola', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('novaVelocidade', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('produto', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('capacidadeDinamica', this._formBuilder.control('', [Validators.required]));
    // }

    // if (type === 'duto') {
    //     this.formObra.addControl('tipoDuto', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('funcaoEstrutura', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('materialTransportado', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('nivelDuto', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('codigoOrigem', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('codigoDestino', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('nomeXRL', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('novaExtesao', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('espessura', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('vazaoProjeto', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('vazaoOperacional', this._formBuilder.control('', [Validators.required]));
    //     this.formObra.addControl('novaAreaImpactada', this._formBuilder.control('', [Validators.required]));
    // }


    return this.formObra;
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

  adicionarTipoObra() {
    const dialogRef = this._tipoObraDialog.open(ObraTipoComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != null) {
        this.tipoObraSelecionada = result;
        (this.empreendimentoForm.get('obra') as FormArray).push(this.initializeObraForm(result))
        console.log(this.empreendimentoForm)
      }

    });

  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (this.empreendimentoForm.get('obra')) {
      this.events.push(_moment(event.value).format('L'));
      console.log(this.events);
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.descricao === c2 : c2 === c1.descricao;
  }

  compareSetores(c1: any, c2: any): boolean {
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
