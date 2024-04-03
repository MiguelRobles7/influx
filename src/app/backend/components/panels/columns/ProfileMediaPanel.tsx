// 'use server'

import Supabase from '@/src/app/backend/model/supabase';
import Image from 'next/image';
import Panel from '@/src/app/backend/components/layouts/PanelLayout';
import ExpandPost from '@/src/app/backend/components/dialogs/ExpandPostPopup';
import React, { useEffect, useState } from 'react';
import { PostClass, UserClass } from '@/src/libraries/structures';
import { Maximize } from 'lucide-react';

const ProfileMediaPanel: React.FC<{ user: UserClass }> = ({ user }) => {
  const [posts, setPosts] = useState<PostClass[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostClass[]>([]);

  // Popover
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

  useEffect(() => {
    if (user) {
      fetchAssociatedPosts();
    }
  }, [user]);

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
  
      setPosts(postData);
      setFilteredPosts(posts.reverse().slice(0, 6));
      console.log('Posts: ', posts);
      console.log('Filtered posts: ', filteredPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <Panel classes="media-panel">
      <div className="header-row">
        <span>Media</span>
        <button>
          <Maximize size={10} color="#202020" strokeWidth={2} />
        </button>
      </div>
      <div className="media-wrapper">
        {filteredPosts.map((post) => (
          post.media && (
            <div key={post.id} className="relative cursor-pointer">
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
            </div>
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
