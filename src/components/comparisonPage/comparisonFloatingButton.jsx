// =============================================================================
// FILE: comparisonFloatingButton.jsx
// =============================================================================
import React from 'react';
import { Plus } from 'react-feather';

const ComparisonFloatingButton = ({ onClick, count, max }) => (
    <button
        onClick={onClick}
        disabled={count >= max}
        className="lg:hidden fixed bottom-6 right-4 w-14 h-14 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-full shadow-xl shadow-[#002874]/30 flex items-center justify-center hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a] disabled:opacity-40 disabled:cursor-not-allowed transition-all z-40"
    >
        <Plus size={24} />
    </button>
);

export default ComparisonFloatingButton;