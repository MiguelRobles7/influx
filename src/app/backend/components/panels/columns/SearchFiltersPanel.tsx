'use client';

import React, { useState } from 'react';
import { FilterClass } from '@/src/libraries/structures';
import { useToTitleCase } from '@/src/app/backend/hooks/useToConvert';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';

import {
  ChevronDown,
  Option,
  RefreshCw,
  Search,
  Star,
  Sparkle,
  ChevronUpSquare,
  ChevronDownSquare,
  Container,
  Tag,
  Loader,
  CircleDot,
} from 'lucide-react';

const SearchFiltersPanel: React.FC = () => {
  const defaults = require('@/src/json/defaults.json');

  const [formData, setFormData] = useState<FilterClass>(
    new FilterClass({
      sort: 'Popularity',
      condition: 'All',
      type: 'All',
      range_start: 0,
      range_end: 0,
    })
  );

  const [isAscending, setIsAscending] = useState(false);
  const [isDescending, setIsDescending] = useState(false);

  const { user, posts } = useGlobalContext();

  let tags = [];
  for (let post of posts) {
    if (post.author.uuid === user.uuid) {
      for (let tag of post.tags || []) {
        tags.push(tag);
      }
    }
  }

  const handleToggleAscending = () => {
    setIsAscending(!isAscending);
    setIsDescending(false);

    setFormData({ ...formData, sort_order: !isAscending ? 'ascending' : '' });
  };

  const handleToggleDescending = () => {
    setIsDescending(!isDescending);
    setIsAscending(false);
    setFormData({ ...formData, sort_order: !isDescending ? 'descending' : '' });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (event.target.name === 'open' || event.target.name === 'owner') {
      setFormData({ ...formData, [event.target.name]: !formData[event.target.name as keyof FilterClass] });
      return;
    } else if (event.target.name.includes('min')) {
      setFormData({ ...formData, range_start: parseInt(event.target.value) });
      if (parseInt(event.target.value) > formData.range_end) {
        setFormData({ ...formData, range_end: parseInt(event.target.value) });
      }
    } else if (event.target.name.includes('max')) {
      setFormData({ ...formData, range_end: parseInt(event.target.value) });
      if (parseInt(event.target.value) < formData.range_start) {
        setFormData({ ...formData, range_start: parseInt(event.target.value) });
      }
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  const handleResetInput = () => {
    setFormData(
      new FilterClass({
        sort: 'Popularity',
        condition: 'All',
        type: 'All',
        range_start: 0,
        range_end: 0,
      })
    );

    setIsAscending(false);
    setIsDescending(false);
  };

  return (
    <form action="/search" method="GET" className="search-panel">
      {/* Search user */}
      <div className="section-container">
        <span>Search by username</span>
        <div className="text-field">
          <Search color="#999999" size={12} strokeWidth={2.5} />
          <input
            name="username"
            type="text"
            placeholder="Look for someone"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Sort results */}
      <div className="section-container">
        <span>Sort results by</span>
        <div className="section-row">
          {/* Sort order */}
          <div className="dropdown">
            <Sparkle size={12} strokeWidth={3} color="#202020" />
            <select name="sort" value={formData.sort} onChange={handleInputChange} required>
              {defaults.search.sorts.map((method: string, index: React.Key | null | undefined) => (
                <option key={index} value={method}>
                  {useToTitleCase(method)}
                </option>
              ))}
            </select>
            <ChevronDown size={12} strokeWidth={3} color="#202020" />
          </div>

          {/* Ascending */}
          <input
            type="checkbox"
            id="asc"
            onClick={handleToggleAscending}
            name="ascending"
            value={isAscending ? 'true' : 'false'}
            hidden
          />
          <label htmlFor="asc" className={`button ${isAscending ? 'isPressed' : ''}`}>
            <ChevronUpSquare color="#202020" size={10} strokeWidth={3} />
          </label>

          {/* Descending */}
          <input
            type="checkbox"
            id="desc"
            onClick={handleToggleDescending}
            name="descending"
            value={isDescending ? 'true' : 'false'}
            hidden
          />
          <label htmlFor="desc" className={`button ${isDescending ? 'isPressed' : ''}`}>
            <ChevronDownSquare color="#202020" size={10} strokeWidth={3} />
          </label>
        </div>
      </div>

      {/* Filter results */}
      <div className="section-container">
        <span>Filter results</span>
        <div className="section-row">
          <div className="dropdown">
            <Container color="#202020" size={12} strokeWidth={3} />
            <select name="condition" value={formData.condition} onChange={handleInputChange} required>
              {defaults.search.conditions.map((condition: string, index: React.Key | null | undefined) => (
                <option key={index} value={condition}>
                  {useToTitleCase(condition)}
                </option>
              ))}
            </select>
            <ChevronDown color="#202020" size={12} strokeWidth={3} />
          </div>

          <div className="dropdown">
            <Tag color="#202020" size={12} strokeWidth={3} />
            <select name="type" value={formData.type} onChange={handleInputChange} required>
              {defaults.search.types.map((type: string, index: React.Key | null | undefined) => (
                <option key={index} value={type}>
                  {useToTitleCase(type)}
                </option>
              ))}
            </select>
            <ChevronDown color="#202020" size={12} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Filter by Price */}
      <div className="section-container">
        <span>Filter price range</span>
        <div className="section-row">
          <div className="price-box">
            <div className="symbol-span">MIN</div>
            <input
              name="username"
              type="text"
              placeholder="₱1,000"
              value={formData.range_start}
              onChange={handleInputChange}
            />
          </div>
          <div className="field-divider"> &nbsp; </div>
          <div className="price-box">
            <div className="symbol-span">MAX</div>
            <input
              name="username"
              type="text"
              placeholder="₱500,000"
              value={formData.range_end}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Filter by Tags */}
      <div className="section-container">
        <span>Filter by tags</span>
        <div className="tag-container">
          {/* TODO - JMS: create function to filter tags */}
          {tags?.map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="section-container">
        <div className="switch-row">
          <div className="left">
            <Loader size={10} strokeWidth={2} />
            <h6>Negotiable</h6>
          </div>
          <label className="switch">
            <input
              name="open"
              type="checkbox"
              value={formData.open ? 'true' : 'false'}
              checked={formData.open}
              onChange={handleInputChange}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="switch-row">
          <div className="left">
            <CircleDot color="#202020" size={10} strokeWidth={2} />
            <h6>Posts you made</h6>
          </div>
          <label className="switch">
            <input
              name="owner"
              type="checkbox"
              value={formData.owner ? 'true' : 'false'}
              checked={formData.owner}
              onChange={handleInputChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      <div className="section-row">
        <button className="clear-button" onClick={handleResetInput}>
          Clear filters
        </button>
        <button type="submit" className="submit-button">
          Apply filters
        </button>
      </div>
    </form>
  );
};

export default SearchFiltersPanel;
