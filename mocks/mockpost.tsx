import { PostClass, CommunityClass, UserClass, CommentClass } from '@/src/libraries/structures';


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
  is_edited: false,
  comments: [],
});

export const mockComment = new CommentClass({
  id: 123,
  enclosing_post: mockPost.id,
  enclosing_comment: 0, // Assuming this comment is not a reply to another comment
  author: mockUser,
  posted_at: new Date(),
  is_edited: false,
  edited_at: new Date(),
  content: "test comment content",
  upvotes: [],
  downvotes: [],
  replies: [],
  is_deleted: false,
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

 
