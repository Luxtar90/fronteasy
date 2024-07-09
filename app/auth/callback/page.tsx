'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
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
  }, [router]);

  return <div>Loading...</div>;
};

export default Callback;
