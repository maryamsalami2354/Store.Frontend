import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    Edit2,
    Home,
    LogOut,
    Package,
    RefreshCw,
    Save,
    Search,
    Shield,
    ShoppingBag,
    UserCheck,
    Users,
    X,
} from "react-feather";
import { getAccessRoles, getAccessUsers, getAdminUsers, updateUserRoles } from "../../services/adminApi.js";
import { getMe } from "../../services/authApi.js";
import { getAdminOrders, getOrderTracking, updateAdminOrder, updateOrderStatus } from "../../services/orderApi.js";
import useStore from "../../store/index.js";
import { isAdminUser, isSuperAdminUser, normalizeAuthUser } from "../../utils/helpers/authUser.js";

const statusOptions = [
    { value: "pending", label: "در انتظار پرداخت" },
    { value: "processing", label: "در انتظار ارسال" },
    { value: "shipped", label: "ارسال سفارش" },
    { value: "completed", label: "تحویل داده شد" },
    { value: "cancelled", label: "لغو شده" },
];

const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
};

const toPersianNumber = (value) => Number(value || 0).toLocaleString("fa-IR");

const getStatusLabel = (status) => statusOptions.find((item) => item.value === status)?.label || status;

const dateInputValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
    return date.toISOString().slice(0, 10);
};

const Admin = () => {
    const navigate = useNavigate();
    const setAuthState = useStore((state) => state.setState);
    const logout = useStore((state) => state.logout);
    const [authChecking, setAuthChecking] = useState(true);
    const [adminUser, setAdminUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const verifyAdmin = async () => {
            const token = localStorage.getItem("authToken") || localStorage.getItem("token");

            if (!token) {
                navigate("/admin/login", { replace: true });
                return;
            }

            try {
                const profile = normalizeAuthUser(await getMe());

                if (!isAdminUser(profile)) {
                    await logout();
                    toast.error("دسترسی ادمین برای این حساب فعال نیست");
                    navigate("/admin/login", { replace: true });
                    return;
                }

                if (isMounted) {
                    setAdminUser(profile);
                    setAuthState({ accessToken: token, user: profile });
                    setAuthChecking(false);
                }
            } catch (error) {
                await logout();
                toast.error(error.message || "لطفا دوباره وارد پنل ادمین شوید");
                navigate("/admin/login", { replace: true });
            }
        };

        verifyAdmin();

        return () => {
            isMounted = false;
        };
    }, [logout, navigate, setAuthState]);

    const loadUsers = useCallback(async () => {
        setUsersLoading(true);
        try {
            const result = await getAdminUsers({ page: 1, pageSize: 100 });
            setUsers(result.users);
        } catch (error) {
            toast.error(error.message || "خطا در دریافت کاربران");
        } finally {
            setUsersLoading(false);
        }
    }, []);

    const loadOrders = useCallback(async () => {
        setOrdersLoading(true);
        try {
            const result = await getAdminOrders({ page: 1, pageSize: 100 });
            setOrders(result.orders);
        } catch (error) {
            toast.error(error.message || "خطا در دریافت سفارش‌ها");
        } finally {
            setOrdersLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authChecking) return;

        loadUsers();
        loadOrders();
    }, [authChecking, loadOrders, loadUsers]);

    const refreshAll = () => {
        loadUsers();
        loadOrders();
    };

    const canManageAccess = isSuperAdminUser(adminUser);

    return (
        <AdminLayout adminUser={adminUser} canManageAccess={canManageAccess} onRefresh={refreshAll}>
            <Routes>
                <Route index element={<AdminDashboard users={users} orders={orders} loading={usersLoading || ordersLoading} />} />
                <Route path="users" element={<AdminUsers users={users} loading={usersLoading} onRefresh={loadUsers} />} />
                <Route
                    path="orders"
                    element={<AdminOrders orders={orders} loading={ordersLoading} canEditOrders={canManageAccess} onRefresh={loadOrders} />}
                />
                <Route path="access" element={canManageAccess ? <AdminAccess /> : <AccessDenied />} />
            </Routes>
        </AdminLayout>
    );
};

const AdminLayout = ({ children, adminUser, canManageAccess, onRefresh }) => {
    const navigate = useNavigate();
    const logout = useStore((state) => state.logout);
    const navItems = [
        { to: "/admin", label: "داشبورد", icon: Home, end: true },
        { to: "/admin/users", label: "کاربران", icon: Users },
        { to: "/admin/orders", label: "سفارش‌ها", icon: ShoppingBag },
        ...(canManageAccess ? [{ to: "/admin/access", label: "دسترسی کاربران", icon: Shield }] : []),
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/admin/login", { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a]" dir="rtl">
            <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col lg:flex-row">
                <aside className="border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111] lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-l">
                    <div className="mb-6">
                        <p className="text-xs font-medium text-gray-500">پنل مدیریت</p>
                        <h1 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">کیان شاپ</h1>
                        <p className="mt-2 text-xs text-gray-500">{adminUser?.fullName || adminUser?.phoneNumber || "مدیر سیستم"}</p>
                    </div>

                    <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex min-w-max items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                                        isActive
                                            ? "bg-[#002874] text-white"
                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                    }`
                                }
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-6 hidden space-y-2 border-t border-gray-100 pt-4 dark:border-gray-800 lg:block">
                        <button
                            onClick={onRefresh}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <RefreshCw size={17} />
                            بروزرسانی داده‌ها
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                            <LogOut size={17} />
                            خروج از پنل ادمین
                        </button>
                        <Link
                            to="/"
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <ArrowLeft size={17} />
                            بازگشت به فروشگاه
                        </Link>
                    </div>
                </aside>

                <main className="flex-1 p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
};

const AdminDashboard = ({ users, orders, loading }) => {
    const summary = useMemo(() => {
        const paidOrders = orders.filter((order) => order.status !== "pending" && order.status !== "cancelled");

        return [
            { label: "کاربران", value: users.length, icon: Users },
            { label: "کل سفارش‌ها", value: orders.length, icon: ShoppingBag },
            { label: "در انتظار ارسال", value: orders.filter((order) => order.status === "processing").length, icon: Package },
            { label: "فروش پرداخت‌شده", value: paidOrders.reduce((sum, order) => sum + order.amountValue, 0), icon: CheckCircle, money: true },
        ];
    }, [orders, users]);

    return (
        <section className="space-y-5">
            <PageTitle title="داشبورد ادمین" subtitle="نمای کلی کاربران، سفارش‌ها و وضعیت پردازش سفارش‌ها" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summary.map((item) => (
                    <div key={item.label} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">{item.label}</p>
                                <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                                    {loading ? "..." : toPersianNumber(item.value)}
                                    {item.money && <span className="mr-1 text-xs font-normal text-gray-500">تومان</span>}
                                </p>
                            </div>
                            <div className="rounded-lg bg-[#002874]/10 p-2 text-[#002874] dark:bg-[#4C6FB6]/20 dark:text-[#9eb6ff]">
                                <item.icon size={22} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <RecentOrders orders={orders.slice(0, 6)} />
                <RecentUsers users={users.slice(0, 6)} />
            </div>
        </section>
    );
};

const RecentOrders = ({ orders }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111]">
        <h2 className="mb-4 font-bold text-gray-900 dark:text-white">آخرین سفارش‌ها</h2>
        <div className="space-y-3">
            {orders.length === 0 && <EmptyText text="سفارشی برای نمایش وجود ندارد." />}
            {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-gray-800">
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">سفارش #{toPersianNumber(order.id)}</p>
                        <p className="text-xs text-gray-500">{order.customer.name || order.recipientPhone || "مشتری"}</p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>
            ))}
        </div>
    </div>
);

const RecentUsers = ({ users }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111]">
        <h2 className="mb-4 font-bold text-gray-900 dark:text-white">آخرین کاربران</h2>
        <div className="space-y-3">
            {users.length === 0 && <EmptyText text="کاربری برای نمایش وجود ندارد." />}
            {users.map((user) => (
                <div key={user.id} className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-gray-800">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        <UserCheck size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {`${user.firstName} ${user.lastName}`.trim() || "کاربر"}
                        </p>
                        <p className="text-xs text-gray-500">{user.phoneNumber || user.email || "-"}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const AdminUsers = ({ users, loading, onRefresh }) => {
    const [query, setQuery] = useState("");

    const filteredUsers = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return users;

        return users.filter((user) =>
            [user.firstName, user.lastName, user.phoneNumber, user.email, user.nationalCode]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(normalizedQuery))
        );
    }, [query, users]);

    return (
        <section className="space-y-5">
            <PageTitle title="مدیریت کاربران" subtitle="مشاهده همه کاربران ثبت‌شده در سیستم" action={<RefreshButton onClick={onRefresh} />} />
            <SearchBox value={query} onChange={setQuery} placeholder="جستجوی نام، موبایل، ایمیل یا کد ملی" />

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-right text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-gray-900">
                            <tr>
                                <th className="px-4 py-3">شناسه</th>
                                <th className="px-4 py-3">نام و نام خانوادگی</th>
                                <th className="px-4 py-3">شماره موبایل</th>
                                <th className="px-4 py-3">ایمیل</th>
                                <th className="px-4 py-3">کد ملی</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading && <TableMessage colSpan={5} text="در حال دریافت کاربران..." />}
                            {!loading && filteredUsers.length === 0 && <TableMessage colSpan={5} text="کاربری پیدا نشد." />}
                            {!loading && filteredUsers.map((user) => (
                                <tr key={user.id} className="text-gray-700 dark:text-gray-300">
                                    <td className="px-4 py-3">#{toPersianNumber(user.id)}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                        {`${user.firstName} ${user.lastName}`.trim() || "-"}
                                    </td>
                                    <td className="px-4 py-3">{user.phoneNumber || "-"}</td>
                                    <td className="px-4 py-3">{user.email || "-"}</td>
                                    <td className="px-4 py-3">{user.nationalCode || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

const AdminOrders = ({ orders, loading, canEditOrders, onRefresh }) => {
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingOrder, setEditingOrder] = useState(null);
    const [trackingOrder, setTrackingOrder] = useState(null);
    const [savingId, setSavingId] = useState(null);
    const [trackingLoadingId, setTrackingLoadingId] = useState(null);

    const filteredOrders = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        let result = [...orders];

        if (statusFilter !== "all") {
            result = result.filter((order) => order.status === statusFilter);
        }

        if (normalizedQuery) {
            result = result.filter((order) =>
                [
                    order.id,
                    order.trackingCode,
                    order.recipientName,
                    order.recipientPhone,
                    order.customer?.name,
                    order.address?.full,
                ]
                    .filter(Boolean)
                    .some((value) => String(value).toLowerCase().includes(normalizedQuery))
            );
        }

        return result;
    }, [orders, query, statusFilter]);

    const handleStatusChange = async (order, status) => {
        if (!canEditOrders) {
            toast.error("شما فقط مجوز مشاهده سفارش‌ها را دارید");
            return;
        }

        setSavingId(order.id);
        try {
            await updateOrderStatus(order.id, status);
            toast.success("وضعیت سفارش بروزرسانی شد");
            await onRefresh();
        } catch (error) {
            toast.error(error.message || "خطا در تغییر وضعیت سفارش");
        } finally {
            setSavingId(null);
        }
    };

    const handleSaveOrder = async (orderId, payload) => {
        if (!canEditOrders) {
            toast.error("شما مجوز ویرایش سفارش را ندارید");
            return;
        }

        setSavingId(orderId);
        try {
            await updateAdminOrder(orderId, payload);
            toast.success("سفارش ویرایش شد");
            setEditingOrder(null);
            await onRefresh();
        } catch (error) {
            toast.error(error.message || "خطا در ویرایش سفارش");
        } finally {
            setSavingId(null);
        }
    };

    const handleShowTracking = async (order) => {
        setTrackingOrder(order);
        setTrackingLoadingId(order.id);
        try {
            const result = await getOrderTracking(order.id);
            setTrackingOrder((current) => current?.id === order.id
                ? { ...current, trackingHistory: result.trackingHistory || [] }
                : current);
        } catch (error) {
            toast.error(error.message || "خطا در دریافت پیگیری سفارش");
        } finally {
            setTrackingLoadingId(null);
        }
    };

    return (
        <section className="space-y-5">
            <PageTitle title="مدیریت سفارش‌ها" subtitle="مشاهده همه سفارش‌ها، تغییر وضعیت و ویرایش اطلاعات ارسال" action={<RefreshButton onClick={onRefresh} />} />

            <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
                <SearchBox value={query} onChange={setQuery} placeholder="جستجوی سفارش، کد رهگیری، نام یا شماره مشتری" />
                <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#002874] focus:outline-none focus:ring-2 focus:ring-[#002874]/10 dark:border-gray-700 dark:bg-[#111] dark:text-gray-200"
                >
                    <option value="all">همه وضعیت‌ها</option>
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] text-right text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-gray-900">
                            <tr>
                                <th className="px-4 py-3">سفارش</th>
                                <th className="px-4 py-3">مشتری</th>
                                <th className="px-4 py-3">مبلغ</th>
                                <th className="px-4 py-3">ارسال</th>
                                <th className="px-4 py-3">وضعیت</th>
                                <th className="px-4 py-3">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading && <TableMessage colSpan={6} text="در حال دریافت سفارش‌ها..." />}
                            {!loading && filteredOrders.length === 0 && <TableMessage colSpan={6} text="سفارشی پیدا نشد." />}
                            {!loading && filteredOrders.map((order) => (
                                <tr key={order.id} className="align-top text-gray-700 dark:text-gray-300">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900 dark:text-white">#{toPersianNumber(order.id)}</p>
                                        <p className="mt-1 text-xs text-gray-500">{order.trackingCode || "بدون کد رهگیری"}</p>
                                        <p className="mt-1 text-xs text-gray-500">{order.date}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900 dark:text-white">{order.recipientName || order.customer.name || "-"}</p>
                                        <p className="mt-1 text-xs text-gray-500">{order.recipientPhone || "-"}</p>
                                        <p className="mt-1 max-w-[260px] truncate text-xs text-gray-500">{order.address.full || "-"}</p>
                                    </td>
                                    <td className="px-4 py-3">{order.amount} تومان</td>
                                    <td className="px-4 py-3">
                                        <p>{order.shippingMethod || "-"}</p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {[order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString("fa-IR") : "", order.deliveryTimeSlot]
                                                .filter(Boolean)
                                                .join(" - ") || "-"}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={order.status}
                                            disabled={!canEditOrders || savingId === order.id}
                                            onChange={(event) => handleStatusChange(order, event.target.value)}
                                            className="rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs text-gray-700 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                                        >
                                            {statusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleShowTracking(order)}
                                                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                            >
                                                <Clock size={15} />
                                                پیگیری
                                            </button>
                                        {canEditOrders ? (
                                            <button
                                                onClick={() => setEditingOrder(order)}
                                                className="inline-flex items-center gap-2 rounded-lg bg-[#002874] px-3 py-2 text-xs font-medium text-white hover:bg-[#001d5a]"
                                            >
                                                <Edit2 size={15} />
                                                ویرایش
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400">فقط مشاهده</span>
                                        )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingOrder && (
                <EditOrderModal
                    order={editingOrder}
                    isSaving={savingId === editingOrder.id}
                    onClose={() => setEditingOrder(null)}
                    onSave={handleSaveOrder}
                />
            )}
            {trackingOrder && (
                <OrderTrackingModal
                    order={trackingOrder}
                    isLoading={trackingLoadingId === trackingOrder.id}
                    onClose={() => setTrackingOrder(null)}
                />
            )}
        </section>
    );
};

const OrderTrackingModal = ({ order, isLoading, onClose }) => {
    const history = order.trackingHistory || order.history || [];
    const latest = history[history.length - 1] || null;

    return (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                onClick={(event) => event.stopPropagation()}
                className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-5 shadow-xl dark:bg-[#111]"
            >
                <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">پیگیری سفارش #{toPersianNumber(order.id)}</h2>
                        <p className="mt-1 text-xs text-gray-500">{order.trackingCode || "کد رهگیری ثبت نشده"}</p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                        <p className="text-xs text-gray-500">وضعیت فعلی</p>
                        <div className="mt-2"><StatusBadge status={latest?.status || order.status} /></div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                        <p className="text-xs text-gray-500">زمان آخرین تغییر</p>
                        <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                            {[latest?.date, latest?.time].filter(Boolean).join(" - ") || "-"}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                    <div className="mb-4 flex items-center gap-2">
                        <Clock size={17} className="text-[#002874] dark:text-[#4C6FB6]" />
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">تاریخچه پیگیری</h3>
                    </div>

                    {isLoading && <EmptyText text="در حال دریافت تاریخچه پیگیری..." />}
                    {!isLoading && history.length === 0 && <EmptyText text="هنوز تاریخچه‌ای برای این سفارش ثبت نشده است." />}
                    {!isLoading && history.length > 0 && (
                        <div className="space-y-0">
                            {history.map((event, index) => (
                                <div key={`${event.id}-${index}`} className="relative flex gap-3 pb-5 last:pb-0">
                                    {index < history.length - 1 && (
                                        <span className="absolute right-[15px] top-8 h-[calc(100%-2rem)] w-px bg-gray-200 dark:bg-gray-800" />
                                    )}
                                    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#002874] text-white">
                                        <Clock size={14} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {event.title || event.statusLabel || getStatusLabel(event.status)}
                                            </p>
                                            <span className="text-xs text-gray-500">
                                                {[event.date, event.time].filter(Boolean).join(" - ")}
                                            </span>
                                        </div>
                                        {event.description && (
                                            <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">{event.description}</p>
                                        )}
                                        {event.source && (
                                            <p className="mt-1 text-[11px] text-gray-400">ثبت توسط: {event.source}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const EditOrderModal = ({ order, isSaving, onClose, onSave }) => {
    const [form, setForm] = useState({
        recipientName: order.recipientName || "",
        recipientPhone: order.recipientPhone || "",
        shippingAddress: order.address?.full || "",
        trackingCode: order.trackingCode || "",
        shippingMethodCode: order.shippingMethod || "",
        deliveryDate: dateInputValue(order.deliveryDate),
        deliveryTimeSlot: order.deliveryTimeSlot || "",
        status: order.status || "processing",
    });

    const updateForm = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(order.id, {
            ...form,
            deliveryDate: form.deliveryDate || null,
            shippingMethodCode: form.shippingMethodCode || undefined,
        });
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <form
                onSubmit={handleSubmit}
                onClick={(event) => event.stopPropagation()}
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5 shadow-xl dark:bg-[#111]"
            >
                <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">ویرایش سفارش #{toPersianNumber(order.id)}</h2>
                        <p className="mt-1 text-xs text-gray-500">اطلاعات ارسال و وضعیت سفارش کاربر را ویرایش کنید.</p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X size={20} />
                    </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="نام گیرنده" value={form.recipientName} onChange={(value) => updateForm("recipientName", value)} />
                    <TextField label="شماره گیرنده" value={form.recipientPhone} onChange={(value) => updateForm("recipientPhone", value)} />
                    <TextField label="کد رهگیری" value={form.trackingCode} onChange={(value) => updateForm("trackingCode", value)} />
                    <TextField label="کد روش ارسال" value={form.shippingMethodCode} onChange={(value) => updateForm("shippingMethodCode", value)} />
                    <TextField label="تاریخ ارسال" type="date" value={form.deliveryDate} onChange={(value) => updateForm("deliveryDate", value)} />
                    <TextField label="زمان ارسال" value={form.deliveryTimeSlot} onChange={(value) => updateForm("deliveryTimeSlot", value)} />
                    <label className="space-y-1.5">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">وضعیت سفارش</span>
                        <select
                            value={form.status}
                            onChange={(event) => updateForm("status", event.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-[#002874] focus:outline-none focus:ring-2 focus:ring-[#002874]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </label>
                    <label className="space-y-1.5 md:col-span-2">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">آدرس ارسال</span>
                        <textarea
                            rows={3}
                            value={form.shippingAddress}
                            onChange={(event) => updateForm("shippingAddress", event.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-[#002874] focus:outline-none focus:ring-2 focus:ring-[#002874]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        />
                    </label>
                </div>

                <div className="mt-5 rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                    <p className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-300">محصولات سفارش</p>
                    <div className="space-y-2">
                        {order.items.map((item) => (
                            <div key={`${item.productId}-${item.id}`} className="flex items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-300">
                                <span>{item.name}</span>
                                <span>{toPersianNumber(item.quantity)} عدد</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                        انصراف
                    </button>
                    <button type="submit" disabled={isSaving} className="rounded-lg bg-[#002874] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#001d5a] disabled:opacity-60">
                        {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </button>
                </div>
            </form>
        </div>
    );
};

const AdminAccess = () => {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [selectedRolesByUser, setSelectedRolesByUser] = useState({});

    const loadAccessData = useCallback(async () => {
        setLoading(true);
        try {
            const [rolesResult, usersResult] = await Promise.all([
                getAccessRoles(),
                getAccessUsers({ page: 1, pageSize: 200 }),
            ]);

            setRoles(rolesResult);
            setUsers(usersResult.users);
            setSelectedRolesByUser(
                usersResult.users.reduce((acc, user) => {
                    acc[user.id] = user.roles.map((role) => role.id);
                    return acc;
                }, {})
            );
        } catch (error) {
            toast.error(error.message || "خطا در دریافت دسترسی کاربران");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAccessData();
    }, [loadAccessData]);

    const filteredUsers = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return users;

        return users.filter((user) =>
            [user.firstName, user.lastName, user.phoneNumber, user.email, user.nationalCode]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(normalizedQuery))
        );
    }, [query, users]);

    const toggleRole = (userId, roleId) => {
        setSelectedRolesByUser((prev) => {
            const current = prev[userId] || [];
            const next = current.includes(roleId)
                ? current.filter((item) => item !== roleId)
                : [...current, roleId];

            return { ...prev, [userId]: next };
        });
    };

    const handleSave = async (userId) => {
        const roleIds = selectedRolesByUser[userId] || [];
        if (roleIds.length === 0) {
            toast.error("حداقل یک نقش باید انتخاب شود");
            return;
        }

        setSavingId(userId);
        try {
            await updateUserRoles(userId, roleIds);
            toast.success("دسترسی کاربر بروزرسانی شد");
            await loadAccessData();
        } catch (error) {
            toast.error(error.message || "خطا در ذخیره دسترسی کاربر");
        } finally {
            setSavingId(null);
        }
    };

    return (
        <section className="space-y-5">
            <PageTitle
                title="دسترسی کاربران"
                subtitle="تعیین نقش User، UserAdmin و SuperAdmin برای کاربران"
                action={<RefreshButton onClick={loadAccessData} />}
            />

            <SearchBox value={query} onChange={setQuery} placeholder="جستجوی کاربر برای مدیریت دسترسی" />

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[920px] text-right text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-gray-900">
                            <tr>
                                <th className="px-4 py-3">کاربر</th>
                                <th className="px-4 py-3">شماره موبایل</th>
                                <th className="px-4 py-3">نقش‌ها</th>
                                <th className="px-4 py-3">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading && <TableMessage colSpan={4} text="در حال دریافت دسترسی‌ها..." />}
                            {!loading && filteredUsers.length === 0 && <TableMessage colSpan={4} text="کاربری پیدا نشد." />}
                            {!loading && filteredUsers.map((user) => (
                                <tr key={user.id} className="align-top text-gray-700 dark:text-gray-300">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {`${user.firstName} ${user.lastName}`.trim() || "کاربر"}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">{user.email || user.nationalCode || "-"}</p>
                                    </td>
                                    <td className="px-4 py-3">{user.phoneNumber || "-"}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            {roles.map((role) => (
                                                <label
                                                    key={role.id}
                                                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={(selectedRolesByUser[user.id] || []).includes(role.id)}
                                                        onChange={() => toggleRole(user.id, role.id)}
                                                        className="h-4 w-4 rounded border-gray-300 text-[#002874]"
                                                    />
                                                    <span>{role.title || role.code}</span>
                                                    <span className="text-gray-400">({role.code})</span>
                                                </label>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleSave(user.id)}
                                            disabled={savingId === user.id}
                                            className="inline-flex items-center gap-2 rounded-lg bg-[#002874] px-3 py-2 text-xs font-medium text-white hover:bg-[#001d5a] disabled:opacity-60"
                                        >
                                            <Save size={15} />
                                            {savingId === user.id ? "در حال ذخیره..." : "ذخیره"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

const AccessDenied = () => (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
        شما فقط مجوز مشاهده اطلاعات را دارید و امکان ویرایش دسترسی کاربران برای حساب شما فعال نیست.
    </section>
);

const PageTitle = ({ title, subtitle, action }) => (
    <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white lg:text-2xl">{title}</h1>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        {action}
    </div>
);

const SearchBox = ({ value, onChange, placeholder }) => (
    <div className="relative">
        <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-sm text-gray-800 focus:border-[#002874] focus:outline-none focus:ring-2 focus:ring-[#002874]/10 dark:border-gray-700 dark:bg-[#111] dark:text-gray-100"
        />
    </div>
);

const TextField = ({ label, value, onChange, type = "text" }) => (
    <label className="space-y-1.5">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <input
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-[#002874] focus:outline-none focus:ring-2 focus:ring-[#002874]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
    </label>
);

const RefreshButton = ({ onClick }) => (
    <button onClick={onClick} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#111] dark:text-gray-300 dark:hover:bg-gray-800">
        <RefreshCw size={16} />
        بروزرسانی
    </button>
);

const StatusBadge = ({ status }) => (
    <span className={`inline-flex rounded-lg border px-2 py-1 text-xs font-medium ${statusStyles[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
        {getStatusLabel(status)}
    </span>
);

const EmptyText = ({ text }) => <p className="py-4 text-center text-sm text-gray-500">{text}</p>;

const TableMessage = ({ colSpan, text }) => (
    <tr>
        <td colSpan={colSpan} className="px-4 py-8 text-center text-sm text-gray-500">{text}</td>
    </tr>
);

export default Admin;
