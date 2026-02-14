'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    { href: '/', icon: 'home', label: 'Home' },
    { href: '/create', icon: 'add_circle', label: 'Create' },
    { href: '/post/post_1', icon: 'chat_bubble_outline', label: 'Thread' },
    { href: '/profile', icon: 'person', label: 'Profile' },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav" id="bottom-nav">
            {NAV_ITEMS.map(item => {
                const isActive = item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
                    >
                        <span className="material-icons-round">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
