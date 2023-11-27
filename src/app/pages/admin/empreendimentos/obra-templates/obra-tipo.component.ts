import {Component, Inject} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogData {
  value: string;
}

@Component({
  selector: 'app-obra-tipo',
  templateUrl: './obra-tipo.component.html',
  styleUrls: ['./obra-tipo.component.scss']
})
export class ObraTipoComponent {
  tipoObraForm: FormGroup;
  tiposDeObra = [
    { label: 'Aeroportuária', value: 'aerea' },
    { label: 'Dutoviária', value: 'duto' },
    { label: 'Ferroviária', value: 'ferroviaria' },
    { label: 'Hidroviária', value: 'hidroviaria' },
    { label: 'Portuária', value: 'portuaria' },
    { label: 'Rodoviária', value: 'rodoviaria' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ObraTipoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.tipoObraForm = this.fb.group({
      tipoObra: ['']
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmSelection(): void {
    this.dialogRef.close(this.tipoObraForm.value.tipoObra);
  }
}