import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  input,
} from '@angular/core';

type ButtonVariant = 'primary' | 'default' | 'dashed' | 'link' | 'text';
type ButtonSize = 'large' | 'default' | 'small';
type ButtonShape = 'default' | 'circle' | 'round';
type IconPlacement = 'prefix' | 'suffix';

@Component({
  selector: 'shared-ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'shared-ui-button',
  },
})
export class UiButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('default');
  readonly shape = input<ButtonShape>('default');
  readonly block = input<boolean>(false);
  readonly danger = input<boolean>(false);
  readonly ghost = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly icon = input<string | undefined>(undefined);
  readonly iconPlacement = input<IconPlacement>('prefix');
  readonly htmlType = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly isDisabled = computed(
    () => this.disabled() || this.loading(),
  );

  readonly controlClasses = computed(() => ({
    [`shared-ui-button__control--${this.variant()}`]: true,
    [`shared-ui-button__control--size-${this.size()}`]: true,
    [`shared-ui-button__control--shape-${this.shape()}`]:
      this.shape() !== 'default',
    'shared-ui-button__control--block': this.block(),
    'shared-ui-button__control--danger': this.danger(),
    'shared-ui-button__control--ghost': this.ghost(),
    'shared-ui-button__control--loading': this.loading(),
  }));

  @HostBinding('class.shared-ui-button--block')
  get hostBlockClass(): boolean {
    return this.block();
  }
}
