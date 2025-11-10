export enum PaymentType {
  CREDIT = 'Crédito',
  DEBIT = 'Débito',
  CASH = 'Dinheiro',
  PIX = 'Pix',
}

export const PAYMENT_TYPES = Object.values(PaymentType);

export enum IncomeCategory {
  SALARY = 'Salário',
  SERVICES = 'Serviços',
  INVESTMENTS = 'Investimentos',
  FREELANCE = 'Freelance',
  BONUS = 'Bônus',
  OTHERS = 'Outros',
}

export const INCOME_CATEGORIES = Object.values(IncomeCategory);

export enum PaymentStatus {
  PAID = 'Pago',
  PENDING = 'Pendente',
  CANCELED = 'Cancelado',
}

export const PAYMENT_STATUSES = Object.values(PaymentStatus);

export enum Bank {
  SANTANDER = 'Santander',
  BANCO_DO_BRASIL = 'Banco do Brasil',
  ITAU = 'Itaú',
  BRADESCO = 'Bradesco',
  NUBANK = 'Nubank',
  PIC_PAY = 'PicPay',
  C6 = 'C6 Bank',
  INTER = 'Banco Inter',
  CAIXA = 'Caixa Econômica Federal',
}

export const BANKS = Object.values(Bank);

export enum TransactionOrigin {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export const TRANSACTION_ORIGINS = Object.values(TransactionOrigin);

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
  WELLNESS = 'Bem-estar',
  CHILDCARE = 'Cuidados com crianças',
  OTHERS = 'Outros',
}

export const EXPENSE_CATEGORIES = Object.values(ExpenseCategory);
