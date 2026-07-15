// =============================================================================
// mostVisitedGrid.jsx
// =============================================================================
import React from 'react';
import MostVisitedCard from './mostVisitedCard';

const MostVisitedGrid = ({ products, viewMode, onAddToCart, onToggleWishlist, navigate }) => (
    <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4' : 'space-y-2.5'}>
        {products.map(p => <MostVisitedCard key={p.id} product={p} viewMode={viewMode} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} navigate={navigate} />)}
    </div>
);

export default MostVisitedGrid;