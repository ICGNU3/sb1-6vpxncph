/**
 * Layout Component
 * Main layout wrapper for the application
 * 
 * Features:
 * - Consistent layout structure across all pages
 * - Navigation bar integration
 * - Footer integration
 * - Flexible content area
 * - Dark theme styling
 */
import React from 'react';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { ErrorBoundary } from './ErrorBoundary';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <ErrorBoundary>
        <NavBar />
        <main className="flex-grow">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}