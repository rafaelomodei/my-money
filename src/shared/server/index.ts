import {
  TransactionServerFirebaseAdapter,
  SummaryServerFirebaseAdapter,
  MemberServerFirebaseAdapter,
} from './firebase';
import { TransactionServer } from '../interface/transaction/transactionServer';
import { AuthServiceFirebaseAdapter } from './firebase/AuthServerFirebaseAdapter';
import { AuthServer } from '../interface/auth/authServer';
import { UserServer } from '../interface/user/userServer';
import { UserServerFirebaseAdapter } from './firebase/UserServerFirebaseAdapter';
import { UserCoordinatorServe } from '../interface/user/UserCoordinatorServer';
import { UserCoordinatorServerFirebaseAdapter } from './firebase/UserCoordinatorServiceAdapter';
import { SummaryServer } from '../interface/summary/summaryServer';
import {
  DefaultSummaryCalculator,
  MonthlySummarySynchronizer,
} from '../services/summary';

import { MemberServer } from '../interface/member/memberServer';

const transactionServer: TransactionServer =
  new TransactionServerFirebaseAdapter();
const summaryServer: SummaryServer = new SummaryServerFirebaseAdapter();
const memberServer: MemberServer = new MemberServerFirebaseAdapter();
const summaryCalculator = new DefaultSummaryCalculator();
const monthlySummarySynchronizer = new MonthlySummarySynchronizer({
  transactionServer,
  summaryServer,
  summaryCalculator,
});

const userService: UserServer = new UserServerFirebaseAdapter();
const authService: AuthServer = new AuthServiceFirebaseAdapter();
const userCoordinator: UserCoordinatorServe =
  new UserCoordinatorServerFirebaseAdapter({ authService, userService });

export {
  transactionServer,
  memberServer,
  authService,
  userService,
  userCoordinator,
  summaryServer,
  monthlySummarySynchronizer,
};
