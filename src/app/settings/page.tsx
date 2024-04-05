'use client'; //* Uses interactable components

import Image from 'next/image';
import About from '@/src/app/backend/components/panels/columns/AboutPanel';
import ProfileAccount from '@/src/app/backend/components/panels/columns/ProfileAccountPanel';
import ProfileComments from '@/src/app/backend/components/panels/columns/ProfileCommentsPanel';
import ProfileMedia from '@/src/app/backend/components/panels/columns/ProfileMediaPanel';
import { useRouter } from 'next/navigation';
import { useRefreshContext, useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import React, { useState, useRef, useEffect } from 'react';
import { UserClass } from '@/src/libraries/structures';
import Supabase from '@/src/app/backend/model/supabase';

import Wrapper from '@/src/app/backend/components/layouts/WrapperLayout';
import TopbarNav from '@/src/app/backend/components/navigators/TopbarNav';
import ExplorerNav from '@/src/app/backend/components/navigators/ExplorerNav';
import Background from '@/src/app/backend/components/Background';
import { ArrowUp, Bookmark, Frame, KeyRound, Mail, MessageCircle, ShoppingBag, UserPlus } from 'lucide-react';

export default function Home() {
  useRefreshContext();
  const { user } = useGlobalContext();

  const [formData, setFormData] = useState<UserClass>(new UserClass(user));

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (event.target.name === '1') {
      console.log('1');
      user.notifs_on[0] = !user.notifs_on[0];
      setFormData({ ...formData, notifs_on: user.notifs_on });
    }
    if (event.target.name === '2') {
      console.log('2');
      user.notifs_on[1] = !user.notifs_on[1];
      setFormData({ ...formData, notifs_on: user.notifs_on });
    }
    if (event.target.name === '3') {
      console.log('3');
      user.notifs_on[2] = !user.notifs_on[2];
      setFormData({ ...formData, notifs_on: user.notifs_on });
    }
    if (event.target.name === '4') {
      console.log('4');
      user.notifs_on[3] = !user.notifs_on[3];
      setFormData({ ...formData, notifs_on: user.notifs_on });
    }
    if (event.target.name === '5') {
      console.log('5');
      user.notifs_on[4] = !user.notifs_on[4];
      setFormData({ ...formData, notifs_on: user.notifs_on });
    }
  };

  const updateProfile = async (event: React.FormEvent) => {
    event.preventDefault();

    const { data, error } = await Supabase.from('profiles')
      .update({ notifs_on: user.notifs_on })
      .match({ uuid: user.uuid })
      .select();

    if (error) throw error;
    else console.log('Updated profile', data);
  };

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

          <form className="settings-panel" onSubmit={updateProfile}>
            <span>Notifications</span>
            <div className="settings-row">
              <ArrowUp size={12} color="#202020" strokeWidth={2} />
              <p className="notif-line">Send me a notification every time a user upvotes one of my listings</p>
              <label className="switch">
                <input
                  name="1"
                  type="checkbox"
                  value={user.notifs_on[0] ? 'true' : 'false'}
                  checked={user.notifs_on[0]}
                  onChange={handleInputChange}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="settings-row">
              <UserPlus size={12} color="#202020" strokeWidth={2} />
              <p className="notif-line">Send me a notification every time a user shares my post</p>
              <label className="switch">
                <input
                  name="2"
                  type="checkbox"
                  value={user.notifs_on[1] ? 'true' : 'false'}
                  checked={user.notifs_on[1]}
                  onChange={handleInputChange}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="settings-row">
              <Bookmark size={12} color="#202020" strokeWidth={2} />
              <p className="notif-line">
                Send me a notification every time a user adds one of my listings to their bookmarks
              </p>
              <label className="switch">
                <input
                  name="3"
                  type="checkbox"
                  value={user.notifs_on[2] ? 'true' : 'false'}
                  checked={user.notifs_on[2]}
                  onChange={handleInputChange}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="settings-row">
              <ShoppingBag size={12} color="#202020" strokeWidth={2} />
              <p className="notif-line">
                Send me a notification every time a user adds one of my listings to their shopping cart
              </p>
              <label className="switch">
                <input
                  name="4"
                  type="checkbox"
                  value={user.notifs_on[3] ? 'true' : 'false'}
                  checked={user.notifs_on[3]}
                  onChange={handleInputChange}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="settings-row">
              <MessageCircle size={12} color="#202020" strokeWidth={2} />
              <p className="notif-line">Send me a notification every time a user comments on my post.</p>
              <label className="switch">
                <input
                  name="5"
                  type="checkbox"
                  value={user.notifs_on[4] ? 'true' : 'false'}
                  checked={user.notifs_on[4]}
                  onChange={handleInputChange}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="buttons-row">
              <button className="cancel-button">Cancel</button>
              <button className="save-button" type="submit">
                Save changes
              </button>
            </div>
          </form>
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
