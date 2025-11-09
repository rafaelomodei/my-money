import { User } from 'firebase/auth';
import { AuthDTO } from './auth.dto';

export interface AuthServer {
  create(userData: AuthDTO): Promise<User | undefined>;
  signIn(userData: AuthDTO): Promise<User | undefined>;
  resetPassword(email: string): Promise<void>;
}
