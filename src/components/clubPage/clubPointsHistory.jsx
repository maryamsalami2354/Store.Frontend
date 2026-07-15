// =============================================================================
// FILE: clubPointsHistory.jsx
// =============================================================================
import React from 'react';
import { TrendingUp, TrendingDown } from 'react-feather';

const history = [
    { id: 1, type: 'earn', reason: 'خرید محصول', points: 250, date: '۱۴۰۴/۰۲/۲۵', order: 'SH-1404-0012' },
    { id: 2, type: 'earn', reason: 'ثبت نظر', points: 50, date: '۱۴۰۴/۰۲/۲۲', order: null },
    { id: 3, type: 'spend', reason: 'دریافت کد تخفیف', points: -500, date: '۱۴۰۴/۰۲/۲۰', order: null },
    { id: 4, type: 'earn', reason: 'خرید محصول', points: 1200, date: '۱۴۰۴/۰۲/۱۸', order: 'SH-1404-0089' },
    { id: 5, type: 'earn', reason: 'امتیاز تولد', points: 300, date: '۱۴۰۴/۰۲/۱۵', order: null },
    { id: 6, type: 'spend', reason: 'هدیه تولد', points: -200, date: '۱۴۰۴/۰۲/۱۰', order: null },
];

const ClubPointsHistory = () => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4">تاریخچه امتیازات</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-right py-3 px-2 text-xs font-medium text-gray-500">نوع</th>
                    <th className="text-right py-3 px-2 text-xs font-medium text-gray-500">شرح</th>
                    <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">امتیاز</th>
                    <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">تاریخ</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {history.map(h => (
                    <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                        <td className="py-3 px-2">
                            <div className={`inline-flex p-1.5 rounded-lg ${h.type === 'earn' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                                {h.type === 'earn' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            </div>
                        </td>
                        <td className="py-3 px-2">
                            <span className="font-medium text-gray-900 dark:text-white">{h.reason}</span>
                            {h.order && <span className="text-xs text-gray-400 block">{h.order}</span>}
                        </td>
                        <td className="py-3 px-2 text-center">
                <span className={`font-bold ${h.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {h.points > 0 ? '+' : ''}{h.points.toLocaleString('fa-IR')}
                </span>
                        </td>
                        <td className="py-3 px-2 text-center text-xs text-gray-400">{h.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default ClubPointsHistory;