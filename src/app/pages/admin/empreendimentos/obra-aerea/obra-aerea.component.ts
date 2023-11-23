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
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ObraAereo } from 'app/models/obraAereo';
import { Endereco } from 'app/models/endereco';
import { Produto } from 'app/models/produto';
_moment.locale('en');

@Component({
  selector: 'app-obra-aerea',
  templateUrl: './obra-aerea.component.html',
  styleUrls: ['./obra-aerea.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  { provide: DateAdapter, useClass: NativeDateAdapter }],
})
export class ObraAereaComponent implements OnInit {

  @Input() obra: FormGroup;
  events: string[] = [];
  tipoObraSelecionada: string = '';
  editMode: boolean = false;
  produtos$: Observable<any>;
  produtos: any;
  infras: any;
  empreendimentos: any;
  saving: boolean;
  creating: boolean = false;
  loading: boolean = false;
  isLoading: boolean = false;
  selectedFile: File | null = null;
  arquivoGeo: File | null = null;
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(private _formBuilder: FormBuilder, public _tipoObraDialog: MatDialog, private cd: ChangeDetectorRef,
    private empreendimentoService: EmpreendimentosService, private _router: Router, public _snackBar: MatSnackBar) { }


  ngOnInit(): void {
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
      .getAllEmpreendimentos()
      .subscribe((emprs) => {
        this.empreendimentos = emprs.data;
      })

    this.createObaForm();
  }


  createObaForm(): FormGroup {
    return this.obra = this._formBuilder.group({
      id: [''],
      empreendimento: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      tipo_infraestrutura: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      intervencao: ['', [Validators.required]],
      status: [true],
      instrumento: ['', [Validators.required]],
      dataInicio: [{ value: '', disabled: true }, [Validators.required]],
      dataConclusao: [{ value: '', disabled: true }, [Validators.required]],
      documentosAdicionais: [''],
      arquivoGeorreferenciado: [''],
      produto:['', [Validators.required]],
      endereco: this.createEnderecoForm(),
      valorGlobal: ['', [Validators.required]],
      percentualFinanceiroExecutado: ['', [Validators.required]],
    })
  }

  createEnderecoForm(): FormGroup {
    return this._formBuilder.group({
      logradouro: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      UF: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required),
      latitude: new FormControl('', Validators.required),
    })
  }


  docsAdicionais(event: any) {

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.selectedFile = event.target.files[0];

      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //   this.obra.patchValue({
      //     documentosAdicionais: reader.result
      //   });

      //   this.cd.markForCheck();
      // };
    }

  }

  geoDocs(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.arquivoGeo = event.target.files[0];

      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //   this.obra.patchValue({
      //     arquivoGeorreferenciado: reader.result
      //   });

      //   this.cd.markForCheck();
      // };
    }
  }

  initializeObraForm(type: string) {

    this.obra.patchValue({ tipo: type })

    if (type === 'aerea') {
      this.obra.addControl('situacaoAeroporto', new FormControl('', Validators.required));
      this.obra.addControl('codigoIATA', new FormControl('', Validators.required));
      this.obra.addControl('tipoAviaoRecICAO', new FormControl('', Validators.required));
      this.obra.addControl('extensao', new FormControl('', Validators.required));
      this.obra.addControl('novaLargura', new FormControl('', Validators.required));
      this.obra.addControl('novaAreaCriada', new FormControl('', Validators.required));
    }

    if (type === 'rodoviaria') {
      this.obra.addControl('rodovia', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('kmInicial', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('kmFinal', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('extensao', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('codigo', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('versao', this._formBuilder.control('', [Validators.required]));
    }

    if (type === 'portuaria') {
      this.obra.addControl('tipoEmbarcacao', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('ampliacaoCapacidade', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('novoCalado', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('novaLargura', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('novoComprimento', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('capacidadeDinamica', this._formBuilder.control('', [Validators.required]));
    }

    if (type === 'hidroviaria') {
      this.obra.addControl('situacaoHidrovia', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('temEclusa', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('temBarragem', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('tipoEmbarcacao', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('ampliacaoCapacidade', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('profundidadeMinima', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('profundidadeMaxima', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('comboiosCheia', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('comboiosEstiagem', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('novaLargura', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('novoComprimento', this._formBuilder.control('', [Validators.required]));
    }

    if (type === 'ferroviaria') {
      this.obra.addControl('kmInicial', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('kmFinal', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('extensao', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('novaBitola', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('novaVelocidade', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('capacidadeDinamica', this._formBuilder.control('', [Validators.required]));
    }

    if (type === 'duto') {
      this.obra.addControl('tipoDuto', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('funcaoEstrutura', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('materialTransportado', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('nivelDuto', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('codigoOrigem', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('codigoDestino', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('nomeXRL', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('extensao', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('espessura', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('vazaoProjeto', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('vazaoOperacional', this._formBuilder.control('', [Validators.required]));
      this.obra.addControl('novaAreaImpactada', this._formBuilder.control('', [Validators.required]));
    }

  }



  get obrasControls(): { [key: string]: AbstractControl } {
    return this.obra.controls;
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

    this.editMode = false;
  }

  onSubmit() {
    if (this.obra) {
      if (this.obra.get('tipo').value === 'aerea') {
        const obraAerea = new ObraAereo(this.obra.value);
        const user = new User(JSON.parse(localStorage.getItem('user')));
        const endereco = new Endereco(this.obra.get('endereco').value);
        const produto = new Produto(this.obra.get('produto').value)
        const enderecoString = JSON.stringify(endereco);
        obraAerea.dataInicio = moment(this.obra.get('dataInicio').value).format('L');
        obraAerea.dataConclusao = moment(this.obra.get('dataConclusao').value).format('L');
        obraAerea.empreendimento = obraAerea.empreendimento?.id;
        obraAerea.tipo_infraestrutura = obraAerea.tipo_infraestrutura?.id;
        obraAerea.produto = produto.id;
        obraAerea.user = user.id;
        console.log(produto)

        delete obraAerea.id;
        delete obraAerea.endereco;
  
        const formData = new FormData();
  
        for (let key in obraAerea) {
          if (obraAerea.hasOwnProperty(key) && obraAerea[key] != null) {
            formData.append(key, obraAerea[key]);
          }
        }
        formData.append('endereco', enderecoString);

      // Append file data
    if (this.obra.get('documentosAdicionais')) {
      formData.append('documentosAdicionais', this.obra.get('documentosAdicionais').value);
    }

    if (this.obra.get('arquivoGeorreferenciado')) {
      formData.append('arquivoGeorreferenciado', this.obra.get('arquivoGeorreferenciado').value);
    }
  
        this.empreendimentoService.addObra(formData)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this._snackBar.open('Empreendimento Salvo com Sucesso', 'Fechar', {
              duration: 3000
            });
            // Additional actions after successful submission
          });
      }
    }
  }
  

}


