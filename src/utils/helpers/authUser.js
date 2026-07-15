export const DEFAULT_AVATAR = "/images/users/avatar-1.svg";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5155";

export const resolveMediaUrl = (url) => {
    if (!url) return DEFAULT_AVATAR;
    if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
    if (url.startsWith("/uploads/")) return `${API_BASE_URL}${url}`;
    return url;
};

export const getUserFullName = (user) => {
    const parts = [user?.name, user?.lastName].filter(Boolean);
    return parts.join(" ").trim() || user?.username || user?.phoneNumber || "کاربر";
};

export const normalizeAuthUser = (user) => {
    if (!user) return null;

    return {
        ...user,
        firstName: user.name || "",
        lastName: user.lastName || "",
        fullName: getUserFullName(user),
        phone: user.phoneNumber || user.phone || "",
        phoneNumber: user.phoneNumber || user.phone || "",
        nationalCode: user.nationalCode || "",
        email: user.email || "",
        hasPassword: Boolean(user.hasPassword),
        avatarUrl: user.avatarUrl || user.avatar || "",
        avatar: resolveMediaUrl(user.avatarUrl || user.avatar),
    };
};
