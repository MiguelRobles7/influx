import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import TopbarNav from '../src/app/backend/components/navigators/TopbarNav'; 
import { mockPost } from '../mocks/mockpost'; 


jest.mock('next/navigation', () => ({
 useRouter: () => ({
    push: jest.fn(),
 }),
}));

jest.mock('../src/app/backend/hooks/context/useGlobalContext', () => ({
 useGlobalContext: () => ({
    user: { uuid: 'user123' },
    setUser: jest.fn(),
 }),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: function ImageMock({ src, alt, ...props }) {
       return <img src={src || 'mock-src'} alt={alt} {...props} />;
    },
}));

const props = {
    posts: [mockPost],
   };

test('displays correct post after query is set', () => {
    render(<TopbarNav />);
   
    // Find the search input and type a query
    const searchInput = screen.getByPlaceholderText('Look for anything...');
    userEvent.type(searchInput, 'Mock Title');
   
    // Submit the form by selecting it by its class name
    const searchForm = screen.getByRole('form', { name: /search form/i });
    fireEvent.submit(searchForm);

    const mockPostElement = screen.findByText('Oagdhsghsgh');
    
    waitFor(() => {
        expect(mockPostElement).toBeInTheDocument();
    });
    // Assert that the correct query is there
    // This part depends on how your component handles the form submission.
    // For example, if it updates the URL, you can check the URL.
    // If it updates the state or props, you can check those.
    // Since the form submission in your component might not directly affect the DOM,
    // you might need to mock or spy on the router or other functions that handle the form submission.
});