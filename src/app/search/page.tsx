'use client'; //* Uses interactable components

import useFilterPosts from '@/src/app/backend/hooks/useFilterPosts';

import Timeline from '@/src/app/backend/components/layouts/TimelineLayout';
import About from '@/src/app/backend/components/panels/columns/AboutPanel';
import SearchFilters from '@/src/app/backend/components/panels/columns/SearchFiltersPanel';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostClass } from '@/src/libraries/structures';
import { useRefreshContext, useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';

export default function Home() {
  useRefreshContext();
  const { user, posts, loadMorePosts, hasMore } = useGlobalContext();

  const search = useSearchParams();
  const query = search.toString();
  const queryParams = new URLSearchParams(query);

  const [showFilteredPosts, setShowFilteredPosts] = useState<PostClass[]>([]);

  useEffect(() => {
    if (posts.length > 0) {
      setShowFilteredPosts(useFilterPosts([...posts], queryParams, user));
    }
  }, [posts]);

  return (
    <Timeline
      user={user}
      posts={showFilteredPosts}
      loadMorePosts={loadMorePosts}
      hasMore={hasMore}
      header={
        <>
          <section className="base-panel">
            <h6 className="results">Showing {posts.length} results</h6>
          </section>
        </>
      }
      panels={
        <>
          <SearchFilters />
          <About />
        </>
      }
    />
  );
}
