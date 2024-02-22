// 'use server'

import React from 'react';
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
}

const Timeline: React.FC<Props> = ({ type, user, header, panels, posts }) => {
  return (
    <main>
      <Background />
      <TopbarNav type={type} />

      <Wrapper className="timeline-wrapper flex flex-row gap-2 w-full h-full align-center z-50">
        {/* Left */}
        <ExplorerNav />
        <div id="padder" className="w-40 min-w-[10rem] ex-br"></div>

        {/*  Middle / Timeline*/}
        <div
          className="flex flex-col gap-2 h-full overflow-y-visible overflow-x-auto justify-center max-w-[32rem]"
          id="right-wrapper"
        >
          {header}
          {posts.length ? (
            <ul className="timeline-container overflow-x-auto">
              {posts.map((post: PostClass) => (
                <Post post={post} />
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
        <div className="ex-br">
          <div className="flex flex-col gap-2 h-full w-[18rem] ra-br z-30 fixed">{panels}</div>
        </div>

        {/* Right */}
        <div id="quick" className="h-full w-40 min-w-[10rem] gap-4 flex flex-col fixed right-[12%] ex-br"></div>
        <div id="padder" className="w-40 min-w-[10rem] ex-br"></div>
      </Wrapper>
    </main>
  );
};

export default Timeline;
