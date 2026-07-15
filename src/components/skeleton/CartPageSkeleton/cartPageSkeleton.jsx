// =============================================================================
// FILE: cartPageSkeleton.jsx
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CartPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 mb-5"><Skeleton width={50} height={16} borderRadius={8} /><Skeleton width={12} height={12} borderRadius="50%" /><Skeleton width={80} height={16} borderRadius={8} /></div>
            <Skeleton width={150} height={32} borderRadius={8} className="mb-4" />
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    {[1,2].map(i => (
                        <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border p-4 flex gap-4">
                            <Skeleton width={80} height={80} borderRadius={12} />
                            <div className="flex-1"><Skeleton width="60%" height={16} /><Skeleton width="40%" height={12} className="mt-2" /><Skeleton width="30%" height={20} className="mt-3" /></div>
                        </div>
                    ))}
                    <Skeleton height={80} borderRadius={16} />
                    <Skeleton height={120} borderRadius={16} />
                </div>
                <div className="w-full lg:w-80"><Skeleton height={280} borderRadius={20} /></div>
            </div>
        </div>
    </div>
);

export default CartPageSkeleton;