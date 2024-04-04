// Comments.test.tsx

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentSection from '../src/app/backend/components/utilities/CommentSection'; // Adjust the import path as necessary
import { mockUser, mockPost, mockComment } from '../mocks/mockpost'; // Adjust the import path as necessary
import Supabase from '../src/app/backend/model/supabase';
import { useCommentsContext } from '../src/app/backend/hooks/context/useCommentsContext';

// Mock external dependencies
jest.mock('../src/app/backend/model/supabase', () => ({
   from: jest.fn().mockReturnThis(),
   select: jest.fn().mockReturnThis(),
   eq: jest.fn().mockReturnThis(),
   single: jest.fn().mockResolvedValue({ data: { comments: [] }, error: null }),
   update: jest.fn(),
   insert: jest.fn().mockResolvedValue({ data: [{ id: 124 }], error: null }),
   order: jest.fn().mockReturnThis(),
   limit: jest.fn().mockReturnThis(), // Add this line to mock the limit method
  }));

jest.mock('../src/app/backend/hooks/context/useGlobalContext', () => ({
 useGlobalContext: () => ({
   user: mockUser,
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
 

test('adds a comment when the send button is clicked and updates comments array', async () => {
  render(<CommentSection postId={mockPost.id} />);
 
  // Simulate typing into the input field
  const input = screen.getByPlaceholderText('Write a comment...');
  await userEvent.type(input, mockComment.content);
 
  // Simulate clicking the send button
  const sendButton = screen.getByLabelText('send');
  await userEvent.click(sendButton);
 
  const { setCommentsArray } = useCommentsContext();
  // Wait for the async operations to complete
  waitFor(() => {
     // Adjusted expectation to check for an array of comment IDs
     expect(setCommentsArray).toHaveBeenCalledWith(expect.arrayContaining([mockComment.id]));
     expect(screen.getByText('HADHGHAGW')).toBeInTheDocument();
  });

 });