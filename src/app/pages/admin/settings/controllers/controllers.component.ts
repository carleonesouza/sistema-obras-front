import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ControllersService } from './controllers.service';

@Component({
  selector: 'app-controllers',
  templateUrl: './controllers.component.html',
  styleUrls: ['./controllers.component.scss']
})
export class ControllersComponent implements OnInit {

  configForm: FormGroup;
  forms = [
    { name: 'userForm', label: 'Formulário de Conta' },
    { name: 'perfilForm', label: 'Formulário de Perfis' },
    { name: 'setorsForm', label: 'Formulário de Setores' },
    { name: 'tipoInfra', label: 'Formulário de Tipo Infraestrutura' },
    { name: 'intervencaoForm', label: 'Formulário de Intervenções' },
    { name: 'empreendimentoForm', label: 'Formulário de Empreendimentos' },
    { name: 'obraForm', label: 'Formulário de Obras' },
    { name: 'iniciativaForm', label: 'Formulário de Iniciativas' }
  ];

  formStates: { [key: string]: boolean } = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private formControlService: ControllersService
  ) { }

  ngOnInit(): void {
     

    // Subscribe to form states
    this.formControlService.formStates$.subscribe(states => {
      this.formStates = states;
    });
  }

  openConfirmationDialog(): void {
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  toggleForm(formName: string): void {
    const currentState = this.formStates[formName];
    this.formControlService.setFormState(formName, !currentState);
  }

  exportFormState(): void {
    this.formControlService.exportState();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const importedState = JSON.parse(reader.result as string);
          this.formControlService.importState(importedState);
        } catch (error) {
          console.error('Erro ao importar o estado do formulário:', error);
        }
      };
      reader.readAsText(file);
    }
  }
}
