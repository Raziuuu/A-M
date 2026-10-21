import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { RoleSwitcher } from '@/components/ui/RoleSwitcher';

export const metadata: Metadata = {
  title: 'ACTION = MATTER — Where Ideas Turn Into Action',
  description:
    'The premier international platform uniting curated skilled specialists, exclusive client opportunities, and high-impact enterprise commissions.',
  keywords: [
    'Action is Matter',
    'Skill Network',
    'Exclusive Freelance',
    'Enterprise Commissions',
    'Tech Leadership',
    'Executive Consulting',
  ],
  authors: [{ name: 'ACTION = MATTER Team' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'ACTION = MATTER — Where Ideas Turn Into Action',
    description: 'Premier international network for elite practitioners and high-impact commissions.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ACTION = MATTER',
  },
};

export const viewport: Viewport = {
  themeColor: '#05070a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#05070a] text-[#f5f5f5] min-h-screen selection:bg-[#dfaf4b]/30 selection:text-white antialiased font-sans">
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0d1117',
              color: '#f5f5f5',
              border: '1px solid rgba(223, 175, 75, 0.25)',
            },
          }}
        />
        {/* Floating persona test switcher: toggles between Free User, Premium Member, and Admin/CEO */}
        <RoleSwitcher />
      </body>
    </html>
  );
}
