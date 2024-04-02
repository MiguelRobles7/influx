// 'use server'

import useAutosizeTextarea from '@/src/app/backend/hooks/useAutosizeTextarea';
import useFetchCommunities from '@/src/app/backend/hooks/fetching/useFetchCommunities';
import useOutsideClick from '@/src/app/backend/hooks/useOutsideClick';
import usePostActions from '@/src/app/backend/hooks/usePostActions';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { PostClass, CommunityClass } from '@/src/libraries/structures';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { useToTitleCase } from '@/src/app/backend/hooks/useToConvert';
import { ChevronDown, Globe, RefreshCw, Maximize, X, Tags } from 'lucide-react';

interface Props {
  post: PostClass;
  onClose: () => void;
}

const CreatePostPopup: React.FC<Props> = ({ post, onClose }) => {
  // Instantiation
  const { user } = useGlobalContext();
  const defaults = require('@/src/json/defaults.json');

  // Post actions
  const { EditItem } = usePostActions();

  // Allow outside click to close modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(modalRef, onClose);

  // Export communities from the database
  const [communities, setCommunities] = useState<CommunityClass[]>([]);
  useFetchCommunities({ type: 'all', communities, setCommunities });

  // Initialize form data
  const [formData, setFormData] = useState<PostClass>(
    new PostClass({
      ...post,
    })
  );

  // Ease of access states
  const [titleCount, setTitleCount] = useState(0);

  // TODO: Turn this into a component
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState<string>('');
  const handleTagInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      handleAddTag();
    }
  };
  const handleAddTag = () => {
    if (formData.tags?.length === 20) {
      alert('You can only add up to 20 tags.');
      return;
    }

    const trimmedTag = tagInput.trim().replace(/\s+/g, '');
    if (trimmedTag !== '' && !formData.tags?.includes(trimmedTag)) {
      setFormData({ ...formData, tags: [...formData.tags!, trimmedTag] });
      setTagInput('');
    }

    setTimeout(() => {
      if (tagInputRef.current) {
        tagInputRef.current.focus();
      }
    }, 0);
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter((tag) => tag !== tagToRemove) });
  };
  useEffect(() => {
    if (tagInputRef.current) {
      tagInputRef.current.style.width = 'auto';
      tagInputRef.current.style.width = `${tagInputRef.current.scrollWidth}px`;
    }
  }, [tagInput]);

  // Listens to all input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    switch (event.target.name) {
      case 'tags':
        setTagInput(event.target.value.replace(/\s+/g, ''));
        break;

      case 'type':
        setFormData({ ...formData, [event.target.name]: defaults.mapping[event.target.value] });
        break;

      case 'origin':
        const selected = communities.find((com: CommunityClass) => com.name === event.target.value);

        setFormData((formData) => ({
          ...formData,
          origin: new CommunityClass(selected),
        }));
        break;

      default:
        setFormData({ ...formData, [event.target.name]: event.target.value });
        break;
    }

    switch (event.target.name) {
      case 'title':
        setTitleValue(event.target.value);
        setTitleCount(event.target.value.length);
        break;

      case 'description':
        setDescValue(event.target.value);
        break;
    }
  };

  // Listens to submit actions
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const partial = new PostClass(formData);
    const newPost: any = {
      ...partial,
      is_edited: true,
      edited_at: new Date(),
    };

    const { origin, author, ...postData } = newPost;
    postData.author_id = user.uuid;
    postData.origin_id = newPost.origin.uuid;

    EditItem(postData, partial.author, partial.origin);
    onClose();
  };

  // Autosizing
  const [titleValue, setTitleValue] = useState('');
  const [descValue, setDescValue] = useState('');
  const textTitleAreaRef = useRef<HTMLTextAreaElement>(null);
  const textDescAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextarea(textTitleAreaRef.current, titleValue);
  useAutosizeTextarea(textDescAreaRef.current, descValue);

  return (
    <main className="text-gray-800 fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="popup-panel" ref={modalRef}>
        {/* Header */}
        <div className="header">
          {/* Handle */}
          <Link href={'/profile'} className="left ">
            @{user.handle}
          </Link>

          {/* Type Dropdown & Close Button */}
          <div className="type-dropdown">
            {/* TODO: Turn into a custom dropdown */}
            <select
              name="type"
              value={defaults.mapping[formData.type]}
              className="cursor-pointer appearance-none"
              onChange={handleInputChange}
              required
            >
              <option className="w-full text-gray-500 text-[0.625rem] font-light rounded-sm" value={1}>
                Article
              </option>
              <option className="w-full text-gray-500 text-[0.625rem] font-light rounded-sm" value={2}>
                Buying
              </option>
              <option className="w-full text-gray-500 text-[0.625rem] font-light rounded-sm" value={3}>
                Selling
              </option>
            </select>

            <ChevronDown size={10} strokeWidth={3} color="#202020" />
          </div>
          <X className="cursor-pointer" size={14} strokeWidth={3} onClick={onClose} color="#202020" />
        </div>

        {/* Form */}
        <form className="form" onSubmit={handleSubmit} onKeyDown={(e) => (e.key == 'Enter' ? e.preventDefault() : '')}>
          {/* Price */}
          {formData.type === 'selling' ? (
            <div className="flex flex-row gap-0.5">
              <h6 className="text-gray-800 text-sm font-medium relative top-[0.1rem]">₱</h6>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full text-3xl font-regular"
                required
              />
            </div>
          ) : formData.type === 'buying' ? (
            <div className="flex flex-row items-center">
              <div className="flex flex-row gap-0.5 w-full">
                <h6 className="text-gray-800 text-sm font-medium relative top-[0.1rem]">₱</h6>
                <input
                  type="number"
                  name="range_start"
                  value={formData.range_start}
                  onChange={handleInputChange}
                  className="w-full text-3xl font-regular"
                  required
                />
              </div>
              <h6 className="text-gray-800 text-[0.625rem] font-light px-6">to</h6>
              <div className="flex flex-row gap-0.5 w-full">
                <h6 className="text-gray-800 text-sm font-medium relative top-[0.1rem]">₱</h6>
                <input
                  type="number"
                  name="range_end"
                  value={formData.range_end}
                  onChange={handleInputChange}
                  className="w-full text-3xl font-regular"
                  required
                />
              </div>
            </div>
          ) : null}

          {/* Title */}
          <div className="title-row">
            <textarea
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="title"
              ref={textTitleAreaRef}
              rows={1}
              required
              maxLength={100}
            />
            <span className="title-count">{titleCount}/100</span>
          </div>

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Write details about your post here."
            className="description"
            ref={textDescAreaRef}
            rows={1}
            required
            maxLength={255}
          />

          {/* Community */}
          <div className="section-container">
            <span>Where to post</span>
            <div className="dropdown">
              <Globe color="#999999" size={12} strokeWidth={2} />
              <select name="origin" value={formData.origin.name} onChange={handleInputChange} required>
                <option style={{ color: '#999999 !important' }} value="" disabled selected>
                  Select a community
                </option>
                {communities.map((com: CommunityClass, index: React.Key | null | undefined) => (
                  <option style={{ color: '#999999 !important' }} key={com.uuid} value={com.name}>
                    {com.name}
                  </option>
                ))}
              </select>
              <ChevronDown color="#999" size={12} strokeWidth={3} />
            </div>
          </div>

          {/* Condition */}
          {formData.type === 'selling' ? (
            <div className="section-container">
              <span>Listing Condition</span>
              <div className="dropdown">
                <Maximize color="#999999" size={12} strokeWidth={2} />
                <select name="condition" value={formData.condition} onChange={handleInputChange} required>
                  <option style={{ color: '#999999 !important' }} value="" disabled selected>
                    Select a condition
                  </option>
                  {defaults.conditions.map((condition: string, index: React.Key | null | undefined) => (
                    <option key={index} value={condition}>
                      {useToTitleCase(condition)}
                    </option>
                  ))}
                </select>
                <ChevronDown color="#999" size={12} strokeWidth={3} />
              </div>
            </div>
          ) : null}

          {/* Tags */}
          <div className="section-container">
            <span>Add tags</span>
            <div className="text-field">
              <Tags color="#999999" size={12} strokeWidth={2.5} />
              <input
                type="text"
                name="tags"
                ref={tagInputRef}
                value={tagInput}
                onChange={handleInputChange}
                onKeyDown={handleTagInputKeyPress}
                placeholder="Add relevant tags"
                maxLength={50}
              />
            </div>

            <div className="tag-container">
              {/* TODO - JMS: create function to filter tags */}
              {formData.tags?.map((tag, index) => (
                <span key={index} className="tag" onClick={() => handleRemoveTag(tag)}>
                  #{tag}
                  <X className="text-gray-800" size={8} strokeWidth={3} />
                </span>
              ))}
            </div>
          </div>

          {/* Open */}
          {formData.type === 'selling' ? (
            <div className="switch-row">
              <div className="left">
                <RefreshCw className="text-gray-800" size={10} strokeWidth={3} />
                <h6 className="text-gray-800 text-[0.625rem] font-regular leading-4">Allow negotiations on price</h6>
              </div>
              <label className="switch">
                <input type="checkbox" value={formData.is_open ? 1 : 0} onChange={handleInputChange} />
                <span className="slider round"></span>
              </label>
            </div>
          ) : null}

          {/* Submit */}
          <div className="button-area">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="publish-button">
              Edit Post
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreatePostPopup;
