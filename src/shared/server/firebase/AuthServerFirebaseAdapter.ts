import { AuthDTO } from '@/shared/interface/auth/auth.dto';
import { AuthServer } from '@/shared/interface/auth/authServer';
import { getAuth, createUserWithEmailAndPassword, User } from 'firebase/auth';

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
}

export { AuthServiceFirebaseAdapter };
