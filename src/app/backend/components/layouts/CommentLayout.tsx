// 'use server'

import Image from 'next/image';
import Supabase from '@/src/app/backend/model/supabase';
import Popover from '@/src/app/backend/components/layouts/PopoverLayout';
import ToggleVote from '@/src/app/backend/components/utilities/ToggleVote';
import Action from '@/src/app/backend/components/utilities/Action';
import React, { useEffect, useRef, useState } from 'react';
import { CommentClass } from '@/src/libraries/structures';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { useCommentsContext } from '@/src/app/backend/hooks/context/useCommentsContext';
import { useToRelativeTime } from '@/src/app/backend/hooks/useToConvert';
import { MoreVertical, Pencil, Reply, Trash2 } from 'lucide-react';

const CommentLayout: React.FC<{ comment: CommentClass; updateComments: any }> = ({ comment, updateComments }) => {
  const { user } = useGlobalContext();
  const { setComments, commentsArray, setCommentsArray } = useCommentsContext();

  const [input, setInput] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [editMode]);

  const handleNewComment = () => {
    setShowInput(true);
  };

  async function updatePostInDatabase(postId: any, comments: any) {
    try {
      const { data, error } = await Supabase.from('posts').update({ comments }).eq('id', postId);

      console.log('Post updated in the database:', postId, comments);
    } catch (error) {
      console.error('Error updating post in the database:', error);
    }
  }

  async function updateCommentInDatabase(commentId: any, replies: any) {
    try {
      const { data, error } = await Supabase.from('posts').update({ replies }).eq('id', commentId);

      console.log('Comment updated in the database:', commentId, replies);
    } catch (error) {
      console.error('Error updating comment in the database:', error);
    }
  }

  // Handles replying to an existing comment.
  const handleReply = async () => {
    const newComment: any = {
      enclosing_post: comment.enclosing_post,
      enclosing_comment: comment.id,
      posted_at: new Date(),
      is_edited: false,
      content: input,
      upvotes: [],
      downvotes: [],
      replies: [],
    };

    const commentInstance = new CommentClass({
      ...newComment,
      author: user,
    });

    setComments((prevComments) => [commentInstance, ...prevComments]);
    newComment.author = user.uuid;

    console.log('Comment data before try:', newComment);

    try {
      const { data: commentData, error: insertError } = await Supabase.from('comments').insert([newComment]);

      console.log('Comment inserted:', commentData);

      if (insertError) {
        console.error('Error inserting new comment:', insertError);
      } else {
        const { data: latestComment } = await Supabase.from('comments')
          .select('id')
          .eq('author', user.uuid)
          .order('posted_at', { ascending: false })
          .limit(1);

        if (latestComment && latestComment.length > 0) {
          const updatedCommentsArray = [...commentsArray, latestComment[0].id];
          setCommentsArray(updatedCommentsArray);

          await updatePostInDatabase(comment.enclosing_post, updatedCommentsArray);
          console.log('Comments array updated:', updatedCommentsArray);

          const updatedEnclosingComment = {
            ...comment,
            replies: comment.replies ? [...comment.replies, latestComment[0].id] : [latestComment[0].id],
          };

          await updateCommentInDatabase(comment.id, updatedEnclosingComment.replies);
          console.log('Enclosing comment updated with new reply:', comment.id, updatedEnclosingComment.replies);

          updateComments();
        }
      }
    } catch (e) {
      console.error('Error during insertion:', e);
    }

    // handleInsertNode(comment.id, input);
    setShowInput(false);
    setInput('');
  };

  // Handles editing an existing comment.
  const handleEdit = async () => {
    setEditMode(true);

    if (editMode) {
      // handleEditNode(comment.id, inputRef?.current?.innerText + " (edited)");
      const editedContent = inputRef?.current?.innerText;

      setComments((prevComments) => {
        return prevComments.map((prevComment) => {
          if (prevComment.id === comment.id) {
            // Ensure editedContent is a string or use a fallback value (e.g., an empty string)
            const updatedContent = editedContent || '';

            return { ...prevComment, content: updatedContent, is_edited: true, edited_at: new Date() };
          }
          return prevComment;
        });
      });

      const { data, error } = await Supabase.from('comments')
        .update({
          content: editedContent,
          is_edited: true,
          edited_at: new Date(),
        })
        .eq('id', comment.id);

      updateComments();

      if (error) {
        console.error('Error updating comment with ID ${commentId}:', error);
      }
    }

    if (editMode) setEditMode(false);
  };

  const handleDelete = async () => {
    // handleDeleteNode(comment.id);
    const { data, error } = await Supabase.from('comments')
      .update({
        is_deleted: true,
        author: null,
        content: '',
        upvotes: [],
        downvotes: [],
        replies: [],
      })
      .eq('id', comment.id);

    updateComments();

    if (error) {
      console.error('Error deleting comment with ID ${comment.id}:', error);
    } else {
      {
        /*setComments(prevComments => prevComments.filter(prevComment => prevComment.id !== comment.id));

      const updatedCommentsArray = commentsArray.filter(commentId => commentId !== comment.id);
      setCommentsArray(updatedCommentsArray);
    
      await updatePostInDatabase(comment.enclosing_post, updatedCommentsArray);*/
      }
    }
  };

  return (
    <div className="comment">
      <div className="main-comment">
        <div className="top">
          <Image
            className="comment-avatar"
            src={comment.is_deleted ? '/root/temp.jpg' : comment.author.icon}
            alt="User Icon"
            width={28}
            height={28}
          />
          <div className="body">
            <div className="name-row">
              {comment.is_deleted ? (
                <p>Deleted</p>
              ) : (
                <p>
                  {comment.author?.first_name} {comment.author?.last_name}
                </p>
              )}
              <p className="sub">{useToRelativeTime(new Date(comment.posted_at))} </p>
              {!comment.is_deleted && (
                <>
                  {comment.is_edited && (
                    <>
                      <h6 className="sub">•</h6>
                      <h6 className="sub">Edited {useToRelativeTime(new Date(comment.edited_at!))}</h6>
                    </>
                  )}
                </>
              )}
            </div>
            <p className="comment-content">
              <span
                contentEditable={editMode}
                suppressContentEditableWarning={editMode}
                style={{ wordWrap: 'break-word' }}
                ref={inputRef}
                data-testid="edit-input"
              >
                {comment.is_deleted ? 'This comment has been deleted.' : comment.content}
              </span>
            </p>
          </div>
          {/* Three Dots Thing */}
          {editMode ? (
            <>
              <h6 className=" font-regular text-xs cursor-pointer">
                <Action className="reply" type="Save" handleClick={handleEdit} data-testid="save-edit"/>
              </h6>
              <h6 className=" font-regular text-xs cursor-pointer">
                <Action
                  className="reply"
                  type="Cancel"
                  handleClick={() => {
                    if (inputRef.current) inputRef.current.innerText = comment.content;
                    setEditMode(false);
                  }}
                />
              </h6>
            </>
          ) : (
            <>
              {!comment.is_deleted && (
                <div className="flex flex-row gap-2 relative">
                  {comment.author.uuid === user.uuid ? (
                    <Popover
                      classes={'top-4 z-[45] absolute right-0'}
                      trigger={
                        <MoreVertical className="cursor-pointer relative" color="#202020" size={12} strokeWidth={3} data-testid='more-btn'/>
                      }
                      elements={[
                        ['Edit', <Pencil size={12} strokeWidth={3} data-testid='edit'/>, () => handleEdit()],
                        ['Delete', <Trash2 size={12} strokeWidth={3} data-testid='delete'/>, () => handleDelete()],
                      ]}
                    />
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>

        {/* control actions */}
        {!comment.is_deleted && (
          <div className="comment-buttons">
            <ToggleVote type="comment" comment={comment} />
            <div className="flex flex-row gap-1 cursor-pointer">
              <Reply
                className="opacity-70 cursor-pointer"
                color="black"
                size={14}
                strokeWidth={3}
                onClick={handleNewComment}
              />
              <h6 className="reply-button interaction-row">
                <Action className="reply" type="Reply" handleClick={handleNewComment}  data-testid="reply-action"/>
              </h6>
            </div>
          </div>
        )}
        {showInput && (
          <div className="inputContainer">
            <div className="flex flex-row items-center rounded-lg w-auto">
              <Image
                className="rounded-full w-6 h-6 object-cover"
                src={user ? user.icon : '/root/temp.jpg'}
                alt="User Icon"
                width={24}
                height={24}
              />
              <input
                type="text"
                className="inputContainer__input first_input font-extralight text-xs"
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Reply to comment..."
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <h6 className=" font-regular text-xs cursor-pointer">
                <Action className="reply" type="Reply" handleClick={handleReply} data-testid='submitReply'/>
              </h6>
              <h6 className=" font-regular text-xs cursor-pointer">
                <Action
                  className="reply"
                  type="Cancel"
                  handleClick={() => {
                    setShowInput(false);
                  }}
                />
              </h6>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentLayout;
