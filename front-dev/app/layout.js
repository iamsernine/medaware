import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: 'MedAware — Community Health Forum',
  description: 'Ask health questions, get verified professional answers, and join a supportive medical community.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <ToastProvider>
          {children}
          <BottomNav />
        </ToastProvider>
      </body>
    </html>
  );
}
