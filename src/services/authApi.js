import axios from "axios";
import { removeCookie } from "../utils/helpers/cookie.js";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5155";

export const toApiUrl = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
};

export const toAssetUrl = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
    if (url.startsWith("/images/")) return url;
    return toApiUrl(url);
};

const authApiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

const normalizeApiError = (error) => {
    const data = error.response?.data;
    const status = error.response?.status;

    if (status === 401) {
        return data?.message || "نشست شما منقضی شده است. لطفا دوباره وارد شوید.";
    }

    if (Array.isArray(data?.errors)) {
        return data.errors.join("\n");
    }

    if (data?.errors && typeof data.errors === "object") {
        return Object.values(data.errors).flat().join("\n");
    }

    return data?.message || error.message || "خطا در ارتباط با سرور";
};

authApiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

authApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("token");
            await removeCookie("origins");
        }

        return Promise.reject(new Error(normalizeApiError(error)));
    }
);

export const requestOtp = async (phoneNumber) => {
    const { data } = await authApiClient.post("/Auth/RequestOtp", { phoneNumber });
    return data;
};

export const login = async ({ phoneNumber, otpCode }) => {
    const { data } = await authApiClient.post("/Auth/Login", { phoneNumber, otpCode });
    return data;
};

export const register = async (payload) => {
    const { data } = await authApiClient.post("/Auth/Register", payload);
    return data;
};

export const getMe = async () => {
    const { data } = await authApiClient.get("/Auth/Me");
    return data;
};

export const updateMe = async (payload) => {
    const { data } = await authApiClient.put("/Auth/Me", payload);
    return data;
};

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await authApiClient.post("/Auth/Me/Avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return data;
};

export const deleteAvatar = async () => {
    const { data } = await authApiClient.delete("/Auth/Me/Avatar");
    return data;
};

export const changePassword = async (payload) => {
    const { data } = await authApiClient.put("/Auth/Me/Password", payload);
    return data;
};

export default authApiClient;
