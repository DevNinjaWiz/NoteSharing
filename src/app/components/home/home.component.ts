import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthStore, NotesStore, Note } from '../../store';
import { Router, RouterModule } from '@angular/router'; // Import Router

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class HomeComponent implements OnInit {
  readonly store = inject(AuthStore);
  private router = inject(Router); // Inject Router
  readonly notesStore = inject(NotesStore);
  private readonly fb = inject(FormBuilder);

  readonly noteForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
  });

  editingNoteId: string | null = null;

  ngOnInit(): void {
    this.refreshNotes();
  }

  refreshNotes(): void {
    this.notesStore.loadNotes();
  }

  submitNote(): void {
    if (this.noteForm.invalid) {
      this.noteForm.markAllAsTouched();
      return;
    }

    const payload = this.noteForm.getRawValue();

    if (this.editingNoteId) {
      this.notesStore.updateNote(this.editingNoteId, payload);
    } else {
      this.notesStore.addNote(payload);
    }

    this.resetForm();
  }

  startEdit(note: Note): void {
    this.editingNoteId = note.id;
    this.noteForm.setValue({
      title: note.title,
      content: note.content,
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteNote(noteId: string): void {
    this.notesStore.deleteNote(noteId);
  }

  trackByNoteId(_: number, note: Note): string {
    return note.id;
  }

  logout() {
    this.store.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']); // Navigate on success
      },
      error: (err) => {
        console.error(err); // Handle error
      },
    });
  }

  private resetForm(): void {
    this.noteForm.reset({
      title: '',
      content: '',
    });
    this.editingNoteId = null;
  }
}
