'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, AlertCircleIcon, GithubIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/input-password';

const formSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match"
  });

export function SignUpView({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password
      },
      {
        onRequest: () => {
          setError(null);
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          form.reset();
          setError(null);
          router.push('/');
        },
        onError: ({ error }) => {
          setIsLoading(false);
          setError(error.message);
        }
      }
    );
  }

  const onSocialSignIn = (provider: 'github' | 'google' | 'facebook') => {
    authClient.signIn.social(
      { provider },
      {
        onRequest: () => {
          setError(null);
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          setError(null);
          router.push('/');
        },
        onError({ error }) {
          setIsLoading(false);
          setError(error.message);
        }
      }
    );
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <Form {...form}>
            <form className='p-6 md:p-8' onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col items-center text-center'>
                  <h1 className='text-2xl font-bold'>Let&apos;s get started</h1>
                  <p className='text-muted-foreground text-base text-balance'>
                    Create your account
                  </p>
                </div>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder='John Doe' required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='email'
                            placeholder='m@example.com'
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <InputPassword
                            {...field}
                            disabled={isLoading}
                            required
                            placeholder='********'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <InputPassword
                            {...field}
                            disabled={isLoading}
                            required
                            placeholder='********'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {error && (
                  <Alert variant='destructive'>
                    <AlertCircleIcon />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type='submit'
                  className='cursor-pointertext-white w-full'
                  disabled={isLoading}
                >
                  {isLoading && <Loader2Icon className='animate-spin' />}
                  Create account
                </Button>
                <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                  <span className='bg-card text-muted-foreground relative z-10 px-2'>
                    Or continue with
                  </span>
                </div>
                <div className='grid grid-cols-3 gap-4'>
                  <Button
                    variant='outline'
                    type='button'
                    className='w-full'
                    onClick={() => onSocialSignIn('github')}
                  >
                    <GithubIcon />
                    <span className='sr-only'>Login with Apple</span>
                  </Button>
                  <Button
                    variant='outline'
                    type='button'
                    className='w-full'
                    onClick={() => onSocialSignIn('google')}
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                      <path
                        d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                        fill='currentColor'
                      />
                    </svg>
                    <span className='sr-only'>Login with Google</span>
                  </Button>
                  <Button
                    variant='outline'
                    type='button'
                    className='w-full'
                    onClick={() => onSocialSignIn('facebook')}
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                      <path
                        d='M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z'
                        fill='currentColor'
                      />
                    </svg>
                    <span className='sr-only'>Login with Meta</span>
                  </Button>
                </div>
                <div className='text-center text-sm'>
                  Already have an account?{' '}
                  <Link
                    href='/sign-in'
                    className='underline underline-offset-4'
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className='from-sidebar-accent to-sidebar relative hidden flex-col items-center justify-center gap-y-4 bg-radial md:flex'>
            <img src='/logo.svg' alt='Logo' className='size-[92px]' />
            <p className='text-2xl font-semibold text-white'>Meet.AI</p>
          </div>
        </CardContent>
      </Card>
      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
}
