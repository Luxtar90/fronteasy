// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <title>TaskEase</title>
      </head>
      <body>
        <header>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
            <Link href="/reset-password">Reset Password</Link>
            <Link href="/tasks">Tasks</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
