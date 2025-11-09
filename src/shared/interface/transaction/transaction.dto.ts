export enum PaymentType {
  CREDIT = 'Crédito',
  DEBIT = 'Débito',
  IN_CASH = 'Avista',
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
}

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
  updatedAt: Date;
  createdAt: Date;
}
