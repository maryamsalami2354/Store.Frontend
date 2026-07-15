// =============================================================================
// FILE: bestSellersGrid.jsx
// =============================================================================
import React from 'react';
import BestSellersCard from './bestSellersCard';

const BestSellersGrid = ({ sellers = [], viewMode }) => (
    <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4' : 'space-y-3'}>
        {sellers.map(seller => <BestSellersCard key={seller.id} seller={seller} viewMode={viewMode} />)}
    </div>
);

export default BestSellersGrid;