import React, { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductSkeletonSlider = memo(() => (
    <div className="p-3 rounded-2xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 h-full">
        <div className="relative pt-14 pb-2 space-y-2">
            <div className="absolute top-2 start-2 flex gap-0.5">
                <Skeleton circle width={10} height={10} />
                <Skeleton circle width={10} height={10} />
            </div>
            <Skeleton height={112} className="!rounded-lg" />
            <Skeleton width={80} height={12} />
            <Skeleton width="90%" height={14} />
            <Skeleton width="60%" height={14} />
            <div className="flex justify-between items-end pt-2">
                <div className="space-y-1">
                    <Skeleton width={60} height={10} />
                    <Skeleton width={80} height={16} />
                </div>
                <Skeleton width={32} height={32} borderRadius={10} />
            </div>
        </div>
    </div>
));

ProductSkeletonSlider.displayName = 'ProductSkeletonSlider';
export default ProductSkeletonSlider;