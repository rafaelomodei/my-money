'use client';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';
import { authService } from '@/shared/server';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = () => {
    if (email && password) authService.create({ email, password });
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
        <div className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>E-mail</Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='grid gap-2'>
            <div className='flex items-center'>
              <Label htmlFor='password'>Senha</Label>
              <Link
                href='/forgot-password'
                className='ml-auto inline-block text-sm underline'
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <Input
              id='password'
              type='password'
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type='submit' className='w-full mt-8' onClick={handleSubmit}>
            Entrar
          </Button>
          <Button variant='outline' className='w-full'>
            Entrar com Google
          </Button>
        </div>
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

export default Login;
