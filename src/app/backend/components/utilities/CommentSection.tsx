'use client'; //* Uses interactable components

import Image from 'next/image';
import Supabase from '@/src/app/backend/model/supabase';
import Comment from '@/src/app/backend/components/layouts/CommentLayout';
import useFetchUsers from '@/src/app/backend/hooks/fetching/useFetchUsers';
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { CommentClass, UserClass } from '@/src/libraries/structures';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { useCommentsContext } from '@/src/app/backend/hooks/context/useCommentsContext';

const CommentSection: React.FC<{ postId: number }> = ({ postId }) => {
  const { user } = useGlobalContext();
  const { comments, setComments, commentsArray, setCommentsArray } = useCommentsContext();
  const [users, setUsers] = useState<UserClass[]>([]);

  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);

  // Fetches and sets comments under the post based on the comment IDs.
  const fetchComments = async (commentIds: number[]) => {
    const commentPromises = commentIds.map(async (commentId) => {
      const { data: commentData, error } = await Supabase.from('comments').select('*').eq('id', commentId).single();

      if (error) {
        console.error(`Error fetching comment with ID ${commentId}:`, error);
        return null;
      } else {
        if (commentData.author) {
          // Fetch user data based on the UUID
          const fetchUsers = useFetchUsers({
            type: 'subquery',
            users,
            setUsers,
            uuids: [commentData.author],
          });
          await fetchUsers();

          // Find the user data based on the UUID
          const foundUser = users?.find((user: UserClass) => user.uuid === commentData.author);

          // If the user is found, update the comment's author field
          if (foundUser) {
            commentData.author = foundUser;
          } else {
            // Create a new UserClass instance as a fallback
            commentData.author = new UserClass();
          }
        }

        return commentData as CommentClass;
      }
    });

    const fetchedComments = await Promise.all(commentPromises);
    setComments(fetchedComments.filter((comment) => comment !== null) as CommentClass[]);
  };

  // Fetches comment IDs of comments under the post.
  async function fetchCommentsArray() {
    const { data: postData, error } = await Supabase.from('posts').select('comments').eq('id', postId).single();

    if (error) {
      console.error('Error fetching comments array from post with ID ${postId}:', error);
    } else {
      const commentsArray = postData.comments || [];
      console.log(commentsArray);
      setCommentsArray(commentsArray);
      fetchComments(commentsArray);
    }
  }

  // Loads comments from the database.
  useEffect(() => {
    fetchCommentsArray();
  }, [postId]);

  async function updatePostInDatabase(postId: any, comments: any) {
    try {
      const { data, error } = await Supabase.from('posts').update({ comments }).eq('id', postId);

      console.log('Post updated in the database:', postId, comments);
    } catch (error) {
      console.error('Error updating post in the database:', error);
    }
  }

  const sendNotification = async () => {
    const notification: any = {
      type: 'comment',
      content: `@${user.handle} commented in your post.`,
      related_post: postId,
      is_read: false,
    };

    let { data, error } = await Supabase.from('notifications').insert(notification).select('id');

    if (error) throw error;
    else {
      if (user.notifications && data) {
        user.notifications.push(data[0].id);
      } else {
        console.log('No notifications', user.notifications, data);
      }
    }

    let { data: data2, error: error2 } = await Supabase.from('profiles')
      .update({ notifications: user.notifications })
      .eq('id', user.id);
    if (error2) throw error2;
  };

  const updateComments = async () => {
    await fetchCommentsArray();
  };

  // Handles adding a new comment.
  const handleAdd = async () => {
    const newComment: any = {
      enclosing_post: postId,
      posted_at: new Date(),
      is_edited: false,
      content: input,
      upvotes: [],
      downvotes: [],
      replies: [],
    };

    const commentInstance = new CommentClass({
      ...newComment,
      author: user,
    });

    setComments((prevComments) => [commentInstance, ...prevComments]);
    newComment.author = user.uuid;

    console.log('Comment data before try:', newComment);

    try {
      const { data: commentData, error: insertError } = await Supabase.from('comments').insert([newComment]);

      console.log('Comment inserted:', commentData);

      if (insertError) {
        console.error('Error inserting new comment:', insertError);
      } else {
        const { data: latestComment } = await Supabase.from('comments')
          .select('id')
          .eq('author', user.uuid)
          .order('posted_at', { ascending: false })
          .limit(1);

        if (latestComment && latestComment.length > 0) {
          const updatedCommentsArray = [...commentsArray, latestComment[0].id];
          setCommentsArray(updatedCommentsArray);

          await updatePostInDatabase(postId, updatedCommentsArray);
          console.log('Comments array updated:', updatedCommentsArray);
        }

        updateComments();
        sendNotification();
      }
    } catch (e) {
      console.error('Error during insertion:', e);
    }

    // handleInsertNode(comment.id, input);
    setShowInput(false);
    setInput('');
  };

  const nestComments = (comments: any) => {
    const nestedCommentsMap = new Map();

    // Create a map with parentCommentId as keys and array of child comments as values
    comments.forEach((comment: any) => {
      const parentCommentId = comment.enclosing_comment || 'root';
      if (!nestedCommentsMap.has(parentCommentId)) {
        nestedCommentsMap.set(parentCommentId, []);
      }
      nestedCommentsMap.get(parentCommentId).push(comment);
    });

    // Helper function to recursively render nested comments
    const renderNestedComments = (comment: any) => {
      const nestedComments = nestedCommentsMap.get(comment.id) || [];

      return (
        <div key={comment.id} className="nestedComment">
          <Comment comment={comment} updateComments={updateComments} />
          {nestedComments.length > 0 && (
            <div className="pl-3">{nestedComments.map((childComment: any) => renderNestedComments(childComment))}</div>
          )}
        </div>
      );
    };

    // Render root comments
    return comments
      .filter((comment: any) => !comment.enclosing_comment)
      .map((rootComment: any) => (
        <div key={rootComment.id} className="rootComment">
          <Comment comment={rootComment} updateComments={updateComments} />
          {nestedCommentsMap.get(rootComment.id)?.map((childComment: any) => renderNestedComments(childComment))}
        </div>
      ));
  };

  return (
    // Write a comment
    <div className="" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
      <div className="commentContainer">{nestComments(comments)}</div>
      <div className="comment-input-container">
        <div className="flex flex-row gap-2 w-full">
          <Image
            className="input-avatar"
            src={user ? user.icon : '/root/temp.jpg'}
            alt="User Icon"
            width={20}
            height={20}
          />
          <input
            type="text"
            className="comment-input"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your own comment.."
          />
        </div>
        <Send className="cursor-pointer" color="#202020" size={12} strokeWidth={2} onClick={handleAdd}  aria-label='send' />
      </div>
    </div>
  );
};

export default CommentSection;