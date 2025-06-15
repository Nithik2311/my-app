// components/withAuth.js
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';

export default function withAuth(Page) {
  return function ProtectedPage(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    if (loading || !user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
        </div>
      );
    }
    return <Page {...props} />;
  };
}
