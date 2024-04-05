// ToggleCart.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ToggleBookmark from '../src/app/backend/components/utilities/ToggleBookmark';
import { mockPost, mockUser } from '../mocks/mockpost';
import Supabase from '@/src/app/backend/model/supabase';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';


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

 test('if initial bookmarks count is 0)', () => {
  const { getByTestId } = render(<ToggleBookmark post={mockPost} />);
  expect(mockPost.bookmarks?.length).toBe(0);
});   
 
 test('if item is added to bookmarks', async () => {
  // Render the component with a mock post
  const { getByTestId } = render(<ToggleBookmark post={mockPost} />);
   
  // Simulate clicking the cart toggle button
  fireEvent.click(screen.getByTestId('toggle-bm'));
   
  await waitFor(() => {
    // Check if the cart array of the post object has been updated
    expect(mockPost.bookmarks).toContain(mockUser.uuid);
    //expect(mockPost.cart.length).toBe(1);
  });
  
}); 
