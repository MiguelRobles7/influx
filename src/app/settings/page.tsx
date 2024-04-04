'use client'; //* Uses interactable components

import Image from 'next/image';
import About from '@/src/app/backend/components/panels/columns/AboutPanel';
import Welcome from '@/src/app/backend/components/panels/columns/WelcomePanel';
import SearchFilters from '@/src/app/backend/components/panels/columns/SearchFiltersPanel';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRefreshContext, useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { NotificationClass } from '@/src/libraries/structures';

import React from 'react';
import Wrapper from '@/src/app/backend/components/layouts/WrapperLayout';
import TopbarNav from '@/src/app/backend/components/navigators/TopbarNav';
import ExplorerNav from '@/src/app/backend/components/navigators/ExplorerNav';
import Background from '@/src/app/backend/components/Background';
import NotificationsLayout from '../backend/components/layouts/NotificationsLayout';
import { ArrowUp, Bookmark, CheckCircle, Frame, KeyRound, Mail, ShoppingBag, UserPlus } from 'lucide-react';

export default function Home() {
  useRefreshContext();
  const { user, posts, notifications } = useGlobalContext();

  const router = useRouter();
  useEffect(() => {
    if (user.uuid === '') router.push('/auth/login');
  }, [user.uuid]);

  let user_notifs: NotificationClass[] = [];

  for (let notification of notifications) {
    if (user.notifications && user.notifications.includes(notification.id)) {
      user_notifs.push(notification);
    }
  }
  user_notifs = user_notifs.reverse();
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
                  <input type="text" placeholder="" />
                  <CheckCircle size={12} color="#7F62D9" strokeWidth={2} />
                </div>
                <span className="text-error">This username has been taken. Please choose another</span>
              </div>
              <div className="settings-column">
                <span>Change email address</span>
                <div className="input-container">
                  <div className="input-left">
                    <Mail size={12} color="#4C4C4C" strokeWidth={2} />
                  </div>
                  <input type="text" placeholder="" />
                  <CheckCircle size={12} color="#7F62D9" strokeWidth={2} />
                </div>
                <span className="text-error">This email has been taken. Please choose another</span>
              </div>
            </div>
            <div className="settings-row">
              <div className="settings-column">
                <span>Change password</span>
                <div className="input-container">
                  <div className="input-left">
                    <KeyRound size={12} color="#4C4C4C" strokeWidth={2} />
                  </div>
                  <input type="text" placeholder="" />
                  <CheckCircle size={12} color="#7F62D9" strokeWidth={2} />
                </div>
                <span className="text-error">
                  The password must be 8 characters long, containing only periods, underscores, letters and numbers.
                </span>
              </div>
              <div className="settings-column">
                <span>Repeat password</span>
                <div className="input-container">
                  <div className="input-left">
                    <KeyRound size={12} color="#4C4C4C" strokeWidth={2} />
                  </div>
                  <input type="text" placeholder="" />
                  <CheckCircle size={12} color="#7F62D9" strokeWidth={2} />
                </div>
                <span className="text-error">
                  The password must be 8 characters long, containing only periods, underscores, letters and numbers.
                </span>
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
          <Welcome />
          <SearchFilters />
          <About />
        </div>
      </Wrapper>
    </main>
  );
}
