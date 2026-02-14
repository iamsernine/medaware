export default function MythShield({ mythShield }) {
    if (!mythShield) return null;

    return (
        <div className="myth-shield">
            <div className="myth-shield__icon">
                <span className="material-icons-round">shield</span>
            </div>
            <div>
                <div className="myth-shield__title">
                    AI Myth-Shield Note <span className="myth-shield__auto-tag">Automated Context</span>
                </div>
                <p dangerouslySetInnerHTML={{ __html: mythShield.text }} />
                <div className="myth-shield__sources">
                    {mythShield.sources.map((s, i) => (
                        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer">
                            <span className="material-icons-round">open_in_new</span>
                            {s.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
