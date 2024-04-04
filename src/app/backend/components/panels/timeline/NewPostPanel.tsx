// 'use server'

import Image from 'next/image';
import Panel from '@/src/app/backend/components/layouts/PanelLayout';
import CreatePost from '@/src/app/backend/components/dialogs/CreatePostPopup';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { Glasses, Megaphone, Tag } from 'lucide-react';

const NewPostPanel: React.FC = () => {
  const router = useRouter();
  const { user } = useGlobalContext();

  const [isCreatePostPopupOpen, setIsCreatePostPopupOpen] = useState(false);
  const [postType, setPostType] = useState(0);

  const handleTypeClick = (type: number, popup: boolean) => {
    if (user.uuid === '') router.push('/auth/login');

    setIsCreatePostPopupOpen(popup);
    setPostType(type);
  };

  return (
    <main>
      <div className="new-post">
        <div className="post-input" onClick={() => handleTypeClick(1, true)}>
          <Image className="rounded-full w-6 h-6 object-cover" src={user.icon} alt="User Icon" width={22} height={22} />
          <span>Post about something...</span>
        </div>

        <div className="action" onClick={() => handleTypeClick(1, true)}>
          <Megaphone color="#999999" size={14} />
        </div>

        <div className="action" onClick={() => handleTypeClick(2, true)}>
          <Glasses color="#999999" size={14} />
        </div>

        <div className="action" onClick={() => handleTypeClick(3, true)}>
          <Tag color="#999999" size={14} />
        </div>
      </div>

      {isCreatePostPopupOpen && <CreatePost onClose={() => handleTypeClick(0, false)} type={postType} />}
    </main>
  );
};

export default NewPostPanel;
