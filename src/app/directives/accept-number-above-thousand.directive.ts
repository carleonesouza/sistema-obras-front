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
    if (value !== null && value !== undefined) {
      this.renderer.setProperty(this.el.nativeElement, 'value', this.formatNumber(value));
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // Implementação se necessário
  }

  private formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  private unformatNumber(value: string): number {
    return parseFloat(value.replace(/\./g, ''));
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    let numericValue = this.unformatNumber(value);
    this.renderer.setProperty(this.el.nativeElement, 'value', this.formatNumber(numericValue));
    this.onChange(numericValue);
  }

  @HostListener('blur')
  onBlur(): void {
    let value = this.el.nativeElement.value;
    let numericValue = this.unformatNumber(value);
    this.renderer.setProperty(this.el.nativeElement, 'value', this.formatNumber(numericValue));
  }

}
