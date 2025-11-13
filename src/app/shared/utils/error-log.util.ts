import { EMPTY, catchError } from 'rxjs';

export const errorLog = (message: string) =>
  catchError((error) => {
    console.error(message, error);
    return EMPTY;
  });
 