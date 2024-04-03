// 'use server'

import Image from 'next/image';
import Panel from '@/src/app/backend/components/layouts/PanelLayout';
import React, { useEffect, useState } from 'react';
import { CommentClass, CommunityClass, PostClass, UserClass } from '@/src/libraries/structures';
import { Maximize } from 'lucide-react';

const ProfileMedia: React.FC<{ user: UserClass }> = ({ user }) => {
  return (
    <Panel classes="media-panel">
      <div className="header-row">
        <span>Media</span>
        <button>
          <Maximize size={10} color="#202020" strokeWidth={2} />
        </button>
      </div>
      {/* TODO - Joshi: Add media here */}
      <div className="media-wrapper">
        <Image className="media" src="/illustrations/confirm.png" alt="User Icon" width={80} height={80} />
        <Image className="media" src="/illustrations/confirm.png" alt="User Icon" width={80} height={80} />
        <Image className="media" src="/illustrations/confirm.png" alt="User Icon" width={80} height={80} />
      </div>
    </Panel>
  );
};

export default ProfileMedia;
