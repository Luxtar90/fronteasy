'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Callback = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        console.log('Token recibido:', token);
        localStorage.setItem('token', token);
        router.push('/tasks');
      } else {
        console.error('Token no recibido');
        router.push('/login');
      }
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
};

export default Callback;
