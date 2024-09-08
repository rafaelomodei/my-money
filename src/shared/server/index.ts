import { TransactionServerFirebaseAdapter } from './firebase';
import { TransactionServer } from '../interface/transaction/transactionServer';
import { AuthServiceFirebaseAdapter } from './firebase/AuthServerFirebaseAdapter';
import { AuthServer } from '../interface/auth/authServer';
import { UserServer } from '../interface/user/userServer';
import { UserServerFirebaseAdapter } from './firebase/UserServerFirebaseAdapter';
import { UserCoordinatorServe } from '../interface/user/UserCoordinatorServer';
import { UserCoordinatorServerFirebaseAdapter } from './firebase/UserCoordinatorServiceAdapter';

const transactionServer: TransactionServer =
  new TransactionServerFirebaseAdapter();

const userService: UserServer = new UserServerFirebaseAdapter();
const authService: AuthServer = new AuthServiceFirebaseAdapter();
const userCoordinator: UserCoordinatorServe =
  new UserCoordinatorServerFirebaseAdapter({ authService, userService });

export { transactionServer, authService, userService, userCoordinator };
