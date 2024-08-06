import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControllersService {

  private formStates = new BehaviorSubject<{ [key: string]: boolean }>({});
  formStates$ = this.formStates.asObservable();

  constructor() {  }

  setFormState(formName: string, isDisabled: boolean) {
    const currentStates = this.formStates.value;
    const updatedStates = { ...currentStates, [formName]: isDisabled };
    this.formStates.next(updatedStates);
  }

  getFormState(formName: string): boolean {
    return this.formStates.value[formName] ?? false;
  }

  importState(state: { [key: string]: boolean }) {
    this.formStates.next(state);
  }

  exportState() {
    const state = this.formStates.value;
    const stateJson = JSON.stringify(state);
    const blob = new Blob([stateJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    console.log(a);
    a.href = url;
    a.download = 'formStates.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
