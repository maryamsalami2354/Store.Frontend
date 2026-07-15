// =============================================================================
// FILE: amazingProductsPageSkeleton.jsx
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import ProductSkeletonSlider from '../ProductSkeletonSlider/ProductSkeletonSlider';
import 'react-loading-skeleton/dist/skeleton.css';

const AmazingProductsPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 mb-5"><Skeleton width={50} height={16} borderRadius={8} /><Skeleton width={12} height={12} borderRadius="50%" /><Skeleton width={100} height={16} borderRadius={8} /></div>
            <Skeleton height={140} borderRadius={24} className="mb-4" />
            <Skeleton height={44} borderRadius={14} className="mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">{Array.from({ length: 10 }).map((_, i) => <ProductSkeletonSlider key={i} />)}</div>
        </div>
    </div>
);

export default AmazingProductsPageSkeleton;