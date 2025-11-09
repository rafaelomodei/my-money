'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { authService } from '@/shared/server';

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Informe e-mail e senha para continuar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await authService.signIn({ email, password });

      if (user) {
        window.sessionStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/inicio';
      }
    } catch (error) {
      console.error('Failed to authenticate user', error);
      setErrorMessage(
        'Não foi possível entrar com as credenciais informadas. Tente novamente.'
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
            Faça login para acessar suas finanças
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
          <div className='grid gap-2'>
            <div className='flex items-center'>
              <Label htmlFor='password'>Senha</Label>
              <Link
                href='/esqueceu-senha'
                className='ml-auto inline-block text-sm underline'
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <Input
              id='password'
              type='password'
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {errorMessage ? (
            <p className='text-sm text-destructive text-center'>{errorMessage}</p>
          ) : null}
          <Button type='submit' className='w-full mt-4' disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
          <Button type='button' variant='outline' className='w-full'>
            Entrar com Google
          </Button>
        </form>
        <div className='mt-4 text-center text-sm'>
          Não tem uma conta?{' '}
          <Link href='/cadastrar' className='underline'>
            Cadastrar-se
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
