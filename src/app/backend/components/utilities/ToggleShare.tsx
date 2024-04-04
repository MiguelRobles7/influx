'use client'; //* Uses interactable components

import Supabase from '@/src/app/backend/model/supabase';
import React, { useState } from 'react';
import { PostClass, UserClass } from '@/src/libraries/structures';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { Repeat2 } from 'lucide-react';

interface Props {
  post: PostClass;
}

const ToggleShare: React.FC<Props> = ({ post }) => {
  const { user, setUser } = useGlobalContext();
  const [shared, setShared] = useState(post?.shares?.includes(user.uuid));

  const sendNotification = async () => {
    const notification: any = {
      type: 'share',
      content: `@${user.handle} shared your post.`,
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

  const savePostShares = async () => {
    const { data, error } = await Supabase.from('posts').update({ shares: post?.shares }).eq('id', post?.id);

    if (error) throw error;
  };

  const saveUserShares = async () => {
    const { data, error } = await Supabase.from('profiles').update({ shares: user.shares }).eq('uuid', user.uuid);

    if (error) throw error;
  };

  const handleShare = () => {
    if (user.uuid === '') return;

    if (!shared) {
      post?.shares?.push(user.uuid);
      user.shares?.push(post.id);
      savePostShares();
      saveUserShares();
      setUser(
        new UserClass({
          ...user,
          shares: user.shares,
        })
      );
      setShared(true);
      sendNotification();
    } else {
      post?.shares?.splice(post?.shares?.indexOf(user.uuid), 1);
      user.shares?.splice(user.shares?.indexOf(post.id), 1);
      savePostShares();
      saveUserShares();
      setUser(
        new UserClass({
          ...user,
          shares: user.shares,
        })
      );
      setShared(false);
    }
  };

  const shareCount = post?.shares?.length || 0;

  return (
    <div
      className={`interaction-row  ${shared ? 'bg-violet-200 hover:bg-violet-300' : 'hover:bg-gray-200 '}`}
      onClick={handleShare}
    >
      {shared ? (
        <>
          <Repeat2 className="text-[#6157ff]" size={12} strokeWidth={3} />
          <h6 className="text-[#6157ff] font-normal text-xs" data-testid="count1">
            {shareCount}
          </h6>
        </>
      ) : (
        <>
          <Repeat2 className="" size={12} strokeWidth={3} />
          <h6 className="font-normal text-xs" data-testid="count2">
            {shareCount}
          </h6>
        </>
      )}
    </div>
  );
};

export default ToggleShare;
