"use client";

const AlarmSkeleton = () => {
  return (
    <div className="flex items-center justify-between py-3 md:py-4 border-b border-gray-500/25 last:border-0 gap-3 sm:gap-6 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-700/40 flex-shrink-0" />

      {/* Text Area Skeleton */}
      <div className="flex flex-col sm:flex-row flex-1 justify-between items-start sm:items-center gap-2 sm:gap-4">
        {/* Time Skeleton */}
        <div className="h-3 w-16 sm:w-20 bg-gray-700/40 rounded" />

        {/* Type and Value Skeleton */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="h-4 sm:h-5 w-12 sm:w-16 bg-gray-700/40 rounded" />
          <div className="h-3 sm:h-4 w-10 sm:w-14 bg-gray-700/40 rounded" />
        </div>
      </div>

      {/* Checkbox Skeleton */}
      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-gray-700/40 flex-shrink-0" />
    </div>
  );
};

export default AlarmSkeleton;
