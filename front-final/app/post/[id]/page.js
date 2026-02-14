'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as DB from '@/lib/db';
import { useToast } from '@/context/ToastContext';
import { timeAgo } from '@/lib/helpers';
import MythShield from '@/components/MythShield';
import ExpertCard from '@/components/ExpertCard';
import CommentBubble from '@/components/CommentBubble';
import Modal from '@/components/Modal';

export default function ThreadPage() {
    const params = useParams();
    const router = useRouter();
    const showToast = useToast();
    const postId = params.id;

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [inlineComment, setInlineComment] = useState('');
    const [commentModal, setCommentModal] = useState(false);
    const [modalComment, setModalComment] = useState('');
    const [upvotes, setUpvotes] = useState(0);
    const [voteState, setVoteState] = useState(null);

    const loadData = useCallback(() => {
        const p = DB.getPost(postId);
        if (p) {
            setPost(p);
            setUpvotes(p.upvotes);
        }
        setComments(DB.getComments(postId));
    }, [postId]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleVote = (dir) => {
        if (voteState === dir) return;
        setVoteState(dir);
        DB.votePost(postId, dir);
        const updated = DB.getPost(postId);
        if (updated) setUpvotes(updated.upvotes);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: 'MedAware Post', url: window.location.href }).catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => showToast('Link copied to clipboard!'));
        }
    };

    const handleReactComment = (cid, type) => {
        DB.reactToComment(cid, type);
        loadData();
    };

    const submitInline = () => {
        if (!inlineComment.trim()) return;
        DB.addComment(postId, inlineComment.trim());
        setInlineComment('');
        showToast('Comment published!');
        loadData();
    };

    const submitModal = () => {
        if (!modalComment.trim()) return;
        DB.addComment(postId, modalComment.trim());
        setModalComment('');
        setCommentModal(false);
        showToast('Comment published!');
        loadData();
    };

    const handleLikeComment = (cid) => {
        DB.reactToComment(cid, 'thanked');
        loadData();
    };

    if (!post) {
        return (
            <div className="page-container">
                <div className="view-header">
                    <button className="view-header__back" onClick={() => router.push('/')}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <span className="view-header__title">Thread</span>
                    <span className="view-header__spacer"></span>
                </div>
                <div className="empty-state" style={{ padding: '2rem' }}>
                    <p className="empty-state__text">Post not found.</p>
                </div>
            </div>
        );
    }

    const currentUser = DB.getCurrentUser();
    const expertComments = comments.filter(c => c.isExpert);
    const regularComments = comments.filter(c => !c.isExpert && !c.parentId);

    return (
        <div className="page-container" id="thread-view">
            <div className="view-header">
                <button className="view-header__back" onClick={() => router.push('/')}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <span className="view-header__title">Thread</span>
                <span className="view-header__spacer"></span>
            </div>

            <div id="thread-content">
                {/* OP Post */}
                <article className="thread__op">
                    <div className="thread__op-header">
                        <div className="thread__op-header__content">
                            <div className="card__meta-left" style={{ marginBottom: '0.5rem' }}>
                                {post.tags.map((t, i) => (
                                    <span key={i} className={`tag tag--${t.type}`}>{t.label}</span>
                                ))}
                                <span className="card__time">{timeAgo(post.createdAt)}</span>
                            </div>
                            <h2 className="thread__op-title">{post.title}</h2>
                        </div>
                        <div className="vote-control">
                            <button
                                className={`vote-control__btn vote-control__btn--up ${voteState === 'up' ? 'vote-control__btn--active' : ''}`}
                                onClick={() => handleVote('up')}
                            >
                                <span className="material-icons-round">arrow_upward</span>
                            </button>
                            <span className="vote-control__count">{upvotes}</span>
                            <button
                                className={`vote-control__btn vote-control__btn--down ${voteState === 'down' ? 'vote-control__btn--active' : ''}`}
                                onClick={() => handleVote('down')}
                            >
                                <span className="material-icons-round">arrow_downward</span>
                            </button>
                        </div>
                    </div>
                    <div className="thread__user">
                        <div className="avatar avatar--md" style={{ background: post.user.avatar_bg }}>{post.user.initials}</div>
                        <div>
                            <div style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: '0.875rem' }}>{post.user.username}</div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Member since {post.user.joined}</div>
                        </div>
                    </div>
                    <div className="thread__op-body">
                        {post.body.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                    <div className="thread__op-actions">
                        <button><span className="material-icons-round">chat_bubble_outline</span>{comments.length} Comments</button>
                        <button onClick={handleShare}><span className="material-icons-round">share</span>Share</button>
                        <button><span className="material-icons-round">flag</span>Report</button>
                    </div>
                </article>

                {/* Expert Responses */}
                {expertComments.map(c => (
                    <ExpertCard key={c.id} comment={c} onReact={handleReactComment} />
                ))}

                {/* Myth Shield */}
                <MythShield mythShield={post.mythShield} />

                {/* Community Discussion */}
                <div className="comments-section">
                    <h3 className="comments-heading">
                        Community Discussion <span className="comments-heading__count">{comments.length}</span>
                    </h3>
                    <div className="comment-sort">
                        <span className="comment-sort__tab comment-sort__tab--active">Top Rated</span>
                        <span className="comment-sort__tab">Newest</span>
                        <span className="comment-sort__tab">Controversial</span>
                    </div>
                    {regularComments.length === 0 ? (
                        <div className="empty-state" style={{ padding: '1rem' }}>
                            <p className="empty-state__text">No community comments yet. Be the first!</p>
                        </div>
                    ) : (
                        regularComments.map(c => {
                            const nested = comments.filter(r => r.parentId === c.id);
                            return (
                                <div key={c.id}>
                                    <CommentBubble
                                        comment={c}
                                        isOP={c.userId === post.userId}
                                        nested={false}
                                        onLike={handleLikeComment}
                                        onReply={() => setCommentModal(true)}
                                    />
                                    {nested.map(r => (
                                        <CommentBubble
                                            key={r.id}
                                            comment={r}
                                            isOP={r.userId === post.userId}
                                            nested={true}
                                            onLike={handleLikeComment}
                                            onReply={() => setCommentModal(true)}
                                        />
                                    ))}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Inline Comment */}
                <div className="thread__add-comment">
                    <div className="avatar avatar--md" style={{ background: currentUser?.avatar_bg }}>
                        {currentUser?.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                        <textarea
                            className="form-textarea"
                            rows="3"
                            placeholder="Add to the discussion…"
                            value={inlineComment}
                            onChange={(e) => setInlineComment(e.target.value)}
                        ></textarea>
                        <div className="thread__add-comment-footer">
                            <span className="thread__add-comment-hint">Markdown supported</span>
                            <button className="btn btn--primary btn--sm" onClick={submitInline}>Post Comment</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comment Modal */}
            <Modal open={commentModal} onClose={() => setCommentModal(false)} title="Add a Comment">
                <textarea
                    className="form-textarea"
                    rows="4"
                    placeholder="Share your thoughts…"
                    value={modalComment}
                    onChange={(e) => setModalComment(e.target.value)}
                ></textarea>
                <button className="btn btn--primary" style={{ width: '100%', marginTop: '0.75rem' }} onClick={submitModal}>
                    Post Comment
                </button>
            </Modal>
        </div>
    );
}
