export default function EmergencyBanner({ visible }) {
    if (!visible) return null;

    return (
        <div className="emergency-banner">
            <div className="emergency-banner__bar"></div>
            <div className="emergency-banner__body">
                <div className="emergency-banner__text">
                    <span className="material-icons-round emergency-banner__icon">warning</span>
                    <div>
                        <strong>Potential Medical Emergency</strong>
                        <p>Your description mentions emergency keywords. Do not wait for an online response.</p>
                    </div>
                </div>
                <div className="emergency-banner__actions">
                    <a href="https://maps.google.com/?q=nearest+emergency+room" target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm">Find Nearest ER</a>
                    <a href="tel:141" className="btn btn--danger btn--sm">
                        <span className="material-icons-round" style={{ fontSize: '16px' }}>call</span>Call 141
                    </a>
                </div>
            </div>
        </div>
    );
}
