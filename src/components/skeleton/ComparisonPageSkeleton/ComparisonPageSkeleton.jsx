// =============================================================================
// FILE: ComparisonPageSkeleton.jsx (اصلاح‌شده - داخل container)
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ComparisonPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
            <Skeleton width={150} height={16} borderRadius={8} className="mb-6" />
            <Skeleton width={200} height={32} borderRadius={8} className="mb-4" />
            <div className="bg-white dark:bg-[#111] rounded-2xl border overflow-hidden">
                <div className="p-4 sm:p-6 overflow-x-auto">
                    <div className="flex gap-4 min-w-[600px]">
                        <Skeleton width={120} height={40} className="flex-shrink-0" />
                        {[1,2,3].map(i => (
                            <div key={i} className="flex-1 text-center min-w-[150px]">
                                <Skeleton circle width={80} height={80} className="mx-auto mb-2" />
                                <Skeleton width="80%" height={16} />
                            </div>
                        ))}
                    </div>
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="flex gap-4 mt-4 min-w-[600px]">
                            <Skeleton width={120} height={30} className="flex-shrink-0" />
                            {[1,2,3].map(j => (
                                <div key={j} className="flex-1 min-w-[150px]">
                                    <Skeleton height={30} borderRadius={8} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default ComparisonPageSkeleton;