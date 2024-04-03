// ToggleCart.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ToggleVote from '../src/app/backend/components/utilities/ToggleVote';
import { mockPost, mockUser } from '../mocks/mockpost';
import Supabase from '@/src/app/backend/model/supabase';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';

// Mock the Supabase client
jest.mock('./src/app/backend/model/supabase', () => ({
  from: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  get: jest.fn().mockResolvedValue({
     data: [],
     error: null,
  }),
 }));
 
// Mock the global context
jest.mock('./src/app/backend/hooks/context/useGlobalContext', () => ({
  useGlobalContext: jest.fn().mockReturnValue({
     user: {
       uuid: 'user123',
       upvotes: [],
       downvotes: [],
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
  
  test('adds upvote and updates state', async () => {
    const { getByTestId } = render(<ToggleVote type='post' post={mockPost} />);
    
    fireEvent.click(screen.getByLabelText('upvote-btn'));
    
    await waitFor(() => {
      expect(mockPost.upvotes).toContain(mockUser.uuid);
    });
  }); 

  test('adds downvote and updates state', async () => {
    const { getByLabelText } = render(<ToggleVote type='post' post={mockPost} />);
     
    fireEvent.click(screen.getByLabelText('downvote-btn'));
     
    await waitFor(() => {
      expect(mockPost.downvotes).toContain(mockUser.uuid);
    });
  });

});