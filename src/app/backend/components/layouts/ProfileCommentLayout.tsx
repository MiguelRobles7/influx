// 'use server'

import React from 'react';
import Image from 'next/image';
import { CommentClass, PostClass } from '@/src/libraries/structures';
import { useToRelativeTime } from '@/src/app/backend/hooks/useToConvert';

interface Props {
  comment: CommentClass;
  post: PostClass;
}

const ProfileCommentLayout: React.FC<Props> = ({ comment, post }) => {
  return (
    <main className="comment-container">
      <div className="community">
        <Image
          className="rounded-full"
          src={post.origin?.icon ?? '/avatars/temp.jpg'}
          alt="Shop Icon"
          width={10}
          height={10}
        />
        <span className="community-name">{post.origin.name}</span>
        <span className="community-handle">{`@c/${post.origin.handle}`}</span>
      </div>
      <span className="content">{comment.content}</span>
      <span className="footer">
        Commented on {`@${post.author.handle}`} listing •&ensp;{useToRelativeTime(new Date(comment.posted_at))}
      </span>
    </main>
  );
};

export default ProfileCommentLayout;
