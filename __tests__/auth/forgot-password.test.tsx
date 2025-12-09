import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordPage from '@/app/auth/forgot-password/page';
import { supabase } from '@/lib/supabase';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: jest.fn(),
    },
  },
}));

describe('ForgotPasswordPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders forgot password form correctly', () => {
    render(<ForgotPasswordPage />);
    
    expect(screen.getByText('Reset your password')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('handles successful reset password request', async () => {
    (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValueOnce({
      data: {},
      error: null,
    });

    render(<ForgotPasswordPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com', expect.any(Object));
      expect(screen.getByText('Check your email for the password reset link.')).toBeInTheDocument();
    });
  });

  it('handles reset password error', async () => {
    const errorMessage = 'Error sending email';
    (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: { message: errorMessage },
    });

    render(<ForgotPasswordPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
