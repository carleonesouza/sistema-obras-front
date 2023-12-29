import { Directive, HostListener, ElementRef, Renderer2, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appPercentageMask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PercentageMaskDirective),
      multi: true
    }
  ]
})
export class PercentageMaskDirective implements ControlValueAccessor {

  private onChange: (value: any) => void;
  private onTouched: () => void;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    let transformed = this.transform(value);
    this.renderer.setProperty(this.el.nativeElement, 'value', transformed);
    this.onChange(this.extractValue(transformed));
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.renderer.setProperty(this.el.nativeElement, 'value', this.transform(value?.toString()));
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private transform(value: string): string {
    if (value && value !== undefined && value !== null) {
      // Remove non-numeric characters except for decimal point
      let onlyNums = value.replace(/[^\d.]/g, '');

      // Add '%' symbol at the end
      return onlyNums + '%';
    }

  }

  private extractValue(transformedValue: string): number {
    // Verifica se o valor é definido e, em seguida, remove o símbolo '%' e converte para número
    return transformedValue ? parseFloat(transformedValue.replace(/%/g, '')) : 0;
  }
  
}
