import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const authGuard = () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  if (store.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};