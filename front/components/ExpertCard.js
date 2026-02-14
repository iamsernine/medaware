import { timeAgo } from '@/lib/helpers';

export default function ExpertCard({ comment, onReact }) {
    const cu = comment.user;
    const hasRecommendation = comment.body.includes('recommend') || comment.body.includes('advise');

    return (
        <div className="expert-card">
            <div className="expert-card__header">
                <div className="expert-card__user">
                    <div className="expert-card__avatar">
                        <div className="avatar avatar--lg" style={{ background: cu.avatar_bg }}>{cu.initials}</div>
                        <div className="expert-card__badge">
                            <span className="material-icons-round">verified</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="expert-card__name">{cu.name}</span>
                            <span className="expert-card__tag">Verified Expert</span>
                        </div>
                        <span className="expert-card__role">{cu.specialization || 'Medical Professional'} • Verified</span>
                    </div>
                </div>
                <span className="expert-card__top-contrib">Top Contributor</span>
            </div>
            <div className="expert-card__body">
                <p dangerouslySetInnerHTML={{ __html: comment.body }} />
                {hasRecommendation && (
                    <div className="expert-card__recommend">
                        <h4>Professional Recommendation:</h4>
                        <p>This response contains professional medical guidance. Always consult your physician for a definitive diagnosis.</p>
                    </div>
                )}
            </div>
            <div className="expert-card__footer">
                <div className="expert-card__footer-left">
                    <button onClick={() => onReact(comment.id, 'thanked')}>Reply</button>
                    <span className="dot">•</span>
                    <button
                        className={comment.reactions.thanked ? 'action--active' : ''}
                        onClick={() => onReact(comment.id, 'thanked')}
                    >
                        Helpful ({(comment.reactions.thanked || 0) + (comment.reactions.informative || 0)})
                    </button>
                </div>
                <span className="expert-card__footer-right">{timeAgo(comment.createdAt)}</span>
            </div>
        </div>
    );
}
