'use client'; //* Uses interactable components

import dynamic from 'next/dynamic';
import Timeline from '@/src/app/backend/components/layouts/TimelineLayout';
import About from '@/src/app/backend/components/panels/columns/AboutPanel';
import Welcome from '@/src/app/backend/components/panels/columns/WelcomePanel';
import { useRefreshContext, useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';

const Home = () => {
  useRefreshContext();
  const { user, posts } = useGlobalContext();

  return (
    <Timeline
      user={user}
      posts={posts}
      header={<></>}
      panels={
        <>
          <Welcome />
          <About />
        </>
      }
    />
  );
};

const NoSSRPost = dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

export default NoSSRPost;
