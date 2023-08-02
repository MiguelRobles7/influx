import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { User, Bookmark, Inbox, ShoppingBag, Settings, Sparkle, Truck, Moon, Megaphone, LayoutGrid } from 'lucide-react';
import { useGlobalContext } from '@/src/app/backend/hooks/GlobalContext';

const ExplorerNav: React.FC = () => {
  const { user } = useGlobalContext();
  return (
    <section id="profile" className="w-40 min-w-[10rem] ex-br gap-4 flex flex-col fixed">
    <Link href="/profile" className="flex flex-row items-start gap-2">
      <Image className="rounded-full" src={user.icon} alt="User Icon" width={48} height={48} />
      <div className="flex flex-col justify-center">
        <div className="flex flex-row gap-0.5 items-start">
        <h6 className="text-gray-800 font-medium text-base leading-4 tracking-tight">
          {user.first_name}<br/>{user.last_name}
          { user.is_verified ? (
          <span className="inline-block w-4 h-4 relative top-[0.125rem]"> 
            <Image src="/root/verified.svg" alt="verified" width={16} height={16} />
          </span>
          ) : null }
        </h6>
        </div>
        <h6 className="text-gray-500 font-regular text-[0.625rem] leading-4">{`@${user.handle}`}</h6>
      </div>
    </Link>
    <ul className="flex flex-col gap-0.5 relative right-2">
      <Link href="/explore" className="flex flex-row items-center gap-2 text-gray-700 px-2 py-1.5 rounded-sm hover:bg-slate-300 transition-colors duration-200">
        <Sparkle size={16} strokeWidth={3}/>
        <h6 className="font-regular text-sm">Explore</h6>
      </Link>
      <Link href="/bookmarks" className="flex flex-row items-center gap-2 text-gray-700 px-2 py-1.5 rounded-sm hover:bg-slate-300 transition-colors duration-200">
        <Bookmark size={16} strokeWidth={3}/>
        <h6 className="font-regular text-sm">Bookmarks</h6>
      </Link>
      <Link href="/cart" className="flex flex-row items-center gap-2 text-gray-700 px-2 py-1.5 rounded-sm hover:bg-slate-300 transition-colors duration-200">
        <ShoppingBag size={16} strokeWidth={3}/>
        <h6 className="font-regular text-sm">Shopping Cart</h6>
      </Link>
      <hr className="my-1"/>
      <Link href="/theme" className="flex flex-row items-center gap-2 text-gray-700 px-2 py-1.5 rounded-sm hover:bg-slate-300 transition-colors duration-200">
        <Moon size={16} strokeWidth={3}/>
        <h6 className="font-regular text-sm">Theme</h6>
      </Link>
      <Link href="/profile" className="flex flex-row items-center gap-2 text-gray-700 px-2 py-1.5 rounded-sm hover:bg-slate-300 transition-colors duration-200">
        <User size={16} strokeWidth={3}/>
        <h6 className="font-regular text-sm">Profile</h6>
      </Link>
      <Link href="/settings" className="flex flex-row items-center gap-2 text-gray-700 px-2 py-1.5 rounded-sm hover:bg-slate-300 transition-colors duration-200">
        <Settings size={16} strokeWidth={3}/>
        <h6 className="font-regular text-sm">Settings</h6>
      </Link>
      {/* <hr />
      <li className="flex flex-row items-center gap-2 text-gray-700">
        <LayoutGrid size={16} strokeWidth={3}/>
        <h6 className="font-regular text-sm">More</h6>
      </li> */}
    </ul>
    </section>
  );
};

export default ExplorerNav;