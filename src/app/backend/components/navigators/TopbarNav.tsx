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
  Menu,
  Milestone,
  Plus,
  Search,
  ShoppingBag,
  SquareSlash,
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
    <nav className={`${type === 'homepage' ? 'h-24' : 'bg-[#F9FAFD] border-b-[1px] h-12'} topbar`} id="top-bar-nav">
      {/* Left */}
      <Wrapper className="left">
        {/* Influx Logo */}
        <Link href="/">
          <Image className="logo" src="/root/influx.svg" alt="Logo" width={40} height={12} />
        </Link>

        {/* Searchbar */}
        {user.uuid ? (
          <form
            action={`/search`}
            method="GET"
            className="bg-gray-200 text-gray-600 h-6 px-3 flex flex-row justify-between items-center gap-2 rounded-full cursor-pointer"
          >
            <div className="flex flex-row items-center gap-2">
              <Search size={12} strokeWidth={3} />
              <input
                className="text-gray-800 w-44 text-xs font-light bg-transparent focus:outline-none"
                type="text"
                placeholder="Look for anything..."
                name="query"
                value={query}
                onChange={handleSetQuery}
              />
            </div>
            <SquareSlash size={12} strokeWidth={3} />
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
              <div
                onClick={handleCreatePostPopupOpen}
                className="bg-gray-200 text-gray-600 h-6 py-1 px-2.5 flex items-center gap-1 rounded-full cursor-pointer hover:bg-slate-900 hover:text-violet-300 transition-colors duration-200"
              >
                <Plus size={12} strokeWidth={3} />
                <h6 className="text-xs font-regular leading-3">New</h6>
              </div>
              {isCreatePostPopupOpen && <CreatePost type={1} onClose={handleCreatePostPopupClose} />}
            </Wrapper>

            {/* Pages */}
            <Link
              href="/"
              className="bg-gray-200 text-gray-600 h-6 py-1 px-1.5 flex items-center rounded-full cursor-pointer
              hover:bg-gray-300 transition-colors duration-200"
            >
              <Home size={14} strokeWidth={3} />
            </Link>
            <Link
              href="/bookmarks"
              className="bg-gray-200 text-gray-600 h-6 py-1 px-1.5 flex items-center rounded-full cursor-pointer
            hover:bg-gray-300 transition-colors duration-200"
            >
              <Bookmark size={14} strokeWidth={3} />
            </Link>
            <Link
              href="/cart"
              className="bg-gray-200 text-gray-600 h-6 py-1 px-2.5 flex items-center gap-1 rounded-full cursor-pointer
            hover:bg-gray-300 transition-colors duration-200"
            >
              <ShoppingBag size={12} strokeWidth={3} />
              <h6 className="text-xs font-regular leading-3">{user.cart?.length || 0} items</h6>
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
              <div
                className="bg-gray-200 text-gray-600 h-6 py-1 px-1.5 flex items-center rounded-full cursor-pointer
            hover:bg-gray-300 transition-colors duration-200 mobile-menu"
              >
                <Menu size={14} strokeWidth={3} />
              </div>
            }
            elements={[
              ['Home', <Home size={12} strokeWidth={3} />, () => router.push(`/`)],
              ['Bookmarks', <Bookmark size={12} strokeWidth={3} />, () => router.push(`/bookmarks`)],
              ['Cart', <ShoppingBag size={12} strokeWidth={3} />, () => router.push(`/cart`)],
            ]}
          />
        ) : null}
      </Wrapper>

      {isLogoutPopupOpen && <LoggingOut />}
    </nav>
  );
};

export default TopbarNav;
