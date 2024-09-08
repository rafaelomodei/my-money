import { User } from 'firebase/auth';
import { UserCoordinatorDTO } from './userCoordinator.dto';

export interface UserCoordinatorServe {
  createUserWithAuth(authData: UserCoordinatorDTO): Promise<User | undefined>;
}
