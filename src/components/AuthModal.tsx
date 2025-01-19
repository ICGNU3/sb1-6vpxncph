/**
 * AuthModal Component
 * Authentication modal for user sign up and sign in
 * 
 * Features:
 * - Email and password authentication
 * - Toggle between sign up and sign in
 * - Form validation
 * - Error handling
 * - Loading states
 * - Smooth animations
 */
import React, { useState } from 'react';
import { X, Mail, Lock, Loader } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useAuthStore } from '../store/authStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  // Form state management
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auth actions from global store
  const { signUp, signIn } = useAuthStore();

  /**
   * Handles form submission for both sign up and sign in
   * Implements error handling and loading states
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Rest of the component implementation... */}
    </div>
  );
}