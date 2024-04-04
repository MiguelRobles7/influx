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
  cart: [mockUser.uuid], 
 });

 export const mockBookmark = new PostClass({
  ...mockPost,
  bookmarks: [mockUser.uuid], 
  cart:[mockUser.uuid]
 });

 export const mockVotes = new PostClass({
  ...mockPost,
  upvotes:[mockUser.uuid],
  downvotes:[mockUser.uuid]
 });

