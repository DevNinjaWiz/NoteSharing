import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

type InputSize = 'default' | 'small' | 'large';
type InputVariant = 'outlined' | 'borderless' | 'filled' | 'underlined';
type InputStatus = 'error' | 'warning' | null;

@Component({
  selector: 'shared-ui-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-input.component.html',
  styleUrls: ['./ui-input.component.scss'], 
  host: {
    class: 'shared-ui-input',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
})
export class UiInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() name?: string;
  @Input() autocomplete?: string;
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() size: InputSize = 'default';
  @Input() variant: InputVariant = 'outlined';
  @Input() status: InputStatus = null;
  @Input() helperText?: string;
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;
  @Input() allowClear = false;
  @Input() disabled = false;
  @Input() autofocus = false;

  @Input()
  get value(): string {
    return this._value;
  }
  set value(newValue: string) {
    this._value = newValue ?? '';
  }

  @Output() valueChange = new EventEmitter<string>();

  isFocused = false;

  protected get hasValue(): boolean {
    return this._value.length > 0;
  }

  private _value = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this._value = input.value;
    this.valueChange.emit(this._value);
    this.onChange(this._value);
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
    this.onTouched();
  }

  clearValue() {
    if (this.disabled) {
      return;
    }

    this._value = '';
    this.valueChange.emit(this._value);
    this.onChange(this._value);
  }

  writeValue(value: string | null): void {
    this._value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected get defaultStatusMessage(): string {
    if (this.status === 'error') {
      return 'Please resolve the highlighted problem.';
    }

    if (this.status === 'warning') {
      return 'Review this field before submitting.';
    }

    return '';
  }
}
