'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const goToPage = (path: string) => {
    router.push(path);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  if (pathname === '/login' || pathname === '/register' || pathname === '/reset-password') {
    return (
      <html lang="en">
        <body>
          <button className="top-left-button" onClick={() => goToPage('/')}>
            Home
          </button>
          {children}
        </body>
      </html>
    );
  }

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
              <a onClick={() => goToPage('/reset-password')} className="nav-link">Reset Password</a>
              {isAuthenticated && (
                <button className="nav-link logout" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              )}
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
