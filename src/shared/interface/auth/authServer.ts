import { User } from 'firebase/auth';
import { AuthDTO } from './auth.dto';

export interface AuthServer {
  create(userData: AuthDTO): Promise<User | undefined>;
}
