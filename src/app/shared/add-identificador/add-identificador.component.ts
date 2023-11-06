import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-identificador',
  templateUrl: './add-identificador.component.html',
  styleUrls: ['./add-identificador.component.scss']
})
export class AddIdentificadorComponent{

  selectedValue: string;

  constructor(
      public dialogRef: MatDialogRef<AddIdentificadorComponent>,
      @Inject(MAT_DIALOG_DATA) public data,
    ) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

}
