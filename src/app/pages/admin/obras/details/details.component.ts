import { ChangeDetectorRef, Component, Input, LOCALE_ID, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject, takeUntil, map } from 'rxjs';
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

    this.produtos$ = this._obraService.getAllProdutos();
    this.produtos$
      .subscribe((prods) => {
        this.produtos = prods.data
        this.isLoading = false;
      });


    this._obraService
      .getEstados()
      .subscribe((estados) => {
        this.estados = estados.data;
      })

    this.statues$ = this._obraService
      .getAllStatues();
    this.statues$.subscribe((res) => {
      this.statues = res.data;
    });

    this.simnaos$ = this._obraService
      .getSimNaos();
    this.simnaos$.subscribe((res) => {
      this.simnaos = res.data;
    })

    if (this._route.snapshot.url[1].path === 'add') {

      this.setores$ = this._setoresService.getSetores();
      this.setores$.subscribe((result) => {
        this.setores = result.data;
      })
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


          if (this.obra) {

            this.initializeObraForm(this.obra.tipo)
            this.tipoObraSelecionada = this.obra.tipo;

            this.setores$ = this._setoresService.getSetores();
            this.setores$.subscribe((data) => {
              this.setores = data.data;
              data.data.map((item) => {
                if (item.descricao === this.obra.tipo) {
                  this.obraForm.patchValue({
                    tipo: item
                  })

                  this._empreendimentosService
                    .getEmpreendimentosBySetor(item.id)
                    .subscribe((emprs) => {
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
                    .getInfrasBySetorId(item.id)
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
                    .getIntervencaoBySetorId(item.id)
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
                this.loading = false;
              });
            });

            if (obra?.produtos) {
              // Clear existing form groups in produtosFormArray
              while (this.produtosFormArray.length !== 0) {
                this.produtosFormArray.removeAt(0);
              }
              this.produtos$.subscribe((itens) => {
                this.produtos = itens.data;
                itens.data.map((prod) => {

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
              });

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
              this.municpios$ = this._obraService.getMunicipios(this.obra.uf.uf.sigla);

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

            if (obra.tipo === 'Hidroviário') {
              this.simnaos$.subscribe((itens) => {
                this.simnaos = itens.data;
                this.simnaos.map((item) => {

                  if (item.id === parseInt(this.obra?.temBarragem.temBarragem)) {
                    this.obraForm.patchValue({
                      temBarragem: item
                    })
                  }
                  if (item.id === parseInt(this.obra?.temEclusa.temEclusa)) {
                    this.obraForm.patchValue({
                      temEclusa: item
                    })
                  }
                  if (item.id === parseInt(this.obra?.ampliacaoCapacidade.ampliacaoCapacidade)) {
                    this.obraForm.patchValue({
                      ampliacaoCapacidade: item
                    })
                  }
                })
              })
            }

            if (obra.tipo === 'Portuário') {

              this.simnaos$.subscribe((itens) => {
                this.simnaos = itens.data;
                this.simnaos.map((item) => {
                  if (item.id === parseInt(this.obra?.ampliacaoCapacidade.ampliacaoCapacidade)) {
                    this.obraForm.patchValue({
                      ampliacaoCapacidade: item
                    })
                  }
                })
              })

            }

            if (obra.tipo === 'Ferroviário') {
              this.bitolas$ = this._obraService.getBitolas();
              this.bitolas$.subscribe((itens) => {
                this.bitolas = itens.data;
                this.bitolas.map((item) => {
                  if (item.id === this.obra.bitola.bitola.id) {
                    this.obraForm.patchValue({
                      bitola: this.obra.bitola.bitola
                    })
                  }
                })
              })
            }

            if (obra.tipo === 'Dutoviário') {

              this.tipoDutos$ = this._obraService.getTipoDutos();
              this.tipoDutos$.subscribe((res) => {
                this.tipoDutos = res.data;

                this.tipoDutos.map((item) => {
                  if (item.id === this.obra?.tipo_duto?.tipo_duto.id) {
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
                  if (item.id === this.obra?.tipo_infraestrutura?.tipo_infraestrutura.id) {
                    this.obraForm.patchValue({
                      tipo_infraestrutura: this.obra?.tipo_infraestrutura?.tipo_infraestrutura
                    })
                  }
                })

              })


              this.nivelDutos$ = this._obraService.getNivelDutos();
              this.nivelDutos$.subscribe((res) => {
                this.nivelDutos = res.data;

                this.nivelDutos.map((item) => {
                  if (item.id === this.obra?.nivel_duto?.nivel_duto.id) {
                    this.obraForm.patchValue({
                      nivel_duto: this.obra?.nivel_duto?.nivel_duto
                    })
                  }
                })
              })
            }

            this.obraForm.patchValue({
              status: this.obra?.status?.status,
              tipo: this.obra.tipo,
              dataInicio: this.fixDateFormat(this.obra?.dataInicio),
              dataConclusao: this.fixDateFormat(this.obra?.dataConclusao),
              data_base_orcamento: this.fixDateFormat(this.obra?.data_base_orcamento),
              uf: this.obra?.uf?.uf,
              documentosAdicionais: '',
              arquivoGeorreferenciado: ''
            })
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
      instrumento: [''],
      dataInicio: [{ value: '', disabled: true }, [Validators.required]],
      dataConclusao: [{ value: '', disabled: true }, [Validators.required]],
      data_base_orcamento: [{ value: '', disabled: true }, [Validators.required]],
      documentosAdicionais: [''],
      responsavel: ['', [Validators.required]],
      arquivoGeorreferenciado: ['', [Validators.required]],
      produtos: this._formBuilder.array([this.createProdutoForms()]),
      municipios: this._formBuilder.array([this.createMunicipioForms()]),
      uf: [''],
      longitude: [''],
      latitude: [''],
      valorGlobal: [''],
      percentualFinanceiroExecutado: [''],
    })
  }

  compareSetores(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.descricao === c2 : c1 === c2;
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
    const ctrlValue = this.obraForm.get('dataConclusao').value!;
    this.obraForm.get('dataConclusao').setValue(normalizedMonthAndYear.toDate());
    datepicker.close();
  }

  setDataInicio(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.obraForm.get('dataInicio').value!;
    this.obraForm.get('dataInicio').setValue(normalizedMonthAndYear.toDate());
    datepicker.close();
  }

  setDataBaseOorcamento(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.obraForm.get('data_base_orcamento').value!;
    this.obraForm.get('data_base_orcamento').setValue(normalizedMonthAndYear.toDate());
    datepicker.close();
  }

  fixDateFormat(dateString: string): string {

    // Verifica se a string de data está no formato esperado
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

      if (obraTipo.descricao === 'Aeroportuário') {
        const obraAerea = new ObraAereo(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraAerea.usuario_que_alterou = user.id;

        obraAerea.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraAerea.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraAerea.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraAerea.empreendimento = obraAerea.empreendimento?.id;
        obraAerea.tipo_infraestrutura = obraAerea.tipo_infraestrutura?.id;
        obraAerea.tipo = obraTipo.descricao;
        obraAerea.municipios = obraAerea.municipios.map((muni: any) => {
          muni.municipio_id = muni.id;
          muni.nome = muni.nome.nome;
          muni.uf = obraAerea.uf?.id;
          delete muni.id;
          return muni;

        });

        obraAerea.produtos = obraAerea.produtos.map((item: any) => {
          item.produto_id = item.descricao.id
          delete item.id;
          delete item.descricao;
          return item;

        });

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
      else if (obraTipo.descricao === 'Dutoviário') {
        const obraDuto = new ObraDuto(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraDuto.usuario_que_alterou = user.id;
        obraDuto.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraDuto.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraDuto.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraDuto.empreendimento = obraDuto.empreendimento?.id;
        obraDuto.tipo = obraTipo.descricao;
        obraDuto.tipo_infraestrutura = obraDuto.tipo_infraestrutura?.id;
        obraDuto.municipios = obraDuto.municipios.map((muni: any) => {
          muni.municipio_id = muni.id;
          muni.nome = muni.nome.nome;
          muni.uf = obraDuto.uf?.id;
          delete muni.id;
          return muni;

        });
        obraDuto.produtos = obraDuto.produtos.map((item: any) => {
          item.produto_id = item.descricao.id
          delete item.id;
          delete item.descricao;
          return item;
        });
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
      else if (obraTipo.descricao === 'Hidroviário') {
        const obraHidroviaria = new ObraHidroviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraHidroviaria.usuario_que_alterou = user.id;
        obraHidroviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraHidroviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraHidroviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraHidroviaria.empreendimento = obraHidroviaria.empreendimento?.id;
        obraHidroviaria.tipo = obraTipo.descricao;
        obraHidroviaria.tipo_infraestrutura = obraHidroviaria.tipo_infraestrutura?.id;
        obraHidroviaria.municipios = obraHidroviaria.municipios.map((muni: any) => {
          muni.municipio_id = muni.id;
          muni.nome = muni.nome.nome;
          muni.uf = obraHidroviaria.uf?.id;
          delete muni.id;
          return muni;

        });
        obraHidroviaria.produtos = obraHidroviaria.produtos.map((item: any) => {
          item.produto_id = item.descricao.id
          delete item.id;
          delete item.descricao;
          return item;
        });
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
      else if (obraTipo.descricao === 'Ferroviário') {
        const obraFerroviaria = new ObraFerroviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraFerroviaria.usuario_que_alterou = user.id;
        obraFerroviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraFerroviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraFerroviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraFerroviaria.empreendimento = obraFerroviaria.empreendimento?.id;
        obraFerroviaria.tipo = obraTipo.descricao;
        obraFerroviaria.tipo_infraestrutura = obraFerroviaria.tipo_infraestrutura?.id;
        obraFerroviaria.municipios = obraFerroviaria.municipios.map((muni: any) => {
          muni.municipio_id = muni.id;
          muni.nome = muni.nome.nome;
          muni.uf = obraFerroviaria.uf?.id;
          delete muni.id;
          return muni;

        });
        obraFerroviaria.produtos = obraFerroviaria.produtos.map((item: any) => {
          item.produto_id = item.descricao.id
          delete item.id;
          delete item.descricao;
          return item;
        });
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
      else if (obraTipo.descricao === 'Portuário') {
        const obraPortuaria = new ObraPortuaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraPortuaria.usuario_que_alterou = user.id;
        obraPortuaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraPortuaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraPortuaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraPortuaria.empreendimento = obraPortuaria.empreendimento?.id;
        obraPortuaria.tipo = obraTipo.descricao;
        obraPortuaria.tipo_infraestrutura = obraPortuaria.tipo_infraestrutura?.id;
        obraPortuaria.municipios = obraPortuaria.municipios.map((muni: any) => {
          muni.municipio_id = muni.id;
          muni.nome = muni.nome.nome;
          muni.uf = obraPortuaria.uf?.id;
          delete muni.id;
          return muni;

        });
        obraPortuaria.produtos = obraPortuaria.produtos.map((item: any) => {
          item.produto_id = item.descricao.id
          delete item.id;
          delete item.descricao;
          return item;
        });
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
      else if (obraTipo.descricao === 'Rodoviário') {
        const obraRodoviaria = new ObraRodoviaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraRodoviaria.usuario_que_alterou = user.id;
        obraRodoviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraRodoviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraRodoviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraRodoviaria.empreendimento = obraRodoviaria.empreendimento?.id;
        obraRodoviaria.tipo = obraTipo.descricao;
        obraRodoviaria.tipo_infraestrutura = obraRodoviaria.tipo_infraestrutura?.id;
        obraRodoviaria.municipios = obraRodoviaria.municipios.map((muni: any) => {
          muni.municipio_id = muni.id;
          muni.nome = muni.nome.nome;
          muni.uf = obraRodoviaria.uf?.id;
          delete muni.id;
          return muni;

        });
        obraRodoviaria.produtos = obraRodoviaria.produtos.map((item: any) => {
          item.produto_id = item.descricao.id
          delete item.id;
          delete item.descricao;
          return item;
        });
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
        obraAerea.municipios = obraAerea.municipios.map((item: any) => {
          item.nome = item.nome.nome
          item.uf = obraAerea.uf?.id;
          delete item.id
          return item;
        });
        obraAerea.produtos = obraAerea.produtos.map((item: any) => {
          item.produto_id = item.descricao.id
          delete item.descricao;
          return item;
        });
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
        obraDuto.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraDuto.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraDuto.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraDuto.empreendimento = obraDuto.empreendimento?.id;
        obraDuto.tipo_infraestrutura = obraDuto.tipo_infraestrutura?.id;
        obraDuto.municipios = obraDuto.municipios.map((item: any) => {
          item.nome = item.nome.nome
          item.uf = obraDuto.uf?.id;
          delete item.id
          return item;
        });
        obraDuto.produtos = obraDuto.produtos.map((item: any) => {
          item.produto_id = item.descricao.id
          delete item.descricao
          return item;
        });
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

        obraHidroviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraHidroviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraHidroviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraHidroviaria.empreendimento = obraHidroviaria.empreendimento?.id;
        obraHidroviaria.ampliacaoCapacidade = obraHidroviaria.ampliacaoCapacidade.id;
        obraHidroviaria.temEclusa = obraHidroviaria.temEclusa.id;
        obraHidroviaria.situacaoHidrovia = obraHidroviaria.situacaoHidrovia?.id;
        obraHidroviaria.temBarragem = obraHidroviaria.temBarragem.id;
        obraHidroviaria.tipo_infraestrutura = obraHidroviaria.tipo_infraestrutura?.id;
        obraHidroviaria.municipios = obraHidroviaria.municipios.map((item: any) => {
          item.nome = item.nome.nome
          item.uf = obraHidroviaria.uf?.id;
          delete item.id;
          return item;
        });
        obraHidroviaria.produtos = obraHidroviaria.produtos.map((item: any) => {
          item.produto_id = item.descricao.id
          delete item.descricao;
          return item;
        });
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
        obraFerroviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraFerroviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraFerroviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraFerroviaria.empreendimento = obraFerroviaria.empreendimento?.id;
        obraFerroviaria.bitola = bitola.id;
        obraFerroviaria.tipo_infraestrutura = obraFerroviaria.tipo_infraestrutura?.id;
        obraFerroviaria.municipios = obraFerroviaria.municipios.map((item: any) => {
          item.nome = item.nome.nome
          item.uf = obraFerroviaria.uf?.id;
          delete item.id;
          return item;
        });
        obraFerroviaria.produtos = obraFerroviaria.produtos.map((item: any) => {
          item.produto_id = item.descricao.id
          delete item.descricao
          return item;
        });
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
            this._snackBar.open('Empreendimento Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });
            this.obraForm.reset();
          });
      }
      else if (this.obraForm.get('tipo').value === 'Portuário') {
        const obraPortuaria = new ObraPortuaria(this.obraForm.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        obraPortuaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraPortuaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraPortuaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraPortuaria.empreendimento = obraPortuaria.empreendimento?.id;
        obraPortuaria.ampliacaoCapacidade = obraPortuaria.ampliacaoCapacidade.id;
        obraPortuaria.tipo_infraestrutura = obraPortuaria.tipo_infraestrutura?.id;
        obraPortuaria.municipios = obraPortuaria.municipios.map((item: any) => {
          item.nome = item.nome.nome
          item.uf = obraPortuaria.uf?.id;
          delete item.id;
          return item;
        });
        obraPortuaria.produtos = obraPortuaria.produtos.map((item: any) => {
          item.produto_id = item.descricao.id
          delete item.descricao
          return item;
        });
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
        obraRodoviaria.dataInicio = moment(this.obraForm.get('dataInicio').value).format('L');
        obraRodoviaria.dataConclusao = moment(this.obraForm.get('dataConclusao').value).format('L');
        obraRodoviaria.data_base_orcamento = moment(this.obraForm.get('data_base_orcamento').value).format('L');
        obraRodoviaria.empreendimento = obraRodoviaria.empreendimento?.id;
        obraRodoviaria.tipo_infraestrutura = obraRodoviaria.tipo_infraestrutura?.id;
        obraRodoviaria.municipios = obraRodoviaria.municipios.map((item: any) => {
          item.nome = item.nome.nome
          item.uf = obraRodoviaria.uf?.id;
          delete item.id
          return item;
        });
        obraRodoviaria.produtos = obraRodoviaria.produtos.map((item: any) => {
          item.produto_id = item.descricao.id
          delete item.descricao
          return item;
        });
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


