'use client';

import { useState } from 'react';
import { timeAgo } from '@/lib/helpers';

export default function CommentBubble({ comment, isOP, nested, onLike, onReply }) {
    const cu = comment.user;
    const likes = (comment.reactions.thanked || 0) + (comment.reactions.informative || 0);
    const [hasLiked, setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);

    const handleLike = () => {
        if (!hasLiked) {
            setHasLiked(true);
            setLikeCount(prev => prev + 1);
            if (onLike) onLike(comment.id);
        }
    };

    return (
        <div className={`comment-item ${nested ? 'comment-item--nested' : ''}`}>
            <div className={`avatar avatar--md ${nested ? '' : 'avatar--square'}`} style={{ background: cu.avatar_bg }}>
                {cu.initials}
            </div>
            <div className="comment-item__content">
                <div className="comment-bubble">
                    <div className="comment-bubble__header">
                        <span className="comment-bubble__name">{cu.name}</span>
                        {isOP && <span className="comment-bubble__tag">OP</span>}
                        {cu.verified && (
                            <span className="material-icons-round" style={{ fontSize: '14px', color: 'var(--primary)' }}>verified</span>
                        )}
                        <span className="comment-bubble__time">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="comment-bubble__body">{comment.body}</p>
                </div>
                <div className="comment-bubble__actions">
                    <button
                        className={hasLiked ? 'action--active' : ''}
                        onClick={handleLike}
                    >
                        <span className="material-icons-round">thumb_up</span> {likeCount || ''}
                    </button>
                    <button onClick={onReply}>Reply</button>
                    <button className="report-action" style={{ opacity: 0, transition: 'opacity 0.2s' }}>Report</button>
                </div>
            </div>
        </div>
    );
}
