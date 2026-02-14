'use client';

export default function FilterTabs({ active, onChange }) {
    const tabs = ['trending', 'newest', 'unanswered'];

    return (
        <div className="filter-tabs">
            {tabs.map(tab => (
                <button
                    key={tab}
                    className={`filter-tab ${active === tab ? 'filter-tab--active' : ''}`}
                    onClick={() => onChange(tab)}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );
}
