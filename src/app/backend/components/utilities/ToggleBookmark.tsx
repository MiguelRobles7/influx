'use client'; //* Uses interactable components

import Supabase from '@/src/app/backend/model/supabase';
import React, { useState } from 'react';
import { PostClass } from '@/src/libraries/structures';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { Bookmark } from 'lucide-react';

interface Props {
  value?: boolean;
  post: PostClass;
}

const ToggleBookmark: React.FC<Props> = ({ value, post }) => {
  const sendNotification = async () => {
    const notification: any = {
      type: 'bookmark',
      content: `@${user.handle} bookmarked your listing.`,
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

  const savePostBookmarks = async () => {
    const { data, error } = await Supabase.from('posts').update({ bookmarks: post.bookmarks }).eq('id', post.id);

    if (error) throw error;
  };

  const saveUserBookmarks = async () => {
    const { data, error } = await Supabase.from('profiles').update({ bookmarks: user.bookmarks }).eq('uuid', user.uuid);

    if (error) throw error;
  };

  const { user, setUser } = useGlobalContext();

  const [bookmarked, setBookmarked] = useState(post.bookmarks?.includes(user.uuid));

  const handleBookmarkToggle = () => {
    if (user.uuid === '') return;
    if (!bookmarked) {
      post.bookmarks?.push(user.uuid);
      user.bookmarks?.push(post.id);
      savePostBookmarks();
      saveUserBookmarks();
      setUser(user);
      setBookmarked(true);
      sendNotification();
    } else {
      post.bookmarks?.splice(post.bookmarks?.indexOf(user.uuid), 1);
      user.bookmarks?.splice(user.bookmarks?.indexOf(post.id), 1);
      savePostBookmarks();
      saveUserBookmarks();
      setUser(user);
      setBookmarked(false);
    }
  };

  return (
    <div
      className={`interaction-row transition-colors duration-200 px-2 py-1 rounded-sm h-6 ${
        bookmarked ? 'bg-violet-200 hover:bg-violet-300' : 'hover:bg-gray-200 '
      }`}
      onClick={handleBookmarkToggle}
    >
      {bookmarked ? (
        <>
          <Bookmark className="text-[#6157ff]" size={14} strokeWidth={3} />
          <h6 className="text-[#6157ff] font-normal text-xs">{value ? post.bookmarks?.length || 0 : ''}</h6>
        </>
      ) : (
        <>
          <Bookmark className="" size={14} strokeWidth={3} />
          <h6 className=" font-normal text-xs">{value ? post.bookmarks?.length || 0 : ''}</h6>
        </>
      )}
    </div>
  );
};

export default ToggleBookmark;
