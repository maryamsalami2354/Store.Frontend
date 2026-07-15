// =============================================================================
// FILE: sellerTicketsDetailModal.jsx
// =============================================================================
import React, { useState } from 'react';
import { X, Send, Clock, User, CheckCircle } from 'react-feather';

const SellerTicketsDetailModal = ({ ticket, statusMap, onClose, onReply, onCloseTicket }) => {
    const [reply, setReply] = useState('');
    const [messages, setMessages] = useState(ticket?.messages || []);
    const st = statusMap[ticket?.status] || statusMap.open;

    const handleReply = (e) => {
        e.preventDefault();
        if (!reply.trim()) return;
        setMessages(prev => [...prev, { sender: 'seller', text: reply, date: new Date().toLocaleDateString('fa-IR') }]);
        onReply(reply);
        setReply('');
    };

    if (!ticket) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{ticket.subject}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {ticket.ticketCode} | <span className="flex items-center gap-1 inline-flex"><User size={10} />{ticket.customer}</span> |
                            <span className={`${st.color} rounded-full px-2 py-0.5 ml-1`}>{st.label}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} className="text-gray-500" /></button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'seller' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                                msg.sender === 'seller'
                                    ? 'bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-br-lg'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-lg'
                            }`}>
                                <p className="text-[10px] opacity-60 mb-1">{msg.sender === 'seller' ? 'شما' : ticket.customer}</p>
                                <p>{msg.text}</p>
                                <p className="text-[10px] mt-1 opacity-60">{msg.date}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 space-y-3">
                    {ticket.status !== 'closed' ? (
                        <>
                            <form onSubmit={handleReply} className="flex items-center gap-2">
                                <input type="text" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="پاسخ خود را بنویسید..." className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent" />
                                <button type="submit" className="p-2.5 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a] transition-colors"><Send size={16} /></button>
                            </form>
                            <button onClick={onCloseTicket} className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <CheckCircle size={16} />
                                بستن تیکت
                            </button>
                        </>
                    ) : (
                        <p className="text-center text-sm text-gray-500">این تیکت بسته شده است.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerTicketsDetailModal;