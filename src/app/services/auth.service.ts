import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, addDoc } from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// WARNING: This is an insecure authentication implementation for POC purposes only.
// Do NOT use this in a production environment.

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<any | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor(private firestore: Firestore) { }

  register({ email, password }: any): Observable<any> {
    // In a real app, you would hash the password before saving it.
    const usersCollection = collection(this.firestore, 'users');
    return from(addDoc(usersCollection, { email, password }));
  }

  login({ email, password }: any): Observable<any> {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('email', '==', email), where('password', '==', password));
    
    return from(getDocs(q)).pipe(
      map(querySnapshot => {
        if (querySnapshot.empty) {
          throw new Error('Invalid login credentials');
        }
        const userDoc = querySnapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() };
        this.currentUser.next(user);
        return user;
      })
    );
  }

  logout() {
    this.currentUser.next(null);
  }

  isLoggedIn() {
    return !!this.currentUser.value;
  }
}
