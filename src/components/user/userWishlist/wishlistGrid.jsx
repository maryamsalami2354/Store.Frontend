// src/components/user/userWishlist/wishlistGrid.jsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import WishlistCard from './wishlistCard';

const WishlistGrid = ({ isLoading, products, onRemove, onAddToCart }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <Skeleton width="100%" height={160} className="dark:!bg-gray-800" />
                        <div className="p-4">
                            <Skeleton width="80%" height={14} className="dark:!bg-gray-800 mb-2" />
                            <Skeleton width="60%" height={12} className="dark:!bg-gray-800 mb-2" />
                            <Skeleton width="40%" height={16} className="dark:!bg-gray-800" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map(product => (
                <WishlistCard
                    key={product.id}
                    product={product}
                    onRemove={() => onRemove(product.id)}
                    onAddToCart={() => onAddToCart(product)}
                />
            ))}
        </div>
    );
};

export default WishlistGrid;