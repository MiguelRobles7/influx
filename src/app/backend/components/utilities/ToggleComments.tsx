'use client'; //* Uses interactable components

import Supabase from '@/src/app/backend/model/supabase';
import React, { useState } from 'react';
import { PostClass, UserClass } from '@/src/libraries/structures';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { MessageCircle, Repeat2 } from 'lucide-react';

interface Props {
  post: PostClass;
  handleExpandPostOpen: () => void;
}

const ToggleShare: React.FC<Props> = ({ post, handleExpandPostOpen }) => {
  return (
    <div
      className={`interaction-row  ${false ? 'bg-violet-200 hover:bg-violet-300' : 'hover:bg-gray-200 '}`}
      onClick={handleExpandPostOpen}
    >
      <MessageCircle className="text-gray-800" size={14} strokeWidth={3} />
      <h6 className="text-gray-800 font-normal text-xs">{post.comments?.length || 0} comments</h6>
    </div>
  );
};

export default ToggleShare;
