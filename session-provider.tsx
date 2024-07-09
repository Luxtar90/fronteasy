'use client';

import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

const CustomSessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};

export default CustomSessionProvider;
