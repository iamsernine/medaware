'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import * as DB from '@/lib/db';
import PostCard from '@/components/PostCard';
import FilterTabs from '@/components/FilterTabs';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('trending');
  const [search, setSearch] = useState('');
  const [proOnly, setProOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState(new Set());

  useEffect(() => {
    setPosts(DB.getPosts());
    const saved = JSON.parse(localStorage.getItem('medaware_bookmarks') || '[]');
    setBookmarks(new Set(saved));
  }, []);

  const saveBookmarks = useCallback((bm) => {
    setBookmarks(bm);
    localStorage.setItem('medaware_bookmarks', JSON.stringify([...bm]));
  }, []);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Apply tab filter/sort
    if (filter === 'trending') {
      result.sort((a, b) => b.upvotes - a.upvotes);
    } else if (filter === 'newest') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (filter === 'unanswered') {
      result = result.filter(p => p.verifiedResponses === 0);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q)
      );
    }

    // Pro-only
    if (proOnly) {
      result = result.filter(p => p.verifiedResponses > 0);
    }

    return result;
  }, [posts, filter, search, proOnly]);

  return (
    <div className="page-container" id="home-feed">
      {/* Top Bar */}
      <header className="top-bar">
        <div className="top-bar__left">
          <div className="top-bar__brand">
            <div className="brand-logo">
              <span className="material-icons-round">local_hospital</span>
            </div>
            <span className="top-bar__name">MedAware</span>
          </div>
          <div className="top-bar__right" style={{ flex: 1 }}>
            <div className="top-bar__search" style={{ flex: 1 }}>
              <span className="material-icons-round search-icon">search</span>
              <input
                type="text"
                placeholder="Search health topics…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="icon-btn">
              <span className="material-icons-round">notifications_none</span>
              <span className="icon-btn__badge"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="feed-filters">
        <FilterTabs active={filter} onChange={setFilter} />
        <div className="top-bar__toggle">
          <span className="toggle__label">Verified Pro Only</span>
          <label className="toggle">
            <input
              type="checkbox"
              checked={proOnly}
              onChange={(e) => setProOnly(e.target.checked)}
            />
            <span className="toggle__slider"></span>
          </label>
        </div>
      </div>

      {/* Feed */}
      <div className="feed" id="feed-list">
        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons-round">forum</span>
            <p className="empty-state__text">No posts match your filters. Try adjusting your search or filter.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              bookmarks={bookmarks}
              onBookmarkChange={saveBookmarks}
            />
          ))
        )}
      </div>
    </div>
  );
}
