// ToggleCart.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ToggleVote from '../src/app/backend/components/utilities/ToggleVote';
import { mockPost, mockUser, mockComment } from '../mocks/mockpost';

 // Mock the Supabase client
 jest.mock('../src/app/backend/model/supabase', () => ({
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  // Mock the final method to return a resolved promise with the expected data
  then: jest.fn().mockResolvedValue({ data: [{ id: 'mockNotificationId' }], error: null }),
 }));

// Mock the global context
jest.mock('../src/app/backend/hooks/context/useGlobalContext', () => ({
  useGlobalContext: jest.fn().mockReturnValue({
     user: {
       uuid: 'user123',
       cart: [],
       notifications: [],
       bookmarks: [],
       notifs_on: [false, false, false, false], // Ensure this is mocked
     },
     setUser: jest.fn(),
  }),
 }));

describe('ToggleVote', () => {
  test('if initial count is 0)', () => {
    const { getByTestId } = render(<ToggleVote type='post' post={mockPost} />);
    expect(mockPost.upvotes?.length).toBe(0);
    expect(mockPost.downvotes?.length).toBe(0);
  });   
  
  test('adds upvote to post and updates state', async () => {
    const { getByTestId } = render(<ToggleVote type='post' post={mockPost} />);
    
    fireEvent.click(screen.getByLabelText('upvote-btn'));
    
    await waitFor(() => {
      expect(mockPost.upvotes).toContain(mockUser.uuid);
    });
  }); 

  test('adds downvote post and updates state', async () => {
    const { getByLabelText } = render(<ToggleVote type='post' post={mockPost} />);
     
    fireEvent.click(screen.getByLabelText('downvote-btn'));
     
    await waitFor(() => {
      expect(mockPost.downvotes).toContain(mockUser.uuid);
    });
  });

  test('adds upvote to comment and updates state', async () => {
    const { getByTestId } = render(<ToggleVote type='comment' comment={mockComment} />);
    
    fireEvent.click(screen.getByLabelText('upvote-btn'));
    
    await waitFor(() => {
      expect(mockComment.upvotes).toContain(mockUser.uuid);
    });
  }); 

  test('adds downvote comment and updates state', async () => {
    const { getByLabelText } = render(<ToggleVote type='comment' comment={mockComment} />);
     
    fireEvent.click(screen.getByLabelText('downvote-btn'));
     
    await waitFor(() => {
      expect(mockComment.downvotes).toContain(mockUser.uuid);
    });
  });

});