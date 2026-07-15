// =============================================================================
// FILE: userTicketsCard.jsx
// =============================================================================
import React from 'react';
import { Eye, MessageSquare, Clock } from 'react-feather';

const UserTicketsCard = ({ ticket, statusMap, onView }) => {
    const st = statusMap[ticket.status] || statusMap.open;

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg ${st.color}`}>
                        <MessageSquare size={18} />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{ticket.subject}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{ticket.ticketCode}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Clock size={11} />{ticket.date}</span>
                            <span>آخرین بروزرسانی: {ticket.lastUpdate}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${st.color}`}>{st.label}</span>
                    <button onClick={onView} className="p-2 rounded-lg bg-[#002874] text-white hover:bg-[#001d5a] transition-colors">
                        <Eye size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserTicketsCard;