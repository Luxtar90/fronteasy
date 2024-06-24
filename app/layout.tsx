// app/layout.tsx
'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
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
    router.push('/login');
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
              {!isAuthenticated && <a onClick={() => goToPage('/login')} className="nav-link">Login</a>}
              {!isAuthenticated && <a onClick={() => goToPage('/register')} className="nav-link">Register</a>}
              <a onClick={() => goToPage('/reset-password')} className="nav-link">Reset Password</a>
              {isAuthenticated && <a onClick={() => goToPage('/tasks')} className="nav-link">Tasks</a>}
              {isAuthenticated && <a onClick={() => goToPage('/completed')} className="nav-link">Completed Tasks</a>}
              {isAuthenticated && (
                <div
                  className="nav-link settings"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  Settings
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <a onClick={() => goToPage('/profile')} className="dropdown-item">Profile</a>
                      <a onClick={() => goToPage('/settings/edit-profile')} className="dropdown-item">Edit Profile</a>
                      <a onClick={() => goToPage('/settings/change-password')} className="dropdown-item">Change Password</a>
                      <a onClick={() => goToPage('/settings/reset-password')} className="dropdown-item">Reset Password</a>
                      <a onClick={handleLogout} className="dropdown-item">Logout</a>
                    </div>
                  )}
                </div>
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
