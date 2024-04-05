import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchComponent from '@/src/app/search/page'; // Adjust the import path as necessary
import { useSearchParams } from 'next/navigation';
import useFetchPosts  from '@/src/app/backend/hooks/fetching/useFetchPosts'; // Import the mocked hook
import { mockPost,mockPost1 } from '@/mocks/mockpost';

// Mock useSearchParams and useRouter hooks
jest.mock('next/navigation', () => ({
 useSearchParams: jest.fn(),
 useRouter: () => ({
    push: jest.fn(),
 }),
}));

jest.mock('../src/app/backend/hooks/fetching/useFetchPosts', () => ({
    __esModule: true, // This line is crucial for mocking default exports
    default: jest.fn(),
}));

describe('SearchComponent', () => {
 it('displays correct posts based on search criteria', async () => {
    // Mock the useSearchParams hook to return a controlled value
    (useSearchParams as jest.Mock).mockImplementation(() => {
      return [new URLSearchParams('?search=MockTitle'), jest.fn()];
    });

    // Mock the useFetchPosts hook to return mock posts
    (useFetchPosts as jest.Mock).mockImplementation(() => {
      return {
        posts: [mockPost, mockPost1], // Use your mock posts here
        isLoading: false,
        error: null,
      };
    });

    // Render the component
    render(<SearchComponent />);
    screen.debug();

    // Example assertion: Check if a post with the search term is displayed
    // Adjust this based on how your component displays search results
    // const searchResult = await screen.getByText(/MockTitle/i);
    // expect(searchResult).toBeInTheDocument();
 });
});