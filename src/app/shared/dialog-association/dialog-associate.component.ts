import { Component, Inject, Input } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';



@Component({
    selector: 'dialog-associate',
    templateUrl: './dialog-associate.component.html',
    styleUrls: ['./dialog-associate.component.scss']
  })
  export class DialogAssociateComponent {

    @Input() titleDialog: string;
    @Input() labelInput: string;
    @Input() propety: string;
    selectedValue: string;

    constructor(
        public dialogRef: MatDialogRef<DialogAssociateComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
      ) {}

      onNoClick(): void {
        this.dialogRef.close();
      }
  }
