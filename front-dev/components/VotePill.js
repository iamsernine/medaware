'use client';

import { useState } from 'react';

export default function VotePill({ postId, count, onVote, variant = 'pill' }) {
    const [voteState, setVoteState] = useState(null); // null | 'up' | 'down'
    const [displayCount, setDisplayCount] = useState(count);

    const isControl = variant === 'control';
    const prefix = isControl ? 'vote-control' : 'vote-pill';

    const handleVote = (dir) => {
        if (voteState === dir) {
            // Toggle off — not implemented in original but safe
            return;
        }
        setVoteState(dir);
        if (onVote) onVote(postId, dir);

        // Update display count
        const post = onVote(postId, dir, true); // dry run to get updated count
        if (post) setDisplayCount(post.upvotes);
    };

    return (
        <div className={prefix}>
            <button
                className={`${prefix}__btn ${prefix}__btn--up ${voteState === 'up' ? `${prefix}__btn--active` : ''}`}
                onClick={(e) => { e.stopPropagation(); handleVote('up'); }}
            >
                <span className="material-icons-round">arrow_upward</span>
            </button>
            <span className={`${prefix}__count`}>{displayCount}</span>
            <button
                className={`${prefix}__btn ${prefix}__btn--down ${voteState === 'down' ? `${prefix}__btn--active` : ''}`}
                onClick={(e) => { e.stopPropagation(); handleVote('down'); }}
            >
                <span className="material-icons-round">arrow_downward</span>
            </button>
        </div>
    );
}
