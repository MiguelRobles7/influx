// 'use server'

import React from 'react';
import Panel from '@/src/app/backend/components/layouts/PanelLayout';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';

const WelcomePanel: React.FC = ({}) => {
  const { user } = useGlobalContext();

  return (
    <div className="welcome-banner">
      <div className="content">
        <span>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
        </span>
        <p className="main-text">{user.first_name}.</p>
      </div>
      <img src="/illustrations/panel-blobs.svg" alt="Photo" className="panel-blobs" />
      <img src="/illustrations/panel-blobs-2.svg" alt="Photo" className="panel-blobs-2" />
    </div>
  );
};

export default WelcomePanel;
