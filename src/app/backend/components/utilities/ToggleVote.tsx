'use client'; //* Uses interactable components

import Supabase from '@/src/app/backend/model/supabase';
import React, { useState } from 'react';
import { PostClass, CommentClass } from '@/src/libraries/structures';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { send } from 'process';

interface Props {
  type: string;
  post?: PostClass;
  comment?: CommentClass;
}

const ToggleVote: React.FC<Props> = ({ type, post, comment }) => {
  const savePostUpvotes = async () => {
    const { data, error } = await Supabase.from('posts').update({ upvotes: post?.upvotes }).eq('id', post?.id);

    if (error) throw error;
  };

  const savePostDownvotes = async () => {
    const { data, error } = await Supabase.from('posts').update({ downvotes: post?.downvotes }).eq('id', post?.id);

    if (error) throw error;
  };

  const saveCommentUpvotes = async () => {
    const { data, error } = await Supabase.from('comments').update({ upvotes: comment?.upvotes }).eq('id', comment?.id);

    if (error) throw error;
  };

  const saveCommentDownvotes = async () => {
    const { data, error } = await Supabase.from('comments')
      .update({ downvotes: comment?.downvotes })
      .eq('id', comment?.id);

    if (error) throw error;
  };

  const sendNotification = async () => {
    const notification: any = {
      type: 'upvote',
      content: `@${user.handle} upvoted your post.`,
      related_post: post?.id,
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

  const { user } = useGlobalContext();

  const [upvoted, setUpvoted] = useState(
    type === 'post' ? post?.upvotes?.includes(user.uuid) : comment?.upvotes?.includes(user.uuid)
  );
  const [downvoted, setDownvoted] = useState(
    type === 'post' ? post?.downvotes?.includes(user.uuid) : comment?.downvotes?.includes(user.uuid)
  );

  const handleUpvote = () => {
    if (user.uuid === '') return;
    if (type === 'post') {
      if (!upvoted) {
        if (downvoted) {
          post?.downvotes?.splice(post?.downvotes?.indexOf(user.uuid), 1);
          savePostDownvotes();
          setDownvoted(false);
        }
        post?.upvotes?.push(user.uuid);
        savePostUpvotes();
        setUpvoted(true);
        if (user.notifs_on[0]) sendNotification();
      } else {
        post?.upvotes?.splice(post?.upvotes?.indexOf(user.uuid), 1);
        savePostUpvotes();
        setUpvoted(false);
      }
    } else if (type === 'comment') {
      if (!upvoted) {
        if (downvoted) {
          comment?.downvotes?.splice(comment?.downvotes?.indexOf(user.uuid), 1);
          saveCommentDownvotes();
          setDownvoted(false);
        }
        comment?.upvotes?.push(user.uuid);
        saveCommentUpvotes();
        setUpvoted(true);
      } else {
        comment?.upvotes?.splice(comment?.upvotes?.indexOf(user.uuid), 1);
        saveCommentUpvotes();
        setUpvoted(false);
      }
    }
  };

  const handleDownvote = () => {
    if (user.uuid === '') return;
    if (type === 'post') {
      if (!downvoted) {
        if (upvoted) {
          post?.upvotes?.splice(post?.upvotes?.indexOf(user.uuid), 1);
          savePostUpvotes();
          setUpvoted(false);
        }
        post?.downvotes?.push(user.uuid);
        savePostDownvotes();
        setDownvoted(true);
      } else {
        post?.downvotes?.splice(post?.downvotes?.indexOf(user.uuid), 1);
        savePostDownvotes();
        setDownvoted(false);
      }
    } else if (type === 'comment') {
      if (!downvoted) {
        if (upvoted) {
          comment?.upvotes?.splice(comment?.upvotes?.indexOf(user.uuid), 1);
          saveCommentUpvotes();
          setUpvoted(false);
        }
        comment?.downvotes?.push(user.uuid);
        saveCommentDownvotes();
        setDownvoted(true);
      } else {
        comment?.downvotes?.splice(comment?.downvotes?.indexOf(user.uuid), 1);
        saveCommentDownvotes();
        setDownvoted(false);
      }
    }
  };

  const voteCount =
    type === 'post'
      ? (post?.upvotes?.length || 0) - (post?.downvotes?.length || 0)
      : (comment?.upvotes?.length || 0) - (comment?.downvotes?.length || 0);

  return (
    <div className="interaction-row">
      <div className="flex items-center justify-center cursor-pointer hover:bg-gray-200 h-6 w-6 transition-colors duration-200 rounded-sm">
        <ArrowUp
          className={`m-1 ${upvoted ? 'text-[#6157ff]' : ''}`}
          size={12}
          strokeWidth={3}
          onClick={handleUpvote}
          aria-label="upvote-btn"
        />
      </div>

      {upvoted || downvoted ? (
        <>
          <h6 className="text-[#6157ff] font-normal text-xs">{voteCount}</h6>
        </>
      ) : (
        <>
          <h6 className=" font-normal text-xs">{voteCount}</h6>
        </>
      )}

      <div
        className={`flex items-center justify-center cursor-pointer hover:bg-gray-200 h-6 w-6 transition-colors duration-200 rounded-sm ${
          downvoted ? 'bg-violet-200 hover:bg-violet-300' : ''
        }`}
      >
        <ArrowDown
          className={`m-1 ${downvoted ? 'text-[#6157ff]' : ''}`}
          size={12}
          strokeWidth={3}
          onClick={handleDownvote}
          aria-label="downvote-btn"
        />
      </div>
    </div>
  );
};

export default ToggleVote;
