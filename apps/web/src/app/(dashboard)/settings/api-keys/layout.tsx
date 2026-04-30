import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Keys | Bapx Media Hub',
  description: 'Manage your API keys for programmatic access to Bapx Media Hub',
  openGraph: {
    title: 'API Keys | Bapx Media Hub',
    description: 'Manage your API keys for programmatic access to Bapx Media Hub',
    type: 'website',
  },
};

export default async function APIKeysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
