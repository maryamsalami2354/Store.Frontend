// =============================================================================
// FILE: GuaranteePageSkeleton.jsx
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const GuaranteePageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
            <Skeleton width={120} height={16} borderRadius={8} className="mb-6" />
            <Skeleton height={200} borderRadius={24} className="mb-6" />
            <div className="max-w-4xl mx-auto space-y-4">
                {[1,2,3,4].map(i => <Skeleton key={i} height={200} borderRadius={20} />)}
            </div>
        </div>
    </div>
);

export default GuaranteePageSkeleton;