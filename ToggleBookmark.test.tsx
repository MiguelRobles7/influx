// ToggleCart.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ToggleBookmark from './src/app/backend/components/utilities/ToggleBookmark';
import { mockPost, mockUser } from './mocks/mockpost';
import Supabase from '@/src/app/backend/model/supabase';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';

// Mock the Supabase client
jest.mock('./src/app/backend/model/supabase', () => ({
  from: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  // Mock the function that fetches the cart
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
       cart: [],
     },
     setUser: jest.fn(),
  }),
 }));

 test('if initial bookmarks count is 0)', () => {
  const { getByTestId } = render(<ToggleBookmark post={mockPost} />);
  expect(mockPost.bookmarks?.length).toBe(0);
});   
 
 test('if item is added to bookmarks', async () => {
  // Render the component with a mock post
  const { getByTestId } = render(<ToggleBookmark post={mockPost} />);
   
  // Simulate clicking the cart toggle button
  fireEvent.click(getByTestId('toggle-bm'));
   
  await waitFor(() => {
    // Check if the cart array of the post object has been updated
    expect(mockPost.bookmarks).toContain(mockUser.uuid);
    //expect(mockPost.cart.length).toBe(1);
  });
  
}); 
