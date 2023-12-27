import { Directive, HostListener, ElementRef, Renderer2, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


@Directive({
  selector: '[appAcceptNumberAboveThousand]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AcceptNumberAboveThousandDirective),
    multi: true
  }]
})
export class AcceptNumberAboveThousandDirective implements ControlValueAccessor {

  private onChange: (value: any) => void;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  writeValue(value: any): void {
    // Inicializa o campo com o valor dividido por 1000
    this.renderer.setProperty(this.el.nativeElement, 'value', (value / 1000).toString());
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // Implementação se necessário
  }

  @HostListener('focus')
  onFocus(): void {
    // Converte o valor para formato editável (divide por 1000)
    let value = this.el.nativeElement.value;
    this.renderer.setProperty(this.el.nativeElement, 'value', parseFloat(value) / 1000);
  }

  @HostListener('blur')
  onBlur(): void {
    // Ao perder o foco, multiplica o valor por 1000
    let value = this.el.nativeElement.value;
    const newValue = parseFloat(value) * 1000;
    this.renderer.setProperty(this.el.nativeElement, 'value', newValue.toString());
    this.onChange(newValue);
  }

}
