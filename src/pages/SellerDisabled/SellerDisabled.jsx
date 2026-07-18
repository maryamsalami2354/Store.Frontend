import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Home } from "react-feather";

const SellerDisabled = () => (
    <main className="min-h-[55vh] bg-gray-50 dark:bg-[#0a0a0a] px-4 py-12" dir="rtl">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <AlertTriangle size={28} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">پنل فروشنده موقتا غیرفعال است</h1>
            <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                دسترسی به بخش فروشندگی فعلا بسته شده و بعد از فعال‌سازی دوباره از همین مسیر قابل استفاده خواهد بود.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#002874] px-5 py-3 text-sm font-medium text-white hover:bg-[#001d5a]"
                >
                    <Home size={17} />
                    بازگشت به فروشگاه
                </Link>
                <Link
                    to="/user"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#111] dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    <ArrowLeft size={17} />
                    پنل کاربری
                </Link>
            </div>
        </div>
    </main>
);

export default SellerDisabled;
