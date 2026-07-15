// =============================================================================
// FILE: userTicketsDetailModal.jsx
// =============================================================================
import React, { useState } from 'react';
import { X, Send, Clock, MessageSquare } from 'react-feather';

const UserTicketsDetailModal = ({ ticket, statusMap, onClose }) => {
    const [reply, setReply] = useState('');
    const [messages, setMessages] = useState(ticket?.messages || []);
    const st = statusMap[ticket?.status] || statusMap.open;

    const handleReply = (e) => {
        e.preventDefault();
        if (!reply.trim()) return;
        setMessages(prev => [...prev, { sender: 'user', text: reply, date: new Date().toLocaleDateString('fa-IR') }]);
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
                        <p className="text-xs text-gray-500">{ticket.ticketCode} | <span className={`${st.color} rounded-full px-2 py-0.5`}>{st.label}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} className="text-gray-500" /></button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                                msg.sender === 'user'
                                    ? 'bg-[#002874] text-white rounded-br-lg'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-lg'
                            }`}>
                                <p>{msg.text}</p>
                                <p className="text-[10px] mt-1 opacity-60">{msg.date}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply Box */}
                {ticket.status !== 'closed' && (
                    <form onSubmit={handleReply} className="flex items-center gap-2 p-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
                        <input type="text" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="پاسخ خود را بنویسید..." className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent" />
                        <button type="submit" className="p-2.5 bg-[#002874] text-white rounded-xl hover:bg-[#001d5a] transition-colors"><Send size={16} /></button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserTicketsDetailModal;