'use client';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'; // Ícones do Radix UI
import { userCoordinator } from '@/shared/server';

const MIN_NUMBER_OF_CHARACTERS = 6;

enum PasswordError {
  MIN_LENGTH,
  NOT_MATCH,
}

const Login = () => {
  const [fistName, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const checkPassword = (): PasswordError | null => {
    if (password.length < MIN_NUMBER_OF_CHARACTERS)
      return PasswordError.MIN_LENGTH;
    if (password !== confirmPassword) return PasswordError.NOT_MATCH;

    return null;
  };

  const handleSubmit = async () => {
    if (email && !checkPassword()) {
      const user = await userCoordinator.createUserWithAuth({
        email,
        password,
        name: fistName,
        lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (user) {
        console.info('user: ', user);
        window.sessionStorage.setItem('user', JSON.stringify(user));

        window.location.href = '/inicio';
      }
    }
  };

  return (
    <div className='flex w-full h-svh items-center justify-center px-8'>
      <div className='mx-auto grid w-[350px] gap-6'>
        <div className='grid gap-2 text-center'>
          <h1 className='text-3xl font-bold'>My Money</h1>
          <p className='text-balance text-muted-foreground'>
            Crie uma conta para acessar suas finanças
          </p>
        </div>
        <div className='grid gap-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='first-name'>Nome</Label>
              <Input
                id='first-name'
                placeholder='Rafael'
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='last-name'>Sobre nome</Label>
              <Input
                id='last-name'
                placeholder='Omodei'
                required
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
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
          <div className='grid gap-2 relative'>
            <Label htmlFor='password'>Senha</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='absolute inset-y-0 right-3 flex items-center'
              >
                {showPassword ? (
                  <EyeClosedIcon className='h-5 w-5 text-gray-500' />
                ) : (
                  <EyeOpenIcon className='h-5 w-5 text-gray-500' />
                )}
              </button>
            </div>
          </div>
          <div className='grid gap-2 relative'>
            <Label htmlFor='confirm-password'>Confirmar senha</Label>
            <div className='relative'>
              <Input
                id='confirm-password'
                type={showConfirmPassword ? 'text' : 'password'}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type='button'
                onClick={toggleConfirmPasswordVisibility}
                className='absolute inset-y-0 right-3 flex items-center'
              >
                {showConfirmPassword ? (
                  <EyeClosedIcon className='h-5 w-5 text-gray-500' />
                ) : (
                  <EyeOpenIcon className='h-5 w-5 text-gray-500' />
                )}
              </button>
            </div>
          </div>
          <Button type='submit' className='w-full mt-8' onClick={handleSubmit}>
            Criar cadastro
          </Button>
          <div className='mt-4 text-center text-sm'>
            Já tem uma conta?{' '}
            <Link href='/' className='underline'>
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
