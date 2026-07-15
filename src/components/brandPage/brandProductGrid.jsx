// =============================================================================
// FILE: brandProductGrid.jsx
// =============================================================================
import React from 'react';
import BrandProductCard from './brandProductCard';

const BrandProductGrid = ({ products, viewMode }) => (
    <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3' : 'space-y-3'}>
        {products.map(p => <BrandProductCard key={p.id} product={p} viewMode={viewMode} />)}
    </div>
);

export default BrandProductGrid;