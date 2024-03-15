import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ToggleVote from './src/app/backend/components/utilities/ToggleVote';
import {mockPost} from "./mocks/mockpost"

jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(() => ({
      from: jest.fn((table) => ({
        update: jest.fn((_, updateObject) => {
          if (table === 'posts') {
            const { upvotes, downvotes } = updateObject;
            if (upvotes !== undefined) {
              mockPost.upvotes = upvotes;
            }
            if (downvotes !== undefined) {
              mockPost.downvotes = downvotes;
            }
          } else if (table === 'comments') {
            // Implement update logic for comments if needed
          }
          return Promise.resolve({ data: null, error: null });
        }),
      })),
    })),
  };
});


describe('ToggleVote', () => {
  

  test('Initial count is 0', () => {
    const {getByTestId} = render(<ToggleVote type="post" post={mockPost} />);
    
    const voteCount = Number(getByTestId("vote-count").textContent);
    expect(voteCount).toBe(0);
  });

  test('Increment votes when clicking upvote', async () => {
    const { getByTestId, getByRole } = render(<ToggleVote type="post" post={mockPost} />);
    const upvoteButton = getByRole('button', { name: 'Upvote' });

    // Get initial vote count
    const voteCount1 = Number(getByTestId("vote-count").textContent);
    expect(voteCount1).toEqual(0);

    // Click the upvote button
    fireEvent.click(upvoteButton);

    // Wait for async operations to complete
    await waitFor(() => {
      // Get updated vote count
      const voteCount2 = Number(getByTestId("vote-count").textContent);
      // Assert that vote count is incremented
      expect(voteCount2).toEqual(1);
    });
  });
  

  // test('clicking downvote decreases vote count', () => {
  //   const { getByLabelText, getByText } = render(
  //     <ToggleVote type="post" post={mockPost} />
  //   );

  //   const downvoteButton = getByLabelText('Downvote');
  //   fireEvent.click(downvoteButton);

  //   expect(getByText('-1')).toBeInTheDocument();
  // });

  // test('clicking upvote then downvote toggles votes', () => {
  //   const { getByLabelText, getByText } = render(
  //     <ToggleVote type="post" post={mockPost} />
  //   );

  //   const upvoteButton = getByLabelText('Upvote');
  //   fireEvent.click(upvoteButton);

  //   //expect(mockPost.upvotes).toContain(mockUser.uuid);
  //   expect(getByText('1')).toBeInTheDocument();

  //   const downvoteButton = getByLabelText('Downvote');
  //   fireEvent.click(downvoteButton);

  //   //expect(mockPost.downvotes).toContain(mockUser.uuid);
  //   expect(getByText('0')).toBeInTheDocument();
  // });
});
