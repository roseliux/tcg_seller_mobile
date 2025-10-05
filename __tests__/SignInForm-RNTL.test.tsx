/**
 * Authentication Component Test with React Native Testing Library
 * Shows proper component testing patterns for authentication UI
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert, Text, TextInput, TouchableOpacity } from 'react-native';

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Simple sign-in form component for testing
interface SignInFormProps {
  onSignIn: (email: string, password: string) => void;
  isLoading?: boolean;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSignIn, isLoading = false }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = () => {
    if (email && password) {
      onSignIn(email, password);
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  return (
    <>
      <Text testID="sign-in-title">Sign In</Text>
      <TextInput
        testID="email-input"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        testID="password-input"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        testID="sign-in-button"
        onPress={isLoading ? undefined : handleSubmit}
        style={{ opacity: isLoading ? 0.5 : 1 }}
      >
        <Text>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
      </TouchableOpacity>
      {isLoading && <Text testID="loading-indicator">Loading...</Text>}
    </>
  );
};

describe('SignInForm Component with RNTL', () => {
  const mockOnSignIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all form elements', () => {
    render(<SignInForm onSignIn={mockOnSignIn} />);

    // Check all elements are present
    expect(screen.getByTestId('sign-in-title')).toBeTruthy();
    expect(screen.getByTestId('email-input')).toBeTruthy();
    expect(screen.getByTestId('password-input')).toBeTruthy();
    expect(screen.getByTestId('sign-in-button')).toBeTruthy();

    // Check initial text (use getAllByText since both title and button have "Sign In")
    const signInTexts = screen.getAllByText('Sign In');
    expect(signInTexts).toHaveLength(2); // Title and button
  });

  it('should handle user input correctly', () => {
    render(<SignInForm onSignIn={mockOnSignIn} />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    // Simulate user typing
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    // Check that inputs have the correct values
    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('should call onSignIn when form is submitted with valid data', () => {
    render(<SignInForm onSignIn={mockOnSignIn} />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const signInButton = screen.getByTestId('sign-in-button');

    // Fill out the form
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    // Submit the form
    fireEvent.press(signInButton);

    // Check that onSignIn was called with correct arguments
    expect(mockOnSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockOnSignIn).toHaveBeenCalledTimes(1);
  });

  it('should show alert when form is submitted with missing data', () => {
    render(<SignInForm onSignIn={mockOnSignIn} />);

    const signInButton = screen.getByTestId('sign-in-button');

    // Submit empty form
    fireEvent.press(signInButton);

    // Check that alert was called
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
    expect(mockOnSignIn).not.toHaveBeenCalled();
  });

  it('should show loading state correctly', () => {
    render(<SignInForm onSignIn={mockOnSignIn} isLoading={true} />);

    // Check loading state elements
    expect(screen.getByText('Signing In...')).toBeTruthy();
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();

    // Check button has reduced opacity (our loading state implementation)
    const button = screen.getByTestId('sign-in-button');
    expect(button.props.style).toEqual({ opacity: 0.5 });
  });

  it('should handle loading state changes', async () => {
    const { rerender } = render(<SignInForm onSignIn={mockOnSignIn} isLoading={false} />);

    // Initially not loading - check for button text specifically
    expect(screen.getAllByText('Sign In')).toHaveLength(2); // Title and button
    expect(screen.queryByTestId('loading-indicator')).toBeNull();

    // Rerender with loading state
    rerender(<SignInForm onSignIn={mockOnSignIn} isLoading={true} />);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Signing In...')).toBeTruthy();
      expect(screen.getByTestId('loading-indicator')).toBeTruthy();
    });
  });
});