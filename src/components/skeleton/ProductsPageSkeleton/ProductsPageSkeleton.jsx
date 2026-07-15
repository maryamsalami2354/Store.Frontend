import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductsPageSkeleton = ({ viewMode = 'grid' }) => {
    return (
        <div>
            {/* Sort Bar Skeleton */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 mb-4">
                <div className="flex items-center justify-between">
                    <Skeleton width={200} height={32} borderRadius={8} />
                    <Skeleton width={150} height={20} borderRadius={8} />
                </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3'
                : 'space-y-3'
            }>
                {[...Array(viewMode === 'grid' ? 12 : 6)].map((_, i) => (
                    <div
                        key={i}
                        className={`bg-white dark:bg-[#111] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800 ${
                            viewMode === 'grid' ? 'p-2 sm:p-3' : 'p-3 flex gap-3'
                        }`}
                    >
                        {/* Image */}
                        <Skeleton
                            height={viewMode === 'grid' ? 128 : 96}
                            width={viewMode === 'grid' ? '100%' : 96}
                            borderRadius={viewMode === 'grid' ? 12 : 12}
                            className={viewMode === 'list' ? 'flex-shrink-0' : ''}
                        />

                        <div className={viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : 'mt-2'}>
                            {/* Rating */}
                            <div className="flex gap-0.5 mb-1">
                                {[...Array(5)].map((_, j) => (
                                    <Skeleton key={j} width={12} height={12} borderRadius={4} />
                                ))}
                            </div>

                            {/* Title */}
                            <Skeleton height={16} borderRadius={4} className="mb-1" />
                            <Skeleton width="75%" height={16} borderRadius={4} className="mb-2" />

                            {/* Price */}
                            <div className="flex items-end justify-between">
                                <div>
                                    <Skeleton width={80} height={14} borderRadius={4} className="mb-1" />
                                    <Skeleton width={100} height={20} borderRadius={8} />
                                </div>
                                {viewMode === 'grid' && <Skeleton width={32} height={32} borderRadius={8} />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsPageSkeleton;