// =============================================================================
// FILE: SupportPageSkeleton.jsx
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SupportPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
            <Skeleton width={120} height={16} borderRadius={8} className="mb-6" />
            <Skeleton height={160} borderRadius={24} className="mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton height={300} borderRadius={20} />
                    <Skeleton height={250} borderRadius={20} />
                </div>
                <div className="space-y-4">
                    <Skeleton height={200} borderRadius={20} />
                    <Skeleton height={200} borderRadius={20} />
                </div>
            </div>
        </div>
    </div>
);

export default SupportPageSkeleton;