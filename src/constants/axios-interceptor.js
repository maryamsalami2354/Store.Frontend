// src/utils/axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "/jsons/",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ interceptor درخواست - جلوگیری از کش
axiosInstance.interceptors.request.use(
    (config) => {
        // اضافه کردن پارامترهای ضد کش به URL
        config.params = {
            ...config.params,
            _t: Date.now(),
            _nocache: Math.random().toString(36).substring(2),
        };

        // هدرهای ضد کش
        config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        config.headers["Pragma"] = "no-cache";
        config.headers["Expires"] = "0";

        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ interceptor پاسخ - مدیریت خطاها
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error("❌ خطای شبکه:", error.message);
            throw new Error("خطا در اتصال به اینترنت");
        }

        const status = error.response.status;
        const serverMessage = error.response.data?.message;

        switch (status) {
            case 400:
                throw new Error(serverMessage || "درخواست نامعتبر است");
            case 401:
                throw new Error("لطفا وارد حساب کاربری شوید");
            case 403:
                throw new Error("دسترسی شما محدود است");
            case 404:
                throw new Error("اطلاعات مورد نظر یافت نشد");
            case 500:
                throw new Error("خطای سرور لطفا بعدا تلاش کنید");
            default:
                throw new Error(serverMessage || "خطای ناشناخته رخ داده");
        }
    }
);

export default axiosInstance;