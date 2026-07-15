// =============================================================================
// FILE: userGiftCardsFilterBar.jsx
// =============================================================================
import React from 'react';
import CustomSelect from '../../common/customSelect/customSelect';

const statusOptions = [
    { value: 'all', label: 'همه' },
    { value: 'active', label: 'فعال' },
    { value: 'used', label: 'استفاده شده' },
    { value: 'expired', label: 'منقضی شده' },
];

const sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'oldest', label: 'قدیمی‌ترین' },
    { value: 'amount', label: 'مبلغ (بیشترین)' },
];

const UserGiftCardsFilterBar = ({ filterStatus, setFilterStatus, sortBy, setSortBy }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-full sm:w-48"><CustomSelect options={statusOptions} value={filterStatus} onChange={setFilterStatus} placeholder="وضعیت" /></div>
            <div className="w-full sm:w-40"><CustomSelect options={sortOptions} value={sortBy} onChange={setSortBy} placeholder="مرتب‌سازی" /></div>
        </div>
    </div>
);

export default UserGiftCardsFilterBar;