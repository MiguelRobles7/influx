// 'use server'

import Supabase from '@/src/app/backend/model/supabase';
import Image from 'next/image';
import Wrapper from '@/src/app/backend/components/layouts/WrapperLayout';
import Panel from '@/src/app/backend/components/layouts/PanelLayout';
import ProfileMedia from '@/src/app/backend/components/dialogs/ProfileMediaPopup';
import ExpandPost from '@/src/app/backend/components/dialogs/ExpandPostPopup';
import React, { useEffect, useState } from 'react';
import {  CommunityClass, PostClass, UserClass } from '@/src/libraries/structures';
import { Maximize } from 'lucide-react';

const ProfileMediaPanel: React.FC<{ user: UserClass }> = ({ user }) => {
  const [posts, setPosts] = useState<PostClass[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostClass[]>([]);

  // Maximized view popup
  const [isMediaPopupOpen, setIsMediaPopupOpen] = useState(false);
  const handleMediaPopupOpen = (posts: PostClass[]) => {
    setPosts(posts);
    setIsMediaPopupOpen(true);
  };
  const handleMediaPopupClose = () => {
    setIsMediaPopupOpen(false);
  };

  // Expanded post popup
  const [selectedPost, setSelectedPost] = useState<PostClass>();
  const [isExpandPostOpen, setIsExpandPostOpen] = useState(false);
  const handleExpandPostOpen = (post: PostClass) => {
    setSelectedPost(post);
    setIsExpandPostOpen(true);
  };
  const handleExpandPostClose = () => {
    let temp = posts;
    temp.map((post, index) => {
      if (post.id == selectedPost?.id) {
        temp[index] = selectedPost;
      }
    });
    setPosts(temp);
    setIsExpandPostOpen(false);
  };

  const fetchAssociatedPosts = async () => {
    try {
      const { data: postData, error: postError } = await Supabase
        .from('posts')
        .select('*')
        .eq('author_id', user?.uuid)
        .neq('media', '{}'); 
  
      if (postError) {
        throw new Error('Failed to fetch posts');
      }

      const originIds = postData.map((post) => post.origin_id);
  
      const { data: originData, error: originError } = await Supabase
        .from('communities')
        .select('*')
        .in('uuid', originIds);
  
      if (originError) {
        throw new Error('Error fetching associated origins');
      }
  
      const updatedPosts = postData.map((post) => ({
        ...post,
        author: user,
        origin: originData.find((origin) => origin.uuid === post.origin_id) || new CommunityClass(),
      }));
  
      updatedPosts.sort((a, b) => b.id - a.id);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts.slice(0, 6));
      
      console.log('Posts: ', posts);
      console.log('Filtered posts: ', filteredPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchAssociatedPosts();
  }, [fetchAssociatedPosts]);

  return (
    <Panel classes="media-panel">
      <div className="header-row">
        <span>Media</span>
        <button>
          <Maximize size={10} color="#202020" strokeWidth={2} onClick={() => { handleMediaPopupOpen(posts); }} />
        </button>
      </div>
      {isMediaPopupOpen && posts && <ProfileMedia posts={posts} onClose={handleMediaPopupClose} />}
      <div className="media-wrapper">
        {filteredPosts.map((post) => (
          post.media && (
            <Wrapper key={post.id} className="relative cursor-pointer rounded-sm overflow-hidden">
              <Image 
                className="media" 
                src={post.media[0]} 
                alt="Media" 
                width={80} 
                height={80}
                style={{ objectFit: 'cover', objectPosition: 'center' }} 
              />
              <div
                className="absolute top-0 left-0 w-full h-full rounded-sm bg-black opacity-0 hover:opacity-20 transition-all duration-300"
                onClick={() => {
                  handleExpandPostOpen(post);
                }}
              ></div>
            </Wrapper>
          )
        ))}
        {Array.from({ length: Math.max(0, 6 - filteredPosts.length) }).map((_, index) => (
          <div key={index} className="media" />
        ))}
      </div>
      {isExpandPostOpen && selectedPost && <ExpandPost post={selectedPost} onClose={handleExpandPostClose} />}
    </Panel>
  );
};

export default ProfileMediaPanel;
