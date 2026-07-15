// =============================================================================
// FILE: BlogPageSkeleton.jsx
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BlogPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 mb-5"><Skeleton width={50} height={16} borderRadius={8} /><Skeleton width={12} height={12} borderRadius="50%" /><Skeleton width={80} height={16} borderRadius={8} /></div>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <Skeleton height={250} borderRadius={20} />
                    <Skeleton height={44} borderRadius={14} />
                    <Skeleton height={200} borderRadius={20} />
                    <Skeleton height={120} borderRadius={20} />
                    <Skeleton height={200} borderRadius={20} />
                </div>
                <div className="w-full lg:w-80 space-y-4">
                    <Skeleton height={48} borderRadius={14} />
                    <Skeleton height={200} borderRadius={20} />
                    <Skeleton height={180} borderRadius={20} />
                    <Skeleton height={160} borderRadius={20} />
                </div>
            </div>
        </div>
    </div>
);

export default BlogPageSkeleton;