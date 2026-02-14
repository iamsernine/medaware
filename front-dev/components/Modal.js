'use client';

export default function Modal({ open, onClose, title, children }) {
    if (!open) return null;

    return (
        <div className="modal">
            <div className="modal__backdrop" onClick={onClose}></div>
            <div className="modal__sheet">
                <div className="modal__handle"></div>
                <h3 className="modal__title">{title}</h3>
                {children}
            </div>
        </div>
    );
}
