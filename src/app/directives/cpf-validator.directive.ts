import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { cpfValida } from '../utils/validaCpf';

@Directive({
  selector: 'appCpfValidator',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: CpfValidatorDirective,
    multi: true
  }]
})
export class CpfValidatorDirective implements Validator {
  @Input() appCpfValidator: string;

  validate(control: AbstractControl): { [key: string]: any } | null {
    console.log(control);
    if(control !== null){
      return cpfValida(control);
    }
  }

}
