// =============================================================================
// FILE: amazingProductsGrid.jsx
// =============================================================================
import React from 'react';
import AmazingProductsCard from './amazingProductsCard';

const AmazingProductsGrid = ({ products, viewMode, onAddToCart, onToggleWishlist, navigate }) => {
    if (!products.length) return null;

    return (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3' : 'space-y-3'}>
            {products.map((product) => (
                <AmazingProductsCard key={product.id} product={product} viewMode={viewMode} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} navigate={navigate} />
            ))}
        </div>
    );
};

export default AmazingProductsGrid;