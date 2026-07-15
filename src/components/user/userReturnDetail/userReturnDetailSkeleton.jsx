// =============================================================================
// FILE: userReturnDetailSkeleton.jsx
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const UserReturnDetailSkeleton = () => (
    <div className="space-y-5">
        <Skeleton width={200} height={28} borderRadius={8} />
        <Skeleton height={120} borderRadius={20} />
        <Skeleton height={100} borderRadius={20} />
        <Skeleton height={200} borderRadius={20} />
    </div>
);

export default UserReturnDetailSkeleton;