/**
 * Button Component
 * A customizable button component with multiple variants and sizes
 * 
 * Features:
 * - Multiple visual variants (primary, secondary, outline)
 * - Configurable sizes (sm, md, lg)
 * - Gradient border effect
 * - Hover and focus states
 * - Full TypeScript support
 */
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}: ButtonProps) {
  // Base styles applied to all button variants
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200';
  
  // Variant-specific styles
  const variants = {
    primary: 'gradient-border bg-slate-900 text-green-400 hover:text-green-300',
    secondary: 'bg-green-400 text-slate-900 hover:bg-green-300',
    outline: 'border-2 border-green-400/50 text-green-400 hover:border-green-400 hover:text-green-300'
  };

  // Size-specific styles
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-3 text-lg'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}