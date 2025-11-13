export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  photoUrl?: string;
  isFavorite?: boolean;
  notebookId?: string | null;
  isDeleted?: boolean;
  deletedAt?: Date | string | null;
}
