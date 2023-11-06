import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpfValidatorDirective } from './cpf-validator.directive';
import { ConfirmEqualValidatorDirective } from './confirm-equal-validator.directive';



@NgModule({
  declarations: [CpfValidatorDirective, ConfirmEqualValidatorDirective],
  imports: [
    CommonModule
  ],
  exports: [CpfValidatorDirective, ConfirmEqualValidatorDirective]
})
export class DirectiveModule { }
