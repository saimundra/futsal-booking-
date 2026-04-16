import React from 'react';
import { motion } from 'framer-motion';

const shimmer = {
  initial: {
    backgroundPosition: '-200% 0',
  },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 1.5,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

export const SkeletonCard = ({ className = '' }) => (
  <motion.div
    className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl ${className}`}
    style={{
      backgroundSize: '200% 100%',
    }}
    variants={shimmer}
    initial="initial"
    animate="animate"
  />
);

export const SkeletonVenueCard = () => (
  <motion.div
    className="bg-white rounded-xl shadow-md overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <SkeletonCard className="h-48 w-full rounded-t-xl rounded-b-none" />
    <div className="p-6 space-y-3">
      <SkeletonCard className="h-6 w-3/4" />
      <SkeletonCard className="h-4 w-1/2" />
      <SkeletonCard className="h-4 w-full" />
      <SkeletonCard className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <SkeletonCard className="h-6 w-20" />
        <SkeletonCard className="h-6 w-20" />
        <SkeletonCard className="h-6 w-20" />
      </div>
    </div>
  </motion.div>
);

export const SkeletonBookingCard = () => (
  <motion.div
    className="bg-white rounded-xl shadow-md overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="flex gap-4 p-6">
      <SkeletonCard className="h-24 w-24 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <SkeletonCard className="h-5 w-2/3" />
        <SkeletonCard className="h-4 w-1/2" />
        <SkeletonCard className="h-4 w-3/4" />
      </div>
    </div>
  </motion.div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    <SkeletonCard className="h-12 w-full rounded-lg" />
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonCard key={i} className="h-16 w-full rounded-lg" />
    ))}
  </div>
);

export const SkeletonSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full border-4 border-gray-200 border-t-primary`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: 'linear',
        repeat: Infinity,
      }}
    />
  );
};

export default SkeletonCard;
