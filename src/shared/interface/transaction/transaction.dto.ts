export enum PaymentType {
  CREDIT = 'Crédito',
  DEBIT = 'Débito',
  CASH = 'Dinheiro',
  PIX = 'Pix',
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

export enum TransactionOrigin {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export const TRANSACTION_ORIGIN_LABEL: Record<TransactionOrigin, string> = {
  [TransactionOrigin.EXPENSE]: 'Despesa',
  [TransactionOrigin.INCOME]: 'Receita',
};

export enum ExpenseCategory {
  HOUSING = 'Casa',
  TRANSPORTATION = 'Transporte',
  CAR = 'Carro',
  GROCERIES = 'Supermercado',
  DINING = 'Alimentação fora de casa',
  PERSONAL = 'Despesas pessoais',
  CLOTHING = 'Vestuário',
  HEALTH = 'Saúde',
  EDUCATION = 'Educação e cursos',
  INVESTMENTS = 'Investimentos',
  ENTERTAINMENT = 'Lazer e entretenimento',
  TRAVEL = 'Viagem',
  SUBSCRIPTIONS = 'Assinaturas e serviços',
  GIFTS = 'Presentes e doações',
  PETS = 'Cuidados com pets',
  HOME_SERVICES = 'Serviços domésticos',
  MAINTENANCE = 'Manutenção e reparos',
  TAXES = 'Impostos e taxas',
  TECHNOLOGY = 'Tecnologia',
  INSURANCE = 'Seguros',
  OTHERS = 'Outros',
}

export const EXPENSE_CATEGORIES = Object.values(ExpenseCategory);

export interface TransactionDTO {
  id: string;
  userId: string;
  label: string;
  type: string;
  paymentStatus: string;
  bank: string;
  value: number;
  paymentDate: Date;
  origin: TransactionOrigin;
  category: ExpenseCategory | null;
  updatedAt: Date;
  createdAt: Date;
}
