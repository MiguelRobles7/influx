// 'use server'

import Image from 'next/image';
import Wrapper from '@/src/app/backend/components/layouts/WrapperLayout';
import Panel from '@/src/app/backend/components/layouts/PanelLayout';
import UpdateProfile from '@/src/app/backend/components/dialogs/UpdateProfilePopup';
import React, { useState } from 'react';
import { UserClass } from '@/src/libraries/structures';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { useToTitleCase } from '@/src/app/backend/hooks/useToConvert';
import { Banknote, CreditCard, Map, Package2, Pocket, Settings2, ShoppingBag } from 'lucide-react';

const ProfileAccountPanel: React.FC<{ user: UserClass }> = ({ user }) => {
  const { user: active } = useGlobalContext();

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const handleProfileEditOpen = () => {
    setIsProfileEditOpen(true);
  };
  const handleProfileEditClose = () => {
    setIsProfileEditOpen(false);
  };

  return (
    <main>
      <Panel classes="profile-card-panel">
        {/* Header */}
        <Image className="profile-banner" src={user.banner} alt="profile-banner" width={280} height={1} />
        <Image className="styled-dent" src={'/root/profile_dent.svg'} alt="profile-dent" width={280} height={56} />

        {/* Profile */}
        <div className="header">
          <div className="left">
            <Image
              className="rounded-full w-9 h-9 object-cover"
              src={user.icon}
              alt="User Icon"
              width={32}
              height={32}
            />
            <div className="left-col">
              <div className="top">
                <span>{user.first_name}</span>
                {user.is_verified ? (
                  <span className="inline-block w-4 h-4 relative top-[0.125rem]">
                    <Image src="/root/verified.svg" alt="verified" width={16} height={16} />
                  </span>
                ) : null}
              </div>
              <div className="bottom">{`@${user.handle}`}</div>
            </div>
          </div>
          {/* Edit Profile */}
          {user.uuid === active.uuid ? (
            <button className="profile-edit-button" onClick={handleProfileEditOpen}>
              <Settings2 className="opacity-70" color="black" size={12} />
            </button>
          ) : null}
        </div>

        <div className="content">
          <p>{user.biography}</p>
          <div className="footer-split">
            <div className="footer-group">
              <Map color="black" size={12} />
              <span>{user.location}</span>
            </div>
            <div className="footer-group">
              <ShoppingBag color="black" size={12} />
              <span>{user.cart?.length} listings</span>
            </div>
          </div>
        </div>

        <div className="profile-divider"></div>
        <div className="flag-container">
          <div className="flag-column">
            <div className="flag-head">
              <Pocket color="black" size={12} />
              <span>Payment Methods</span>
            </div>
            <div className="flag-container">
              {user.payment_methods.map((method: any) => (
                <Image className="flag" src={`/flags/payment/${method}.svg`} alt={method} width={24} height={24} />
              ))}
            </div>
          </div>

          <div className="flag-column">
            <div className="flag-head">
              <Package2 color="black" size={12} />
              <span>Delivery Methods</span>
            </div>
            <div className="flag-container">
              {user.delivery_methods.map((method: any) => (
                <Image className="flag" src={`/flags/delivery/${method}.svg`} alt={method} width={24} height={24} />
              ))}
            </div>
          </div>
        </div>
      </Panel>
      {isProfileEditOpen && <UpdateProfile onClose={handleProfileEditClose} />}
    </main>
  );
};

export default ProfileAccountPanel;
