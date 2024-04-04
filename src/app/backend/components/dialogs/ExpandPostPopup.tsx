'use client'; //* Uses interactable components

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Layouts
import Wrapper from '@/src/app/backend/components/layouts/WrapperLayout';
import Carousel from '@/src/app/backend/components/layouts/CarouselLayout';

// Hooks & Classes
import { PostClass } from '@/src/libraries/structures';
import { useToTitleCase, useToRelativeTime, useToMonetary } from '@/src/app/backend/hooks/useToConvert';
import { CommentsProvider } from '@/src/app/backend/hooks/context/useCommentsContext';
import useOutsideClick from '@/src/app/backend/hooks/useOutsideClick';

// Icons
import { X, MessageCircle, MapPin, Package2, Map, Verified } from 'lucide-react';

// Utilities
import Comment from '@/src/app/backend/components/utilities/CommentSection';
import ToggleBookmark from '@/src/app/backend/components/utilities/ToggleBookmark';
import ToggleCart from '@/src/app/backend/components/utilities/ToggleCart';
import ToggleVote from '@/src/app/backend/components/utilities/ToggleVote';
import ToggleShare from '../utilities/ToggleShare';
interface Props {
  post: PostClass;
  onClose: () => void;
}

const ExpandPostPopup: React.FC<Props> = ({ post, onClose }) => {
  // Instantiation
  const router = useRouter();
  post = new PostClass(post);

  // Allow outside click to close modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(modalRef, onClose);

  // Visit user profile
  const handleProfileClick = () => {
    router.push(`/profile/${post.author.handle}`);
  };

  return (
    <main className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      {/* Modal */}
      <div className="post-expand" ref={modalRef}>
        {/* Images */}
        <div id="post-popup-desktop">
          <Carousel media={post.media || []} />
        </div>

        {/* Content */}
        <Wrapper className="timeline-expand">
          <div className="header-row">
            {/* Community Avatar */}
            <Image className="rounded-full" src={post.origin.icon} alt="Shop Icon" width={16} height={16} />
            {/* Community Details */}
            <h6 className="poster-name">{post.origin.name}</h6>
            <h6 className="poster-handle">{`@c/${post.origin.handle}`}</h6>
            <X className="cursor-pointer" color="black" size={14} strokeWidth={3} onClick={onClose} />
          </div>

          <div className="content">
            {post.type === 'article' ? null : (
              <div className="price-row">
                {/* Price */}
                {post.type === 'selling' ? (
                  <h1>{useToMonetary(post.price || 0)}</h1>
                ) : post.type === 'buying' ? (
                  <div className="price-range">
                    <h1>{useToMonetary(post.range_start || 0)}</h1>
                    <p>to</p>
                    <h1>{useToMonetary(post.range_end || 0)}</h1>
                  </div>
                ) : null}

                {/* Open */}
                {post.type === 'selling' ? (
                  <div className="pill">
                    <p>{post.is_open ? 'Negotiable' : 'Fixed Price'}</p>
                  </div>
                ) : null}
              </div>
            )}

            <div className="content-main">
              <div className="price-group">
                {/* Title */}
                {post.title}

                {/* Condition */}
                {post.type === 'selling' ? <span className="pill">{useToTitleCase(post.condition || '')}</span> : null}
              </div>

              {/* Description */}
              <p className="description">{post.description.trim()}</p>

              {/* Mobile Images */}
              <div id="post-popup-mobile">
                <Carousel media={post.media || []} />
              </div>

              {/* Tags */}
              {post.tags?.length === 0 ? null : (
                <div className="tag-container">
                  {post.tags?.map((tag, index) => (
                    <span key={index} className="tag" onClick={() => router.push(`/search?query=${tag}`)}>
                      # {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Controls */}
              <div className="interaction-options">
                <Wrapper className="block">
                  <ToggleVote type="post" post={post} />
                  <ToggleShare post={post} />
                  <ToggleCart value={true} post={post} />
                  <ToggleBookmark value={true} post={post} />
                </Wrapper>

                {/* Comments */}
                <div className="interaction-row">
                  <MessageCircle color="#202020" size={12} strokeWidth={3} />
                  <h6 className=" font-normal text-xs">{post.comments?.length || 0} Comments</h6>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="seller-profile" onClick={handleProfileClick}>
            <hr className="mobile-remove divider" />
            <div className="seller-details">
              <div className="left">
                <Image className="avatar" src={post.author.icon} alt="User Icon" width={32} height={32} />
                <div className="left-col">
                  <div className="top">
                    <p>{`${post.author.first_name} ${post.author.last_name}`}</p>
                    {/* Verified Status */}
                    {post.author.is_verified ? (
                      <Image src="/root/verified.svg" width={18} height={18} alt="Verified" />
                    ) : null}
                  </div>
                  <div className="bottom">@{post.author.handle}</div>
                </div>
              </div>
              <div className="right">
                <div className="right-row">
                  <Map size={10} strokeWidth={2} />
                  <p>{post.author.location}</p>
                </div>
                <div className="right-row">
                  <Package2 size={10} strokeWidth={2} />
                  <p>{post.author.delivery_methods.length} Delivery Preferences</p>
                </div>
              </div>
            </div>
            <hr className="mobile-remove divider" />
          </div>

          {/* Comments */}
          <h6 className="comments-initial">Comments</h6>

          <div className="comments-container">
            <CommentsProvider>
              <Comment postId={post.id} />
            </CommentsProvider>
          </div>
        </Wrapper>
      </div>
    </main>
  );
};

export default ExpandPostPopup;
