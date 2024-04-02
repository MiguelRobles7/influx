'use client'; //* Uses interactable components

import dynamic from 'next/dynamic';
import Timeline from '@/src/app/backend/components/layouts/TimelineLayout';
import About from '@/src/app/backend/components/panels/columns/AboutPanel';
import Listings from '@/src/app/backend/components/panels/timeline/ListingsPanel';
import ProfileAccount from '@/src/app/backend/components/panels/columns/ProfileAccountPanel';
import ProfileComments from '@/src/app/backend/components/panels/columns/ProfileCommentsPanel';
import { useRouter } from 'next/navigation';
import { useRefreshContext, useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { useEffect } from 'react';

const Home = () => {
  useRefreshContext();
  const { user, posts } = useGlobalContext();

  const router = useRouter();
  useEffect(() => {
    if (user.uuid === '') router.push('/auth/login');
  }, [user.uuid]);

  return (
    <Timeline
      user={user}
      posts={posts.filter((post) => post.author.uuid === user.uuid)}
      header={
        <>
          <Listings user={user} />
        </>
      }
      panels={
        <>
          <ProfileAccount user={user} />
          {/* TODO - Joshi: media here */}
          <ProfileComments user={user} />
          <About />
        </>
      }
    />
  );
};

const NoSSRHome = dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

export default NoSSRHome;
