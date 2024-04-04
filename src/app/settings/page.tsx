'use client'; //* Uses interactable components

import Image from 'next/image';
import About from '@/src/app/backend/components/panels/columns/AboutPanel';
import ProfileAccount from '@/src/app/backend/components/panels/columns/ProfileAccountPanel';
import ProfileComments from '@/src/app/backend/components/panels/columns/ProfileCommentsPanel';
import ProfileMedia from '@/src/app/backend/components/panels/columns/ProfileMediaPanel';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRefreshContext, useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';

import React from 'react';
import Wrapper from '@/src/app/backend/components/layouts/WrapperLayout';
import TopbarNav from '@/src/app/backend/components/navigators/TopbarNav';
import ExplorerNav from '@/src/app/backend/components/navigators/ExplorerNav';
import Background from '@/src/app/backend/components/Background';
import { ArrowUp, Bookmark, Frame, KeyRound, Mail, ShoppingBag, UserPlus } from 'lucide-react';

export default function Home() {
  useRefreshContext();
  const { user } = useGlobalContext();
  return (
    <main>
      <Background />
      <TopbarNav type="" />

      <Wrapper className="timeline-wrapper flex flex-row gap-2 w-full h-full align-center z-50">
        {/* Left */}
        <ExplorerNav />

        {/* Middle */}
        <div className="flex flex-col gap-2 h-full overflow-y-visible overflow-x-auto justify-center max-w-[32rem]">
          <div className="settings-panel">
            <span>Account</span>
            <div className="settings-row">
              <div className="settings-column">
                <span>Change username</span>
                <div className="input-container">
                  <div className="input-left">
                    <Frame size={12} color="#4C4C4C" strokeWidth={2} />
                  </div>
                  <input type="text" placeholder={`@${user.handle}`} />
                </div>
                {/* <span className="text-error">This username has been taken. Please choose another</span> */}
              </div>
              <div className="settings-column">
                <span>Change email address</span>
                <div className="input-container">
                  <div className="input-left">
                    <Mail size={12} color="#4C4C4C" strokeWidth={2} />
                  </div>
                  <input type="text" placeholder={user.email_address} />
                </div>
                {/* <span className="text-error">This email has been taken. Please choose another</span> */}
              </div>
            </div>
            <div className="settings-row">
              <div className="settings-column">
                <span>Change password</span>
                <div className="input-container">
                  <div className="input-left">
                    <KeyRound size={12} color="#4C4C4C" strokeWidth={2} />
                  </div>
                  <input type="password" placeholder="" />
                </div>
                {/* <span className="text-error">
                  The password must be 8 characters long, containing only periods, underscores, letters and numbers.
                </span> */}
              </div>
              <div className="settings-column">
                <span>Repeat password</span>
                <div className="input-container">
                  <div className="input-left">
                    <KeyRound size={12} color="#4C4C4C" strokeWidth={2} />
                  </div>
                  <input type="password" placeholder="" />
                </div>
                {/* <span className="text-error">
                  The password must be 8 characters long, containing only periods, underscores, letters and numbers.
                </span> */}
              </div>
            </div>
            <div className="buttons-row">
              <button className="cancel-button">Cancel</button>
              <button className="save-button">Save changes</button>
            </div>
          </div>

          <div className="settings-panel">
            <span>Notifications</span>
            <div className="settings-row">
              <ArrowUp size={12} color="#202020" strokeWidth={2} />
              <p className="notif-line">Send me a notification every time a user upvotes one of my listings</p>
              <label className="switch">
                <input name="open" type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="settings-row">
              <UserPlus size={12} color="#202020" strokeWidth={2} />
              <p className="notif-line">Send me a notification every time a user shares my post</p>
              <label className="switch">
                <input name="open" type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="settings-row">
              <Bookmark size={12} color="#202020" strokeWidth={2} />
              <p className="notif-line">
                Send me a notification every time a user adds one of my listings to their bookmarks
              </p>
              <label className="switch">
                <input name="open" type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="settings-row">
              <ShoppingBag size={12} color="#202020" strokeWidth={2} />
              <p className="notif-line">
                Send me a notification every time a user adds one of my listings to their shopping cart
              </p>
              <label className="switch">
                <input name="open" type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="buttons-row">
              <button className="cancel-button">Cancel</button>
              <button className="save-button">Save changes</button>
            </div>
          </div>
        </div>
        {/* Panels */}
        <div className="layout-right">
          <ProfileAccount user={user} />
          <ProfileMedia user={user} />
          <ProfileComments user={user} />
          <About />
        </div>
      </Wrapper>
    </main>
  );
}
