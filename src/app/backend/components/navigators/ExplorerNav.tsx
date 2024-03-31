// 'use server'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Wrapper from '@/src/app/backend/components/layouts/WrapperLayout';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { User, Bookmark, ShoppingBag, Sparkle, Search, Glasses, MemoryStick } from 'lucide-react';

// Module Component for Links
const Module = ({ elements }: { elements: [string, JSX.Element, string][] }) => {
  return (
    <Wrapper className="flex flex-col gap-1">
      {elements.map((element, index) => {
        const [name, icon, route] = element;
        return (
          <Link
            key={index}
            href={route}
            className="flex flex-row items-center gap-2 text-gray-700 px-2 py-1.5 rounded-sm hover:bg-slate-300 transition-colors duration-200"
          >
            {icon}
            <h6 className="font-normal leading-4 text-sm">{name}</h6>
          </Link>
        );
      })}
    </Wrapper>
  );
};

const ExplorerNav: React.FC = () => {
  // Export user from global context
  const { user } = useGlobalContext();

  return (
    <aside className="explorer">
      {/* Profile */}
      <Link href="/profile" className="header">
        {/* Icon */}
        <Image className="rounded-full w-9 h-9 object-cover" src={user.icon} alt="User Icon" width={36} height={36} />

        {/* Name */}
        <div className="right">
          <h6 className="flex flex-row gap-0.5 items-start flex-wrap text-gray-800 font-medium text-sm leading-5 tracking-tight w-full">
            <span>{user.first_name}</span>
            {user.is_verified ? (
              <span className="inline-block w-4 h-4 relative top-[0.125rem]">
                <Image src="/root/verified.svg" alt="verified" width={16} height={16} />
              </span>
            ) : null}
          </h6>
          <h6 className="text-gray-500 font-regular text-[0.625rem] leading-3">{`@${user.handle}`}</h6>
        </div>
      </Link>

      {/* Modules */}
      <Wrapper className="body">
        {user.uuid !== '' ? (
          <>
            <Module
              elements={[
                ['Explore', <Glasses size={16} strokeWidth={2} />, '/explore'],
                ['Search', <Search size={16} strokeWidth={2} />, '/search'],
                ['Communities', <MemoryStick size={16} strokeWidth={2} />, '/communities'],
              ]}
            />
            <div className="explorer-hr" />
            <Module
              elements={[
                ['Shopping Cart', <ShoppingBag size={16} strokeWidth={2} />, '/cart'],
                ['Bookmarks', <Bookmark size={16} strokeWidth={2} />, '/bookmarks'],
              ]}
            />
          </>
        ) : null}
        <div className="explorer-hr" />
        <Module
          elements={[
            ['Notifications', <Sparkle size={16} strokeWidth={2} />, '/notifications'],
            ['Your Profile', <User size={16} strokeWidth={2} />, '/profile'],
            ['Preferences', <Search size={16} strokeWidth={2} />, '/settings'],
          ]}
        />
      </Wrapper>
    </aside>
  );
};

export default ExplorerNav;
