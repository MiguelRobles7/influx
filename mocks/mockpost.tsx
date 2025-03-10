import { PostClass, CommunityClass, UserClass, CommentClass, NotificationClass } from '@/src/libraries/structures';


export const mockUser: UserClass = new UserClass({
    uuid: 'user123',
    notifications: [],
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
  is_edited: false,
  comments: [],
});

export const mockPost1 = new PostClass({
  id: 125,
  origin: new CommunityClass(),
  author: mockUser,
  type: 'mockType',
  posted_at: new Date(),
  title: 'Mock Title1',
  description: 'Mock Description1',
  upvotes: [],
  downvotes: [],
  cart: [],
  bookmarks: [],
  is_edited: false,
  comments: [],
});

export const mockComment = new CommentClass({
  id: 124,
  enclosing_post: mockPost.id,
  enclosing_comment: 0, // Assuming this comment is not a reply to another comment
  author: mockUser,
  posted_at: new Date(),
  is_edited: false,
  edited_at: new Date(),
  content: "test comment content baliw",
  upvotes: [],
  downvotes: [],
  replies: [],
  is_deleted: false,
 });
 
 export const mockNotification1 = new NotificationClass({
  id: 1,
  created_at: new Date(),
  content: 'Your post has been upvoted!',
  related_post: mockPost.id,
  is_read: false,
 });
 
 export const mockNotification2 = new NotificationClass({
  id: 2,
  created_at: new Date(),
  content: 'You have a new comment on your post.',
  related_post: mockPost.id,
  is_read: false,
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

 export const mockComments = new PostClass({
  ...mockPost,
  comments: [mockComment.id]
 });

 export const otherMockPost = new PostClass({
  id: 125,
  origin: new CommunityClass(),
  author: mockUser,
  type: 'mockType',
  posted_at: new Date(),
  title: 'Other Post',
  description: 'Sample for other post',
  upvotes: [],
  downvotes: [],
  cart: [],
  bookmarks: [],
});