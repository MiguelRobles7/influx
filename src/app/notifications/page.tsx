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
          <section className="base-panel">
            <h6 className="results">Your notifications</h6>
          </section>
          {user_notifs.length ? (
            <ul className="timeline-container">
              {user_notifs.map((notif: NotificationClass) => (
                // eslint-disable-next-line react/jsx-key
                <NotificationsLayout notification={notif} user={user} posts={posts} />
              ))}
            </ul>
          ) : (
            <span className="flex flex-col items-center justify-center z-[-2]">
              <Image
                src={'/illustrations/no-posts.png'}
                width={1000}
                height={1000}
                alt="No posts"
                className=" w-[50%]"
                priority={true}
              />
              <p className="text-gray-700 text-sm">No posts to show</p>
            </span>
          )}
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
