'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as DB from '@/lib/db';
import { useToast } from '@/context/ToastContext';
import { timeAgo } from '@/lib/helpers';
import Modal from '@/components/Modal';

export default function ProfilePage() {
    const router = useRouter();
    const showToast = useToast();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ postsCount: 0, commentsCount: 0, helpfulVotes: 0 });
    const [userPosts, setUserPosts] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [form, setForm] = useState({ name: '', bio: '', location: '', email: '' });

    useEffect(() => {
        const u = DB.getCurrentUser();
        setUser(u);
        setStats(DB.getUserStats());
        setUserPosts(DB.getPosts().filter(p => p.userId === u.id));
    }, []);

    const openEdit = () => {
        setForm({
            name: user.name || '',
            bio: user.bio || '',
            location: user.location || '',
            email: user.email || '',
        });
        setEditModal(true);
    };

    const saveProfile = (e) => {
        e.preventDefault();
        const name = form.name.trim();
        DB.updateUser({
            name,
            bio: form.bio.trim(),
            location: form.location.trim(),
            email: form.email.trim(),
            initials: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        });
        setEditModal(false);
        showToast('Profile updated!');

        // Refresh
        const u = DB.getCurrentUser();
        setUser(u);
        setStats(DB.getUserStats());
        setUserPosts(DB.getPosts().filter(p => p.userId === u.id));
    };

    if (!user) return null;

    return (
        <div className="page-container" id="profile-view">
            <div className="view-header">
                <button className="view-header__back" onClick={() => router.push('/')}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <span className="view-header__title">Profile</span>
                <button className="icon-btn" onClick={openEdit} id="edit-profile-btn">
                    <span className="material-icons-round">edit</span>
                </button>
            </div>

            <div id="profile-content" style={{ padding: '1rem' }}>
                {/* Header */}
                <div className="profile__header">
                    <div className="avatar avatar--xl" style={{ background: user.avatar_bg }}>{user.initials}</div>
                    <div>
                        <h2 className="profile__name">{user.name}</h2>
                        <p className="profile__username">@{user.username}</p>
                        {user.verified && (
                            <div className="profile__verified-badge">
                                <span className="material-icons-round">verified</span>
                                {user.specialization || 'Verified Professional'}
                            </div>
                        )}
                        <p className="profile__bio">{user.bio || ''}</p>
                        <div className="profile__info">
                            <span className="profile__info-item">
                                <span className="material-icons-round">location_on</span>{user.location || 'Not set'}
                            </span>
                            <span className="profile__info-item">
                                <span className="material-icons-round">calendar_today</span>Joined {user.joined}
                            </span>
                            <span className="profile__info-item">
                                <span className="material-icons-round">email</span>{user.email || 'Not set'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="profile__stats">
                    <div className="stat-card">
                        <span className="stat-card__number">{stats.postsCount}</span>
                        <span className="stat-card__label">Posts</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-card__number">{stats.commentsCount}</span>
                        <span className="stat-card__label">Comments</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-card__number">{stats.helpfulVotes}</span>
                        <span className="stat-card__label">Helpful</span>
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="profile__section">
                    <h3 className="profile__section-title">
                        <span className="material-icons-round">description</span>Recent Posts
                    </h3>
                    {userPosts.length === 0 ? (
                        <p style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>No posts yet.</p>
                    ) : (
                        userPosts.slice(0, 5).map(p => (
                            <div
                                key={p.id}
                                className="profile__activity-item"
                                onClick={() => router.push(`/post/${p.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="profile__activity-title">{p.title}</div>
                                <div className="profile__activity-meta">
                                    {timeAgo(p.createdAt)} · {p.upvotes} helpful · {DB.getComments(p.id).length} comments
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Profile">
                <form onSubmit={saveProfile} id="edit-profile-form">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            className="form-input"
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea
                            className="form-textarea"
                            rows="3"
                            value={form.bio}
                            onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <input
                            className="form-input"
                            type="text"
                            value={form.location}
                            onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className="form-input"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                        />
                    </div>
                    <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        Save Changes
                    </button>
                </form>
            </Modal>
        </div>
    );
}
