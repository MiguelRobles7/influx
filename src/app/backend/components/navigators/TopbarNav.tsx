'use client'; //* Uses interactable components

import Image from 'next/image';
import Link from 'next/link';
import Popover from '@/src/app/backend/components/layouts/PopoverLayout';
import Wrapper from '@/src/app/backend/components/layouts/WrapperLayout';
import CreatePost from '@/src/app/backend/components/dialogs/CreatePostPopup';
import LoggingOut from '@/src/app/backend/components/dialogs/LoggingOutPopup';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserClass } from '@/src/libraries/structures';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';

// Icons
import {
  Bookmark,
  Cog,
  FormInput,
  Home,
  LogIn,
  LogOut,
  Megaphone,
  Menu,
  Milestone,
  Plus,
  Search,
  ShoppingBag,
  User,
} from 'lucide-react';

// Model
import Supabase from '@/src/app/backend/model/supabase';

const TopbarNav: React.FC<{ type?: string }> = ({ type }) => {
  // Instantiation
  const router = useRouter();
  const { user, setUser } = useGlobalContext();

  // Redirect to search page with the query
  const [query, setQuery] = useState('');
  const handleSetQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    console.log(query);
  };

  // Handle CreatePost state
  const [isCreatePostPopupOpen, setIsCreatePostPopupOpen] = useState(false);
  const handleCreatePostPopupOpen = () => {
    setIsCreatePostPopupOpen(true);
  };
  const handleCreatePostPopupClose = () => {
    setIsCreatePostPopupOpen(false);
  };

  // Handle Logout Popup state
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const handleLogoutPopupOpen = () => {
    setIsLogoutPopupOpen(true);
  };

  // Logout
  const handleLogout = async () => {
    const { error } = await Supabase.auth.signOut();
    if (error) throw error;

    localStorage.removeItem('token');

    setUser(
      new UserClass({
        id: -1,
        handle: 'Guest',
        first_name: 'Guest',
        last_name: 'User',
        icon: '/root/temp.jpg',
        email_address: '',
      })
    );

    router.push('/home');
    handleLogoutPopupOpen();
  };

  return (
    <nav className={`${type === 'homepage' ? 'h-24' : 'bg-[#F3F3F3] border-b-[1px] h-12'} topbar`} id="top-bar-nav">
      {/* Left */}
      <Wrapper className="left">
        {/* Influx Logo */}
        <Link href="/">
          <Image className="logo" src="/root/influx.svg" alt="Logo" width={40} height={12} />
        </Link>

        {/* Searchbar */}
        {user.uuid ? (
          <form action={`/search`} method="GET" className="searchbar">
            <div className="flex gap-1.5 items-center">
              <Search size={12} strokeWidth={2} color="#999999" />
              <input
                type="text"
                placeholder="Search for anything..."
                name="query"
                value={query}
                onChange={handleSetQuery}
              />
            </div>
          </form>
        ) : null}
      </Wrapper>

      {/* Right */}
      <Wrapper className="right">
        {/* Homepage */}
        {type === 'homepage' ? (
          <>
            <Link
              href="/auth/register"
              className="bg-gray-200 text-gray-600 h-6 py-1 px-2.5 flex items-center gap-1 rounded-full cursor-pointer hover:bg-slate-900 hover:text-violet-300 transition-colors duration-200"
            >
              <FormInput size={12} strokeWidth={3} />
              <h6 className="text-xs font-regular leading-3">Register</h6>
            </Link>
            <Link
              href="/auth/login"
              className="bg-gray-200 text-gray-600 h-6 py-1 px-2.5 flex items-center gap-1 rounded-full cursor-pointer hover:bg-slate-900 hover:text-violet-300 transition-colors duration-200"
            >
              <Milestone size={12} strokeWidth={3} />
              <h6 className="text-xs font-regular leading-3">Log in</h6>
            </Link>
          </>
        ) : null}

        {/* User Actions */}
        {user.uuid ? (
          <div className="actions">
            {/* Create Post */}
            <Wrapper>
              <div onClick={handleCreatePostPopupOpen} className="topbar-new-button">
                <Plus size={13} strokeWidth={2} color="#f3f3f3" />
                <span>New</span>
              </div>
              {isCreatePostPopupOpen && <CreatePost type={1} onClose={handleCreatePostPopupClose} />}
            </Wrapper>

            {/* Pages */}
            <Link href="/notifications" className="topbar-button">
              <Megaphone size={13} strokeWidth={2} color="#4C4C4C" />
            </Link>
            <Link href="/" className="topbar-button">
              <Home size={13} strokeWidth={2} color="#4C4C4C" />
            </Link>
            <Link href="/bookmarks" className="topbar-button">
              <Bookmark size={13} strokeWidth={2} color="#4c4c4c" />
            </Link>
            <Link href="/cart" className="topbar-button">
              <ShoppingBag size={13} strokeWidth={2} color="#4c4c4c" />
              <h6>{user.cart?.length || 0} items</h6>
            </Link>
          </div>
        ) : null}

        {/* User Popover */}
        {type === 'homepage' ? null : (
          <Popover
            classes={'top-8 user-popover'}
            trigger={
              <Image
                className="cursor-pointer rounded-full w-7 h-7 object-cover user-popover"
                src={user.icon}
                alt="User Icon"
                width={30}
                height={30}
              />
            }
            elements={
              user.uuid
                ? [
                    ['Profile', <User size={12} strokeWidth={3} />, () => router.push(`/profile`)],
                    ['Settings', <Cog size={12} strokeWidth={3} />, () => router.push(`/settings`)],
                    ['Logout', <LogOut size={12} strokeWidth={3} />, handleLogout],
                  ]
                : [
                    ['Home', <Home size={12} strokeWidth={3} />, () => router.push(`/home`)],
                    ['Log in', <LogIn size={12} strokeWidth={3} />, () => router.push(`/auth/login`)],
                    ['Register', <LogOut size={12} strokeWidth={3} />, () => router.push(`/auth/register`)],
                  ]
            }
          />
        )}

        {/* Mobile Menu */}
        {user.uuid ? (
          <Popover
            classes={'top-8'}
            trigger={
              <div className="topbar-button mobile-menu">
                <Menu size={14} strokeWidth={2} />
              </div>
            }
            elements={[
              ['Home', <Home size={12} strokeWidth={2} />, () => router.push(`/`)],
              ['Bookmarks', <Bookmark size={12} strokeWidth={2} />, () => router.push(`/bookmarks`)],
              ['Cart', <ShoppingBag size={12} strokeWidth={2} />, () => router.push(`/cart`)],
            ]}
          />
        ) : null}
      </Wrapper>

      {isLogoutPopupOpen && <LoggingOut />}
    </nav>
  );
};

export default TopbarNav;
