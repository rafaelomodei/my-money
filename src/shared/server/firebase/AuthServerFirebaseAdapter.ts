import { AuthDTO } from '@/shared/interface/auth/auth.dto';
import { AuthServer } from '@/shared/interface/auth/authServer';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';

class AuthServiceFirebaseAdapter implements AuthServer {
  private readonly auth;

  constructor() {
    this.auth = getAuth();
  }

  async create(authData: AuthDTO): Promise<User | undefined> {
    const { email, password } = authData;

    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    if (!userCredential) return;

    const user = userCredential.user;
    console.log('User created', JSON.stringify(user));

    return user;
  }

  async signIn(authData: AuthDTO): Promise<User | undefined> {
    const { email, password } = authData;

    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    if (!userCredential) return;

    const user = userCredential.user;
    console.log('User logged in', JSON.stringify(user));

    return user;
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }
}

export { AuthServiceFirebaseAdapter };
