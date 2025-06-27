import { LoginForm } from '@/components/login-form';

/**
 * Renders the home page with a centered login form inside a styled container.
 *
 * The layout adapts responsively for different screen sizes.
 */
export default function Home() {
  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        <LoginForm />
      </div>
    </div>
  );
}
