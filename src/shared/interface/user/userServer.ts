import { UserDTO } from "./user.dto";

export interface UserServer {
  create(userData: Omit<UserDTO, 'id'>): Promise<UserDTO>;
  getByID(id: string): Promise<UserDTO | undefined>;
  update(userData: UserDTO): Promise<UserDTO>;
}
