'use client';

import { useMemo, useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { addMonths, format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';

import { useCurrentUser } from '@/hooks/use-current-user';
import {
  memberServer,
  monthlySummarySynchronizer,
  transactionServer,
} from '@/shared/server';
import { TransactionDTO } from '@/shared/interface/transaction/transaction.dto';
import { MemberDTO } from '@/shared/interface/member/member.dto';
import {
  Bank,
  BANKS,
  ExpenseCategory,
  EXPENSE_CATEGORIES,
  IncomeCategory,
  INCOME_CATEGORIES,
  PaymentStatus,
  PAYMENT_STATUSES,
  PaymentType,
  PAYMENT_TYPES,
  TransactionOrigin,
  TRANSACTION_ORIGIN_LABEL,
} from '@/shared/constants/finance';
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

enum TransactionStep {
  DETAILS,
  MEMBER,
  PAYMENT,
}

const STEP_SEQUENCE: Array<{ key: TransactionStep; title: string }> = [
  { key: TransactionStep.DETAILS, title: 'Detalhes' },
  { key: TransactionStep.MEMBER, title: 'Membro' },
  { key: TransactionStep.PAYMENT, title: 'Pagamento' },
];

type ExpenseFormState = {
  label: string;
  description: string;
  category: ExpenseCategory | '';
  paymentMethod: PaymentType | '';
  paymentStatus: PaymentStatus;
  bank: Bank | '';
  value: string;
  paymentDate: Date | null;
  installmentsEnabled: boolean;
  installmentCount: number;
  includeCurrentMonth: boolean;
};

type IncomeFormState = {
  label: string;
  description: string;
  incomeCategory: IncomeCategory | '';
  paymentStatus: PaymentStatus;
  bank: Bank | '';
  value: string;
  paymentDate: Date | null;
};

type ExpenseFieldKey = keyof ExpenseFormState;
type IncomeFieldKey = keyof IncomeFormState;

type SelectedMemberState = {
  memberId: string;
  memberName: string;
};

interface StepIndicatorProps {
  currentStep: TransactionStep;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className='grid gap-4 sm:grid-cols-3'>
      {STEP_SEQUENCE.map((step, index) => {
        const isActive = currentStep === step.key;
        const isCompleted = currentStep > step.key;

        return (
          <div key={step.key} className='flex items-center gap-3'>
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium',
                isCompleted
                  ? 'border-primary bg-primary text-primary-foreground'
                  : isActive
                  ? 'border-primary text-primary'
                  : 'border-muted text-muted-foreground'
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                'text-sm font-medium',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

interface DetailsStepProps {
  origin: TransactionOrigin;
  onOriginChange: (origin: TransactionOrigin) => void;
  expenseData: ExpenseFormState;
  incomeData: IncomeFormState;
  onExpenseFieldChange: (
    field: ExpenseFieldKey,
    value: ExpenseFormState[ExpenseFieldKey]
  ) => void;
  onIncomeFieldChange: (
    field: IncomeFieldKey,
    value: IncomeFormState[IncomeFieldKey]
  ) => void;
  disabled: boolean;
}

const DetailsStep = ({
  origin,
  onOriginChange,
  expenseData,
  incomeData,
  onExpenseFieldChange,
  onIncomeFieldChange,
  disabled,
}: DetailsStepProps) => {
  const handleLabelChange = (value: string) => {
    if (origin === TransactionOrigin.EXPENSE) {
      onExpenseFieldChange('label', value);
    } else {
      onIncomeFieldChange('label', value);
    }
  };

  const handleDescriptionChange = (value: string) => {
    if (origin === TransactionOrigin.EXPENSE) {
      onExpenseFieldChange('description', value);
    } else {
      onIncomeFieldChange('description', value);
    }
  };

  return (
    <div className='grid gap-4'>
      <div>
        <Label>Tipo de transação</Label>
        <div className='mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2'>
          <Button
            type='button'
            variant={
              origin === TransactionOrigin.EXPENSE ? 'default' : 'outline'
            }
            onClick={() => onOriginChange(TransactionOrigin.EXPENSE)}
            disabled={disabled}
          >
            {TRANSACTION_ORIGIN_LABEL[TransactionOrigin.EXPENSE]}
          </Button>
          <Button
            type='button'
            variant={
              origin === TransactionOrigin.INCOME ? 'default' : 'outline'
            }
            onClick={() => onOriginChange(TransactionOrigin.INCOME)}
            disabled={disabled}
          >
            {TRANSACTION_ORIGIN_LABEL[TransactionOrigin.INCOME]}
          </Button>
        </div>
      </div>

      <div>
        <Label>Nome</Label>
        <Input
          type='text'
          value={
            origin === TransactionOrigin.EXPENSE
              ? expenseData.label
              : incomeData.label
          }
          onChange={(event) => handleLabelChange(event.target.value)}
          disabled={disabled}
          required
        />
      </div>

      <div>
        <Label>Descrição</Label>
        <Textarea
          value={
            origin === TransactionOrigin.EXPENSE
              ? expenseData.description
              : incomeData.description
          }
          onChange={(event) => handleDescriptionChange(event.target.value)}
          disabled={disabled}
        />
      </div>

      {origin === TransactionOrigin.EXPENSE ? (
        <div>
          <Label>Categoria</Label>
          <Select
            value={expenseData.category || undefined}
            onValueChange={(value) =>
              onExpenseFieldChange('category', value as ExpenseCategory)
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione a categoria' />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div>
          <Label>Categoria da receita</Label>
          <Select
            value={incomeData.incomeCategory || undefined}
            onValueChange={(value) =>
              onIncomeFieldChange('incomeCategory', value as IncomeCategory)
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione a categoria' />
            </SelectTrigger>
            <SelectContent>
              {INCOME_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

interface MemberStepProps {
  members: MemberDTO[];
  selectedMember: SelectedMemberState | null;
  onMemberChange: (memberId: string) => void;
  onAddMemberClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

const MemberStep = ({
  members,
  selectedMember,
  onMemberChange,
  onAddMemberClick,
  disabled,
  isLoading,
}: MemberStepProps) => {
  return (
    <div className='grid gap-4'>
      <div className='space-y-2'>
        <Label>Membro responsável</Label>
        <Select
          value={selectedMember?.memberId || undefined}
          onValueChange={onMemberChange}
          disabled={disabled || isLoading || members.length === 0}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                isLoading
                  ? 'Carregando membros...'
                  : members.length === 0
                  ? 'Nenhum membro cadastrado'
                  : 'Selecione um membro'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {members.length === 0 && !isLoading ? (
          <p className='text-sm text-muted-foreground'>
            Cadastre um novo membro para associar à transação.
          </p>
        ) : null}
      </div>

      <div>
        <Button
          type='button'
          variant='outline'
          onClick={onAddMemberClick}
          disabled={disabled}
        >
          <Plus className='mr-2 h-4 w-4' /> Adicionar novo membro
        </Button>
      </div>
    </div>
  );
};

interface PaymentStepProps {
  origin: TransactionOrigin;
  expenseData: ExpenseFormState;
  incomeData: IncomeFormState;
  onExpenseFieldChange: (
    field: ExpenseFieldKey,
    value: ExpenseFormState[ExpenseFieldKey]
  ) => void;
  onIncomeFieldChange: (
    field: IncomeFieldKey,
    value: IncomeFormState[IncomeFieldKey]
  ) => void;
  disabled: boolean;
}

const PaymentStep = ({
  origin,
  expenseData,
  incomeData,
  onExpenseFieldChange,
  onIncomeFieldChange,
  disabled,
}: PaymentStepProps) => {
  const paymentDate =
    origin === TransactionOrigin.EXPENSE
      ? expenseData.paymentDate
      : incomeData.paymentDate;

  const handleValueChange = (value: string) => {
    if (origin === TransactionOrigin.EXPENSE) {
      onExpenseFieldChange('value', value);
    } else {
      onIncomeFieldChange('value', value);
    }
  };

  const handleBankChange = (value: Bank) => {
    if (origin === TransactionOrigin.EXPENSE) {
      onExpenseFieldChange('bank', value);
    } else {
      onIncomeFieldChange('bank', value);
    }
  };

  const handleStatusChange = (value: PaymentStatus) => {
    if (origin === TransactionOrigin.EXPENSE) {
      onExpenseFieldChange('paymentStatus', value);
    } else {
      onIncomeFieldChange('paymentStatus', value);
    }
  };

  const handlePaymentDateChange = (date: Date | null) => {
    if (origin === TransactionOrigin.EXPENSE) {
      onExpenseFieldChange('paymentDate', date);
    } else {
      onIncomeFieldChange('paymentDate', date);
    }
  };

  return (
    <div className='grid gap-4'>
      {origin === TransactionOrigin.EXPENSE ? (
        <div>
          <Label>Método de pagamento</Label>
          <Select
            value={expenseData.paymentMethod || undefined}
            onValueChange={(value) =>
              onExpenseFieldChange(
                'paymentMethod',
                value as ExpenseFormState['paymentMethod']
              )
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione o método de pagamento' />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div>
        <Label>Status do pagamento</Label>
        <Select
          value={
            origin === TransactionOrigin.EXPENSE
              ? expenseData.paymentStatus
              : incomeData.paymentStatus
          }
          onValueChange={(value) =>
            handleStatusChange(value as PaymentStatus)
          }
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder='Selecione o status' />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>{origin === TransactionOrigin.EXPENSE ? 'Conta' : 'Conta de recebimento'}</Label>
        <Select
          value={
            origin === TransactionOrigin.EXPENSE
              ? expenseData.bank || undefined
              : incomeData.bank || undefined
          }
          onValueChange={(value) => handleBankChange(value as Bank)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder='Selecione a conta' />
          </SelectTrigger>
          <SelectContent>
            {BANKS.map((bank) => (
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
          value={
            origin === TransactionOrigin.EXPENSE
              ? expenseData.value
              : incomeData.value
          }
          onChange={(event) => handleValueChange(event.target.value)}
          disabled={disabled}
          required
        />
      </div>

      <div className='space-y-2'>
        <Label>
          {origin === TransactionOrigin.EXPENSE
            ? 'Data da compra'
            : 'Data do recebimento'}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type='button'
              variant='outline'
              className={cn(
                'w-full justify-start text-left font-normal',
                !paymentDate && 'text-muted-foreground'
              )}
              disabled={disabled}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {paymentDate
                ? format(paymentDate, 'dd/MM/yyyy')
                : 'Selecione uma data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={paymentDate ?? undefined}
              onSelect={(date) => handlePaymentDateChange(date ?? null)}
              initialFocus
              captionLayout='dropdown-buttons'
              fromYear={2000}
              toYear={2100}
            />
          </PopoverContent>
        </Popover>
      </div>

      {origin === TransactionOrigin.EXPENSE ? (
        <div className='space-y-2 rounded-md border p-4'>
          <div className='flex items-start gap-2'>
            <Checkbox
              id='installments'
              checked={expenseData.installmentsEnabled}
              onCheckedChange={(checked) =>
                onExpenseFieldChange('installmentsEnabled', checked === true)
              }
              disabled={disabled}
            />
            <div className='space-y-1'>
              <Label htmlFor='installments'>Pagamento parcelado</Label>
              <p className='text-sm text-muted-foreground'>
                Cadastre a quantidade de parcelas e escolha se a primeira deve
                ser considerada no mês atual.
              </p>
            </div>
          </div>

          {expenseData.installmentsEnabled ? (
            <div className='grid gap-4 pt-4 sm:grid-cols-2'>
              <div>
                <Label>Quantidade de parcelas</Label>
                <Input
                  type='number'
                  min='2'
                  step='1'
                  value={expenseData.installmentCount}
                  onChange={(event) =>
                    onExpenseFieldChange(
                      'installmentCount',
                      Number.parseInt(event.target.value, 10) || 2
                    )
                  }
                  disabled={disabled}
                />
              </div>
              <div className='flex items-center gap-2 pt-6 sm:pt-8'>
                <Checkbox
                  id='include-current-month'
                  checked={expenseData.includeCurrentMonth}
                  onCheckedChange={(checked) =>
                    onExpenseFieldChange(
                      'includeCurrentMonth',
                      checked !== false
                    )
                  }
                  disabled={disabled}
                />
                <Label htmlFor='include-current-month' className='text-sm'>
                  Considerar parcela no mês atual
                </Label>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

type CreateTransactionPayload = {
  transactions: Array<
    Omit<TransactionDTO, 'id' | 'updatedAt' | 'createdAt'>
  >;
};

const NewTransactionPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const userId = user?.uid ?? null;

  const [currentStep, setCurrentStep] = useState<TransactionStep>(
    TransactionStep.DETAILS
  );
  const [transactionOrigin, setTransactionOrigin] =
    useState<TransactionOrigin>(TransactionOrigin.EXPENSE);
  const [expenseFormData, setExpenseFormData] = useState<ExpenseFormState>({
    label: '',
    description: '',
    category: '' as ExpenseFormState['category'],
    paymentMethod: '' as ExpenseFormState['paymentMethod'],
    paymentStatus: PaymentStatus.PENDING,
    bank: '' as ExpenseFormState['bank'],
    value: '',
    paymentDate: null,
    installmentsEnabled: false,
    installmentCount: 2,
    includeCurrentMonth: true,
  });
  const [incomeFormData, setIncomeFormData] = useState<IncomeFormState>({
    label: '',
    description: '',
    incomeCategory: '' as IncomeFormState['incomeCategory'],
    paymentStatus: PaymentStatus.PENDING,
    bank: '' as IncomeFormState['bank'],
    value: '',
    paymentDate: null,
  });
  const [selectedMember, setSelectedMember] =
    useState<SelectedMemberState | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  const {
    data: members = [],
    isLoading: isMembersLoading,
  } = useQuery({
    queryKey: ['members', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      return memberServer.listByUser(userId as string);
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: async (memberName: string) => {
      if (!userId) {
        throw new Error('Usuário não autenticado.');
      }

      return memberServer.create({
        name: memberName,
        userId,
      });
    },
    onSuccess: (createdMember) => {
      queryClient.setQueryData<MemberDTO[] | undefined>(
        ['members', userId],
        (previousMembers) => {
          if (!previousMembers) {
            return [createdMember];
          }

          return [...previousMembers, createdMember];
        }
      );
      setSelectedMember({
        memberId: createdMember.id,
        memberName: createdMember.name,
      });
      setIsAddMemberDialogOpen(false);
      setNewMemberName('');
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ transactions }: CreateTransactionPayload) => {
      if (transactions.length === 0) {
        throw new Error('Nenhuma transação para registrar.');
      }

      const createdTransactions: TransactionDTO[] = [];
      const periodsToSync = new Map<string, {
        userId: string;
        year: number;
        month: number;
      }>();

      for (const transaction of transactions) {
        const createdTransaction = await transactionServer.create(transaction);
        createdTransactions.push(createdTransaction);

        const year = createdTransaction.paymentDate.getFullYear();
        const month = createdTransaction.paymentDate.getMonth() + 1;
        const key = `${createdTransaction.userId}-${year}-${month}`;

        if (!periodsToSync.has(key)) {
          periodsToSync.set(key, {
            userId: createdTransaction.userId,
            year,
            month,
          });
        }
      }

      await Promise.all(
        Array.from(periodsToSync.values()).map((period) =>
          monthlySummarySynchronizer.sync(period)
        )
      );

      return createdTransactions;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
      router.push('/inicio');
    },
  });

  const handleExpenseFieldChange: DetailsStepProps['onExpenseFieldChange'] = (
    field,
    value
  ) => {
    setExpenseFormData((previousState) => ({
      ...previousState,
      [field]: value,
    }));
  };

  const handleIncomeFieldChange: DetailsStepProps['onIncomeFieldChange'] = (
    field,
    value
  ) => {
    setIncomeFormData((previousState) => ({
      ...previousState,
      [field]: value,
    }));
  };

  const handleMemberChange = (memberId: string) => {
    const member = members.find((item) => item.id === memberId);
    if (member) {
      setSelectedMember({ memberId: member.id, memberName: member.name });
    } else {
      setSelectedMember(null);
    }
  };

  const isExpense = transactionOrigin === TransactionOrigin.EXPENSE;

  const isExpenseDetailsValid = useMemo(() => {
    return (
      Boolean(expenseFormData.label.trim()) &&
      Boolean(expenseFormData.category)
    );
  }, [expenseFormData]);

  const isIncomeDetailsValid = useMemo(() => {
    return (
      Boolean(incomeFormData.label.trim()) &&
      Boolean(incomeFormData.incomeCategory)
    );
  }, [incomeFormData]);

  const isDetailsStepValid = isExpense
    ? isExpenseDetailsValid
    : isIncomeDetailsValid;

  const isMemberStepValid = Boolean(selectedMember?.memberId);

  const isExpensePaymentValid = useMemo(() => {
    const parsedValue = Number.parseFloat(expenseFormData.value);
    const hasValidInstallments = !expenseFormData.installmentsEnabled
      ? true
      : expenseFormData.installmentCount >= 2;

    return (
      Boolean(expenseFormData.paymentMethod) &&
      Boolean(expenseFormData.bank) &&
      Boolean(expenseFormData.paymentDate) &&
      !Number.isNaN(parsedValue) &&
      parsedValue > 0 &&
      hasValidInstallments
    );
  }, [expenseFormData]);

  const isIncomePaymentValid = useMemo(() => {
    const parsedValue = Number.parseFloat(incomeFormData.value);

    return (
      Boolean(incomeFormData.bank) &&
      Boolean(incomeFormData.paymentDate) &&
      !Number.isNaN(parsedValue) &&
      parsedValue > 0
    );
  }, [incomeFormData]);

  const isPaymentStepValid = isExpense
    ? isExpensePaymentValid
    : isIncomePaymentValid;

  const isCurrentStepValid =
    currentStep === TransactionStep.DETAILS
      ? isDetailsStepValid
      : currentStep === TransactionStep.MEMBER
      ? isMemberStepValid
      : isPaymentStepValid;

  const isFormDisabled = isUserLoading || mutation.isPending;

  const handleOriginChange = (origin: TransactionOrigin) => {
    setTransactionOrigin(origin);
    setCurrentStep(TransactionStep.DETAILS);
  };

  const handleAddMemberDialogChange = (isOpen: boolean) => {
    setIsAddMemberDialogOpen(isOpen);
    if (!isOpen) {
      setNewMemberName('');
    }
  };

  const handleMemberSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = newMemberName.trim();

    if (!trimmedName) {
      return;
    }

    addMemberMutation.mutate(trimmedName);
  };

  const handleFinalSubmit = () => {
    if (!userId) {
      alert('Usuário não autenticado. Faça login para registrar uma transação.');
      return;
    }

    if (!isPaymentStepValid || !selectedMember) {
      return;
    }

    const selectedFormData = isExpense ? expenseFormData : incomeFormData;
    const parsedValue = Number.parseFloat(selectedFormData.value);

    if (Number.isNaN(parsedValue) || parsedValue <= 0) {
      alert('Informe um valor válido.');
      return;
    }

    if (!selectedFormData.paymentDate) {
      return;
    }

    if (isExpense && !expenseFormData.paymentMethod) {
      return;
    }

    if (!selectedFormData.bank) {
      return;
    }

    const baseTransaction: Omit<
      TransactionDTO,
      'id' | 'updatedAt' | 'createdAt'
    > = {
      label: selectedFormData.label.trim(),
      description:
        selectedFormData.description.trim().length > 0
          ? selectedFormData.description.trim()
          : null,
      type: isExpense
        ? expenseFormData.paymentMethod
        : incomeFormData.incomeCategory,
      paymentStatus: selectedFormData.paymentStatus,
      bank: selectedFormData.bank,
      value: parsedValue,
      paymentDate: selectedFormData.paymentDate,
      userId,
      origin: transactionOrigin,
      category: isExpense ? expenseFormData.category : null,
      memberId: selectedMember.memberId,
      memberName: selectedMember.memberName,
      installmentCount: 1,
      installmentNumber: 1,
      installmentGroupId: null,
    };

    let transactionsToCreate: CreateTransactionPayload['transactions'] = [];

    if (isExpense && expenseFormData.installmentsEnabled) {
      const totalInstallments = Math.max(
        2,
        Number.parseInt(String(expenseFormData.installmentCount), 10) || 2
      );
      const baseDate = expenseFormData.paymentDate!;
      const startOffset = expenseFormData.includeCurrentMonth ? 0 : 1;
      const groupId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      transactionsToCreate = Array.from(
        { length: totalInstallments },
        (_, index) => {
          const paymentDate = addMonths(baseDate, index + startOffset);

          return {
            ...baseTransaction,
            paymentDate,
            installmentCount: totalInstallments,
            installmentNumber: index + 1,
            installmentGroupId: groupId,
          };
        }
      );
    } else {
      transactionsToCreate = [
        {
          ...baseTransaction,
          paymentDate: selectedFormData.paymentDate,
        },
      ];
    }

    mutation.mutate({ transactions: transactionsToCreate });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isCurrentStepValid) {
      return;
    }

    if (currentStep === TransactionStep.PAYMENT) {
      handleFinalSubmit();
      return;
    }

    setCurrentStep((previousStep) =>
      (previousStep + 1) as TransactionStep
    );
  };

  const handlePreviousStep = () => {
    setCurrentStep((previousStep) =>
      Math.max(previousStep - 1, TransactionStep.DETAILS)
    );
  };

  const actionButtonLabel = () => {
    if (currentStep !== TransactionStep.PAYMENT) {
      return 'Próximo passo';
    }

    if (isUserLoading) {
      return 'Carregando usuário...';
    }

    if (mutation.isPending) {
      return 'Salvando...';
    }

    return 'Salvar Transação';
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-6'>
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <CardTitle>Adicionar Nova Transação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='grid gap-6'>
            <StepIndicator currentStep={currentStep} />

            {currentStep === TransactionStep.DETAILS ? (
              <DetailsStep
                origin={transactionOrigin}
                onOriginChange={handleOriginChange}
                expenseData={expenseFormData}
                incomeData={incomeFormData}
                onExpenseFieldChange={handleExpenseFieldChange}
                onIncomeFieldChange={handleIncomeFieldChange}
                disabled={isFormDisabled}
              />
            ) : null}

            {currentStep === TransactionStep.MEMBER ? (
              <MemberStep
                members={members}
                selectedMember={selectedMember}
                onMemberChange={handleMemberChange}
                onAddMemberClick={() => setIsAddMemberDialogOpen(true)}
                disabled={isFormDisabled}
                isLoading={isMembersLoading}
              />
            ) : null}

            {currentStep === TransactionStep.PAYMENT ? (
              <PaymentStep
                origin={transactionOrigin}
                expenseData={expenseFormData}
                incomeData={incomeFormData}
                onExpenseFieldChange={handleExpenseFieldChange}
                onIncomeFieldChange={handleIncomeFieldChange}
                disabled={isFormDisabled}
              />
            ) : null}

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

              <div className='flex flex-col gap-2 sm:flex-row'>
                {currentStep !== TransactionStep.DETAILS ? (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handlePreviousStep}
                    className='w-full sm:w-auto'
                    disabled={isFormDisabled}
                  >
                    Voltar
                  </Button>
                ) : null}
                <Button
                  type='submit'
                  disabled={
                    (currentStep === TransactionStep.PAYMENT && isFormDisabled) ||
                    !isCurrentStepValid
                  }
                  className='w-full sm:w-auto'
                >
                  {actionButtonLabel()}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isAddMemberDialogOpen} onOpenChange={handleAddMemberDialogChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Novo membro</DialogTitle>
            <DialogDescription>
              Informe o nome do membro que será associado às transações.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMemberSubmit} className='grid gap-4'>
            <div>
              <Label htmlFor='member-name'>Nome do membro</Label>
              <Input
                id='member-name'
                value={newMemberName}
                onChange={(event) => setNewMemberName(event.target.value)}
                placeholder='Ex.: João, Maria, etc.'
                disabled={addMemberMutation.isPending}
                required
              />
            </div>
            <DialogFooter className='flex-col gap-2 sm:flex-row sm:justify-end'>
              <DialogClose asChild>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full sm:w-auto'
                  disabled={addMemberMutation.isPending}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type='submit'
                className='w-full sm:w-auto'
                disabled={
                  addMemberMutation.isPending || newMemberName.trim().length === 0
                }
              >
                {addMemberMutation.isPending ? 'Salvando...' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewTransactionPage;
