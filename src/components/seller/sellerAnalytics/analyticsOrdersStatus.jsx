// src/components/seller/sellerAnalytics/analyticsOrdersStatus.jsx
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const AnalyticsOrdersStatus = ({ ordersByStatus, incomeExpense, hourlyTraffic, isLoading }) => {
    const [activeTab, setActiveTab] = useState('orders');

    if (isLoading) {
        return (
            <div className="space-y-5">
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                    <Skeleton width={120} height={20} className="dark:!bg-gray-800 mb-4" />
                    <Skeleton width="100%" height={250} borderRadius={16} className="dark:!bg-gray-800" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">آمار سفارشات</h2>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'orders' ? 'bg-white dark:bg-gray-700 text-[#002874]  shadow-sm' : 'text-gray-500'}`}
                        >
                            وضعیت سفارشات
                        </button>
                        <button
                            onClick={() => setActiveTab('income')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'income' ? 'bg-white dark:bg-gray-700 text-[#002874]  shadow-sm' : 'text-gray-500'}`}
                        >
                            درآمد/هزینه
                        </button>
                        <button
                            onClick={() => setActiveTab('traffic')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'traffic' ? 'bg-white dark:bg-gray-700 text-[#002874]  shadow-sm' : 'text-gray-500'}`}
                        >
                            ترافیک
                        </button>
                    </div>
                </div>

                <div className="h-72" dir="ltr">
                    {activeTab === 'orders' && ordersByStatus && (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={ordersByStatus} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                                    {ordersByStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}

                    {activeTab === 'income' && incomeExpense && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={incomeExpense} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(v) => `${v}M`} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="income" name="درآمد" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="expense" name="هزینه" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="profit" name="سود" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}

                    {activeTab === 'traffic' && hourlyTraffic && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={hourlyTraffic} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="visits" name="بازدید" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsOrdersStatus;