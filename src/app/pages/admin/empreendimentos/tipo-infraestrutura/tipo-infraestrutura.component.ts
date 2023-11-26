import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TipoInfraestruturaService } from './tipo-infraestrutura.service';
import { TipoInfraestrutura } from 'app/models/tipoInfra';
import { Setor } from 'app/models/setor';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogMessage } from 'app/utils/dialog-message ';
import { SetorsService } from '../../setors/setors.service';

@Component({
  selector: 'app-tipo-infraestrutura',
  templateUrl: './tipo-infraestrutura.component.html',
  styleUrls: ['./tipo-infraestrutura.component.scss']
})
export class TipoInfraestruturaComponent implements OnInit {

  @Input() tipoInfra: FormGroup;  
  editMode: boolean = false;
  infras: any;
  saving: boolean;
  creating: boolean = false;
  loading: boolean = false;
  isLoading: boolean = false;
  setores$: Observable<any>;
  setores: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _tipoInfraService: TipoInfraestruturaService,
    public _snackBar: MatSnackBar,
    private _setoresService: SetorsService,
    public _dialog: DialogMessage,
    public dialog: MatDialog) {}

  ngOnInit(): void {
     // Open the drawer
     
     
      this.creating = true;
      this.createInfraForm();
      this.setores$ = this._setoresService.getSetores();
      this.setores$.subscribe((result) =>{
        this.setores = result.data;
      })

      
    

    // if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

    //   this.loading = true;
    //   this.iniciativa$ = this._iniciativasService.iniciativa$;
    //   this.setores$ = this._setoresService.getSetores();
    //   this.setores$.subscribe((result) =>{
    //     this.setores = result.data;
    //   })

    //   this.statues$ = this._iniciativasService.getAllStatues();
    //   this.statues$.subscribe((res) =>{       
    //     this.statues = res.data;
    //   })

    //   this.iniciativa$
    //     .subscribe((iniciativa) => {

    //       // Open the drawer in case it is closed
    //       this._listItemComponent.matDrawer.open();
    //       this.createIniciativaForm();
    //       this.iniciativaForm.reset();
    //       this.iniciativa = iniciativa;    
    //       // Get the Lista
    //       if (this.iniciativa) {
    //         this.loading = false;              
    //         this.iniciativaForm.patchValue(this.iniciativa);
    //         this.selectedStatus = this.iniciativa.status.status;
    //         this.iniciativaForm.patchValue({
    //           setor: this.iniciativa.setor.setor,
    //           status: this.iniciativa.status.status
    //         })
    //       }

    //       // Toggle the edit mode off
    //       this.toggleEditMode(false);

    //       // Mark for check
    //       this._changeDetectorRef.markForCheck();
    //     });


    // }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    ///this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createInfraForm(){
    this.tipoInfra = this._formBuilder.group({
      id: new FormControl(''),
      descricao: new FormControl('', Validators.required),
      setor_id: new FormControl('', Validators.required),
      status: new FormControl()
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get tipoInfraControls() {
    return this.tipoInfra.controls;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  itemDisplayFn(item: Setor) {
    return item ? item.descricao : '';
  }

  itemDisplayFnStatus(item: any) {
    return item ? item.descricao : '';
  }



  cancelEdit() {
    if(this.creating){
      
      //this._router.navigate(['/admin/iniciativas/list']);
    }
    this.editMode = false;
  }


  // async desativaItem(event) {
  //   const ativaDesativa = parseInt(this.iniciativa.status) === 1 ? 'Inativar' : 'Ativar';
  //   const dialogRef = this._dialog.showDialog(`${ativaDesativa} Produto`, `Certeza que deseja ${ativaDesativa} Produto?`,
  //     this.iniciativa, true);

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {

  //       const iniciativa = new Iniciativa();
  //       const user = new User(JSON.parse(localStorage.getItem('user')));
  //       iniciativa.usuario_que_alterou = user.id;
  //       iniciativa.id = result?.item.id;
  //       iniciativa.status = parseInt(result?.item?.status) === 1 ? 0 : 1;
        
  //       this._iniciativasService.deactivateActiveItem(iniciativa)
  //         .subscribe(
  //           () => {
  //             this._router.navigate(['/admin/iniciativas/lista/']);
  //             this.closeDrawer();
  //             this._dialog.showMessageResponse('Atualizado com Sucesso!', 'OK');
  //           }
  //         );
  //     }
  //   });
  // }
  
  // deleteItem(){
  //   if (this.iniciativaForm.valid) {
  //     const iniciativa = new Iniciativa(this.iniciativaForm.value);  
     
  //     if (iniciativa) {
  //       this._iniciativasService
  //         .deleteIniciativa(iniciativa)
  //         .pipe(takeUntil(this._unsubscribeAll))
  //         .subscribe(
  //           () => {
  //             this.toggleEditMode(false);
  //             this.closeDrawer().then(() => true);
  //             this._router.navigate(['/admin/iniciativas/lista']);
  //             this._snackBar.open('Iniciativa Removido com Sucesso', 'Fechar', {
  //               duration: 3000
  //             });
  //             this.iniciativaForm.reset();
  //           },
  //         );
  //     }
  //   }
  // }

  // updateItem() {
  //   if (this.iniciativaForm.valid) {
  //     const iniciativa = new Iniciativa(this.iniciativaForm.value);
  //     const user = new User(JSON.parse(localStorage.getItem('user')));
  //     const setor = new Setor(this.iniciativaForm.get('setor').value);
  //     const status = new Status(this.iniciativaForm.get('status').value)
  //     iniciativa.usuario_que_alterou = user.id;
  //     iniciativa.setor = setor.id;
  //     iniciativa.status = status.id;

  //     delete iniciativa.usuario;
           
  //     if (iniciativa) {
  //       this._iniciativasService
  //         .editIniciativa(iniciativa)
  //         .pipe(takeUntil(this._unsubscribeAll))
  //         .subscribe(
  //           () => {
  //             this.toggleEditMode(false);
  //             this.closeDrawer().then(() => true);
  //             this._router.navigate(['/admin/iniciativas/lista']);
  //             this._snackBar.open('Iniciativa Atualizado com Sucesso', 'Fechar', {
  //               duration: 3000
  //             });
  //             this.iniciativaForm.reset();
  //           },
  //         );
  //     }
  //   }
  // }

  onSubmit(){
    if(this.tipoInfra.valid){
      const tipoInfra = new TipoInfraestrutura(this.tipoInfra.value);
      const setor = new Setor(this.tipoInfra.get('setor_id').value)
      tipoInfra.setor_id = setor.id;
     
      delete tipoInfra.id;
      
      this._tipoInfraService
        .addTipoInfraestrutura(tipoInfra)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {          
            //this._router.navigate(['/admin/iniciativas/lista']);
            this._snackBar.open('Tipo Infraestrutura Salva com Sucesso','Fechar', {
              duration: 3000
            });
            this.tipoInfra.reset();
          });
    }
  }
}

