// app/layout.tsx
'use client';

import './globals.css';
import './layout.css';
import { ReactNode } from 'react';
import Link from 'next/link';

const RootLayout = ({ children }: { children: ReactNode }) => {
  const handleLinkClick = (href: string) => {
    window.location.href = href;
  };

  return (
    <html lang="en">
      <head>
        <title>TaskEase</title>
      </head>
      <body>
        <header className="header">
          <div className="container">
            <div className="logo">TaskEase</div>
            <nav className="nav">
              <button onClick={() => handleLinkClick('/')}>Home</button>
              <button onClick={() => handleLinkClick('/login')}>Login</button>
              <button onClick={() => handleLinkClick('/register')}>Register</button>
              <button onClick={() => handleLinkClick('/reset-password')}>Reset Password</button>
              <button onClick={() => handleLinkClick('/tasks')}>Tasks</button>
            </nav>
          </div>
        </header>
        <main className="main-container">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
