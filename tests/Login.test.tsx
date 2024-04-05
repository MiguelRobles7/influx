import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../src/app/auth/login/page';
import supabase from '../src/app/backend/model/supabase';
import { useRouter } from 'next/navigation';

// Mock external dependencies
jest.mock('../src/app/backend/model/supabase', () => ({
 auth: {
    signInWithPassword: jest.fn(),
 },
}));

jest.mock('next/navigation', () => ({
 useRouter: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
       push: jest.fn(),
    }),
}));


describe('Login Component', () => {
 beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
 });

 it('submits the form and updates state correctly', async () => {
    // Explicitly assert the mocked function as a Jest mock
    const mockedSignInWithPassword = supabase.auth.signInWithPassword as jest.Mock;

    // Mock the resolved value of the mocked function
    mockedSignInWithPassword.mockResolvedValue({
      data: {},
      error: null,
    });

    render(<Login />);

    // Simulate user input
    const emailInput = screen.getByRole('textbox', { name: /Email Address/i });
    await userEvent.type(emailInput, 'test@example.com');
    const passwordInput = screen.getByLabelText('Password');
    await userEvent.type(passwordInput, 'password123');

    // Simulate form submission
    await userEvent.click(screen.getByRole('button', { name: /continue with an influx account/i }));

    // Wait for any asynchronous operations to complete
    await waitFor(() => {
      // Assert that the mocked Supabase function was called with the correct arguments
      expect(mockedSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
 });

 it('displays error messages for wrong inputs', async () => {
    render(<Login />);
   
    // Simulate user input with wrong values
    const emailInput = screen.getByRole('textbox', { name: /Email Address/i });
    await userEvent.type(emailInput, 'invalidEmail'); // Invalid email address
    const passwordInput = screen.getByLabelText('Password');
    await userEvent.type(passwordInput, 'short'); // Password too short
   
    // Simulate form submission
    await userEvent.click(screen.getByRole('button', { name: /continue with an influx account/i }));
   
    // Check for error messages
    expect(await screen.findByText(/Invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/Must be at least 8 characters/i)).toBeInTheDocument();
    
   });
   
});
