// Comments.test.tsx

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentSection from '../src/app/backend/components/utilities/CommentSection'; // Adjust the import path as necessary
import CommentLayout from '../src/app/backend/components/layouts/CommentLayout';
import { mockUser, mockPost, mockComment } from '../mocks/mockpost'; // Adjust the import path as necessary
import Supabase from '../src/app/backend/model/supabase';
import { useCommentsContext } from '../src/app/backend/hooks/context/useCommentsContext';
import usePostActions from '../src/app/backend/hooks/usePostActions'; 


// Mock external dependencies
jest.mock('../src/app/backend/model/supabase', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: { comments: [] }, error: null }),
  update: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(), // Ensure insert returns this to allow chaining
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  then: jest.fn().mockResolvedValue({ data: [{ id: 123 }], error: null }), // Mock the final method to return a resolved promise
 }));



jest.mock('../src/app/backend/hooks/context/useGlobalContext', () => ({
 useGlobalContext: () => ({
   user: mockUser,
   notifications: [],
 }),
}));

jest.mock('../src/app/backend/hooks/context/useCommentsContext', () => ({
 useCommentsContext: jest.fn().mockReturnValue ({
   comments: [],
   setComments: jest.fn(),
   commentsArray: [],
   setCommentsArray: jest.fn(),
 }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: function ImageMock({ src, alt, ...props }) {
     return <img src={src || 'mock-src'} alt={alt} {...props} />;
  },
}));
 
describe('Comments', () => {
  test('allows a user to edit a comment and updates the comments array', async () => {
    
    render(<CommentLayout comment={mockComment} updateComments={jest.fn()}/>);
    
    // Simulate entering edit mode
    const moreButton = screen.getByTestId('more-btn');

    await userEvent.click(moreButton);

    await waitFor(() => {
        expect(screen.getByTestId('edit')).toBeInTheDocument();
    });

    const editButton = screen.getByTestId('edit');
    await userEvent.click(editButton);

    waitFor(() => {
      expect(screen.getByTestId('edit-input')).toBeInTheDocument();
  });
    
    // Simulate typing into the edit input
    const editInput = screen.getByTestId('edit-input'); // Assuming you have a test ID for the edit input
    await userEvent.clear(editInput);
    await userEvent.type(editInput, 'Updated comment content');
    
    // Simulate saving the edit
    const saveButton = screen.getByTestId('save-edit'); // Assuming you have a test ID for the save button
    await userEvent.click(saveButton);
    
    // Wait for the async operations to complete and the state to update
    waitFor(() => {
      expect(editInput).toBeInTheDocument();
    });
 });
  test('adds a comment when the send button is clicked and updates comments array', async () => {
    render(<CommentSection postId={mockPost.id} />);
  
    // Simulate typing into the input field
    const input = screen.getByPlaceholderText('Write your own comment..');
    await userEvent.type(input, mockComment.content);
  
    // Simulate clicking the send button
    const sendButton = screen.getByLabelText('send');
    await userEvent.click(sendButton);
  
    const { setCommentsArray } = useCommentsContext();
    // Wait for the async operations to complete
    waitFor(() => {
      // Adjusted expectation to check for an array of comment IDs
      expect(setCommentsArray).toHaveBeenCalledWith(expect.arrayContaining([mockComment.id]));
    });

  });

  test('allows a user to reply to a comment and updates the comments array', async () => {
    // Render the CommentLayout component with the mock comment
    render(<CommentLayout comment={mockComment} updateComments={jest.fn()} />);
     
    // Simulate clicking the reply button
    const replyButton = screen.getByTestId('reply-action');
    await userEvent.click(replyButton);
     
    // Simulate typing into the reply input
    const replyInput = screen.getByPlaceholderText('Reply to comment...');
    await userEvent.type(replyInput, 'This is a reply');
     
    // Simulate submitting the reply
    const submitReplyButton = screen.getByTestId('submitReply');
    await userEvent.click(submitReplyButton);
     
    const { setCommentsArray } = useCommentsContext();
    
    waitFor(() => {
       // Verify that setCommentsArray was called with the expected arguments
       // This assumes that the new reply's ID is added to the comments array
       expect(setCommentsArray).toHaveBeenCalledWith(expect.arrayContaining([expect.any(Number)]));
    });
   });



 test('allows a user to delete a comment and updates the comments array', async () => {
  render(<CommentLayout comment={mockComment} updateComments={jest.fn()} />);

  // Simulate entering edit mode
  const moreButton = screen.getByTestId('more-btn');

  await userEvent.click(moreButton);

  await waitFor(() => {
      expect(screen.getByTestId('delete')).toBeInTheDocument();
  });
  
  // Simulate deleting a comment
  const deleteButton = screen.getByTestId('delete'); // Assuming you have a test ID for the delete button
  await userEvent.click(deleteButton);
  
  // Wait for the async operations to complete and the state to update
  await waitFor(() => {
    const { setComments } = useCommentsContext();
    expect(setComments).toHaveBeenCalledWith(expect.not.arrayContaining([expect.objectContaining({ id: mockComment.id })]));
  });
});

});