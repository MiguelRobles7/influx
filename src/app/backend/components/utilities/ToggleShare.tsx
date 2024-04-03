'use client'; //* Uses interactable components

import Supabase from '@/src/app/backend/model/supabase';
import React, { useState } from 'react';
import { PostClass, UserClass } from '@/src/libraries/structures';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { Repeat2 } from 'lucide-react';

interface Props {}

const ToggleShare: React.FC<Props> = () => {
  return (
    // TODO - Miguel: Implement notification on share once share functionality is implemented
    // TODO - JMS: Implement share functionality here
    <div className={`interaction-row  ${false ? 'bg-violet-200 hover:bg-violet-300' : 'hover:bg-gray-200 '}`}>
      <Repeat2 className="" size={14} strokeWidth={3} />
      <h6 className=" font-normal text-xs">0</h6>
    </div>
  );
};

export default ToggleShare;
