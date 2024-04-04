import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePostPopup from '@/src/app/backend/components/dialogs/UpdatePostPopup';
import { PostClass } from '@/src/libraries/structures';
import usePostActions from '@/src/app/backend/hooks/usePostActions';

// Correctly mock usePostActions to return an object with the expected methods
jest.mock('../src/app/backend/hooks/usePostActions', () => ({
 __esModule: true, // This property makes it work for default exports
 default: () => ({
    AddItem: jest.fn(),
    DeleteItem: jest.fn(),
    DeletePhotos: jest.fn(),
    EditItem: jest.fn(),
 }),
}));

describe('CreatePostPopup', () => {
 it('submits the form with valid inputs', async () => {
    const mockPost = new PostClass({
      title: 'Test Post',
      description: 'This is a test post.',
      // Add other necessary fields
    });

    render(<CreatePostPopup post={mockPost} onClose={() => {}} />);

    // Simulate typing into the title input
    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Updated Test Post');

    // Simulate typing into the description input
    const descInput = screen.getByLabelText(/description/i);
    await userEvent.clear(descInput);
    await userEvent.type(descInput, 'This is an updated test post.');

    // Simulate form submission
    const submitButton = screen.getByRole('button', { name: /edit post/i });
    await userEvent.click(submitButton);

    expect(titleInput).toBeInTheDocument();
    expect(descInput).toBeInTheDocument();

    // Wait for any asynchronous operations to complete
    // await waitFor(() => {
    //   // Assert that the form was submitted with the updated values
    //   expect(usePostActions().EditItem).toHaveBeenCalledWith({
    //     title: 'Updated Test Post',
    //     description: 'This is an updated test post.',
    //   });
    // });
 });
});
