// 'use server'

import React, { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Wrapper from '@/src/app/backend/components/layouts/WrapperLayout';
import Post from '@/src/app/backend/components/layouts/PostLayout';
import TopbarNav from '@/src/app/backend/components/navigators/TopbarNav';
import ExplorerNav from '@/src/app/backend/components/navigators/ExplorerNav';
import Background from '@/src/app/backend/components/Background';
import { PostClass, UserClass } from '@/src/libraries/structures';

interface Props {
  type?: string;
  user: UserClass;
  posts: PostClass[];
  header?: React.ReactNode;
  panels?: React.ReactNode;
  loadMorePosts: () => void; 
  hasMore: boolean; 
}

const Timeline: React.FC<Props> = ({ type, user, header, panels, posts, loadMorePosts, hasMore }) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!hasMore || !loaderRef.current) return;
  
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );
  
    const loader = loaderRef.current;
    observer.observe(loader);
  
    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [hasMore, loadMorePosts]);  

  return (
    <main>
      <Background />
      <TopbarNav type={type} />

      <Wrapper className="timeline-wrapper flex flex-row gap-2 w-full h-full align-center z-50">
        {/* Left */}
        <ExplorerNav />

        {/*  Middle / Timeline*/}
        <div
          className="flex flex-col gap-2 h-full overflow-y-visible overflow-x-auto justify-center max-w-[32rem]"
          id="right-wrapper"
        >
          {header}
          {posts.length ? (
            <ul className="timeline-container overflow-x-auto">
              {posts.map((post: PostClass, index) => {
                const isLastPost = index === posts.length - 1;
                return (
                  <li key={post.id} ref={isLastPost ? loaderRef : null}>
                    <Post post={post} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <span className="flex flex-col items-center justify-center z-[-2]">
              <Image
                src={'/illustrations/no-posts.png'}
                width={1000}
                height={1000}
                alt="No posts"
                className="w-[50%]"
                priority={true}
              />
              <p className="text-gray-700 text-sm">No posts to show</p>
            </span>
          )}
        </div>

        {/* Panels */}
        <div className="layout-right">{panels}</div>
      </Wrapper>
    </main>
  );
};

export default Timeline;
