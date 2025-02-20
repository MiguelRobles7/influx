'use client'; //* Uses interactable components

import Timeline from '@/src/app/backend/components/layouts/TimelineLayout';
import About from '@/src/app/backend/components/panels/columns/AboutPanel';
import Welcome from '@/src/app/backend/components/panels/columns/WelcomePanel';
import SearchFilters from '@/src/app/backend/components/panels/columns/SearchFiltersPanel';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRefreshContext, useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';

export default function Home() {
  useRefreshContext();
  const { user, posts, loadMorePosts, hasMore } = useGlobalContext();

  const router = useRouter();
  useEffect(() => {
    if (user.uuid === '') router.push('/auth/login');
  }, [user.uuid]);

  return (
    <Timeline
      user={user}
      posts={posts.filter((post) => user.bookmarks?.includes(post.id))}
      loadMorePosts={loadMorePosts}
      hasMore={hasMore}
      header={
        <>
          <section className="base-panel">
            <h6 className="results">Showing {posts.filter((post) => user.cart?.includes(post.id)).length} results</h6>
          </section>
        </>
      }
      panels={
        <>
          <Welcome />
          <SearchFilters />
          <About />
        </>
      }
    />
  );
}
