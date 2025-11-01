export interface INote {
  id?: string;
  ownerId: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}