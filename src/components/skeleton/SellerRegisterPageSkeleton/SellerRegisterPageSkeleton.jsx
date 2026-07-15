// =============================================================================
// FILE: SellerRegisterPageSkeleton.jsx
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SellerRegisterPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
            <Skeleton height={300} borderRadius={24} className="mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[1,2,3].map(i => <Skeleton key={i} height={180} borderRadius={20} />)}
            </div>
            <Skeleton height={60} borderRadius={14} className="mb-4" />
            <Skeleton height={200} borderRadius={20} className="mb-6" />
            <Skeleton height={160} borderRadius={20} />
        </div>
    </div>
);

export default SellerRegisterPageSkeleton;