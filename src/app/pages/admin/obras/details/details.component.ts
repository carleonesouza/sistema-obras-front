import { ChangeDetectorRef, Component, Input, LOCALE_ID, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject, takeUntil, forkJoin, catchError, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ObraAereo } from 'app/models/obraAereo';
import { User } from 'app/models/user';
import { ObraDuto } from 'app/models/obraDuto';
import { ObraHidroviaria } from 'app/models/obraHidroviaria';
import { ObraFerroviaria } from 'app/models/obraFerroviaria';
import { ObraPortuaria } from 'app/models/obraPortuaria';
import { ObraRodoviaria } from 'app/models/obraRodoviaria';
import { ObrasService } from '../obras.service';
import { IntervencoesService } from '../../empreendimentos/intervencoes/intervencoes.service';
import { EmpreendimentosService } from '../../empreendimentos/empreendimentos.service';
import { SetorsService } from '../../setors/setors.service';
import { TipoInfraestruturaService } from '../../empreendimentos/tipoInfraestruturas/tipo-infraestrutura.service';
import { default as _rollupMoment, Moment } from 'moment';
import * as _moment from 'moment';
import { Bitola } from 'app/models/bitola';
import { HttpEventType } from '@angular/common/http';
const moment = _rollupMoment || _moment;
_moment.locale('en');

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-obra-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ObraDetailsComponent implements OnInit {

  @Input() obraForm: FormGroup;
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
  municpios$: Observable<any>;
  municpios: any;
  infras: any;
  estados: any;
  intervecoes: any;
  statues$: Observable<any>;
  statues: any;
  situacoes$: Observable<any>;
  situacoes: any;
  tipoDutos$: Observable<any>;
  tipoDutos: any;
  tipoInfras$: Observable<any>;
  tipoInfras: any;
  setores$: Observable<any>;
  setores = [];
  simnaos$: Observable<any>;
  simnaos: any;
  bitolas$: Observable<any>;
  bitolas: any;
  funcaoEstruturas$: Observable<any>;
  funcaoEstruturas: any;
  nivelDutos$: Observable<any>;
  nivelDutos: any;
  empreendimentos$: Observable<any>;
  empreendimentos: any;
  saving: boolean;
  isLoading: boolean = false;
  selectedFile: File | null = null;
  arquivoGeo: File | null = null;
  uploadProgress: number = 0;
  tipo: any;
  uploadGeorreferenciado: number = 0;
  uploadFiles = new FormData();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoadingMunicipio: boolean = false;

  constructor(private _route: ActivatedRoute,
    public _dialog: DialogMessage,
    private _obraService: ObrasService,
    private _formBuilder: FormBuilder,
    public _tipoObraDialog: MatDialog,
    private _empreendimentosService: EmpreendimentosService,
    private _setoresService: SetorsService,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    public _snackBar: MatSnackBar,
    private _tipoInfraService: TipoInfraestruturaService,
    private intervencaoService: IntervencoesService,

  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    
    // Combine initial requests into a single forkJoin
    forkJoin({
      produtos: this._obraService.getAllProdutos(),
      estados: this._obraService.getEstados(),
      statues: this._obraService.getAllStatues(),
      simnaos: this._obraService.getSimNaos(),
      setores: this._setoresService.getSetores()
    }).pipe(
      catchError(error => {
        console.error(error);
        return of({ produtos: [], estados: [], statues: [], simnaos: [], setores: [] });
      })
    ).subscribe(({ produtos, estados, statues, simnaos, setores }) => {
      this.produtos = produtos.data || [];
      this.estados = estados.data || [];
      this.statues = statues.data || [];
      this.simnaos = simnaos.data || [];
      this.setores = setores.data || [];   
      // Process route-specific logic
      this.processRouteSpecificData();

      this.isLoading = false;
    });
  }

  private processRouteSpecificData(): void {
    const routePath = this._route.snapshot.url[1]?.path;
    const obraId = this._route.snapshot.paramMap.get('id');

    if (routePath === 'add') {
      this.creating = true;
      this.title = 'Nova Obra';
      this.createObaForm();
    } else if (obraId !== 'add') {
      this.creating = false;

      this._obraService.obra$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((obra: any) => {
          this.obra = obra;
          this.createObaForm();
          this.obraForm.reset();
          this.handleObraData(obra);
        });
    }
  }

  private handleObraData(obra: any): void {
    if (!obra) return;

    this.initializeObraForm(this.obra.tipo)
    this.tipoObraSelecionada = this.obra.tipo;
    this.tipo = this.setores.find((elem) => elem?.descricao === this.obra?.tipo)

    if (this.tipo) {
      this._empreendimentosService.getEmpreendimentosBySetor(this.tipo?.id)
        .subscribe(emprs => {
          this.empreendimentos = emprs.data;

          emprs.data.map((result) => {
            if (result) {
              this.obraForm.patchValue({
                empreendimento: result
              })
            }
          })
        });

      this._tipoInfraService
        .getInfrasBySetorId(this.tipo?.id)
        .subscribe((result) => {
          this.infras = result.data
          result.data.map((infra) => {
            if (infra) {
              this.obraForm.patchValue({
                tipo_infraestrutura: infra
              })
            }
          })
        })

      this.intervencaoService
        .getIntervencaoBySetorId(this.tipo?.id)
        .subscribe((interv) => {
          this.intervecoes = interv.data;
          interv.data.map((intv) => {
            if (intv) {
              this.obraForm.patchValue({
                intervencao: intv
              })
            }
          })
        })
    }

    if (obra?.produtos) {
      // Clear existing form groups in produtosFormArray
      while (this.produtosFormArray.length !== 0) {
        this.produtosFormArray.removeAt(0);
      }
      this.produtos.map((prod) => {

        obra.produtos.forEach((item) => {
          if (prod.id === item.id) {
            // Create a new form group for each item
            const produtoFormGroup = this.createProdutoForms();

            // Patch the form group with values from the item
            produtoFormGroup.patchValue({
              id: item.id,
              descricao: item.descricao
            });

            // Push the form group to the form array
            this.produtosFormArray.push(produtoFormGroup);
          }
        })
      })


      // Patch the form array in the obraForm
      this.obraForm.patchValue({
        produtos: this.produtosFormArray.controls
      });
    }

    if (obra?.municipios) {

      // Clear existing form groups in produtosFormArray
      while (this.municipiosFormArray.length !== 0) {
        this.municipiosFormArray.removeAt(0);
      }
      this.municpios$ = this.obra?.uf?.uf ? this._obraService.getMunicipios(this.obra?.uf?.uf?.sigla) : of([]);

      this.municpios$.subscribe((itens) => {

        const flattenedArray = [].concat(...itens);

        this.municpios = flattenedArray;

        this.municpios.map((munic) => {

          obra.municipios.forEach((item) => {
            if (munic.nome === item.nome) {
              // Create a new form group for each item
              const municipioFormGroup = this.createMunicipioForms();

              // Patch the form group with values from the item
              municipioFormGroup.patchValue({
                id: item.id,
                nome: item.nome,
                uf: item.uf
              });

              // Push the form group to the form array
              this.municipiosFormArray.push(municipioFormGroup);
            }
          })
          this.isLoadingMunicipio = false
        })
      });

      // Patch the form array in the obraForm
      this.obraForm.patchValue({
        municipios: this.municipiosFormArray.controls
      });
    }

    this.obraForm.patchValue(this.obra)

    if (this.tipo?.descricao === 'Hidroviário') {

      this.simnaos.map((item) => {

        if (item.id === parseInt(this.obra?.temBarragem?.temBarragem)) {
          this.obraForm.patchValue({
            temBarragem: item
          })
        }
        if (item.id === parseInt(this.obra?.temEclusa?.temEclusa)) {
          this.obraForm.patchValue({
            temEclusa: item
          })
        }
        if (item.id === parseInt(this.obra?.ampliacaoCapacidade)) {
          this.obraForm.patchValue({
            ampliacaoCapacidade: item
          })
        }
      })

    }

    if (this.tipo?.descricao === 'Portuário') {

      this.simnaos.map((item) => {
        if (item.id === parseInt(this.obra?.ampliacaoCapacidade?.id)) {
          this.obraForm.patchValue({
            ampliacaoCapacidade: item
          })
        }
      })

    }

    if (this.tipo?.descricao === 'Ferroviário') {
      this.bitolas$ = this._obraService.getBitolas();
      this.bitolas$.subscribe((itens) => {
        this.bitolas = itens.data;
        this.bitolas.map((item) => {
          if (item.id === this.obra?.bitola?.bitola?.id) {
            this.obraForm.patchValue({
              bitola: this.obra.bitola.bitola
            })
          }
        })
      })
    }

    if (this.tipo?.descricao === 'Dutoviário') {

      this.tipoDutos$ = this._obraService.getTipoDutos();
      this.tipoDutos$.subscribe((res) => {
        this.tipoDutos = res.data;

        this.tipoDutos.map((item) => {
          if (item.id === this.obra?.tipo_duto?.tipo_duto?.id) {
            this.obraForm.patchValue({
              tipo_duto: this.obra?.tipo_duto?.tipo_duto
            })
          }
        })

      })

      this.funcaoEstruturas$ = this._obraService.getFuncaoEstruturas();
      this.funcaoEstruturas$.subscribe((res) => {
        this.funcaoEstruturas = res.data;

        this.funcaoEstruturas.map((item) => {
          if (item.id === this.obra?.funcao_estrutura?.funcao_estrutura?.id) {
            this.obraForm.patchValue({
              funcao_estrutura: this.obra?.funcao_estrutura?.funcao_estrutura
            })
          }
        })
      })


      this.nivelDutos$ = this._obraService.getNivelDutos();
      this.nivelDutos$.subscribe((res) => {
        this.nivelDutos = res.data;

        this.nivelDutos.map((item) => {
          if (item.id === this.obra?.nivel_duto?.nivel_duto?.id) {
            this.obraForm.patchValue({
              nivel_duto: this.obra?.nivel_duto?.nivel_duto
            })
          }
        })
      })
    }

    if (this.tipo?.descricao === 'Hidroviário') {
      this.situacoes$ = this._obraService
        .getSituacoes();
      this.situacoes$.subscribe((res) => {
        this.situacoes = res.data;

        this.situacoes.map((item) => {
          if (item.id === this.obra?.situacaoHidrovia?.id) {
            this.obraForm.patchValue({
              situacaoHidrovia: item
            })
          }
        })
      })
    }

    this.obraForm.patchValue({
      status: this.obra?.status?.status,
      dataInicio: this.fixDateFormat(this.obra?.dataInicio),
      dataConclusao: this.fixDateFormat(this.obra?.dataConclusao),
      data_base_orcamento: this.fixDateFormat(this.obra?.data_base_orcamento),
      uf: this.obra?.uf?.uf,
      documentosAdicionais: '',
      arquivoGeorreferenciado: ''
    })
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
      instrumento: [''],
      dataInicio: [''],
      dataConclusao: [''],
      data_base_orcamento: [''],
      documentosAdicionais: [''],
      responsavel: ['', [Validators.required]],
      arquivoGeorreferenciado: ['', [Validators.required]],
      produtos: this._formBuilder.array([this.createProdutoForms()]),
      municipios: this._formBuilder.array([this.createMunicipioForms()]),
      uf: [''],
      longitude: [''],
      latitude: [''],
      valorGlobal: [''],
      percentualFinanceiroExecutado: [0],
    })
  }

  compareSetores(c1: any, c2: any): boolean {
    if (c1.descricao === c2) {
      return true;
    } else if (c1.descricao === c2.descricao) {
      return true
    }

  }

  compareEmpreend(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareProdutos(option1: any, option2: any): boolean {
    return option1 && option2 ? option1.descricao === option2 : option1 === option2;
  }

  compareMunicipios(option1: any, option2: any): boolean {
    return option1 && option2 ? option1.nome === option2 : option1 === option2;
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

      if (this.uploadFiles.has('documentosAdicionais')) {
        this._obraService.uploadFile(this.uploadFiles).subscribe(event => {

          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.uploadProgress = 100;
            this.uploadFiles.set('documentosAdicionais', event?.body?.documentosAdicionais)
            this._snackBar.open('Arquivo Salvo com Sucesso', 'Fechar', { duration: 3000 });
          }
        }, error => {
          // Handle error
          this.uploadProgress = 0;
          this._snackBar.open('Erro ao fazer Upload ' + error, 'Fechar', { duration: 3000 });
          console.error('Upload error:', error);
        });
      }
    }

  }

  geoDocs(event: any) {

    if (event.target.files && event.target.files.length) {
      const file: File = event.target.files[0];
      this.arquivoGeo = event.target.files[0];
      this.uploadFiles.append('arquivoGeorreferenciado', this.arquivoGeo)

      if (this.uploadFiles.has('arquivoGeorreferenciado')) {
        this._obraService.uploadFile(this.uploadFiles).subscribe(event => {

          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadGeorreferenciado = Math.round(100 * event.loaded / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.uploadGeorreferenciado = 100;
            this.uploadFiles.set('arquivoGeorreferenciado', event?.body?.arquivoGeorreferenciado)
            this._snackBar.open('Arquivo Salvo com Sucesso', 'Fechar', { duration: 3000 });
          }
        }, error => {
          // Handle error
          this.uploadGeorreferenciado = 0;
          this._snackBar.open('Erro ao fazer Upload ' + error, 'Fechar', { duration: 3000 });
          console.error('Upload error:', error);
        });
      }
    }
  }

  setDataConclusao(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    if (normalizedMonthAndYear) {
      const ctrlValue = this.obraForm.get('dataConclusao').value!;
      this.obraForm.get('dataConclusao').setValue(normalizedMonthAndYear.toDate());
    } else {
      this.obraForm.get('dataConclusao').setValue('');
    }

    datepicker.close();
  }

  setDataInicio(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    if (normalizedMonthAndYear) {
      const ctrlValue = this.obraForm.get('dataInicio').value!;
      this.obraForm.get('dataInicio').setValue(normalizedMonthAndYear.toDate());
    } else {
      this.obraForm.get('dataInicio').setValue('');
    }

    datepicker.close();
  }

  setDataBaseOorcamento(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {

    if (normalizedMonthAndYear) {
      // Only set the date if it's not null or undefined
      const ctrlValue = this.obraForm.get('data_base_orcamento').value;
      this.obraForm.get('data_base_orcamento').setValue(normalizedMonthAndYear.toDate());
    } else {
      // Handle the case where no date is selected - either leave it unchanged or set to null    
      this.obraForm.get('data_base_orcamento').setValue('');
    }
    datepicker.close();
  }

  fixDateFormat(dateString: string): string {

    // Verifica se a string de data está no formato esperado
    if (dateString) {

      if (dateString.length != null) {

        dateString = dateString.replace(/-/g, '');

        // Extrai os componentes da data
        const year = dateString.slice(0, 4);
        const day = dateString.slice(4, 6);
        const month = dateString.slice(6, 8);

        // Formata a data no novo formato
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
      } else {
        // Se a string de data não estiver no formato esperado, retorna a mesma string
        return dateString;
      }
    }

  }

  selectedEstaoObra(event) {
    if (event.value != undefined && event.value != null) {
      this.isLoadingMunicipio = true;
      this.municpios$ = this._obraService
        .getMunicipios(event.value.sigla);
      this.municpios$
        .subscribe((mcps) => {
          const flattenedArray = [].concat(...mcps);
          this.isLoadingMunicipio = false
          this.municpios = flattenedArray;
        })
    }
  }

  selectedSetorObra(event) {

    if (event.value?.descricao != undefined && event.value?.descricao != null) {

      this.initializeObraForm(event.value?.descricao);
      this.tipoObraSelecionada = event.value?.descricao;

      this._empreendimentosService
        .getEmpreendimentosBySetor(event.value?.id)
        .subscribe((emprs) => {
          this.empreendimentos = emprs.data;
        });

      this._tipoInfraService
        .getInfrasBySetorId(event.value?.id)
        .subscribe((result) => {
          this.infras = result.data
        })

      this.intervencaoService
        .getIntervencaoBySetorId(event.value?.id)
        .subscribe((interv) => {
          this.intervecoes = interv.data;
        })

      if (event.value?.descricao === 'Dutoviário') {
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

        this.nivelDutos$ = this._obraService
          .getNivelDutos();
        this.nivelDutos$.subscribe((res) => {
          this.nivelDutos = res.data;
        })
      }

      if (event.value?.descricao === 'Ferroviário') {
        this.bitolas$ = this._obraService
          .getBitolas();
        this.bitolas$.subscribe((res) => {
          this.bitolas = res.data;
        })
      }

      if (event.value?.descricao === 'Hidroviário') {
        this.situacoes$ = this._obraService
          .getSituacoes();
        this.situacoes$.subscribe((res) => {
          this.situacoes = res.data;
        })
      }
    }
  }

  createMunicipioForms() {
    return this._formBuilder.group({
      id: new FormControl(''),
      nome: new FormControl(''),
      uf: new FormControl('')
    });
  }

  createProdutoForms() {
    return this._formBuilder.group({
      id: new FormControl(''),
      descricao: new FormControl('')
    });
  }

  initializeObraForm(type: string) {

    this.obraForm.patchValue({ tipo: type })

    switch (type) {
      case 'Aeroportuário':
        this.obraForm.addControl('codigoIATA', new FormControl(''));
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

  get produtosFormArray(): FormArray {
    return this.obraForm.get('produtos') as FormArray;
  }

  get municipiosFormArray(): FormArray {
    return this.obraForm.get('municipios') as FormArray;
  }

  get obrasControls(): { [key: string]: AbstractControl } {
    return this.obraForm.controls;
  }

  get produtosControls() {
    return (this.obraForm.get('produtos') as FormArray).controls;
  }

  get municipiosControls() {
    return (this.obraForm.get('municipios') as FormArray).controls;
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(_moment(event.value).format('L'));
  }

  addProdutoField(): void {

    //const produtoFormGroup = this._formBuilder.group({ descricao: [''] });
    const control = <FormArray>this.obrasControls['produtos'];
    control.push(this.createProdutoForms())

    //(this.obraForm.get('produtos') as FormArray).push(produtoFormGroup);
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  removeProdutoField(index: number): void {

    // Get form array for address
    const produtoFormArray = this.obraForm.get('produtos') as FormArray;

    const produto = produtoFormArray.at(index);

    if (produto.value?.id) {
      const dialogRef = this._dialog.showDialog('Remover Produto', 'Certeza que deseja Remover Produto?', produto.value, true);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {

          this._obraService.removeProduto(this.obra, {
            id: produto.value?.id
          })
            .subscribe((res) => {
              console.log(res)
              this._snackBar.open('Produto Removido com Sucesso', 'Fechar', {
                duration: 3000
              });
            })

          produtoFormArray.removeAt(index);
        }
      });
    } else {
      // Remove the Endereço field
      produtoFormArray.removeAt(index);
    }

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  addMunicipioField(): void {

    const municipioFormGroup = this._formBuilder.group({ nome: [''], uf: [''], id: [''] });

    (this.obraForm.get('municipios') as FormArray).push(municipioFormGroup);
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  removeMunicipioField(index: number): void {

    // Get form array for address
    const municipioFormArray = this.obraForm.get('municipios') as FormArray;

    const municipio = municipioFormArray.at(index);

    if (municipio.value?.id) {
      const dialogRef = this._dialog.showDialog('Remover Municipio', 'Certeza que deseja Remover Municipio?', municipio.value, true);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {

          this._obraService.removeMunicipio(this.obra, {
            id: municipio.value?.id
          })
            .subscribe((res) => {
              console.log(res)
              this._snackBar.open('Município Removido com Sucesso', 'Fechar', {
                duration: 3000
              });
            })

          municipioFormArray.removeAt(index);
        }
      });
    } else {
      // Remove the Endereço field
      municipioFormArray.removeAt(index);
    }

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if (this.editMode) {
      this.editMode = false;
    }
  }

  clearForm() {
    if (this.creating) {
      this.obraForm.reset();
      this.editMode = false;
      this._router.navigate(['/admin/obras/lista']);
    }
  }

  updateObra() {

    if (this.obraForm.valid) {

      const obraTipo = this.obraForm.get('tipo').value;

      if (obraTipo === 'Aeroportuário') {
        const obraAerea = new ObraAereo(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraAerea.usuario_que_alterou = user.id;
        obraAerea.dataInicio = this.obraForm.get('dataInicio').value ? moment(this.obraForm.get('dataInicio').value).format('L') : null;;
        obraAerea.dataConclusao = this.obraForm.get('dataConclusao').value ? moment(this.obraForm.get('dataConclusao').value).format('L') : null;
        obraAerea.data_base_orcamento = this.obraForm.get('data_base_orcamento').value ? moment(this.obraForm.get('data_base_orcamento').value).format('L') : null;
        obraAerea.empreendimento = obraAerea.empreendimento?.id;
        obraAerea.tipo_infraestrutura = obraAerea.tipo_infraestrutura?.id;
        obraAerea.municipios = this.normalizeMunicipioArray(obraAerea.municipios, obraAerea.uf?.id);
        obraAerea.produtos = this.normalizeProductArray(obraAerea.produtos);
        obraAerea.tipo = obraTipo.descricao;
        obraAerea.intervencao = obraAerea.intervencao?.id;
        obraAerea.status = obraAerea.status?.id;
        obraAerea.uf = obraAerea.uf?.id;
        obraAerea.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado')?.toString();;
        obraAerea.documentosAdicionais = this.uploadFiles.get('documentosAdicionais')?.toString();;

        this._obraService.editObra(obraAerea)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._router.navigate(['admin/obras/lista']);
            this._snackBar.open('Obra Atualizada com Sucesso', 'Fechar', {
              duration: 3000
            });
          });
      }
      else if (obraTipo === 'Dutoviário') {
        const obraDuto = new ObraDuto(this.obraForm.value);
        console.log(obraDuto)
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraDuto.usuario_que_alterou = user.id;
        obraDuto.tipo = obraDuto.tipo?.descricao;
        obraDuto.dataInicio = this.obraForm.get('dataInicio').value ? moment(this.obraForm.get('dataInicio').value).format('L') : null;;
        obraDuto.dataConclusao = this.obraForm.get('dataConclusao').value ? moment(this.obraForm.get('dataConclusao').value).format('L') : null;
        obraDuto.data_base_orcamento = this.obraForm.get('data_base_orcamento').value ? moment(this.obraForm.get('data_base_orcamento').value).format('L') : null;
        obraDuto.empreendimento = obraDuto.empreendimento?.id;
        obraDuto.tipo_infraestrutura = obraDuto.tipo_infraestrutura?.id;
        obraDuto.municipios = this.normalizeMunicipioArray(obraDuto.municipios, obraDuto.uf?.id);
        obraDuto.produtos = this.normalizeProductArray(obraDuto.produtos);
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
            this._router.navigate(['admin/obras/lista']);
            this._snackBar.open('Obra Atualizada com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (obraTipo === 'Hidroviário') {
        const obraHidroviaria = new ObraHidroviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraHidroviaria.usuario_que_alterou = user.id;
        obraHidroviaria.dataInicio = this.obraForm.get('dataInicio').value ? moment(this.obraForm.get('dataInicio').value).format('L') : null;;
        obraHidroviaria.dataConclusao = this.obraForm.get('dataConclusao').value ? moment(this.obraForm.get('dataConclusao').value).format('L') : null;
        obraHidroviaria.data_base_orcamento = this.obraForm.get('data_base_orcamento').value ? moment(this.obraForm.get('data_base_orcamento').value).format('L') : null;
        obraHidroviaria.empreendimento = obraHidroviaria.empreendimento?.id;
        obraHidroviaria.ampliacaoCapacidade = obraHidroviaria.ampliacaoCapacidade.id;
        obraHidroviaria.temEclusa = obraHidroviaria.temEclusa.id;
        obraHidroviaria.situacaoHidrovia = obraHidroviaria.situacaoHidrovia?.id;
        obraHidroviaria.temBarragem = obraHidroviaria.temBarragem.id;
        obraHidroviaria.tipo_infraestrutura = obraHidroviaria.tipo_infraestrutura?.id;
        obraHidroviaria.municipios = this.normalizeMunicipioArray(obraHidroviaria.municipios, obraHidroviaria.uf?.id);
        obraHidroviaria.produtos = this.normalizeProductArray(obraHidroviaria.produtos);
        obraHidroviaria.intervencao = obraHidroviaria.intervencao?.id;
        obraHidroviaria.status = obraHidroviaria.status?.id;
        obraHidroviaria.uf = obraHidroviaria.uf?.id;
        obraHidroviaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado')?.toString();;
        obraHidroviaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais')?.toString();

        this._obraService.editObra(obraHidroviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._router.navigate(['admin/obras/lista']);
            this._snackBar.open('Obra Atualizada com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (obraTipo === 'Ferroviário') {
        const obraFerroviaria = new ObraFerroviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        const bitola = new Bitola(this.obraForm.get('bitola').value)
        obraFerroviaria.usuario_que_alterou = user.id;
        obraFerroviaria.tipo = obraFerroviaria.tipo?.descricao;
        obraFerroviaria.dataInicio = this.obraForm.get('dataInicio').value ? moment(this.obraForm.get('dataInicio').value).format('L') : null;;
        obraFerroviaria.dataConclusao = this.obraForm.get('dataConclusao').value ? moment(this.obraForm.get('dataConclusao').value).format('L') : null;
        obraFerroviaria.data_base_orcamento = this.obraForm.get('data_base_orcamento').value ? moment(this.obraForm.get('data_base_orcamento').value).format('L') : null;
        obraFerroviaria.empreendimento = obraFerroviaria.empreendimento?.id;
        obraFerroviaria.tipo = obraTipo.descricao;
        obraFerroviaria.bitola = bitola.id;
        obraFerroviaria.tipo_infraestrutura = obraFerroviaria.tipo_infraestrutura?.id;
        obraFerroviaria.municipios = this.normalizeMunicipioArray(obraFerroviaria.municipios, obraFerroviaria.uf?.id);
        obraFerroviaria.produtos = this.normalizeProductArray(obraFerroviaria.produtos);
        obraFerroviaria.intervencao = obraFerroviaria.intervencao?.id;
        obraFerroviaria.status = obraFerroviaria.status?.id;
        obraFerroviaria.uf = obraFerroviaria.uf?.id;
        obraFerroviaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado')?.toString();;
        obraFerroviaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais')?.toString();

        this._obraService.editObra(obraFerroviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._router.navigate(['admin/obras/lista']);
            this._snackBar.open('Obra Atualizada com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (obraTipo === 'Portuário') {
        const obraPortuaria = new ObraPortuaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraPortuaria.usuario_que_alterou = user.id;
        obraPortuaria.dataInicio = this.obraForm.get('dataInicio').value ? moment(this.obraForm.get('dataInicio').value).format('L') : null;;
        obraPortuaria.dataConclusao = this.obraForm.get('dataConclusao').value ? moment(this.obraForm.get('dataConclusao').value).format('L') : null;
        obraPortuaria.data_base_orcamento = this.obraForm.get('data_base_orcamento').value ? moment(this.obraForm.get('data_base_orcamento').value).format('L') : null;
        obraPortuaria.empreendimento = obraPortuaria.empreendimento?.id;
        obraPortuaria.tipo = obraTipo.descricao;
        obraPortuaria.tipo_infraestrutura = obraPortuaria.tipo_infraestrutura?.id;
        obraPortuaria.municipios = this.normalizeMunicipioArray(obraPortuaria.municipios, obraPortuaria.uf?.id);
        obraPortuaria.produtos = this.normalizeProductArray(obraPortuaria.produtos);
        obraPortuaria.intervencao = obraPortuaria.intervencao?.id;
        obraPortuaria.status = obraPortuaria.status?.id;
        obraPortuaria.uf = obraPortuaria.uf?.id;
        obraPortuaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado')?.toString();;
        obraPortuaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais')?.toString();

        this._obraService.editObra(obraPortuaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._router.navigate(['admin/obras/lista']);
            this._snackBar.open('Obra Atualizada com Sucesso', 'Fechar', {
              duration: 3000
            });

          });
      }
      else if (obraTipo === 'Rodoviário') {
        const obraRodoviaria = new ObraRodoviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraRodoviaria.usuario_que_alterou = user.id;
        obraRodoviaria.dataInicio = this.obraForm.get('dataInicio').value ? moment(this.obraForm.get('dataInicio').value).format('L') : null;;
        obraRodoviaria.dataConclusao = this.obraForm.get('dataConclusao').value ? moment(this.obraForm.get('dataConclusao').value).format('L') : null;
        obraRodoviaria.data_base_orcamento = this.obraForm.get('data_base_orcamento').value ? moment(this.obraForm.get('data_base_orcamento').value).format('L') : null;
        obraRodoviaria.empreendimento = obraRodoviaria.empreendimento?.id;
        obraRodoviaria.tipo = obraTipo.descricao;
        obraRodoviaria.tipo_infraestrutura = obraRodoviaria.tipo_infraestrutura?.id;
        obraRodoviaria.municipios = this.normalizeMunicipioArray(obraRodoviaria.municipios, obraRodoviaria.uf?.id);
        obraRodoviaria.produtos = this.normalizeProductArray(obraRodoviaria.produtos);
        obraRodoviaria.intervencao = obraRodoviaria.intervencao?.id;
        obraRodoviaria.status = obraRodoviaria.status?.id;
        obraRodoviaria.uf = obraRodoviaria.uf?.id;
        obraRodoviaria.arquivoGeorreferenciado = this.uploadFiles.get('arquivoGeorreferenciado')?.toString();;
        obraRodoviaria.documentosAdicionais = this.uploadFiles.get('documentosAdicionais')?.toString();

        this._obraService.editObra(obraRodoviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._router.navigate(['admin/obras/lista']);
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

  normalizeProductArray(produtoArray: any) {
    if (produtoArray && produtoArray.length > 0) {
      produtoArray = produtoArray.map((item: any) => {
        if (item) {
          item.produto_id = item.descricao && item.descricao.id ? item.descricao.id : item.id;
          delete item.id;
          delete item.descricao;
          return item;
        }
      }).filter((item: any) => item && item.produto_id); // Add this line to filter out items with empty produto_id
      return produtoArray;
    } else {
      return []; // Simplified this line
    }
  }
  
  normalizeMunicipioArray(municipioArray: any, ufID: any) {
    if (municipioArray && municipioArray.length > 0) {
      return municipioArray.map((muni: any) => {
        if (muni && muni.id != null && muni.nome && muni.nome.nome != null) {
          muni.municipio_id = muni.id;
          muni.nome = muni.nome.nome;
          muni.uf = ufID;
          if (muni.municipio_id) {
            delete muni.uf;
          }
          delete muni.id;
          return muni;
        }
      }).filter((muni: any) => muni && muni.municipio_id); // Filter out items without municipio_id
    } else {
      return []; // Return an empty array if input is invalid or empty
    }
  }
  

  uploadFilesSelected() {

    if (this.uploadFiles.has('documentosAdicionais') || this.uploadFiles.has('arquivoGeorreferenciado')) {
      this._obraService.uploadFile(this.uploadFiles).subscribe(event => {
        this.uploadFiles.set('documentosAdicionais', event?.body?.documentosAdicionais)
        this.uploadFiles.set('arquivoGeorreferenciado', event?.body?.arquivoGeorreferenciado)

        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress = 100;
          this._snackBar.open('Arquivos Salvos com Sucesso', 'Fechar', { duration: 3000 });
        }
      }, error => {
        // Handle error
        this.uploadProgress = 0;
        this._snackBar.open('Erro ao fazer Upload ' + error, 'Fechar', { duration: 3000 });
        console.error('Upload error:', error);
      });
    }
  }

  deleteItem() {
    const tipo = this.obraForm.get('tipo').value;

    if (tipo === 'Aeroportuário') {
      const obraAerea = new ObraAereo(this.obraForm.value);

      this._obraService.removeObra(obraAerea)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.saving = false;
          this.toggleEditMode(false);
          this._router.navigate(['/admin/obras/lista']);
          this._snackBar.open('Obra Removida com Sucesso', 'Fechar', {
            duration: 3000
          });
          this.obraForm.reset();
        });
    }
    else if (tipo === 'Dutoviário') {
      const obraDuto = new ObraDuto(this.obraForm.value);

      this._obraService.removeObra(obraDuto)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.saving = false;
          this.toggleEditMode(false);
          this._router.navigate(['/admin/obras/lista']);
          this._snackBar.open('Obra Removida com Sucesso', 'Fechar', {
            duration: 3000
          });
          this.obraForm.reset();
        });
    }
    else if (tipo === 'Hidroviário') {
      const obraHidroviaria = new ObraHidroviaria(this.obraForm.value);

      this._obraService.removeObra(obraHidroviaria)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.saving = false;
          this.toggleEditMode(false);
          this._router.navigate(['/admin/obras/lista']);
          this._snackBar.open('Obra Removida com Sucesso', 'Fechar', {
            duration: 3000
          });
          this.obraForm.reset();
        });
    }
    else if (tipo === 'Ferroviário') {
      const obraFerroviaria = new ObraFerroviaria(this.obraForm.value);

      this._obraService.removeObra(obraFerroviaria)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.saving = false;
          this.toggleEditMode(false);
          this._router.navigate(['/admin/obras/lista']);
          this._snackBar.open('Obra Removida com Sucesso', 'Fechar', {
            duration: 3000
          });
          this.obraForm.reset();
        });
    }
    else if (tipo === 'Portuário') {
      const obraPortuaria = new ObraPortuaria(this.obraForm.value);

      this._obraService.removeObra(obraPortuaria)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.saving = false;
          this.toggleEditMode(false);
          this._router.navigate(['/admin/obras/lista']);
          this._snackBar.open('Obra Removida com Sucesso', 'Fechar', {
            duration: 3000
          });
          this.obraForm.reset();
        });
    }
    else if (tipo === 'Rodoviário') {
      const obraRodoviaria = new ObraRodoviaria(this.obraForm.value);

      this._obraService.removeObra(obraRodoviaria)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.saving = false;
          this.toggleEditMode(false);
          this._router.navigate(['/admin/obras/lista']);
          this._snackBar.open('Obra Removida com Sucesso', 'Fechar', {
            duration: 3000
          });
          this.obraForm.reset();
        });
    }

  }

  onSubmit() {
    if (this.obraForm) {
      if (this.obraForm.get('tipo').value === 'Aeroportuário') {
        const obraAerea = new ObraAereo(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraAerea.dataInicio = this.obraForm.get('dataInicio').value ? moment(this.obraForm.get('dataInicio').value).format('L') : null;
        obraAerea.dataConclusao = this.obraForm.get('dataConclusao').value ? moment(this.obraForm.get('dataConclusao').value).format('L') : null;
        obraAerea.data_base_orcamento = this.obraForm.get('data_base_orcamento').value ? moment(this.obraForm.get('data_base_orcamento').value).format('L') : null;
        obraAerea.empreendimento = obraAerea.empreendimento?.id;
        obraAerea.tipo_infraestrutura = obraAerea.tipo_infraestrutura?.id;
        obraAerea.municipios = this.normalizeMunicipioArray(obraAerea.municipios, obraAerea.uf?.id);
        obraAerea.produtos = this.normalizeProductArray(obraAerea.produtos);
        obraAerea.user = user.id;
        obraAerea.intervencao = obraAerea.intervencao?.id;
        obraAerea.status = obraAerea.status?.id;
        obraAerea.uf = obraAerea.uf?.id;
        obraAerea.arquivoGeorreferenciado = this.uploadFiles?.get('arquivoGeorreferenciado')?.toString();
        obraAerea.documentosAdicionais = this.uploadFiles?.get('documentosAdicionais')?.toString()

        this._obraService.addObra(obraAerea)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.saving = false;
            this.toggleEditMode(false);
            this._router.navigate(['/admin/obras/lista']);
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });
            this.obraForm.reset();
          });
      }
      else if (this.obraForm.get('tipo').value === 'Dutoviário') {
        const obraDuto = new ObraDuto(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraDuto.dataInicio = this.obraForm.get('dataInicio').value ? moment(this.obraForm.get('dataInicio').value).format('L') : null;;
        obraDuto.dataConclusao = this.obraForm.get('dataConclusao').value ? moment(this.obraForm.get('dataConclusao').value).format('L') : null;
        obraDuto.data_base_orcamento = this.obraForm.get('data_base_orcamento').value ? moment(this.obraForm.get('data_base_orcamento').value).format('L') : null;
        obraDuto.empreendimento = obraDuto.empreendimento?.id;
        obraDuto.tipo_infraestrutura = obraDuto.tipo_infraestrutura?.id;
        obraDuto.municipios = this.normalizeMunicipioArray(obraDuto.municipios, obraDuto.uf?.id);
        obraDuto.produtos = this.normalizeProductArray(obraDuto.produtos);
        obraDuto.user = user.id;
        obraDuto.intervencao = obraDuto.intervencao?.id;
        obraDuto.status = obraDuto.status?.id;
        obraDuto.uf = obraDuto.uf?.id;
        obraDuto.tipo_duto = obraDuto.tipo_duto?.id;
        obraDuto.funcao_estrutura = obraDuto.funcao_estrutura?.id;
        obraDuto.nivel_duto = obraDuto.nivel_duto?.id;
        obraDuto.arquivoGeorreferenciado = this.uploadFiles?.get('arquivoGeorreferenciado')?.toString();
        obraDuto.documentosAdicionais = this.uploadFiles?.get('documentosAdicionais')?.toString()

        this._obraService.addObra(obraDuto)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.saving = false;
            this.toggleEditMode(false);
            this._router.navigate(['/admin/obras/lista']);
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });
            this.obraForm.reset();
          });
      }
      else if (this.obraForm.get('tipo').value === 'Hidroviário') {
        const obraHidroviaria = new ObraHidroviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));

        obraHidroviaria.dataInicio = this.obraForm.get('dataInicio').value ? moment(this.obraForm.get('dataInicio').value).format('L') : null;;
        obraHidroviaria.dataConclusao = this.obraForm.get('dataConclusao').value ? moment(this.obraForm.get('dataConclusao').value).format('L') : null;
        obraHidroviaria.data_base_orcamento = this.obraForm.get('data_base_orcamento').value ? moment(this.obraForm.get('data_base_orcamento').value).format('L') : null;
        obraHidroviaria.empreendimento = obraHidroviaria.empreendimento?.id;
        obraHidroviaria.ampliacaoCapacidade = obraHidroviaria.ampliacaoCapacidade.id;
        obraHidroviaria.temEclusa = obraHidroviaria.temEclusa.id;
        obraHidroviaria.situacaoHidrovia = obraHidroviaria.situacaoHidrovia?.id;
        obraHidroviaria.temBarragem = obraHidroviaria.temBarragem.id;
        obraHidroviaria.tipo_infraestrutura = obraHidroviaria.tipo_infraestrutura?.id;
        obraHidroviaria.municipios = this.normalizeMunicipioArray(obraHidroviaria.municipios, obraHidroviaria.uf?.id);
        obraHidroviaria.produtos = this.normalizeProductArray(obraHidroviaria.produtos);
        obraHidroviaria.user = user.id;
        obraHidroviaria.intervencao = obraHidroviaria.intervencao?.id;
        obraHidroviaria.status = obraHidroviaria.status?.id;
        obraHidroviaria.uf = obraHidroviaria.uf?.id;
        obraHidroviaria.arquivoGeorreferenciado = this.uploadFiles?.get('arquivoGeorreferenciado')?.toString();
        obraHidroviaria.documentosAdicionais = this.uploadFiles?.get('documentosAdicionais')?.toString()

        this._obraService.addObra(obraHidroviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.saving = false;
            this.toggleEditMode(false);
            this._router.navigate(['/admin/obras/lista']);
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });
            this.obraForm.reset();
          });
      }
      else if (this.obraForm.get('tipo').value === 'Ferroviário') {
        const obraFerroviaria = new ObraFerroviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        const bitola = new Bitola(this.obraForm.get('bitola').value)
        obraFerroviaria.dataInicio = this.obraForm.get('dataInicio').value ? moment(this.obraForm.get('dataInicio').value).format('L') : null;;
        obraFerroviaria.dataConclusao = this.obraForm.get('dataConclusao').value ? moment(this.obraForm.get('dataConclusao').value).format('L') : null;
        obraFerroviaria.data_base_orcamento = this.obraForm.get('data_base_orcamento').value ? moment(this.obraForm.get('data_base_orcamento').value).format('L') : null;
        obraFerroviaria.empreendimento = obraFerroviaria.empreendimento?.id;
        obraFerroviaria.bitola = bitola.id;
        obraFerroviaria.tipo_infraestrutura = obraFerroviaria.tipo_infraestrutura?.id;
        obraFerroviaria.municipios = this.normalizeMunicipioArray(obraFerroviaria.municipios, obraFerroviaria.uf?.id);
        obraFerroviaria.produtos = this.normalizeProductArray(obraFerroviaria.produtos);
        obraFerroviaria.user = user.id;
        obraFerroviaria.intervencao = obraFerroviaria.intervencao?.id;
        obraFerroviaria.status = obraFerroviaria.status?.id;
        obraFerroviaria.uf = obraFerroviaria.uf?.id;
        obraFerroviaria.arquivoGeorreferenciado = this.uploadFiles?.get('arquivoGeorreferenciado')?.toString();
        obraFerroviaria.documentosAdicionais = this.uploadFiles?.get('documentosAdicionais')?.toString()

        this._obraService.addObra(obraFerroviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.saving = false;
            this.toggleEditMode(false);
            this._router.navigate(['/admin/obras/lista']);
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });
            this.obraForm.reset();
          });
      }
      else if (this.obraForm.get('tipo').value === 'Portuário') {
        const obraPortuaria = new ObraPortuaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraPortuaria.dataInicio = this.obraForm.get('dataInicio').value ? moment(this.obraForm.get('dataInicio').value).format('L') : null;;
        obraPortuaria.dataConclusao = this.obraForm.get('dataConclusao').value ? moment(this.obraForm.get('dataConclusao').value).format('L') : null;
        obraPortuaria.data_base_orcamento = this.obraForm.get('data_base_orcamento').value ? moment(this.obraForm.get('data_base_orcamento').value).format('L') : null;
        obraPortuaria.empreendimento = obraPortuaria.empreendimento?.id;
        obraPortuaria.ampliacaoCapacidade = obraPortuaria.ampliacaoCapacidade.id;
        obraPortuaria.tipo_infraestrutura = obraPortuaria.tipo_infraestrutura?.id;
        obraPortuaria.municipios = this.normalizeMunicipioArray(obraPortuaria.municipios, obraPortuaria.uf?.id);
        obraPortuaria.produtos = this.normalizeProductArray(obraPortuaria.produtos);
        obraPortuaria.user = user.id;
        obraPortuaria.intervencao = obraPortuaria.intervencao?.id;
        obraPortuaria.status = obraPortuaria.status?.id;
        obraPortuaria.uf = obraPortuaria.uf?.id;
        obraPortuaria.arquivoGeorreferenciado = this.uploadFiles?.get('arquivoGeorreferenciado')?.toString();
        obraPortuaria.documentosAdicionais = this.uploadFiles?.get('documentosAdicionais')?.toString()

        this._obraService.addObra(obraPortuaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.saving = false;
            this.toggleEditMode(false);
            this._router.navigate(['/admin/obras/lista']);
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });
            this.obraForm.reset();
          });
      }
      else if (this.obraForm.get('tipo').value === 'Rodoviário') {
        const obraRodoviaria = new ObraRodoviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraRodoviaria.dataInicio = this.obraForm.get('dataInicio').value ? moment(this.obraForm.get('dataInicio').value).format('L') : null;;
        obraRodoviaria.dataConclusao = this.obraForm.get('dataConclusao').value ? moment(this.obraForm.get('dataConclusao').value).format('L') : null;
        obraRodoviaria.data_base_orcamento = this.obraForm.get('data_base_orcamento').value ? moment(this.obraForm.get('data_base_orcamento').value).format('L') : null;
        obraRodoviaria.empreendimento = obraRodoviaria.empreendimento?.id;
        obraRodoviaria.tipo_infraestrutura = obraRodoviaria.tipo_infraestrutura?.id;
        obraRodoviaria.municipios = this.normalizeMunicipioArray(obraRodoviaria.municipios, obraRodoviaria.uf?.id);
        obraRodoviaria.produtos = this.normalizeProductArray(obraRodoviaria.produtos);
        obraRodoviaria.user = user.id;
        obraRodoviaria.intervencao = obraRodoviaria.intervencao?.id;
        obraRodoviaria.status = obraRodoviaria.status?.id;
        obraRodoviaria.uf = obraRodoviaria.uf?.id;
        obraRodoviaria.arquivoGeorreferenciado = this.uploadFiles?.get('arquivoGeorreferenciado')?.toString();
        obraRodoviaria.documentosAdicionais = this.uploadFiles?.get('documentosAdicionais')?.toString()

        this._obraService.addObra(obraRodoviaria)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.saving = false;
            this.toggleEditMode(false);
            this._router.navigate(['/admin/obras/lista']);
            this._snackBar.open('Obra Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });
            this.obraForm.reset();
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


