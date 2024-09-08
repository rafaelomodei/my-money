enum PaymentType {
  CREDIT = 'Crédito',
  DEBIT = 'Débito',
  IN_CASH = 'Avista',
}

enum Bank {
  SANTANDER = 'Santander',
  BANCO_DO_BRASIL = 'Banco do Brasil',
  ITAU = 'Itaú',
  BRADESCO = 'Bradesco',
  NUBANK = 'Nubank',
  PIC_PAY = 'Pyc Pay',
}

enum PaymentMethod {
  CARD = 'Cartão',
  CASH = 'Dinheiro',
  TRANSFERENCE = 'Transferência',
}

export interface TransactionDTO {
  id: string;
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
