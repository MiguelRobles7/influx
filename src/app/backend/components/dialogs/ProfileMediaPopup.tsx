import React, { useRef, useState } from 'react';
import Image from 'next/image';

// Layouts
import Wrapper from '@/src/app/backend/components/layouts/WrapperLayout'
import Panel from '@/src/app/backend/components/layouts/PanelLayout';
import ExpandPost from '@/src/app/backend/components/dialogs/ExpandPostPopup';

// Hooks & Classes
import { PostClass } from '@/src/libraries/structures';
import useOutsideClick from '@/src/app/backend/hooks/useOutsideClick';

// Icons
import { X } from 'lucide-react';

interface Props {
  posts: PostClass[];
  onClose: () => void;
}

const ProfileMediaPopup: React.FC<Props> = ({ posts, onClose }) => {
  // Allow outside click to close modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(modalRef, onClose);

  // Expanded post popup
  const [selectedPost, setSelectedPost] = useState<PostClass>();
  const [isExpandPostOpen, setIsExpandPostOpen] = useState(false);
  const [isMediaPopupOpen, setIsMediaPopupOpen] = useState(false);
  const handleExpandPostOpen = (post: PostClass) => {
    setSelectedPost(post);
    setIsExpandPostOpen(true);
    setIsMediaPopupOpen(false);
  };
  const handleExpandPostClose = () => {
    setSelectedPost(undefined);
    setIsExpandPostOpen(false);
    setIsMediaPopupOpen(true); 
  };

  return (
    <main className={`text-gray-950 fixed top-0 left-0 w-screen h-screen flex items-center justify-center ${isExpandPostOpen ? '' : 'bg-black bg-opacity-50 backdrop-blur-sm'} z-50`}>
      {/* Modal */}
      <div className="profile-media" ref={modalRef}>
        <Panel classes="media-panel">
          <div className="header-row">
            <span>Media</span>
            <X className="cursor-pointer" color="black" size={14} strokeWidth={3} onClick={onClose} />
          </div>
          <div className={`media-max-wrapper ${isMediaPopupOpen && !isExpandPostOpen ? '' : 'hidden'}`}>
            {posts.map((post) => (
              post.media && (
                <Wrapper key={post.id} className="relative cursor-pointer rounded-sm overflow-hidden">
                  <Image 
                    className="media" 
                    src={post.media[0]} 
                    alt="Media" 
                    width={160} 
                    height={160}
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
          </div>
        </Panel>
      </div>
      {selectedPost && isExpandPostOpen && <ExpandPost post={selectedPost} onClose={handleExpandPostClose} />}
    </main>
  );
};

export default ProfileMediaPopup;