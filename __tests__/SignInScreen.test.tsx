import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import SignInScreen from '../app/(auth)/signin';
import { useAuth } from '../components/auth/AuthContext';

// Mock dependencies
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

jest.mock('../components/auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../hooks/useAuthRedirect', () => ({
  useAuthRedirect: jest.fn(),
}));

jest.mock('../components/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

// Mock Alert.alert
jest.spyOn(Alert, 'alert');

// Mock implementations
const mockSignIn = jest.fn();
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockRouter = router as jest.Mocked<typeof router>;
const mockAlert = Alert.alert as jest.MockedFunction<typeof Alert.alert>;

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    mockUseAuth.mockReturnValue({
      signIn: mockSignIn,
      signUp: jest.fn(), // Add mock signUp
      isLoading: false,
      user: null,
      isAuthenticated: false,
      signOut: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render all essential elements', () => {
      render(<SignInScreen />);

      expect(screen.getByText('Welcome Back')).toBeTruthy();
      expect(screen.getByText('Sign in to your TCG Marketplace account')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
      expect(screen.getByText('Sign In')).toBeTruthy();
      expect(screen.getByText('Forgot Password?')).toBeTruthy();
      expect(screen.getByText("Don't have an account? ")).toBeTruthy();
      expect(screen.getByText('Sign Up')).toBeTruthy();
    });

    it('should show loading state when isLoading is true', () => {
      mockUseAuth.mockReturnValue({
        signIn: mockSignIn,
        signUp: jest.fn(), // Add mock signUp
        isLoading: true,
        user: null,
        isAuthenticated: false,
        signOut: jest.fn(),
      });

      render(<SignInScreen />);

      expect(screen.getByText('Signing In...')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should show error when email is empty', async () => {
      render(<SignInScreen />);

      const signInButton = screen.getByText('Sign In');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'Error',
          'Please fill in all fields'
        );
      });
    });

    it('should show error when password is empty', async () => {
      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.changeText(emailInput, 'test@example.com');

      const signInButton = screen.getByText('Sign In');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'Error',
          'Please fill in all fields'
        );
      });
    });

    it('should show error for invalid email format', async () => {
      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.changeText(passwordInput, 'password123');

      const signInButton = screen.getByText('Sign In');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'Error',
          'Please enter a valid email address'
        );
      });
    });
  });

  describe('User Interactions', () => {
    it('should update email input value', () => {
      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.changeText(emailInput, 'john@example.com');

      expect(emailInput.props.value).toBe('john@example.com');
    });

    it('should update password input value', () => {
      render(<SignInScreen />);

      const passwordInput = screen.getByPlaceholderText('Enter your password');
      fireEvent.changeText(passwordInput, 'password123456');

      expect(passwordInput.props.value).toBe('password123456');
    });

    it('should navigate to register screen when Sign Up is pressed', () => {
      render(<SignInScreen />);

      const signUpLink = screen.getByText('Sign Up');
      fireEvent.press(signUpLink);

      expect(mockRouter.push).toHaveBeenCalledWith('/(auth)/register');
    });
  });

  describe('Authentication Flow', () => {
    it('should call signIn with correct credentials when form is valid', async () => {
      mockSignIn.mockResolvedValueOnce(undefined);

      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const signInButton = screen.getByText('Sign In');

      fireEvent.changeText(emailInput, 'john@example.com');
      fireEvent.changeText(passwordInput, 'password123456');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('john@example.com', 'password123456');
      });
    });

    it('should navigate to tabs after successful sign in', async () => {
      mockSignIn.mockResolvedValueOnce(undefined);

      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const signInButton = screen.getByText('Sign In');

      fireEvent.changeText(emailInput, 'john@example.com');
      fireEvent.changeText(passwordInput, 'password123456');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/');
      });
    });

    it('should show error alert when sign in fails', async () => {
      const errorMessage = 'Invalid credentials';
      mockSignIn.mockRejectedValueOnce(new Error(errorMessage));

      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const signInButton = screen.getByText('Sign In');

      fireEvent.changeText(emailInput, 'john@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'Sign In Failed',
          errorMessage
        );
      });
    });

    it('should show generic error message when sign in fails without specific message', async () => {
      mockSignIn.mockRejectedValueOnce(new Error());

      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const signInButton = screen.getByText('Sign In');

      fireEvent.changeText(emailInput, 'john@example.com');
      fireEvent.changeText(passwordInput, 'password123456');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'Sign In Failed',
          'Sign in failed. Please check your credentials and try again.'
        );
      });
    });
  });

  describe('Component State Management', () => {
    it('should disable sign in button when loading', () => {
      mockUseAuth.mockReturnValue({
        signIn: mockSignIn,
        signUp: jest.fn(), // Add mock signUp
        isLoading: true,
        user: null,
        isAuthenticated: false,
        signOut: jest.fn(),
      });

      render(<SignInScreen />);

      const signInButton = screen.getByText('Signing In...');
      expect(signInButton.parent?.props.disabled).toBe(true);
    });

    it('should not call signIn when button is disabled due to loading', async () => {
      mockUseAuth.mockReturnValue({
        signIn: mockSignIn,
        signUp: jest.fn(), // Add mock signUp
        isLoading: true,
        user: null,
        isAuthenticated: false,
        signOut: jest.fn(),
      });

      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const signInButton = screen.getByText('Signing In...');

      fireEvent.changeText(emailInput, 'john@example.com');
      fireEvent.changeText(passwordInput, 'password123456');
      fireEvent.press(signInButton);

      // Wait a bit to ensure no async calls are made
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockSignIn).not.toHaveBeenCalled();
    });
  });

  describe('Email Validation Logic', () => {
    const validEmails = [
      'john@example.com',
      'user.name@domain.co.uk',
      'test123@test-domain.com',
    ];

    const invalidEmails = [
      'invalid-email',
      '@domain.com',
      'user@',
      'user@domain',
      'user name@domain.com',
    ];

    validEmails.forEach(email => {
      it(`should accept valid email: ${email}`, async () => {
        mockSignIn.mockResolvedValueOnce(undefined);

        render(<SignInScreen />);

        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByText('Sign In');

        fireEvent.changeText(emailInput, email);
        fireEvent.changeText(passwordInput, 'password123456');
        fireEvent.press(signInButton);

        await waitFor(() => {
          expect(mockSignIn).toHaveBeenCalledWith(email, 'password123456');
        });
      });
    });

    invalidEmails.forEach(email => {
      it(`should reject invalid email: ${email}`, async () => {
        render(<SignInScreen />);

        const emailInput = screen.getByPlaceholderText('Enter your email');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByText('Sign In');

        fireEvent.changeText(emailInput, email);
        fireEvent.changeText(passwordInput, 'password123456');
        fireEvent.press(signInButton);

        await waitFor(() => {
          expect(mockAlert).toHaveBeenCalledWith(
            'Error',
            'Please enter a valid email address'
          );
        });

        expect(mockSignIn).not.toHaveBeenCalled();
      });
    });
  });
});