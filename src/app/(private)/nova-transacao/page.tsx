'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { monthlySummarySynchronizer, transactionServer } from '@/shared/server';
import {
  TransactionDTO,
  PaymentType,
  Bank,
  PaymentStatus,
  TransactionCategory,
  IncomeType,
} from '@/shared/interface/transaction/transaction.dto';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Calendar } from '@/shared/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

type ExpenseFormState = {
  label: string;
  type: PaymentType | '';
  paymentStatus: PaymentStatus;
  bank: Bank | '';
  value: string;
  paymentDate: Date | null;
};

type IncomeFormState = {
  label: string;
  type: IncomeType | '';
  paymentStatus: PaymentStatus;
  bank: Bank | '';
  value: string;
  paymentDate: Date | null;
};

type ExpenseFieldKey = keyof ExpenseFormState;
type IncomeFieldKey = keyof IncomeFormState;

interface ExpenseFieldsProps {
  data: ExpenseFormState;
  disabled: boolean;
  onFieldChange: (
    field: ExpenseFieldKey,
    value: ExpenseFormState[ExpenseFieldKey]
  ) => void;
}

const ExpenseFields = ({
  data,
  disabled,
  onFieldChange,
}: ExpenseFieldsProps) => {
  return (
    <div className='grid gap-4'>
      <div>
        <Label>Nome</Label>
        <Input
          type='text'
          value={data.label}
          onChange={(event) => onFieldChange('label', event.target.value)}
          disabled={disabled}
          required
        />
      </div>

      <div>
        <Label>Método de Pagamento</Label>
        <Select
          value={data.type || undefined}
          onValueChange={(value) =>
            onFieldChange('type', value as ExpenseFormState['type'])
          }
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder='Selecione o método de pagamento' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(PaymentType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Status do Pagamento</Label>
        <Select
          value={data.paymentStatus}
          onValueChange={(value) =>
            onFieldChange('paymentStatus', value as PaymentStatus)
          }
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder='Selecione o status' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(PaymentStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Banco</Label>
        <Select
          value={data.bank || undefined}
          onValueChange={(value) => onFieldChange('bank', value as Bank)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder='Selecione o banco' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Bank).map((bank) => (
              <SelectItem key={bank} value={bank}>
                {bank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Valor</Label>
        <Input
          type='number'
          min='0.01'
          step='0.01'
          value={data.value}
          onChange={(event) => onFieldChange('value', event.target.value)}
          disabled={disabled}
          required
        />
      </div>

      <div>
        <Label>Data do Pagamento</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type='button'
              variant={'outline'}
              className={`w-full justify-start text-left font-normal ${
                !data.paymentDate ? 'text-muted-foreground' : ''
              }`}
              disabled={disabled}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {data.paymentDate
                ? format(data.paymentDate, 'dd/MM/yyyy')
                : 'Selecione uma data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={data.paymentDate ?? undefined}
              onSelect={(date) => onFieldChange('paymentDate', date ?? null)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

interface IncomeFieldsProps {
  data: IncomeFormState;
  disabled: boolean;
  onFieldChange: (
    field: IncomeFieldKey,
    value: IncomeFormState[IncomeFieldKey]
  ) => void;
}

const IncomeFields = ({ data, disabled, onFieldChange }: IncomeFieldsProps) => {
  return (
    <div className='grid gap-4'>
      <div>
        <Label>Nome</Label>
        <Input
          type='text'
          value={data.label}
          onChange={(event) => onFieldChange('label', event.target.value)}
          disabled={disabled}
          required
        />
      </div>

      <div>
        <Label>Categoria da Receita</Label>
        <Select
          value={data.type || undefined}
          onValueChange={(value) =>
            onFieldChange('type', value as IncomeFormState['type'])
          }
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder='Selecione a categoria' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(IncomeType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Status do Recebimento</Label>
        <Select
          value={data.paymentStatus}
          onValueChange={(value) =>
            onFieldChange('paymentStatus', value as PaymentStatus)
          }
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder='Selecione o status' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(PaymentStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Conta</Label>
        <Select
          value={data.bank || undefined}
          onValueChange={(value) => onFieldChange('bank', value as Bank)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder='Selecione a conta' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Bank).map((bank) => (
              <SelectItem key={bank} value={bank}>
                {bank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Valor</Label>
        <Input
          type='number'
          min='0.01'
          step='0.01'
          value={data.value}
          onChange={(event) => onFieldChange('value', event.target.value)}
          disabled={disabled}
          required
        />
      </div>

      <div>
        <Label>Data do Recebimento</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type='button'
              variant={'outline'}
              className={`w-full justify-start text-left font-normal ${
                !data.paymentDate ? 'text-muted-foreground' : ''
              }`}
              disabled={disabled}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {data.paymentDate
                ? format(data.paymentDate, 'dd/MM/yyyy')
                : 'Selecione uma data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={data.paymentDate ?? undefined}
              onSelect={(date) => onFieldChange('paymentDate', date ?? null)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

const NewTransactionPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const [transactionCategory, setTransactionCategory] = useState<TransactionCategory>(
    TransactionCategory.EXPENSE
  );
  const [expenseFormData, setExpenseFormData] = useState<ExpenseFormState>({
    label: '',
    type: '' as ExpenseFormState['type'],
    paymentStatus: PaymentStatus.PENDING,
    bank: '' as ExpenseFormState['bank'],
    value: '',
    paymentDate: null,
  });
  const [incomeFormData, setIncomeFormData] = useState<IncomeFormState>({
    label: '',
    type: '' as IncomeFormState['type'],
    paymentStatus: PaymentStatus.PENDING,
    bank: '' as IncomeFormState['bank'],
    value: '',
    paymentDate: null,
  });
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (
      newTransaction: Omit<TransactionDTO, 'id' | 'updatedAt' | 'createdAt'>
    ) => {
      const createdTransaction = await transactionServer.create(newTransaction);

      await monthlySummarySynchronizer.sync({
        userId: createdTransaction.userId,
        year: createdTransaction.paymentDate.getFullYear(),
        month: createdTransaction.paymentDate.getMonth() + 1,
      });

      return createdTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
      router.push('/inicio');
    },
  });

  const handleExpenseFieldChange: ExpenseFieldsProps['onFieldChange'] = (
    field,
    value
  ) => {
    setExpenseFormData((previousState) => ({
      ...previousState,
      [field]: value,
    }));
  };

  const handleIncomeFieldChange: IncomeFieldsProps['onFieldChange'] = (
    field,
    value
  ) => {
    setIncomeFormData((previousState) => ({
      ...previousState,
      [field]: value,
    }));
  };

  const isExpenseFormValid = useMemo(() => {
    const parsedValue = parseFloat(expenseFormData.value);

    return (
      Boolean(expenseFormData.label.trim()) &&
      Boolean(expenseFormData.type) &&
      Boolean(expenseFormData.bank) &&
      Boolean(expenseFormData.paymentDate) &&
      !Number.isNaN(parsedValue) &&
      parsedValue > 0
    );
  }, [expenseFormData]);

  const isIncomeFormValid = useMemo(() => {
    const parsedValue = parseFloat(incomeFormData.value);

    return (
      Boolean(incomeFormData.label.trim()) &&
      Boolean(incomeFormData.type) &&
      Boolean(incomeFormData.bank) &&
      Boolean(incomeFormData.paymentDate) &&
      !Number.isNaN(parsedValue) &&
      parsedValue > 0
    );
  }, [incomeFormData]);

  const isCurrentFormValid =
    transactionCategory === TransactionCategory.EXPENSE
      ? isExpenseFormValid
      : isIncomeFormValid;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      alert('Usuário não autenticado. Faça login para registrar uma transação.');
      return;
    }

    const isExpense = transactionCategory === TransactionCategory.EXPENSE;
    const selectedFormData = isExpense ? expenseFormData : incomeFormData;

    if (!isCurrentFormValid) {
      return;
    }

    const parsedValue = parseFloat(selectedFormData.value);

    if (Number.isNaN(parsedValue)) {
      alert('Informe um valor válido.');
      return;
    }

    if (!selectedFormData.type || !selectedFormData.bank) {
      return;
    }

    if (!selectedFormData.paymentDate) {
      return;
    }

    mutation.mutate({
      label: selectedFormData.label.trim(),
      type: selectedFormData.type,
      paymentStatus: selectedFormData.paymentStatus,
      bank: selectedFormData.bank,
      value: parsedValue,
      paymentDate: selectedFormData.paymentDate,
      userId: user.uid,
      category: transactionCategory,
    });
  };

  const isFormDisabled = isUserLoading || mutation.isPending;

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Card className='w-full max-w-lg'>
        <CardHeader>
          <CardTitle>Adicionar Nova Transação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='grid gap-4'>
            <Tabs
              value={transactionCategory}
              onValueChange={(value) =>
                setTransactionCategory(value as TransactionCategory)
              }
            >
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value={TransactionCategory.EXPENSE}>
                  Despesa
                </TabsTrigger>
                <TabsTrigger value={TransactionCategory.INCOME}>
                  Receita
                </TabsTrigger>
              </TabsList>
              <TabsContent value={TransactionCategory.EXPENSE} className='mt-4'>
                <ExpenseFields
                  data={expenseFormData}
                  disabled={isFormDisabled}
                  onFieldChange={handleExpenseFieldChange}
                />
              </TabsContent>
              <TabsContent value={TransactionCategory.INCOME} className='mt-4'>
                <IncomeFields
                  data={incomeFormData}
                  disabled={isFormDisabled}
                  onFieldChange={handleIncomeFieldChange}
                />
              </TabsContent>
            </Tabs>

            <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
              <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    className='w-full sm:w-auto'
                    disabled={mutation.isPending}
                  >
                    Cancelar
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-md'>
                  <DialogHeader>
                    <DialogTitle>Cancelar cadastro da transação</DialogTitle>
                    <DialogDescription>
                      Tem certeza de que deseja cancelar? As informações preenchidas
                      serão perdidas.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className='flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
                    <DialogClose asChild>
                      <Button variant='outline' className='w-full sm:w-auto'>
                        Continuar editando
                      </Button>
                    </DialogClose>
                    <Button
                      variant='destructive'
                      className='w-full sm:w-auto'
                      onClick={() => {
                        setIsCancelDialogOpen(false);
                        router.push('/inicio');
                      }}
                    >
                      Cancelar transação
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                type='submit'
                disabled={isFormDisabled || !isCurrentFormValid}
                className='w-full sm:w-auto'
              >
                {isUserLoading
                  ? 'Carregando usuário...'
                  : mutation.isPending
                  ? 'Salvando...'
                  : 'Salvar Transação'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTransactionPage;
