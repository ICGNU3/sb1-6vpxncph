/**
 * Loading Skeleton Components
 * Provides placeholder UI while content is loading
 * 
 * Features:
 * - Animated pulse effect
 * - Consistent styling with main UI
 * - Multiple skeleton types for different content
 * - Responsive design
 */
import React from 'react';

interface SkeletonProps {
  className?: string;
}

// Base skeleton component with pulse animation
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-slate-700/50 rounded ${className}`}
    />
  );
}

// Project card loading skeleton
export function ProjectSkeleton() {
  return (
    <div className="gradient-border bg-slate-800/50 rounded-lg overflow-hidden">
      <Skeleton className="w-full h-48" /> {/* Image placeholder */}
      <div className="p-6">
        <Skeleton className="h-8 w-3/4 mb-4" /> {/* Title placeholder */}
        <Skeleton className="h-4 w-full mb-2" /> {/* Description line 1 */}
        <Skeleton className="h-4 w-2/3 mb-4" /> {/* Description line 2 */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24" /> {/* Stats placeholder */}
          <Skeleton className="h-6 w-24" /> {/* Button placeholder */}
        </div>
      </div>
    </div>
  );
}

// Resource card loading skeleton
export function ResourceSkeleton() {
  return (
    <div className="gradient-border bg-slate-800/50 rounded-lg p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" /> {/* Avatar */}
        <div>
          <Skeleton className="h-6 w-32 mb-2" /> {/* Name */}
          <Skeleton className="h-4 w-24" /> {/* Role */}
        </div>
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
      <Skeleton className="h-4 w-full mb-4" /> {/* Description */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full" /> {/* Tag 1 */}
        <Skeleton className="h-6 w-16 rounded-full" /> {/* Tag 2 */}
        <Skeleton className="h-6 w-16 rounded-full" /> {/* Tag 3 */}
      </div>
    </div>
  );
}

// Post card loading skeleton
export function PostSkeleton() {
  return (
    <div className="gradient-border bg-slate-800/50 rounded-lg p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" /> {/* Avatar */}
        <div>
          <Skeleton className="h-6 w-32 mb-2" /> {/* Name */}
          <Skeleton className="h-4 w-24" /> {/* Timestamp */}
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" /> {/* Content line 1 */}
      <Skeleton className="h-4 w-3/4 mb-4" /> {/* Content line 2 */}
      <Skeleton className="w-full h-48 rounded-lg mb-4" /> {/* Image */}
      <div className="flex justify-between">
        <Skeleton className="h-8 w-20" /> {/* Action button 1 */}
        <Skeleton className="h-8 w-20" /> {/* Action button 2 */}
        <Skeleton className="h-8 w-20" /> {/* Action button 3 */}
      </div>
    </div>
  );
}

// Event card loading skeleton
export function EventSkeleton() {
  return (
    <div className="gradient-border bg-slate-800/50 rounded-lg overflow-hidden">
      <Skeleton className="w-full h-48" /> {/* Cover image */}
      <div className="p-6">
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-24 rounded-full" /> {/* Tag 1 */}
          <Skeleton className="h-6 w-24 rounded-full" /> {/* Tag 2 */}
        </div>
        <Skeleton className="h-8 w-3/4 mb-4" /> {/* Title */}
        <Skeleton className="h-4 w-full mb-2" /> {/* Description line 1 */}
        <Skeleton className="h-4 w-2/3 mb-4" /> {/* Description line 2 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" /> {/* Host avatar */}
            <div>
              <Skeleton className="h-4 w-24 mb-1" /> {/* Host name */}
              <Skeleton className="h-3 w-16" /> {/* Host role */}
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" /> {/* Action button */}
        </div>
      </div>
    </div>
  );
}