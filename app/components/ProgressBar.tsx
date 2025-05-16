'use client';

import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  progress: number;
  isComplete: boolean;
  isError: boolean;
}

export default function ProgressBar({ progress, isComplete, isError }: ProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Smoothly animate the progress bar
    const animation = requestAnimationFrame(() => {
      setAnimatedProgress(prev => {
        // If current progress is less than target, increment smoothly
        if (prev < progress) {
          return Math.min(prev + 2, progress);
        }
        return progress;
      });
    });
    
    return () => cancelAnimationFrame(animation);
  }, [progress, animatedProgress]);

  const getProgressColorClass = () => {
    if (isError) return 'bg-red-500';
    if (isComplete) return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">
          {isError ? 'Error' : isComplete ? 'Complete' : 'Processing...'}
        </span>
        <span className="text-sm font-medium text-gray-700">{Math.round(animatedProgress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColorClass()}`}
          style={{ width: `${animatedProgress}%` }}
        ></div>
      </div>
    </div>
  );
}