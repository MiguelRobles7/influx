'use client';

// Layouts
import Timeline from '@/src/app/backend/components/layouts/TimelineLayout';
import About from '@/src/app/backend/components/panels/columns/AboutPanel';
import Welcome from '@/src/app/backend/components/panels/columns/WelcomePanel';
import NewPost from '@/src/app/backend/components/panels/timeline/NewPostPanel';
import { useRefreshContext, useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';

export default function Home() {
  useRefreshContext();
  const { user, posts } = useGlobalContext();

  return (
    <Timeline
      type="root"
      user={user}
      posts={posts}
      header={
        <>
          <NewPost />
        </>
      }
      panels={
        <>
          <Welcome />
          <About />
        </>
      }
    />
  );
}
