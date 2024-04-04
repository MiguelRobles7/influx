// 'use server'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Wrapper from '@/src/app/backend/components/layouts/WrapperLayout';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { User, Bookmark, ShoppingBag, Sparkle, Search, Glasses, MemoryStick, Megaphone, Settings2 } from 'lucide-react';

// Module Component for Links
const Module = ({ elements }: { elements: [string, JSX.Element, string][] }) => {
  return (
    <>
      {elements.map((element, index) => {
        const [name, icon, route] = element;
        return (
          <Link key={index} href={route} className="nav-row">
            {icon}
            <h6>{name}</h6>
          </Link>
        );
      })}
    </>
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
          <h6 className="top">
            <span>{user.first_name}</span>
            {user.is_verified ? (
              <span className="inline-block w-4 h-4 relative top-[0.125rem]">
                <Image src="/root/verified.svg" alt="verified" width={16} height={16} />
              </span>
            ) : null}
          </h6>
          <h6 className="bottom">{`@${user.handle}`}</h6>
        </div>
      </Link>

      {/* Modules */}
      <Wrapper className="body">
        {user.uuid !== '' ? (
          <>
            <Module
              elements={[
                ['Explore', <Glasses size={16} strokeWidth={2} color="#202020" />, '/explore'],
                ['Search', <Search size={16} strokeWidth={2} color="#202020" />, '/search'],
                ['Communities', <MemoryStick size={16} strokeWidth={2} color="#202020" />, '/communities'],
              ]}
            />
            <div className="explorer-hr" />
            <Module
              elements={[
                ['Shopping Cart', <ShoppingBag size={16} strokeWidth={2} color="#202020" />, '/cart'],
                ['Bookmarks', <Bookmark size={16} strokeWidth={2} color="#202020" />, '/bookmarks'],
              ]}
            />
          </>
        ) : null}
        <div className="explorer-hr" />
        <Module
          elements={[
            ['Notifications', <Megaphone size={16} strokeWidth={2} color="#202020" />, '/notifications'],
            ['Your Profile', <User size={16} strokeWidth={2} color="#202020" />, '/profile'],
            ['Preferences', <Settings2 size={16} strokeWidth={2} color="#202020" />, '/settings'],
          ]}
        />
      </Wrapper>
    </aside>
  );
};

export default ExplorerNav;
