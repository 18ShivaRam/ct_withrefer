import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdatePasswordPage from '@/app/auth/update-password/page';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      updateUser: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('UpdatePasswordPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    // Mock getSession to return a valid session
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: '123' } } },
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders update password form correctly', async () => {
    render(<UpdatePasswordPage />);
    
    // Use waitFor because there is a useEffect that checks session
    await waitFor(() => {
       expect(screen.getByRole('heading', { name: /update password/i })).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument();
  });

  it('handles password mismatch', async () => {
    render(<UpdatePasswordPage />);

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'password456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      expect(supabase.auth.updateUser).not.toHaveBeenCalled();
    });
  });

  it('handles successful password update', async () => {
    (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({
      data: {},
      error: null,
    });
    
    render(<UpdatePasswordPage />);

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'newpassword123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'newpassword123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    // Verify updateUser is called
    await waitFor(() => {
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'newpassword123' });
    });
    
    // Verify success message
    await waitFor(() => {
        expect(screen.getByText(/Password updated successfully/i)).toBeInTheDocument();
    });
    
    // Check for the "Go to Login" link
    expect(screen.getByRole('link', { name: /go to login/i })).toBeInTheDocument();
  });

  it('handles update error', async () => {
    const errorMessage = 'Weak password';
    (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: { message: errorMessage },
    });

    render(<UpdatePasswordPage />);

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'short' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'short' },
    });
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
