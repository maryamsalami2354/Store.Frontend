// =============================================================================
// FILE: ReturnPolicyPageSkeleton.jsx
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ReturnPolicyPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
            <Skeleton width={150} height={16} borderRadius={8} className="mb-6" />
            <Skeleton height={200} borderRadius={24} className="mb-6" />
            <div className="flex gap-6">
                <div className="flex-1 space-y-4">
                    <Skeleton height={400} borderRadius={20} />
                    <Skeleton height={200} borderRadius={20} />
                </div>
                <Skeleton width={280} height={300} borderRadius={20} className="hidden lg:block" />
            </div>
        </div>
    </div>
);

export default ReturnPolicyPageSkeleton;