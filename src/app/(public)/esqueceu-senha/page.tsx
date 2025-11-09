'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { authService } from '@/shared/server';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackMessage('');

    if (!email) {
      setIsError(true);
      setFeedbackMessage('Informe um e-mail válido para continuar.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.resetPassword(email);
      setIsError(false);
      setFeedbackMessage(
        'Enviamos um e-mail com as instruções para você redefinir sua senha.'
      );
    } catch (error) {
      console.error('Failed to send password recovery email', error);
      setIsError(true);
      setFeedbackMessage(
        'Não foi possível enviar o e-mail de recuperação. Verifique os dados e tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex w-full h-svh items-center justify-center px-8'>
      <div className='mx-auto grid w-[350px] gap-6'>
        <div className='grid gap-2 text-center'>
          <h1 className='text-3xl font-bold'>My Money</h1>
          <p className='text-balance text-muted-foreground'>
            Esqueceu sua senha? Informe seu e-mail para receber o link de
            recuperação.
          </p>
        </div>
        <form className='grid gap-4' onSubmit={handleSubmit}>
          <div className='grid gap-2'>
            <Label htmlFor='email'>E-mail</Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          {feedbackMessage ? (
            <p
              className={`text-sm text-center ${
                isError ? 'text-destructive' : 'text-emerald-600'
              }`}
            >
              {feedbackMessage}
            </p>
          ) : null}
          <Button type='submit' className='w-full mt-4' disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar instruções'}
          </Button>
        </form>
        <div className='mt-4 text-center text-sm'>
          Lembrou sua senha?{' '}
          <Link href='/' className='underline'>
            Voltar para login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
