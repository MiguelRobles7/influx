import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationsLayout from '@/src/app/backend/components/layouts/NotificationsLayout'; // Adjust the import path as necessary
//import { NotificationClass, UserClass, PostClass } from '@/src/libraries/structures';
import { mockNotification1, mockNotification2, mockUser, mockPost } from '@/mocks/mockpost';
import { useRefreshContext } from '@/src/app/backend/hooks/context/useGlobalContext';


jest.mock('../src/app/backend/hooks/context/useGlobalContext', () => ({
    useGlobalContext: () => ({
       user: { uuid: 'user123', notifications: [mockNotification1.id, mockNotification2.id, mockNotification3.id] },
       // Mock other context values as needed
    }),
    useRefreshContext: jest.fn(),
   }));

   jest.mock('date-fns', () => ({
    formatDistance: jest.fn(() => 'a few seconds ago'),
   }));
   
   jest.mock('next/image', () => ({
    __esModule: true,
    default: function ImageMock({ src, alt, ...props }) {
       return <img src={src || 'mock-src'} alt={alt} {...props} />;
    },
   }));
   
   

jest.mock('next/navigation', () => ({
 useRouter: () => ({
    push: jest.fn(),
 }),
}));

describe('Notifications', () => {
    test('renders notifications correctly', () => {
        render(<NotificationsLayout notification={mockNotification1} user={mockUser} posts={[mockPost]} />);

        // Check that the notification content is displayed
        expect(screen.getByText('Your post has been upvoted!')).toBeInTheDocument();

        // Check that the related post information is displayed
        expect(screen.getByText('Mock Title')).toBeInTheDocument();
     });
   });
   
