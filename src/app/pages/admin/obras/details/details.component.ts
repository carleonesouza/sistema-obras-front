import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import moment, * as _moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ObraAereo } from 'app/models/obraAereo';
import { User } from 'app/models/user';
import { ObraDuto } from 'app/models/obraDuto';
import { ObraHidroviaria } from 'app/models/obraHidroviaria';
import { ObraFerroviaria } from 'app/models/obraFerroviaria';
import { ObraPortuaria } from 'app/models/obraPortuaria';
import { ObraRodoviaria } from 'app/models/obraRodoviaria';
import { Setor } from 'app/models/setor';
import { ObrasService } from '../obras.service';
import { IntervencoesService } from '../../empreendimentos/intervencoes/intervencoes.service';
import { EmpreendimentosService } from '../../empreendimentos/empreendimentos.service';
import { ObraTipoComponent } from '../../empreendimentos/obra-templates/obra-tipo.component';
import { SetorsService } from '../../setors/setors.service';
import { TipoInfraestruturaService } from '../../empreendimentos/tipoInfraestruturas/tipo-infraestrutura.service';
_moment.locale('en');

@Component({
  selector: 'app-obra-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class ObraDetailsComponent implements OnInit {

  @Input() obraForm: FormGroup;
  empreendimento$: Observable<any>;
  obra$: Observable<any>;
  obra: any;
  creating: boolean;
  title: string;
  loading: boolean;
  events: string[] = [];
  tipoObraSelecionada: string = '';
  editMode: boolean = false;
  produtos$: Observable<any>;
  produtos: any;
  infras: any;
  estados: any;
  intervecoes: any;
  statues$: Observable<any>;
  statues: any;
  situacoes$: Observable<any>;
  situacoes: any;
  tipoDutos$: Observable<any>;
  tipoDutos: any;
  setores$: Observable<any>;
  setores: any;
  simnaos$: Observable<any>;
  simnaos: any;
  bitolas$: Observable<any>;
  bitolas: any;
  funcaoEstruturas$: Observable<any>;
  funcaoEstruturas: any;
  nivelDutos$: Observable<any>;
  nivelDutos: any;
  empreendimentos: any;
  saving: boolean;
  selected: any;
  selectedProduto: any;
  selectedStatus: any;
  selectedIntervencao: any;
  selectedSituacao: any;
  selectedTipoInfra: any;
  selectedEstado: any;
  selectedTipoDuto: any;
  selectedSetor: any;
  selectedNivelDuto: any;
  selectedFuncaoEstrutura: any
  isLoading: boolean = false;
  selectedFile: File | null = null;
  arquivoGeo: File | null = null;
  uploadFiles = new FormData();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _route: ActivatedRoute,
    public _dialog: DialogMessage,
    private _obraService: ObrasService,
    private _formBuilder: FormBuilder,
    public _tipoObraDialog: MatDialog,
    private _empreendimentosService: EmpreendimentosService,
    private _setoresService: SetorsService,
    private _router: Router,
    public _snackBar: MatSnackBar,
    private _tipoInfraService: TipoInfraestruturaService,
    private intervencaoService: IntervencoesService,

  ) { }

  ngOnInit(): void {

    this.isLoading = true;

    this._obraService
      .getAllProdutos()
      .subscribe((prods) => {

        this.produtos = prods.data
      });
   

    this._obraService
      .getEstados()
      .subscribe((estados) => {
        this.estados = estados.data;
      })

    this._empreendimentosService
      .getAllEmpreendimentos()
      .subscribe((emprs) => {
        this.empreendimentos = emprs.data;
        this.isLoading = false;
      });

    this.statues$ = this._obraService
      .getAllStatues();
    this.statues$.subscribe((res) => {
      this.statues = res.data;
    });

    this.simnaos$ = this._obraService
    .getSimNaos();
    this.simnaos$.subscribe((res) =>{
      this.simnaos = res.data;
    })

    this.bitolas$ = this._obraService
    .getBitolas();
    this.bitolas$.subscribe((res)=>{
      this.bitolas = res.data;
    })

    this.tipoDutos$ = this._obraService
      .getTipoDutos();
    this.tipoDutos$.subscribe((res) => {
      this.tipoDutos = res.data;
    })

    this.funcaoEstruturas$ = this._obraService
      .getFuncaoEstruturas();
    this.funcaoEstruturas$.subscribe((res) => {
      this.funcaoEstruturas = res.data;
    })

    this.setores$ = this._setoresService
      .getSetores();
    this.setores$.subscribe((res) => {
      this.setores = res.data;
    })

    this.nivelDutos$ = this._obraService
      .getNivelDutos();
    this.nivelDutos$.subscribe((res) => {
      this.nivelDutos = res.data;
    })

    if (this._route.snapshot.url[1].path === 'add') {

      this.creating = true;
      this.title = 'Nova Obra';
      this.createObaForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.creating = false;

      this.obra$ = this._obraService.obra$;

      this.obra$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((obra: any) => {
          // Get the Lista
          this.obra = obra;
          this.createObaForm();
          this.obraForm.reset();

          this.selected = this.obra.empreendimento.empreendimento;
          this.selectedIntervencao = this.obra.intervencao.intervencao;
          this.selectedProduto = this.obra.produto.produto;
          this.selectedStatus = this.obra.status.status;
          this.selectedTipoInfra = this.obra.tipo_infraestrutura.tipo_infraestrutura;
          this.selectedEstado = this.obra.uf.uf;
          this.selectedFuncaoEstrutura = this.obra?.funcao_estrutura?.funcao_estrutura;
          this.selectedTipoDuto = this.obra?.tipo_duto?.tipo_duto;
          this.selectedNivelDuto = this.obra?.nivel_duto?.nivel_duto;
          this.tipoObraSelecionada = this.obra?.tipo;
          //this.selectedSetor = this.obra?.setor

          if (this.obra) {
            this.initializeObraForm(this.obra.tipo)
            this.obraForm.patchValue(this.obra)
            this.obraForm.patchValue({
              empreendimento: this.obra.empreendimento.empreendimento,
              intervencao: this.obra.intervencao.intervencao,
              produto: this.obra.produto.produto,
              status: this.obra.status.status,
              tipo_infraestrutura: this.obra.tipo_infraestrutura.tipo_infraestrutura,
              uf: this.obra.uf.uf,
              funcao_estrutura: this.obra?.funcao_estrutura?.funcao_estrutura,
              tipo_duto: this.obra?.tipo_duto?.tipo_duto,
              nivel_duto: this.obra?.nivel_duto?.nivel_duto,
              documentosAdicionais: '',
              arquivoGeorreferenciado: ''
            })
            this.loading = false;

          }

        });

    }
  }

  createObaForm(): FormGroup {
    return this.obraForm = this._formBuilder.group({
      id: [''],
      empreendimento: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      tipo_infraestrutura: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      intervencao: ['', [Validators.required]],
      status: ['', [Validators.required]],
      instrumento: ['', [Validators.required]],
      dataInicio: [{ value: '', disabled: true }, [Validators.required]],
      dataConclusao: [{ value: '', disabled: true }, [Validators.required]],
      data_base_orcamento: [{ value: '', disabled: true }, [Validators.required]],
      documentosAdicionais: [''],
      responsavel: [''],
      arquivoGeorreferenciado: ['', [Validators.required]],
      produto: [''],
      municipio: [''],
      uf: [''],
      longitude: [''],
      latitude: [''],
      valorGlobal: [''],
      percentualFinanceiroExecutado: [''],
    })
  }

  compareSetores(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  itemDisplayFn(item: any) {
    return item ? item.descricao : '';
  }

  trackByFn(index: number, item: any): any {
    return item || index;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2 : c2 === c1.id;
  }

  docsAdicionais(event: any) {

    if (event.target.files && event.target.files.length) {
      const file: File = event.target.files[0];
      this.selectedFile = event.target.files[0];
      this.uploadFiles.append('documentosAdicionais', this.selectedFile);
    }

  }

  geoDocs(event: any) {
    if (event.target.files && event.target.files.length) {
      const file: File = event.target.files[0];
      this.arquivoGeo = event.target.files[0];
      this.uploadFiles.append('arquivoGeorreferenciado', this.arquivoGeo)
    }
  }

  selectedSetorObra(event) {

    if (event.value?.descricao != undefined && event.value?.descricao != null) {

      this.initializeObraForm(event.value?.descricao);
      this.tipoObraSelecionada = event.value?.descricao;

      this._tipoInfraService
      .getInfrasBySetorId(event.value?.id)
      .subscribe((result)=>{
        this.infras = result.data
      })

      this.intervencaoService
      .getIntervencaoBySetorId(event.value?.id)
      .subscribe((interv) => {
        this.intervecoes = interv.data;
      })
    }
  }

  initializeObraForm(type: string) {

    this.obraForm.patchValue({ tipo: type })

    switch (type) {
      case 'Aeroportuário':
        this.obraForm.addControl('codigoIATA', new FormControl('', Validators.required));
        this.obraForm.addControl('tipoAviaoRecICAO', this._formBuilder.control(''));
        this.obraForm.addControl('extensao', this._formBuilder.control(''));
        this.obraForm.addControl('novaLargura', this._formBuilder.control(''));
        this.obraForm.addControl('novaAreaCriada', this._formBuilder.control(''));
        break;

      case 'Rodoviário':
        this.obraForm.addControl('rodovia', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('kmInicial', this._formBuilder.control(''));
        this.obraForm.addControl('kmFinal', this._formBuilder.control(''));
        this.obraForm.addControl('extensao', this._formBuilder.control(''));
        this.obraForm.addControl('codigo', this._formBuilder.control(''));
        this.obraForm.addControl('versao', this._formBuilder.control(''));
        break;

      case 'Portuário':
        this.obraForm.addControl('tipoEmbarcacao', this._formBuilder.control(''));
        this.obraForm.addControl('ampliacaoCapacidade', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('novoCalado', this._formBuilder.control(''));
        this.obraForm.addControl('novaLargura', this._formBuilder.control(''));
        this.obraForm.addControl('novoComprimento', this._formBuilder.control(''));
        this.obraForm.addControl('capacidadeDinamica', this._formBuilder.control(''));
        break;

      case 'Hidroviário':
        this.obraForm.addControl('situacaoHidrovia', this._formBuilder.control(''));
        this.obraForm.addControl('temEclusa', this._formBuilder.control(''));
        this.obraForm.addControl('temBarragem', this._formBuilder.control(''));
        this.obraForm.addControl('tipoEmbarcacao', this._formBuilder.control(''));
        this.obraForm.addControl('ampliacaoCapacidade', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('profundidadeMinima', this._formBuilder.control(''));
        this.obraForm.addControl('profundidadeMaxima', this._formBuilder.control(''));
        this.obraForm.addControl('comboiosCheia', this._formBuilder.control(''));
        this.obraForm.addControl('comboiosEstiagem', this._formBuilder.control(''));
        this.obraForm.addControl('novaLargura', this._formBuilder.control(''));
        this.obraForm.addControl('novoComprimento', this._formBuilder.control(''));
        break;

      case 'Ferroviário':
        this.obraForm.addControl('kmInicial', this._formBuilder.control(''));
        this.obraForm.addControl('kmFinal', this._formBuilder.control(''));
        this.obraForm.addControl('extensao', this._formBuilder.control(''));
        this.obraForm.addControl('bitola', this._formBuilder.control(''));
        this.obraForm.addControl('novaVelocidade', this._formBuilder.control(''));
        this.obraForm.addControl('capacidadeDinamica', this._formBuilder.control(''));
        break;

      case 'Dutoviário':
        this.obraForm.addControl('tipo_duto', this._formBuilder.control(''));
        this.obraForm.addControl('funcao_estrutura', this._formBuilder.control(''));
        this.obraForm.addControl('materialTransportado', this._formBuilder.control(''));
        this.obraForm.addControl('nivel_duto', this._formBuilder.control(''));
        this.obraForm.addControl('codigoOrigem', this._formBuilder.control(''));
        this.obraForm.addControl('codigoDestino', this._formBuilder.control(''));
        this.obraForm.addControl('nomeXRL', this._formBuilder.control(''));
        this.obraForm.addControl('extensao', this._formBuilder.control(''));
        this.obraForm.addControl('espessura', this._formBuilder.control(''));
        this.obraForm.addControl('vazaoProjeto', this._formBuilder.control(''));
        this.obraForm.addControl('vazaoOperacional', this._formBuilder.control(''));
        this.obraForm.addControl('novaAreaImpactada', this._formBuilder.control(''));
        break;

      default:
        // Handle default case if needed
        break;
    }
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
      this.title = 'Editar Obra';
    }

  }


  get obrasControls(): { [key: string]: AbstractControl } {
    return this.obraForm.controls;
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(_moment(event.value).format('L'));
  }

  cancelEdit() {
    if (this.creating) {

      this.obraForm.reset();
      this.editMode = false;
      this._router.navigate(['/admin/obras/lista']);
    }
   
  }

  updateObra() {

    if (this.obraForm) {
      if (this.obraForm.get('tipo').value === 'Aeroportuário') {
        const obraAerea = new ObraAereo(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraAerea.usuario_que_alterou = user.id;

        obraAerea.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraAerea.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraAerea.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraAerea.empreendimento = obraAerea.empreendimento?.id;
        obraAerea.tipo_infraestrutura = obraAerea.tipo_infraestrutura?.id;
        obraAerea.produto = obraAerea.produto?.id;
        obraAerea.intervencao = obraAerea.intervencao?.id;
        obraAerea.status = obraAerea.status?.id;
        obraAerea.uf = obraAerea.uf?.id;
        obraAerea.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado')?.toString();;
        obraAerea.documentosAdicionais = this.uploadFiles.get('documentosAdicionais')?.toString();;

        this._obraService.editObra(obraAerea)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._router.navigate(['admin/empreendimentos/todas-obras']);
            this._snackBar.open('Obra Atualizada com Sucesso', 'Fechar', {
              duration: 3000
            });
          });
      }
      else if (this.obraForm.get('tipo').value === 'Dutoviário') {
        const obraDuto = new ObraDuto(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraDuto.usuario_que_alterou = user.id;
        obraDuto.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraDuto.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraDuto.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraDuto.empreendimento = obraDuto.empreendimento?.id;
        obraDuto.tipo_infraestrutura = obraDuto.tipo_infraestrutura?.id;
        obraDuto.produto = obraDuto.produto?.id;
        obraDuto.intervencao = obraDuto.intervencao?.id;
        obraDuto.status = obraDuto.status?.id;
        obraDuto.uf = obraDuto.uf?.id;
        obraDuto.tipo_duto = obraDuto.tipo_duto?.id;
        obraDuto.funcao_estrutura = obraDuto.funcao_estrutura?.id;
        obraDuto.nivel_duto = obraDuto.nivel_duto?.id;
        obraDuto.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado')?.toString();;
        obraDuto.documentosAdicionais = this.uploadFiles.get('documentosAdicionais')?.toString();

        this._obraService.editObra(obraDuto)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._router.navigate(['admin/empreendimentos/todas-obras']);
            this._snackBar.open('Obra Atualizada com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (this.obraForm.get('tipo').value === 'Hidroviário') {
        const obraHidroviaria = new ObraHidroviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraHidroviaria.usuario_que_alterou = user.id;
        obraHidroviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraHidroviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraHidroviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraHidroviaria.empreendimento = obraHidroviaria.empreendimento?.id;
        obraHidroviaria.tipo_infraestrutura = obraHidroviaria.tipo_infraestrutura?.id;
        obraHidroviaria.produto = obraHidroviaria.produto?.id;
        obraHidroviaria.intervencao = obraHidroviaria.intervencao?.id;
        obraHidroviaria.status = obraHidroviaria.status?.id;
        obraHidroviaria.uf = obraHidroviaria.uf?.id;
        obraHidroviaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado')?.toString();;
        obraHidroviaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais')?.toString();

        this._obraService.editObra(obraHidroviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._router.navigate(['admin/empreendimentos/todas-obras']);
            this._snackBar.open('Obra Atualizada com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (this.obraForm.get('tipo').value === 'Ferroviário') {
        const obraFerroviaria = new ObraFerroviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraFerroviaria.usuario_que_alterou = user.id;
        obraFerroviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraFerroviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraFerroviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraFerroviaria.empreendimento = obraFerroviaria.empreendimento?.id;
        obraFerroviaria.tipo_infraestrutura = obraFerroviaria.tipo_infraestrutura?.id;
        obraFerroviaria.produto = obraFerroviaria.produto?.id;
        obraFerroviaria.intervencao = obraFerroviaria.intervencao?.id;
        obraFerroviaria.status = obraFerroviaria.status?.id;
        obraFerroviaria.uf = obraFerroviaria.uf?.id;
        obraFerroviaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado')?.toString();;
        obraFerroviaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais')?.toString();

        this._obraService.editObra(obraFerroviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._router.navigate(['admin/empreendimentos/todas-obras']);
            this._snackBar.open('Obra Atualizada com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (this.obraForm.get('tipo').value === 'Portuário') {
        const obraPortuaria = new ObraPortuaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraPortuaria.usuario_que_alterou = user.id;
        obraPortuaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraPortuaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraPortuaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraPortuaria.empreendimento = obraPortuaria.empreendimento?.id;
        obraPortuaria.tipo_infraestrutura = obraPortuaria.tipo_infraestrutura?.id;
        obraPortuaria.produto = obraPortuaria.produto?.id;
        obraPortuaria.intervencao = obraPortuaria.intervencao?.id;
        obraPortuaria.status = obraPortuaria.status?.id;
        obraPortuaria.uf = obraPortuaria.uf?.id;
        obraPortuaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado')?.toString();;
        obraPortuaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais')?.toString();

        this._obraService.editObra(obraPortuaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._router.navigate(['admin/empreendimentos/todas-obras']);
            this._snackBar.open('Obra Atualizada com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (this.obraForm.get('tipo').value === 'Rodoviário') {
        const obraRodoviaria = new ObraRodoviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraRodoviaria.usuario_que_alterou = user.id;
        obraRodoviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraRodoviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraRodoviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraRodoviaria.empreendimento = obraRodoviaria.empreendimento?.id;
        obraRodoviaria.tipo_infraestrutura = obraRodoviaria.tipo_infraestrutura?.id;
        obraRodoviaria.produto = obraRodoviaria.produto?.id;
        obraRodoviaria.intervencao = obraRodoviaria.intervencao?.id;
        obraRodoviaria.status = obraRodoviaria.status?.id;
        obraRodoviaria.uf = obraRodoviaria.uf?.id;
        obraRodoviaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado')?.toString();;
        obraRodoviaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais')?.toString();

        this._obraService.editObra(obraRodoviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._router.navigate(['admin/empreendimentos/todas-obras']);
            this._snackBar.open('Obra Atualizada com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }

      else {
        this._tipoObraDialog.open(ConfirmationDialogComponent, {
          width: 'auto',
          data: {
            title: 'Ocorreu um erro!', message: 'Você deve Escolher o tipo de Obra',
            confirm: false, id: 1, status: 500
          },
        });
      }
    }

  }


  uploadFilesSelected() {

    if (this.uploadFiles.has('documentosAdicionais') || this.uploadFiles.has('arquivoGeorreferenciado')) {

      this._obraService
        .uploadFile(this.uploadFiles)
        .subscribe((e) => {
          this.uploadFiles.set('documentosAdicionais', e.documentosAdicionais)
          this.uploadFiles.set('arquivoGeorreferenciado', e.arquivoGeorreferenciado)
          this._snackBar.open('Arquivos Salvos com Sucesso', 'Fechar', {
            duration: 3000
          });
        })
    }
  }

  onSubmit() {
    if (this.obraForm) {
      if (this.obraForm.get('tipo').value === 'Aeroportuário') {
        const obraAerea = new ObraAereo(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));

        obraAerea.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraAerea.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraAerea.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraAerea.empreendimento = obraAerea.empreendimento?.id;
        obraAerea.tipo_infraestrutura = obraAerea.tipo_infraestrutura?.id;
        obraAerea.produto = obraAerea.produto?.id;
        obraAerea.user = user.id;
        obraAerea.intervencao = obraAerea.intervencao?.id;
        obraAerea.status = obraAerea.status?.id;
        obraAerea.uf = obraAerea.uf?.id;
        obraAerea.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado').toString();
        obraAerea.documentosAdicionais = this.uploadFiles.get('documentosAdicionais').toString()

        this._obraService.addObra(obraAerea)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.obraForm.reset();
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });
          });
      }
      else if (this.obraForm.get('tipo').value === 'Dutoviário') {
        const obraDuto = new ObraDuto(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraDuto.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraDuto.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraDuto.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraDuto.empreendimento = obraDuto.empreendimento?.id;
        obraDuto.tipo_infraestrutura = obraDuto.tipo_infraestrutura?.id;
        obraDuto.produto = obraDuto.produto?.id;
        obraDuto.user = user.id;
        obraDuto.intervencao = obraDuto.intervencao?.id;
        obraDuto.status = obraDuto.status?.id;
        obraDuto.uf = obraDuto.uf?.id;
        obraDuto.tipo_duto = obraDuto.tipo_duto?.id;
        obraDuto.funcao_estrutura = obraDuto.funcao_estrutura?.id;
        obraDuto.nivel_duto = obraDuto.nivel_duto?.id;
        obraDuto.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado').toString();
        obraDuto.documentosAdicionais = this.uploadFiles.get('documentosAdicionais').toString()

        this._obraService.addObra(obraDuto)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.obraForm.reset();
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (this.obraForm.get('tipo').value === 'Hidroviário') {
        const obraHidroviaria = new ObraHidroviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraHidroviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraHidroviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraHidroviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraHidroviaria.empreendimento = obraHidroviaria.empreendimento?.id;
        obraHidroviaria.tipo_infraestrutura = obraHidroviaria.tipo_infraestrutura?.id;
        obraHidroviaria.produto = obraHidroviaria.produto?.id;
        obraHidroviaria.user = user.id;
        obraHidroviaria.intervencao = obraHidroviaria.intervencao?.id;
        obraHidroviaria.status = obraHidroviaria.status?.id;
        obraHidroviaria.uf = obraHidroviaria.uf?.id;
        obraHidroviaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado').toString();
        obraHidroviaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais').toString()

        this._obraService.addObra(obraHidroviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.obraForm.reset();
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (this.obraForm.get('tipo').value === 'Ferroviário') {
        const obraFerroviaria = new ObraFerroviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraFerroviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraFerroviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraFerroviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraFerroviaria.empreendimento = obraFerroviaria.empreendimento?.id;
        obraFerroviaria.tipo_infraestrutura = obraFerroviaria.tipo_infraestrutura?.id;
        obraFerroviaria.produto = obraFerroviaria.produto?.id;
        obraFerroviaria.user = user.id;
        obraFerroviaria.intervencao = obraFerroviaria.intervencao?.id;
        obraFerroviaria.status = obraFerroviaria.status?.id;
        obraFerroviaria.uf = obraFerroviaria.uf?.id;
        obraFerroviaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado').toString();
        obraFerroviaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais').toString()

        this._obraService.addObra(obraFerroviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.obraForm.reset();
            this._snackBar.open('Empreendimento Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (this.obraForm.get('tipo').value === 'Portuário') {
        const obraPortuaria = new ObraPortuaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraPortuaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraPortuaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraPortuaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraPortuaria.empreendimento = obraPortuaria.empreendimento?.id;
        obraPortuaria.tipo_infraestrutura = obraPortuaria.tipo_infraestrutura?.id;
        obraPortuaria.produto = obraPortuaria.produto?.id;
        obraPortuaria.user = user.id;
        obraPortuaria.intervencao = obraPortuaria.intervencao?.id;
        obraPortuaria.status = obraPortuaria.status?.id;
        obraPortuaria.uf = obraPortuaria.uf?.id;
        obraPortuaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado').toString();
        obraPortuaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais').toString()

        this._obraService.addObra(obraPortuaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.obraForm.reset();
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (this.obraForm.get('tipo').value === 'Rodoviário') {
        const obraRodoviaria = new ObraRodoviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraRodoviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraRodoviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraRodoviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraRodoviaria.empreendimento = obraRodoviaria.empreendimento?.id;
        obraRodoviaria.tipo_infraestrutura = obraRodoviaria.tipo_infraestrutura?.id;
        obraRodoviaria.produto = obraRodoviaria.produto?.id;
        obraRodoviaria.user = user.id;
        obraRodoviaria.intervencao = obraRodoviaria.intervencao?.id;
        obraRodoviaria.status = obraRodoviaria.status?.id;
        obraRodoviaria.uf = obraRodoviaria.uf?.id;
        obraRodoviaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado').toString();
        obraRodoviaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais').toString()

        this._obraService.addObra(obraRodoviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.obraForm.reset();
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }

      else {
        this._tipoObraDialog.open(ConfirmationDialogComponent, {
          width: 'auto',
          data: {
            title: 'Ocorreu um erro!', message: 'Você deve Escolher o tipo de Obra',
            confirm: false, id: 1, status: 500
          },
        });
      }
    }
  }

}


