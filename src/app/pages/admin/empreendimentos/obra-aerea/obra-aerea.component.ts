import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment, * as _moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ObraTipoComponent } from '../obra-templates/obra-tipo.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { EmpreendimentosService } from '../empreendimentos.service';
import { User } from 'app/models/user';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ObraAereo } from 'app/models/obraAereo';
import { IntervencoesService } from '../intervencoes.service';
import { SituacaoService } from '../situacao.service';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { ObraDuto } from 'app/models/obraDuto';
import { ObraHidroviaria } from 'app/models/obraHidroviaria';
import { ObraFerroviaria } from 'app/models/obraFerroviaria';
import { ObraPortuaria } from 'app/models/obraPortuaria';
import { ObraRodoviaria } from 'app/models/obraRodoviaria';
_moment.locale('en');

@Component({
  selector: 'app-obra-aerea',
  templateUrl: './obra-aerea.component.html',
  styleUrls: ['./obra-aerea.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  { provide: DateAdapter, useClass: NativeDateAdapter }],
})
export class ObraAereaComponent implements OnInit {

  @Input() obraForm: FormGroup;
  events: string[] = [];
  tipoObraSelecionada: string = '';
  editMode: boolean = false;
  produtos$: Observable<any>;
  produtos: any;
  obra$: Observable<any>;
  obra: any;
  infras: any;
  estados: any;
  intervecoes: any;
  statues$: Observable<any>;
  statues: any;
  situacoes$: Observable<any>;
  situacoes: any;
  tipoDutos$: Observable<any>;
  tipoDutos: any;
  funcaoEstruturas$: Observable<any>;
  funcaoEstruturas: any;
  nivelDutos$: Observable<any>;
  nivelDutos: any;
  empreendimentos: any;
  saving: boolean;
  creating: boolean = false;
  loading: boolean = false;
  isLoading: boolean = false;
  selectedFile: File | null = null;
  arquivoGeo: File | null = null;
  uploadFiles = new FormData();
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(private _formBuilder: FormBuilder, public _tipoObraDialog: MatDialog, private cd: ChangeDetectorRef,
    private empreendimentoService: EmpreendimentosService,  private _route: ActivatedRoute, public _snackBar: MatSnackBar,
    private intervencaoService: IntervencoesService, private situacaoService: SituacaoService) { }


  ngOnInit(): void {
    this.isLoading = true;

    this.empreendimentoService
      .getAllProdutos()
      .subscribe((prods) => {

        this.produtos = prods.data
      });
    this.empreendimentoService
      .getAllInfras()
      .subscribe((infras) => {

        this.infras = infras.data
      });

    this.empreendimentoService
      .getEstados()
      .subscribe((estados) => {
        this.estados = estados.data;
      })

    this.empreendimentoService
      .getAllEmpreendimentos()
      .subscribe((emprs) => {
        this.empreendimentos = emprs.data;
        this.isLoading = false;
      });

    this.intervencaoService
      .getIntervencoes()
      .subscribe((interv) => {
        this.intervecoes = interv.data;
      })

    this.statues$ = this.empreendimentoService
      .getAllStatues();
    this.statues$.subscribe((res) => {
      this.statues = res.data;
    });

    this.tipoDutos$ = this.empreendimentoService
      .getTipoDutos();
    this.tipoDutos$.subscribe((res) => {
      this.tipoDutos = res.data;
    })

    this.funcaoEstruturas$ = this.empreendimentoService
      .getFuncaoEstruturas();
    this.funcaoEstruturas$.subscribe((res) => {
      this.funcaoEstruturas = res.data;
    })

    this.nivelDutos$ = this.empreendimentoService
      .getNivelDutos();
    this.nivelDutos$.subscribe((res) => {
      this.nivelDutos = res.data;
    })

    this.situacaoService
      .getSitaucoes()
      .subscribe((sit) => {
        this.situacoes = sit.data;
      })

    this.createObaForm();

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.obra$ = this.empreendimentoService.obra$;
   
     
      this.empreendimentoService.obra$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((obra: any) => {

          // Open the drawer in case it is closed
      
          this.createObaForm();
          this.obraForm.reset();

          // Get the Lista
          this.obra = obra;

          if (this.obra) {


            console.log(this.obra)
    
            this.obraForm.patchValue(this.obra);
           
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
      tipo_infraestrutura: [''],
      descricao: ['', [Validators.required]],
      intervencao: [''],
      status: [''],
      instrumento: ['', [Validators.required]],
      dataInicio: [{ value: '', disabled: true }, [Validators.required]],
      dataConclusao: [{ value: '', disabled: true }, [Validators.required]],
      data_base_orcamento: [{ value: '', disabled: true }, [Validators.required]],
      documentosAdicionais: [''],
      situacao: [''],
      arquivoGeorreferenciado: [''],
      produto: [''],
      municipio: new FormControl('', Validators.required),
      uf: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required),
      latitude: new FormControl('', Validators.required),
      valorGlobal: ['', [Validators.required]],
      percentualFinanceiroExecutado: ['', [Validators.required]],
    })
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

  initializeObraForm(type: string) {

    this.obraForm.patchValue({ tipo: type })

    switch (type) {
      case 'aerea':
        this.obraForm.addControl('codigoIATA', new FormControl('', Validators.required));
        this.obraForm.addControl('tipoAviaoRecICAO', new FormControl('', Validators.required));
        this.obraForm.addControl('extensao', new FormControl('', Validators.required));
        this.obraForm.addControl('novaLargura', new FormControl('', Validators.required));
        this.obraForm.addControl('novaAreaCriada', new FormControl('', Validators.required));
        break;

      case 'rodoviaria':
        this.obraForm.addControl('rodovia', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('kmInicial', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('kmFinal', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('extensao', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('codigo', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('versao', this._formBuilder.control('', [Validators.required]));
        break;

      case 'portuaria':
        this.obraForm.addControl('tipoEmbarcacao', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('ampliacaoCapacidade', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('novoCalado', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('novaLargura', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('novoComprimento', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('capacidadeDinamica', this._formBuilder.control('', [Validators.required]));
        break;

      case 'hidroviaria':
        this.obraForm.addControl('situacaoHidrovia', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('temEclusa', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('temBarragem', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('tipoEmbarcacao', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('ampliacaoCapacidade', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('profundidadeMinima', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('profundidadeMaxima', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('comboiosCheia', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('comboiosEstiagem', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('novaLargura', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('novoComprimento', this._formBuilder.control('', [Validators.required]));
        break;

      case 'ferroviaria':
        this.obraForm.addControl('kmInicial', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('kmFinal', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('extensao', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('novaBitola', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('novaVelocidade', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('capacidadeDinamica', this._formBuilder.control('', [Validators.required]));
        break;

      case 'duto':
        this.obraForm.addControl('tipo_duto', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('funcao_estrutura', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('materialTransportado', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('nivel_duto', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('codigoOrigem', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('codigoDestino', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('nomeXRL', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('extensao', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('espessura', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('vazaoProjeto', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('vazaoOperacional', this._formBuilder.control('', [Validators.required]));
        this.obraForm.addControl('novaAreaImpactada', this._formBuilder.control('', [Validators.required]));
        break;

      default:
        // Handle default case if needed
        break;
    }
  }



  get obrasControls(): { [key: string]: AbstractControl } {
    return this.obraForm.controls;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.descricao === c2 : c2 === c1.descricao;
  }
  adicionarTipoObra() {
    const dialogRef = this._tipoObraDialog.open(ObraTipoComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != null) {

        this.initializeObraForm(result);
        this.tipoObraSelecionada = result;

      }

    });
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(_moment(event.value).format('L'));
  }

  cancelEdit() {
    this.obraForm.reset();
    this.editMode = false;
  }


  uploadFilesSelected() {

    if (this.uploadFiles.has('documentosAdicionais') || this.uploadFiles.has('arquivoGeorreferenciado')) {

      this.empreendimentoService
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
      if (this.obraForm.get('tipo').value === 'aerea') {
        const obraAerea = new ObraAereo(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));


        obraAerea.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraAerea.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraAerea.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraAerea.empreendimento = obraAerea.empreendimento?.id;
        obraAerea.tipo_infraestrutura = obraAerea.tipo_infraestrutura?.id;
        obraAerea.produto = obraAerea.produto?.id;
        obraAerea.user = user.id;
        obraAerea.situacao = obraAerea.situacao?.id;
        obraAerea.intervencao = obraAerea.intervencao?.id;
        obraAerea.status = obraAerea.status?.id;
        obraAerea.uf = obraAerea.uf?.id;
        obraAerea.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado').toString();
        obraAerea.documentosAdicionais = this.uploadFiles.get('documentosAdicionais').toString()

        this.empreendimentoService.addObra(obraAerea)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });
          });
      }
      else if (this.obraForm.get('tipo').value === 'duto') {
        const obraDuto = new ObraDuto(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraDuto.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraDuto.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraDuto.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraDuto.empreendimento = obraDuto.empreendimento?.id;
        obraDuto.tipo_infraestrutura = obraDuto.tipo_infraestrutura?.id;
        obraDuto.produto = obraDuto.produto?.id;
        obraDuto.user = user.id;
        obraDuto.situacao = obraDuto.situacao?.id;
        obraDuto.intervencao = obraDuto.intervencao?.id;
        obraDuto.status = obraDuto.status?.id;
        obraDuto.uf = obraDuto.uf?.id;
        obraDuto.tipo_duto = obraDuto.tipo_duto?.id;
        obraDuto.funcao_estrutura = obraDuto.funcao_estrutura?.id;
        obraDuto.nivel_duto = obraDuto.nivel_duto?.id;
        obraDuto.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado').toString();
        obraDuto.documentosAdicionais = this.uploadFiles.get('documentosAdicionais').toString()

        this.empreendimentoService.addObra(obraDuto)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (this.obraForm.get('tipo').value === 'hidroviaria') {
        const obraHidroviaria = new ObraHidroviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraHidroviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraHidroviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraHidroviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraHidroviaria.empreendimento = obraHidroviaria.empreendimento?.id;
        obraHidroviaria.tipo_infraestrutura = obraHidroviaria.tipo_infraestrutura?.id;
        obraHidroviaria.produto = obraHidroviaria.produto?.id;
        obraHidroviaria.user = user.id;
        obraHidroviaria.situacao = obraHidroviaria.situacao?.id;
        obraHidroviaria.intervencao = obraHidroviaria.intervencao?.id;
        obraHidroviaria.status = obraHidroviaria.status?.id;
        obraHidroviaria.uf = obraHidroviaria.uf?.id;
        obraHidroviaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado').toString();
        obraHidroviaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais').toString()

        this.empreendimentoService.addObra(obraHidroviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (this.obraForm.get('tipo').value === 'ferroviaria') {
        const obraFerroviaria = new ObraFerroviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraFerroviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraFerroviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraFerroviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraFerroviaria.empreendimento = obraFerroviaria.empreendimento?.id;
        obraFerroviaria.tipo_infraestrutura = obraFerroviaria.tipo_infraestrutura?.id;
        obraFerroviaria.produto = obraFerroviaria.produto?.id;
        obraFerroviaria.user = user.id;
        obraFerroviaria.situacao = obraFerroviaria.situacao?.id;
        obraFerroviaria.intervencao = obraFerroviaria.intervencao?.id;
        obraFerroviaria.status = obraFerroviaria.status?.id;
        obraFerroviaria.uf = obraFerroviaria.uf?.id;   
        obraFerroviaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado').toString();
        obraFerroviaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais').toString()

        this.empreendimentoService.addObra(obraFerroviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._snackBar.open('Empreendimento Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (this.obraForm.get('tipo').value === 'portuaria') {
        const obraPortuaria = new ObraPortuaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraPortuaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraPortuaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraPortuaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraPortuaria.empreendimento = obraPortuaria.empreendimento?.id;
        obraPortuaria.tipo_infraestrutura = obraPortuaria.tipo_infraestrutura?.id;
        obraPortuaria.produto = obraPortuaria.produto?.id;
        obraPortuaria.user = user.id;
        obraPortuaria.situacao = obraPortuaria.situacao?.id;
        obraPortuaria.intervencao = obraPortuaria.intervencao?.id;
        obraPortuaria.status = obraPortuaria.status?.id;
        obraPortuaria.uf = obraPortuaria.uf?.id;
        obraPortuaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado').toString();
        obraPortuaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais').toString()

        this.empreendimentoService.addObra(obraPortuaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (this.obraForm.get('tipo').value === 'rodoviaria') {
        const obraRodoviaria = new ObraRodoviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraRodoviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraRodoviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraRodoviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraRodoviaria.empreendimento = obraRodoviaria.empreendimento?.id;
        obraRodoviaria.tipo_infraestrutura = obraRodoviaria.tipo_infraestrutura?.id;
        obraRodoviaria.produto = obraRodoviaria.produto?.id;
        obraRodoviaria.user = user.id;
        obraRodoviaria.situacao = obraRodoviaria.situacao?.id;
        obraRodoviaria.intervencao = obraRodoviaria.intervencao?.id;
        obraRodoviaria.status = obraRodoviaria.status?.id;
        obraRodoviaria.uf = obraRodoviaria.uf?.id;
        obraRodoviaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado').toString();
        obraRodoviaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais').toString()

        this.empreendimentoService.addObra(obraRodoviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
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


