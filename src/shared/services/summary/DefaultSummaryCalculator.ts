import {
  SummaryTransactionItemDTO,
  SummaryUpsertData,
} from '@/shared/interface/summary/summary.dto';
import { TransactionDTO } from '@/shared/interface/transaction/transaction.dto';
import { PaymentStatus, TransactionOrigin } from '@/shared/constants/finance';
import {
  SummaryCalculationContext,
  SummaryCalculator,
} from './SummaryCalculator';

type DefaultSummaryCalculatorOptions = {
  shouldIncludeTransaction?: (transaction: TransactionDTO) => boolean;
};

export class DefaultSummaryCalculator implements SummaryCalculator {
  private readonly shouldIncludeTransaction: (
    transaction: TransactionDTO
  ) => boolean;

  constructor(options: DefaultSummaryCalculatorOptions = {}) {
    this.shouldIncludeTransaction =
      options.shouldIncludeTransaction ?? (() => true);
  }

  calculate(
    transactions: TransactionDTO[],
    context: SummaryCalculationContext
  ): SummaryUpsertData {
    const incomeTransactions: SummaryTransactionItemDTO[] = [];
    const expenseTransactions: SummaryTransactionItemDTO[] = [];

    let incomeTotal = 0;
    let expenseTotal = 0;

    const sortedTransactions = [...transactions]
      .filter((transaction) => this.shouldIncludeTransaction(transaction))
      .sort(
        (firstTransaction, secondTransaction) =>
          secondTransaction.paymentDate.getTime() -
          firstTransaction.paymentDate.getTime()
      );

    sortedTransactions.forEach((transaction) => {
      const summaryTransaction: SummaryTransactionItemDTO = {
        transactionId: transaction.id,
        label: transaction.label,
        value: transaction.value,
        paymentStatus: (transaction.paymentStatus as PaymentStatus) ?? PaymentStatus.PAID,
        paymentDate: transaction.paymentDate,
      };

      if (transaction.origin === TransactionOrigin.INCOME) {
        incomeTransactions.push(summaryTransaction);
        incomeTotal += transaction.value;
        return;
      }

      expenseTransactions.push(summaryTransaction);
      expenseTotal += transaction.value;
    });

    return {
      userId: context.userId,
      year: context.year,
      month: context.month,
      incomeTotal,
      expenseTotal,
      balance: incomeTotal - expenseTotal,
      incomeTransactions,
      expenseTransactions,
    };
  }
}
