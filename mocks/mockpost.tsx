import { PostClass, CommunityClass, UserClass } from '@/src/libraries/structures';

export const mockUser: UserClass = new UserClass({
    uuid: 'user123',
  });

export const mockPost = new PostClass({
  id: 123,
  origin: new CommunityClass(),
  author: mockUser,
  type: 'mockType',
  posted_at: new Date(),
  title: 'Mock Title',
  description: 'Mock Description',
  upvotes: [],
  downvotes: [],
  cart: [],
  bookmarks: [],
});

export const mockCart = new PostClass({
  ...mockPost,
  cart: [mockUser.uuid], // Add the user's UUID to the cart
 });

 export const mockBookmark = new PostClass({
  ...mockPost,
  bookmarks: [mockUser.uuid], // Add the user's UUID to the cart
 });