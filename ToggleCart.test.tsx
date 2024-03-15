// ToggleCart.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ToggleCart from './src/app/backend/components/utilities/ToggleCart';
import { mockPost, mockUser } from './mocks/mockpost';
import Supabase from '@/src/app/backend/model/supabase';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';

 // Mock Supabase and useGlobalContext
/* jest.mock('@supabase/supabase-js', () => ({
 from: jest.fn().mockReturnThis(),
 update: jest.fn(),
 eq: jest.fn(),
})); */

jest.mock('@supabase/supabase-js', () => {
    return {
      createClient: jest.fn(() => ({
        from: jest.fn().mockReturnThis(),
        update: jest.fn(),
        eq: jest.fn(),
      })),
    };
  });
   
describe('ToggleCart', () => {

    test('if initial cart count is false (0)', () => {
        const { getByTestId } = render(<ToggleCart post={mockPost} />);
        const cartCount = Number(getByTestId("count").textContent);
        expect(cartCount).toBe(0);
      });   

    test('if it toggles cart state to true (1)', async () => { 

        // Render the component and simulate a click
        const { getByTestId } = render(<ToggleCart post={mockPost} />);
        const toggleButton = getByTestId('toggle-cart');

        const cartCount = Number(getByTestId("count").textContent);
        expect(cartCount).toBe(0);
        fireEvent.click(toggleButton);
        //expect(cartCount).toBe(1);

        // Wait for any asynchronous updates and assert the expected behavior
        await waitFor(() => {
            //expect(cartCount).toBe(1);
            expect(cartCount).toHaveTextContent('1');

        // expect(getByTestId('toggle-cart')).toHaveTextContent('1 Interested');
        // expect(Supabase.update).toHaveBeenCalledWith({ cart: expect.arrayContaining(['user123']) });
        // expect(Supabase.eq).toHaveBeenCalledWith('id', mockPost.id);
        });
    });
}); 

