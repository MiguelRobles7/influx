// Import global stylesheets, and the Inter font.
import '@/src/styles/globals.scss';
import { Inter } from 'next/font/google';
import { GlobalProvider } from './backend/hooks/context/useGlobalContext';

// Creates an instance of the Inter font.
const inter = Inter({ subsets: ['latin'] });

// Exports the metadata for the page (<head>).
export const metadata = {
  title: 'Influx',
  description: 'Find the best deals on the internet.',
  metadata: {
    charset: 'utf-8',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <GlobalProvider>
        <body className={inter.className}>{children}</body>
      </GlobalProvider>
    </html>
  );
}
