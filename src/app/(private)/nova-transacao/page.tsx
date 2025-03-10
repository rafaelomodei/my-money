'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionServer } from '@/shared/server';
import {
  TransactionDTO,
  PaymentType,
  Bank,
  PaymentMethod,
  PaymentStatus,
} from '@/shared/interface/transaction/transaction.dto';
import { useRouter } from 'next/navigation';

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

const NewTransactionPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    label: '',
    type: '' as PaymentType,
    paymentStatus: PaymentStatus.PENDING,
    method: '' as PaymentMethod,
    bank: '' as Bank,
    value: '',
    paymentDate: null as Date | null,
  });

  const mutation = useMutation({
    mutationFn: async (
      newTransaction: Omit<TransactionDTO, 'id' | 'updatedAt' | 'createdAt'>
    ) => {
      return transactionServer.create(newTransaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      router.push('/inicio');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paymentDate) return alert('Selecione uma data de pagamento');

    mutation.mutate({
      label: formData.label,
      type: formData.type,
      paymentStatus: formData.paymentStatus,
      method: formData.method,
      bank: formData.bank,
      value: parseFloat(formData.value),
      paymentDate: formData.paymentDate,
    });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Card className='w-full max-w-lg'>
        <CardHeader>
          <CardTitle>Adicionar Nova Transação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='grid gap-4'>
            <div>
              <Label>Nome</Label>
              <Input
                type='text'
                name='label'
                value={formData.label}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as PaymentType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione o tipo' />
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
                value={formData.paymentStatus}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    paymentStatus: value as PaymentStatus,
                  })
                }
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
              <Label>Meio de Pagamento</Label>
              <Select
                value={formData.method}
                onValueChange={(value) =>
                  setFormData({ ...formData, method: value as PaymentMethod })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione o meio de pagamento' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentMethod).map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Banco</Label>
              <Select
                value={formData.bank}
                onValueChange={(value) =>
                  setFormData({ ...formData, bank: value as Bank })
                }
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
                name='value'
                value={formData.value}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Data do Pagamento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={`w-full justify-start text-left font-normal ${
                      !formData.paymentDate ? 'text-muted-foreground' : ''
                    }`}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {formData.paymentDate
                      ? format(formData.paymentDate, 'dd/MM/yyyy')
                      : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={formData.paymentDate || undefined}
                    onSelect={(date) =>
                      setFormData({ ...formData, paymentDate: date || null })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              type='submit'
              disabled={mutation.isPending}
              className='w-full'
            >
              {mutation.isPending ? 'Salvando...' : 'Salvar Transação'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTransactionPage;
