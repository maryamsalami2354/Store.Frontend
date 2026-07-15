// =============================================================================
// FILE: PaymentPageSkeleton.jsx
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PaymentPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
            <Skeleton height={80} borderRadius={20} className="mb-6" />
            <Skeleton width={150} height={32} borderRadius={8} className="mb-4" />
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <Skeleton height={160} borderRadius={20} />
                    <Skeleton height={140} borderRadius={20} />
                </div>
                <div className="w-full lg:w-80"><Skeleton height={400} borderRadius={20} /></div>
            </div>
        </div>
    </div>
);

export default PaymentPageSkeleton;