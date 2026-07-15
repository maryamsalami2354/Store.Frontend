// =============================================================================
// FILE: sellerReturnsSkeleton.jsx
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SellerReturnsSkeleton = () => (
    <div className="space-y-5">
        <Skeleton width={200} height={32} borderRadius={8} />
        <Skeleton height={56} borderRadius={14} />
        {[1,2,3,4].map(i => (
            <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border p-4 flex gap-4">
                <Skeleton width={64} height={64} borderRadius={12} />
                <div className="flex-1"><Skeleton width="60%" height={16} /><Skeleton width="40%" height={12} className="mt-2" /><Skeleton width="30%" height={12} className="mt-1" /></div>
            </div>
        ))}
    </div>
);

export default SellerReturnsSkeleton;