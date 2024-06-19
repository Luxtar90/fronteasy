'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import './layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  const goToPage = (path: string) => {
    router.push(path);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

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
            <div className="logo-container" onClick={() => goToPage('/')}>
              <img src="/logo.png" alt="TaskEase Logo" />
              <span className="logo-text">TaskEase</span>
            </div>
            <nav className="nav-link-container">
              <a onClick={() => goToPage('/')} className="nav-link">Home</a>
              <a onClick={() => goToPage('/login')} className="nav-link">Login</a>
              <a onClick={() => goToPage('/register')} className="nav-link">Register</a>
              <a onClick={() => goToPage('/reset-password')} className="nav-link">Reset Password</a>
              <a onClick={() => goToPage('/tasks')} className="nav-link">Tasks</a>
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
