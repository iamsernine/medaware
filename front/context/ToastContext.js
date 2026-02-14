'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({ msg: '', visible: false });
    const timerRef = useRef(null);

    const showToast = useCallback((msg) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setToast({ msg, visible: true });
        timerRef.current = setTimeout(() => setToast({ msg: '', visible: false }), 2800);
    }, []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            {toast.visible && (
                <div className="toast toast--success">
                    <span className="material-icons-round toast__icon">check_circle</span>
                    <span>{toast.msg}</span>
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
