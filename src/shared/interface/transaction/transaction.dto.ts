export enum PaymentType {
  CREDIT = 'Crédito',
  DEBIT = 'Débito',
  IN_CASH = 'Avista',
}

export enum IncomeType {
  SALARY = 'Salário',
  SERVICES = 'Serviços',
  INVESTMENTS = 'Investimentos',
  OTHERS = 'Outros',
}

export enum PaymentStatus {
  PAID = 'Pago',
  PENDING = 'Pendente',
  CANCELED = 'Cancelado',
}

export enum Bank {
  SANTANDER = 'Santander',
  BANCO_DO_BRASIL = 'Banco do Brasil',
  ITAU = 'Itaú',
  BRADESCO = 'Bradesco',
  NUBANK = 'Nubank',
  PIC_PAY = 'Pyc Pay',
}

export enum PaymentMethod {
  CARD = 'Cartão',
  CASH = 'Dinheiro',
  TRANSFERENCE = 'Transferência',
  PIX = 'Pix',
}

export enum TransactionCategory {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export const TRANSACTION_CATEGORY_LABEL: Record<TransactionCategory, string> = {
  [TransactionCategory.EXPENSE]: 'Despesa',
  [TransactionCategory.INCOME]: 'Receita',
};

export interface TransactionDTO {
  id: string;
  userId: string;
  label: string;
  type: string;
  paymentStatus: string;
  method: string;
  bank: string;
  value: number;
  paymentDate: Date;
  category: TransactionCategory;
  updatedAt: Date;
  createdAt: Date;
}
