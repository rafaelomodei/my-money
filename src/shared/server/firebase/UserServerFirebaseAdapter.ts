import { appFirebase } from './config';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { UserDTO } from '@/shared/interface/user/user.dto';
import { UserServer } from '@/shared/interface/user/userServer';

export class UserServerFirebaseAdapter implements UserServer {
  private readonly db;

  private readonly collectionPath: string;

  private readonly collection;

  constructor() {
    this.db = getFirestore(appFirebase);
    this.collectionPath = 'users';
    this.collection = collection(this.db, this.collectionPath);
  }

  async create(userData: UserDTO): Promise<UserDTO> {
    const createdAt = new Date();
    const userDocRef = doc(this.collection, userData.id); // Referência com o ID fornecido

    await setDoc(userDocRef, {
      ...userData,
      createdAt,
      updatedAt: createdAt,
    });

    return {
      ...userData,
      createdAt,
      updatedAt: createdAt,
    };
  }

  async getByID(id: string): Promise<UserDTO | undefined> {
    const docRef = doc(this.collection, id);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        name: data.name,
        lastName: data.lasName,
        updatedAt: (data.updatedAt as Timestamp).toDate(),
        createdAt: (data.createdAt as Timestamp).toDate(),
      };
    }

    return undefined;
  }

  async update(newUserData: UserDTO): Promise<UserDTO> {
    const updatedAt = new Date();
    const docRef = doc(this.collection, newUserData.id);
    await updateDoc(docRef, {
      ...newUserData,
      updatedAt,
    });

    return {
      ...newUserData,
      updatedAt,
    };
  }
}
