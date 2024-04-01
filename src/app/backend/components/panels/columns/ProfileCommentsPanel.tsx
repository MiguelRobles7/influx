// 'use server'

import Supabase from '@/src/app/backend/model/supabase';
import Panel from '@/src/app/backend/components/layouts/PanelLayout';
import ProfileComment from '@/src/app/backend/components/layouts/ProfileCommentLayout';
import React, { useEffect, useState } from 'react';
import { CommentClass, CommunityClass, PostClass, UserClass } from '@/src/libraries/structures';

const ProfileCommentsPanel: React.FC<{ user: UserClass }> = ({ user }) => {
  const [comments, setComments] = useState<CommentClass[]>([]);
  const [posts, setPosts] = useState<PostClass[]>([]);

  useEffect(() => {
    if (user) {
      fetchComments();
    }
  }, [user]);

  const fetchComments = async () => {
    const { data, error } = await Supabase.from('comments')
      .select('*')
      .eq('author', user?.uuid)
      .eq('is_deleted', false)
      .order('posted_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching comments:', error.message);
    } else {
      const commentsWithAuthor = data.map((comment) => ({
        ...comment,
        author: user,
      }));

      setComments(commentsWithAuthor);
      fetchAssociatedPosts(commentsWithAuthor);
    }
  };

  const fetchAssociatedPosts = async (comments: CommentClass[]) => {
    const postIds = comments.map((comment) => comment.enclosing_post);

    const { data: postData, error: postError } = await Supabase.from('posts').select('*').in('id', postIds);

    if (postError) {
      console.error('Error fetching associated posts:', postError.message);
    } else {
      setPosts(postData);

      const authorIds = postData.map((post) => post.author_id);
      const originIds = postData.map((post) => post.origin_id);

      const { data: authorData, error: authorError } = await Supabase.from('profiles')
        .select('*')
        .in('uuid', authorIds);

      const { data: originData, error: originError } = await Supabase.from('communities')
        .select('*')
        .in('uuid', originIds);

      if (authorError) {
        console.error('Error fetching associated authors:', authorError.message);
      } else if (originError) {
        console.error('Error fetching associated origins:', originError.message);
      } else {
        const updatedPosts = postData.map((post) => ({
          ...post,
          author: authorData.find((author) => author.uuid === post.author_id) || new UserClass(),
          origin: originData.find((origin) => origin.uuid === post.origin_id) || new CommunityClass(),
        }));

        setPosts(updatedPosts);
      }
    }
  };

  return (
    <Panel classes="comments-panel">
      <span>Comments</span>
      {comments.map((comment) => (
        <ProfileComment
          key={comment.id}
          comment={comment}
          post={new PostClass(posts.find((post) => post.id === comment.enclosing_post))}
        />
      ))}
    </Panel>
  );
};

export default ProfileCommentsPanel;
