'use client'; //* Uses interactable components

import usePostActions from '@/src/app/backend/hooks/usePostActions';
import Image from 'next/image';
import Wrapper from '@/src/app/backend/components/layouts/WrapperLayout';
import Panel from '@/src/app/backend/components/layouts/PanelLayout';
import Popover from '@/src/app/backend/components/layouts/PopoverLayout';
import ExpandPost from '@/src/app/backend/components/dialogs/ExpandPostPopup';
import UpdatePost from '@/src/app/backend/components/dialogs/UpdatePostPopup';
import ToggleVote from '@/src/app/backend/components/utilities/ToggleVote';
import ToggleBookmark from '@/src/app/backend/components/utilities/ToggleBookmark';
import ToggleShare from '@/src/app/backend/components/utilities/ToggleShare';
import ToggleCart from '@/src/app/backend/components/utilities/ToggleCart';
import ToggleComments from '@/src/app/backend/components/utilities/ToggleComments';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostClass } from '@/src/libraries/structures';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { useToTitleCase, useToRelativeTime, useToMonetary } from '@/src/app/backend/hooks/useToConvert';
import { Focus, MessageCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

const PostLayout: React.FC<{ post: PostClass }> = ({ post }) => {
  // Instantiation
  const router = useRouter();
  const { user, posts, setPosts } = useGlobalContext();
  post = new PostClass(post);

  // Visit user profile
  const handleProfileClick = () => {
    router.push('/profile/' + post.author.handle);
  };

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

  const [isEditPostPopupOpen, setIsEditPostPopupOpen] = useState(false);
  const handleEditPostOpen = () => {
    setIsEditPostPopupOpen(true);
  };
  const handleEditPostClose = () => {
    setIsEditPostPopupOpen(false);
  };

  const { DeleteItem } = usePostActions();
  const handleDeletePost = async (post: PostClass) => {
    DeleteItem(post.id, post.media as string[]);
  };
  const handleEditPost = async (post_id: number) => {
    handleEditPostOpen();
  };

  return (
    <Panel classes="timeline-post">
      {/* Header */}
      <div className="header">
        <div className="left">
          {/* Community Avatar */}
          <Image className="rounded-full" src={post.origin.icon} alt="Shop Icon" width={16} height={16} />

          {/* Community Details */}
          <span className="username">{post.origin.name}</span>
          <span className="handle">{`@c/${post.origin.handle}`}</span>
        </div>
        <div className="right">
          {/* Open */}
          {post.type === 'selling' ? (
            <span className="post-type">{post.is_open ? 'Negotiable' : 'Fixed Price'}</span>
          ) : null}

          {/* Price */}
          {post.type === 'selling' ? (
            <h1 className="sell-price">{useToMonetary(post.price || 0)}</h1>
          ) : post.type === 'buying' ? (
            <h1 className="sell-price">
              {useToMonetary(post.range_start || 0)} <span>to</span> {useToMonetary(post.range_end || 0)}
            </h1>
          ) : null}

          {/* More */}
          {post.author.uuid === user.uuid ? (
            <Popover
              classes={'top-4 z-[99]'}
              trigger={
                <MoreHorizontal
                  className="opacity-70 cursor-pointer relative"
                  color="black"
                  size={12}
                  strokeWidth={3}
                />
              }
              elements={[
                ['Edit', <Pencil size={12} strokeWidth={3} />, () => handleEditPost(post.id)],
                ['Delete', <Trash2 size={12} strokeWidth={3} />, () => handleDeletePost(post)],
              ]}
            />
          ) : null}
        </div>
      </div>

      <div className="flex flex-row items-center gap-2 w-full" onClick={handleProfileClick}>
        {/* Author Avatar */}
        <Image
          className="rounded-full cursor-pointer w-9 h-9 object-cover"
          src={post.author.icon}
          alt="User Icon"
          width={36}
          height={36}
        />

        <div className="flex flex-col justify-center">
          <div className="flex flex-row gap-0.5 items-center">
            {/* Author Name */}
            <h6 className=" font-medium text-sm leading-4 tracking-tight cursor-pointer hover:underline">
              {`${post.author.first_name} ${post.author.last_name}`}
            </h6>

            {/* Verified Status */}
            {post.author.is_verified ? (
              <Image src="/root/verified.svg" width={18} height={18} alt="Verified" />
            ) : (
              <div className="w-1"></div>
            )}

            {/* Post Type */}
            <span className="bg-gray-200 rounded-full px-1.5 text-black  font-light tracking-wider text-[0.5rem] py-0.5 pt-[0.2rem] leading-[0.5rem]">
              {useToTitleCase(post.type)}
            </span>
          </div>

          {/* Author Handle */}
          <h6 className="text-gray-500 font-light text-[0.65rem] leading-4 cursor-pointer gap-1 flex flex-row">
            <span className="hover:underline">{`@${post.author.handle}`}</span>•
            <span>{useToRelativeTime(post.posted_at)}</span>
            {post.is_edited ? (
              <>
                •
                <span className="text-gray-500 font-light text-[0.65rem] leading-4 cursor-pointer gap-1 flex flex-row">
                  Edited {useToRelativeTime(post.edited_at || new Date()).toLowerCase()}
                </span>
              </>
            ) : null}
          </h6>
        </div>
      </div>

      <div
        className="details"
        onClick={() => {
          handleExpandPostOpen(post);
        }}
      >
        {/* Title */}
        <div className="post-title">
          {post.title}&nbsp;&nbsp;
          {post.type === 'selling' ? <span className="condition">{useToTitleCase(post.condition || '')}</span> : null}
        </div>

        {/* Description */}
        {post.description ? null : (
          <p className=" font-light text-sm tracking-tight leading-4 truncate break h-auto whitespace-pre-line">
            {post.description.trim()}
          </p>
        )}

        {/* Tags */}
        {post.tags?.length === 0 ? (
          <></>
        ) : (
          <div className="flex flex-row gap-2 items-start w-full">
            <div className="flex flex-wrap gap-1">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tags" onClick={() => router.push(`/search?query=${tag}`)}>
                  # {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {isExpandPostOpen && selectedPost && <ExpandPost post={selectedPost} onClose={handleExpandPostClose} />}

      {/* Media */}
      {post.media && post.media.length >= 1 ? (
        <Wrapper className="relative w-full h-full rounded-sm cursor-pointer overflow-hidden">
          <Image
            className="w-full h-full text-xs"
            src={post.media[0]}
            alt="Media"
            width={0}
            height={0}
            sizes="100vw"
            priority={true}
          />

          <div
            className="absolute top-0 left-0 w-full h-full rounded-sm bg-black opacity-0 hover:opacity-20 transition-all duration-300"
            onClick={() => {
              handleExpandPostOpen(post);
            }}
          ></div>

          {post.media.length > 1 ? (
            <div className="absolute right-4 top-4 bg-black bg-opacity-20 px-2 rounded-sm flex flex-row gap-1 items-center py-1 ">
              <Focus className="text-white" color="white" size={10} strokeWidth={2} />
              <h6 className="text-white font-light text-[0.5rem] leading-3">{post.media.length} photos</h6>
            </div>
          ) : null}
        </Wrapper>
      ) : null}

      {/* Controls */}
      <div className="interaction-options">
        {/* Votes, Cart & Bookmark */}
        <Wrapper className="block">
          <ToggleVote type="post" post={post} />
          <ToggleShare />
          <ToggleCart value={true} post={post} />
          <ToggleBookmark value={true} post={post} />
        </Wrapper>

        {/* Comments */}
        <Wrapper className="block">
          <ToggleComments
            post={post}
            handleExpandPostOpen={() => {
              handleExpandPostOpen(post);
            }}
          />
        </Wrapper>
      </div>

      {isEditPostPopupOpen && <UpdatePost onClose={handleEditPostClose} post={post} />}
    </Panel>
  );
};

export default PostLayout;
