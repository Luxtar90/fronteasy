// layout.tsx
'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import './layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>TaskEase</title>
        <meta name="description" content="Task management application" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="layout">
          <header className="nav-horizontal">
            <div className="logo-container">
              <img src="/logo.png" alt="TaskEase Logo" />
              <span className="logo-text">TaskEase</span>
            </div>
            <nav className="nav-link-container">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/login" className="nav-link">Login</Link>
              <Link href="/register" className="nav-link">Register</Link>
              <Link href="/reset-password" className="nav-link">Reset Password</Link>
              <Link href="/tasks" className="nav-link">Tasks</Link>
            </nav>
          </header>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
};

export default Layout;
