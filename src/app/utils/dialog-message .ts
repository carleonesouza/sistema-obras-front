import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})

export class DialogMessage  {

    constructor(private _snackBar: MatSnackBar, private dialog: MatDialog){}

    showMessageResponse(message: string, status: string | number) {
        this._snackBar.open(message, ' ' + status, { duration: 1000 });
      }

      showDialog(title: string, message: string, item: any, confirmation: boolean): MatDialogRef<ConfirmationDialogComponent, any> {
        return this.dialog.open(ConfirmationDialogComponent, { width: 'auto', data: {title: title, message: message, confirm: confirmation, item }});
      }
}
