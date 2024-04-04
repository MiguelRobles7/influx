import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostLayout from '../src/app/backend/components/layouts/PostLayout'; // Replace with your actual component
import Action from '../src/app/backend/components/utilities/Action';
import { mockPost } from '../mocks/mockpost';

const setPostsMock = jest.fn();

jest.mock('../src/app/backend/hooks/context/useGlobalContext', () => ({
    useGlobalContext: () => ({
       user: { uuid: 'user123' },
       posts: [mockPost],
       setPosts: setPostsMock,
    }),
}));
   
jest.mock('next/navigation', () => ({
    useRouter: () => ({
       push: jest.fn(),
    }),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: function ImageMock({ src, alt, ...props }) {
       return <img src={src || 'mock-src'} alt={alt} {...props} />;
    },
}));
   
test('deletes a post when the delete button is clicked', async () => {
    render(<PostLayout post={mockPost} />);
   
    // Find the delete button by its test ID
    const moreButton = screen.getByTestId('more-btn');
    //const deleteButton = screen.getByTestId('delete-btn');
   
    // Simulate a click event on the delete button
    await userEvent.click(moreButton);
    //userEvent.click(deleteButton);
    await waitFor(() => {
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Delete');
    await userEvent.click(deleteButton);

    // `setPostsMock` is a mock function that updates the posts state
    await waitFor(() => {
        //expect(setPostsMock).toHaveBeenCalled();
        expect(setPostsMock).toHaveBeenCalledWith(expect.not.arrayContaining([mockPost]));
    });
});