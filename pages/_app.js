import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '@/styles/bootstrap.min.css';
import { SWRConfig } from 'swr';
import Layout from '@/components/Layout';

async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure the router is initialized before accessing events
    if (router.events) {
      // Track loading state during navigation
      const handleRouteChangeStart = () => setLoading(true);
      const handleRouteChangeComplete = () => setLoading(false);
      const handleRouteChangeError = () => setLoading(false);

      // Subscribe to route change events
      router.events.on('routeChangeStart', handleRouteChangeStart);
      router.events.on('routeChangeComplete', handleRouteChangeComplete);
      router.events.on('routeChangeError', handleRouteChangeError);

      // Clean up event listeners on component unmount
      return () => {
        router.events.off('routeChangeStart', handleRouteChangeStart);
        router.events.off('routeChangeComplete', handleRouteChangeComplete);
        router.events.off('routeChangeError', handleRouteChangeError);
      };
    }
  }, [router.events]);

  return (
    <SWRConfig value={{ fetcher }}>
      <Layout>
        {loading && <div>Loading...</div>} {/* Show loading state */}
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
}
