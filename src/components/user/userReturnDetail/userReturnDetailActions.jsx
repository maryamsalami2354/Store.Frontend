// =============================================================================
// FILE: userReturnDetailActions.jsx
// =============================================================================
import React from 'react';
import { XCircle, MessageSquare } from 'react-feather';
import { Link } from 'react-router-dom';

const UserReturnDetailActions = ({ onCancel }) => (
    <div className="flex flex-col sm:flex-row gap-3">
        <button
            onClick={onCancel}
            className="flex items-center justify-center gap-2 px-5 py-3 border border-red-200 dark:border-red-800 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
            <XCircle size={18} />
            لغو درخواست
        </button>
        <Link
            to="/user/tickets"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition-colors"
        >
            <MessageSquare size={18} />
            ارتباط با پشتیبانی
        </Link>
    </div>
);

export default UserReturnDetailActions;