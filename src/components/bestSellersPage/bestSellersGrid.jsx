// =============================================================================
// FILE: bestSellersGrid.jsx (بدون infinite scroll)
// =============================================================================
import React from 'react';
import BestSellersCard from './bestSellersCard';

const BestSellersGrid = ({ sellers = [] }) => {
    const top3 = sellers.slice(0, 3);

    return (
        <div className="space-y-4 sm:space-y-5 max-w-5xl mx-auto">
            {top3.map(seller => (
                <BestSellersCard key={seller.id} seller={seller} />
            ))}
        </div>
    );
};

export default BestSellersGrid;