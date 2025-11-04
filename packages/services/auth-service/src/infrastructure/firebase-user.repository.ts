import { firestore } from '../../../../shared/src/lib/functions/connectToFirebase';
import { IUser } from '../domain';
import { IUserRepository } from '../repository';

export class FirebaseUserRepository implements IUserRepository {
  private readonly usersCollection = firestore.collection('users');

  async findByEmail(email: string): Promise<IUser | null> {
    const snapshot = await this.usersCollection
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const userDoc = snapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as IUser;
  }

  async save(user: IUser): Promise<IUser> {
    const docRef = await this.usersCollection.add(user);
    return { id: docRef.id, ...user };
  }
}
