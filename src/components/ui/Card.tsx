/**
 * Card Component
 * A container component with consistent styling and gradient border effect
 * 
 * Features:
 * - Gradient border animation
 * - Semi-transparent background
 * - Consistent padding and rounded corners
 * - Flexible content support
 */
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`gradient-border bg-slate-800/50 rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}