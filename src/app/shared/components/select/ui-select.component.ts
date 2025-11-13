import {
  Component,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  signal,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UiSelectOption<T extends string> {
  readonly label: string;
  readonly value: T;
}

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-select.component.html',
  styleUrls: ['./ui-select.component.scss'],
})
export class UiSelectComponent<T extends string = string> {
  readonly label = input.required<string>();
  readonly options = input<readonly UiSelectOption<T>[]>([]);
  readonly value = input.required<T>();
  readonly disabled = input(false);
  readonly menuWidth = input<number | undefined>(undefined);
  readonly tooltip = input<string | undefined>(undefined);

  @Output() valueChange = new EventEmitter<T>();

  readonly isOpen = signal(false);
  readonly currentLabel = computed(() => {
    return (
      this.options().find((option) => option.value === this.value())?.label ??
      this.value()
    );
  });

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  toggle(): void {
    if (this.disabled()) {
      return;
    }

    this.isOpen.update((open) => !open);
  }

  select(option: UiSelectOption<T>): void {
    if (this.disabled()) {
      return;
    }

    this.valueChange.emit(option.value);
    this.isOpen.set(false);
  }
 
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    if (!this.isOpen()) {
      return;
    }

    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }
}
