// =============================================================================
// FILE: categoriesGrid.jsx
// =============================================================================
import React from 'react';
import { motion } from 'framer-motion';
import categoriesCard from './categoriesCard';

const CategoriesGrid = ({ categories = [], viewMode = 'grid' }) => {
    if (!categories.length) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={viewMode === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4'
                        : 'space-y-2.5'
                    }>
            {categories.map((cat, i) => (
                <motion.div key={cat.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    {React.createElement(categoriesCard, { category: cat, viewMode })}
                </motion.div>
            ))}
        </motion.div>
    );
};

export default CategoriesGrid;