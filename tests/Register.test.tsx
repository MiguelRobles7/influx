
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../src/app/auth/register/page';
import Login from '../src/app/auth/login/page';
import RegisterComplete from '@/src/app/backend/components/dialogs/RegisterCompletePopup';
import supabase from '../src/app/backend/model/supabase';
import { useRouter } from 'next/navigation';

   
jest.mock('../src/app/backend/model/supabase', () => ({
    auth: {
        signUp: jest.fn().mockResolvedValue({ user: { email: 'test@example.com' }, session: {} }),
     },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    then: jest.fn().mockImplementation((callback) => {
       // Simulate the response from the database
       callback({ data: [{ handle: 'user123' }], error: null });
       return { catch: jest.fn() };
    }),
   }));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
   }));

jest.mock('next/navigation', () => ({
 useRouter: () => ({
    push: jest.fn(),
 }),
}));


describe('Register Component', () => {
 beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
 });

    it('displays RegisterComplete after signing up', async () => {
        render(<Register />);
    
        // Simulate user input
        const firstName = screen.getByTestId('first-name');
        await userEvent.type(firstName, 'Archibald');
    
        const lastName = screen.getByTestId('last-name');
        await userEvent.type(lastName, 'Chilimansi');
    
        const userName = screen.getByTestId('user-name');
        await userEvent.type(userName, 'chichiboy');
    
        const emailInput = screen.getByTestId('email-input');
        await userEvent.type(emailInput, 'test@example.com');
    
        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, 'password123');
    
        // Simulate form submission
        await userEvent.click(screen.getByRole('button', { name: /continue with an influx account/i }));
    
        // Wait for the RegisterComplete component to appear
        await waitFor(() => {
        expect(screen.getByText(/Thank you for signing up!/i)).toBeInTheDocument();
        });
    });

 it('displays error messages for wrong inputs', async () => {
    render(<Register />);
   
    // Simulate user input with wrong values
    const firstName = screen.getByTestId('first-name')
    await userEvent.type(firstName, 'Archibald');

    const lastName = screen.getByTestId('last-name')
    await userEvent.type(lastName, 'Chilimansi');

    const userName = screen.getByTestId('user-name')
    await userEvent.type(userName, 'chichiboy');

    const emailInput = screen.getByTestId('email-input')
    await userEvent.type(emailInput, 'invalidEmail');

    const passwordInput = screen.getByTestId('password-input')
    await userEvent.type(passwordInput, 'pass');

    // Simulate form submission
    await userEvent.click(screen.getByRole('button', { name: /continue with an influx account/i }));
   
    // Check for error messages
    expect(await screen.findByText(/Invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/Must be at least 8 characters/i)).toBeInTheDocument();
   });

   it('displays an error message when trying to register with an existing username', async () => {
    render(<Register />);
   
    // Simulate filling out the form with the mock user's credentials
    const userName = screen.getByTestId('user-name');
    await userEvent.type(userName, 'user123'); // This should match the username in the mocked response
   
    // Simulate form submission
    await userEvent.click(screen.getByRole('button', { name: /continue with an influx account/i }));
   
    // Wait for the error message to appear
    expect(await screen.findByText(/Username already exists/i)).toBeInTheDocument();
   });

});
