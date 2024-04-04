// ToggleCart.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ToggleCart from '../src/app/backend/components/utilities/ToggleCart';
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
    },
    setUser: jest.fn(),
 }),
}));

 test('if initial cart count is 0)', () => {
  const { getByTestId } = render(<ToggleCart post={mockPost} />);
  expect(mockPost.cart?.length).toBe(0);
});   
 
 test('adds item to cart and updates cart state', async () => {
  // Render the component with a mock post
  const { getByTestId } = render(<ToggleCart post={mockPost} />);
   
  // Simulate clicking the cart toggle button
  fireEvent.click(screen.getByTestId('toggle-cart'));
   
  await waitFor(() => {
    // Check if the cart array of the post object has been updated
    expect(mockPost.cart).toContain(mockUser.uuid);
    //expect(mockPost.cart.length).toBe(1);
  });
  
}); 
