import { AuthDTO } from '../auth/auth.dto';
import { UserDTO } from './user.dto';

export interface UserCoordinatorDTO extends Omit<UserDTO, 'id'>, AuthDTO {}
