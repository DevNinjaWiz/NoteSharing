import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input('');
  readonly name = input<string | undefined>(undefined);
  readonly autocomplete = input<string | undefined>(undefined);
  readonly type = input<'text' | 'email' | 'password' | 'number'>('text');
  readonly size = input<InputSize>('default');
  readonly variant = input<InputVariant>('outlined');
  readonly status = input<InputStatus>(null);
  readonly helperText = input<string | undefined>(undefined);
  readonly prefixIcon = input<string | undefined>(undefined);
  readonly suffixIcon = input<string | undefined>(undefined);
  readonly allowClear = input<boolean>(false);
  readonly disabledInput = input<boolean>(false);
  readonly autofocus = input<boolean>(false);
  private readonly disabledFromControl = signal(false);

  readonly value = model<string>('');
  readonly isFocused = signal(false);
  readonly hasValue = computed(() => this.value().length > 0);
  readonly disabled = computed(
    () => !!this.disabledInput() || this.disabledFromControl()
  );

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.onChange(this.value());
  }

  onFocus() {
    this.isFocused.set(true);
  }

  onBlur() {
    this.isFocused.set(false);
    this.onTouched();
  }

  clearValue() {
    if (this.disabled()) {
      return;
    }

    this.value.set('');
    this.onChange(this.value());
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabledFromControl.set(isDisabled);
  }

  protected get defaultStatusMessage(): string {
    const status = this.status();

    if (status === 'error') {
      return 'Please resolve the highlighted problem.';
    }

    if (status === 'warning') {
      return 'Review this field before submitting.';
    }

    return '';
  }
}
