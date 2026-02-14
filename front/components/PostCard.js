'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import * as DB from '@/lib/db';
import { useToast } from '@/context/ToastContext';
import { timeAgo } from '@/lib/helpers';

export default function PostCard({ post, bookmarks, onBookmarkChange }) {
    const showToast = useToast();
    const comments = DB.getComments(post.id);
    const [upvotes, setUpvotes] = useState(post.upvotes);
    const [voteState, setVoteState] = useState(null);
    const isBookmarked = bookmarks.has(post.id);

    const categoryLabel = post.category ? post.category.charAt(0).toUpperCase() + post.category.slice(1) : '';

    const handleVote = (e, dir) => {
        e.preventDefault();
        e.stopPropagation();
        if (voteState === dir) return;

        // Clear sibling
        setVoteState(dir);
        DB.votePost(post.id, dir);
        const updated = DB.getPost(post.id);
        if (updated) setUpvotes(updated.upvotes);
    };

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (bookmarks.has(post.id)) {
            bookmarks.delete(post.id);
            showToast('Removed from bookmarks');
        } else {
            bookmarks.add(post.id);
            showToast('Bookmarked!');
        }
        onBookmarkChange(new Set(bookmarks));
    };

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({ title: 'MedAware Post', url: window.location.href }).catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => showToast('Link copied to clipboard!'));
        }
    };

    return (
        <Link href={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article className="card" data-verified={String(post.verifiedResponses > 0)} data-category={post.category}>
                <div className="card__header">
                    <div className="card__meta-left">
                        {post.tags.map((t, i) => (
                            <span key={i} className={`tag tag--${t.type}`}>{t.label}</span>
                        ))}
                        <span className="card__category">{categoryLabel}</span>
                        <span className="card__time">• Posted {timeAgo(post.createdAt)} by {post.user.username}</span>
                    </div>
                    <div className="card__meta-right">
                        <button className="icon-btn icon-btn--sm" onClick={(e) => e.preventDefault()}>
                            <span className="material-icons-round">more_horiz</span>
                        </button>
                    </div>
                </div>
                <h2 className="card__title">{post.title}</h2>
                <p className="card__body">{post.body}</p>
                {post.verifiedResponses > 0 && (
                    <div className="verified-chip">
                        <span className="material-icons-round">verified</span>
                        {post.verifiedResponses} Verified Professional{post.verifiedResponses > 1 ? 's' : ''} responded
                    </div>
                )}
                <div className="engage">
                    <div className="engage__left">
                        <div className="vote-pill">
                            <button
                                className={`vote-pill__btn vote-pill__btn--up ${voteState === 'up' ? 'vote-pill__btn--active' : ''}`}
                                onClick={(e) => handleVote(e, 'up')}
                            >
                                <span className="material-icons-round">arrow_upward</span>
                            </button>
                            <span className="vote-pill__count">{upvotes}</span>
                            <button
                                className={`vote-pill__btn vote-pill__btn--down ${voteState === 'down' ? 'vote-pill__btn--active' : ''}`}
                                onClick={(e) => handleVote(e, 'down')}
                            >
                                <span className="material-icons-round">arrow_downward</span>
                            </button>
                        </div>
                        <span className="engage-action" onClick={(e) => e.stopPropagation()}>
                            <span className="material-icons-round">chat_bubble_outline</span>
                            {comments.length} Comments
                        </span>
                        <button className="engage-action engage-action--share" onClick={handleShare}>
                            <span className="material-icons-round">share</span>Share
                        </button>
                    </div>
                    <div className="engage__right">
                        <button
                            className={`engage-action engage-action--bookmark ${isBookmarked ? 'active' : ''}`}
                            onClick={handleBookmark}
                        >
                            <span className="material-icons-round">{isBookmarked ? 'bookmark' : 'bookmark_border'}</span>
                        </button>
                    </div>
                </div>
            </article>
        </Link>
    );
}
