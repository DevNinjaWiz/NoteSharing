import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Note } from '../../../store';
import { ViewMode } from '../../../components/dashboard/dashboard.models';

const FALLBACK_BACKGROUNDS = [
  'linear-gradient(135deg, #2563eb, #7c3aed)',
  'linear-gradient(135deg, #ec4899, #ef4444)',
  'linear-gradient(135deg, #0ea5e9, #22d3ee)',
  'linear-gradient(135deg, #a855f7, #6366f1)',
  'linear-gradient(135deg, #f97316, #f43f5e)',
];

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteCardComponent {
  @Input({ required: true }) note!: Note;
  @Input() viewMode: ViewMode = 'grid';
  @Input() metaText = '';
  @Input() isTrashView = false;
  @Input() previewIndex = 0;
  @Input() trashLocation = '';
  @Input() trashDeletedAt = '';

  @Output() favoriteToggle = new EventEmitter<void>();
  @Output() deleteRequested = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<Note>();
  @Output() restoreRequested = new EventEmitter<void>();
  @Output() deleteForeverRequested = new EventEmitter<void>();

  get previewBackground(): string {
    if (this.note?.photoUrl) {
      return `url('${this.note.photoUrl}')`;
    }

    const safeIndex =
      this.previewIndex >= 0 ? this.previewIndex : Math.abs(this.previewIndex);
    return FALLBACK_BACKGROUNDS[safeIndex % FALLBACK_BACKGROUNDS.length];
  }

  get noteTitle(): string {
    return this.note?.title?.trim() || 'Untitled note';
  }

  get noteExcerpt(): string {
    const content = this.note?.content ?? '';
    const normalized = content.replace(/\s+/g, ' ').trim();

    if (!normalized) {
      return 'No content yet.';
    }

    return normalized.length > 130
      ? `${normalized.slice(0, 127)}...`
      : normalized;
  }

  get derivedMetaText(): string {
    const fallback = 'just now';
    const meta = this.metaText?.trim();
    return meta?.length ? meta : fallback;
  }

  get derivedTrashLocation(): string {
    const fallback = 'Unknown notebook';
    const value = this.trashLocation?.trim();
    return value?.length ? value : fallback;
  }

  get derivedTrashDeletedAt(): string {
    const fallback = 'Unknown time';
    const value = this.trashDeletedAt?.trim();
    return value?.length ? value : fallback;
  }
}
