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
  const { user } = useGlobalContext();
  const [isShared, setIsShared] = useState(post?.shares?.includes(user.uuid));

  // TODO - Miguel: Implement notification on share once share functionality is implemented

  const savePostShares = async () => {
    const { data, error } = await Supabase.from('posts').update({ shares: post?.shares }).eq('id', post?.id);

    if (error) throw error;
  };

  const handleShare = () => {
    if (user.uuid === '') return;
    
    if (!isShared) {
      post?.shares?.push(user.uuid);
      savePostShares();
      setIsShared(true);
    } else {
      post?.shares?.splice(post?.shares?.indexOf(user.uuid), 1);
      savePostShares();
      setIsShared(false);
    }
  };

  const shareCount = (post?.shares?.length || 0)

  return (
    <div className={`interaction-row  ${false ? 'bg-violet-200 hover:bg-violet-300' : 'hover:bg-gray-200 '}`}>
      <Repeat2 className="" size={12} strokeWidth={3} onClick={handleShare} />
      <h6 className=" font-normal text-xs">{shareCount}</h6>
    </div>
  );
};

export default ToggleShare;
