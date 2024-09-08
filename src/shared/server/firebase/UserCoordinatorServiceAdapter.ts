import { AuthServer } from '@/shared/interface/auth/authServer';
import { UserServer } from '@/shared/interface/user/userServer';
import { UserDTO } from '@/shared/interface/user/user.dto';
import { UserCoordinatorDTO } from '@/shared/interface/user/userCoordinator.dto';
import { UserCoordinatorServe } from '@/shared/interface/user/UserCoordinatorServer';
import { User } from 'firebase/auth';

interface IUserCoordinator {
  authService: AuthServer;
  userService: UserServer;
}

class UserCoordinatorServerFirebaseAdapter implements UserCoordinatorServe {
  private readonly authService: AuthServer;
  private readonly userService: UserServer;

  constructor({ authService, userService }: IUserCoordinator) {
    this.authService = authService;
    this.userService = userService;
  }

  async createUserWithAuth(
    authData: UserCoordinatorDTO
  ): Promise<User | undefined> {
    const { email, password, name, lastName } = authData;
    // Cria o usuário no sistema de autenticação
    const user = await this.authService.create({ email, password });

    if (!user) throw new Error('Failed to create user');

    // Cria o usuário no Firestore
    const userDTO: UserDTO = {
      id: user.uid,
      name,
      lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const a = await this.userService.create(userDTO);

    const b = {
      ...user,
      ...a,
    };
    
    return b;
  }
}

export { UserCoordinatorServerFirebaseAdapter };
