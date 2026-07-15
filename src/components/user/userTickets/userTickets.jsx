// =============================================================================
// FILE: userTickets.jsx
// =============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { MessageSquare, Plus } from 'react-feather';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import UserTicketsFilterBar from './userTicketsFilterBar';
import UserTicketsCard from './userTicketsCard';
import UserTicketsEmpty from './userTicketsEmpty';
import UserTicketsSkeleton from './userTicketsSkeleton';
import UserTicketsDetailModal from './userTicketsDetailModal';
import ProductsPagination from '../../seller/sellerProducts/productsPagination';

const ITEMS_PER_PAGE = 8;

const statusMap = {
    open: { label: 'باز', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    answered: { label: 'پاسخ داده شده', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    closed: { label: 'بسته شده', color: 'text-gray-600 bg-gray-100 dark:bg-gray-900/30' },
    pending: { label: 'در انتظار', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
};

const UserTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        const load = async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            const subjects = ['مشکل در پرداخت', 'پیگیری سفارش', 'بازگشت کالا', 'مشکل فنی', 'سوال درباره محصول'];
            const statuses = ['open', 'answered', 'closed', 'pending'];
            const sample = Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                ticketCode: `TKT-${String(i + 1).padStart(5, '0')}`,
                subject: subjects[i % 5],
                status: statuses[i % 4],
                date: new Date(Date.now() - i * 2 * 86400000).toLocaleDateString('fa-IR'),
                lastUpdate: new Date(Date.now() - i * 12 * 3600000).toLocaleDateString('fa-IR'),
                messages: [
                    { sender: 'user', text: 'سلام، من مشکل دارم با پرداختم. لطفاً راهنمایی کنید.', date: new Date(Date.now() - i * 2 * 86400000).toLocaleDateString('fa-IR') },
                    { sender: 'agent', text: 'سلام، لطفاً شماره سفارش خود را ارسال کنید.', date: new Date(Date.now() - (i * 2 - 1) * 86400000).toLocaleDateString('fa-IR') },
                ],
            }));
            setTickets(sample);
            setIsLoading(false);
        };
        load();
    }, []);

    const fuse = useMemo(() => new Fuse(tickets, { keys: ['ticketCode', 'subject'], threshold: 0.3 }), [tickets]);

    const filtered = useMemo(() => {
        let result = searchQuery.trim() ? fuse.search(searchQuery).map(r => r.item) : [...tickets];
        if (filterStatus !== 'all') result = result.filter(t => t.status === filterStatus);
        switch (sortBy) {
            case 'oldest': result.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
            default: result.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        return result;
    }, [tickets, filterStatus, sortBy, searchQuery, fuse]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    useEffect(() => { setCurrentPage(1); }, [filterStatus, sortBy, searchQuery]);

    if (isLoading) return <UserTicketsSkeleton />;

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">تیکت‌های پشتیبانی</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filtered.length} تیکت</p>
                </div>
                <Link to="/user/tickets/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition-colors">
                    <Plus size={16} />
                    تیکت جدید
                </Link>
            </div>

            <UserTicketsFilterBar
                filterStatus={filterStatus} setFilterStatus={setFilterStatus}
                sortBy={sortBy} setSortBy={setSortBy}
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            />

            {filtered.length === 0 ? (
                <UserTicketsEmpty hasFilter={filterStatus !== 'all' || !!searchQuery} />
            ) : (
                <>
                    <div className="space-y-3">
                        {paginated.map(ticket => (
                            <UserTicketsCard key={ticket.id} ticket={ticket} statusMap={statusMap} onView={() => setSelectedTicket(ticket)} />
                        ))}
                    </div>
                    {filtered.length > ITEMS_PER_PAGE && (
                        <ProductsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    )}
                </>
            )}

            {selectedTicket && (
                <UserTicketsDetailModal ticket={selectedTicket} statusMap={statusMap} onClose={() => setSelectedTicket(null)} />
            )}
        </div>
    );
};

export default UserTickets;