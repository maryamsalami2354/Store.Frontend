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

    const roles = Array.isArray(user.roles) ? user.roles : [];
    const roleCodes = Array.isArray(user.roleCodes) ? user.roleCodes : [];

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
        roles,
        roleCodes,
        avatarUrl: user.avatarUrl || user.avatar || "",
        avatar: resolveMediaUrl(user.avatarUrl || user.avatar),
    };
};

const getRoleValues = (user) =>
    [...(user?.roles || []), ...(user?.roleCodes || [])].map((role) => String(role || "").trim().toLowerCase());

export const isSuperAdminUser = (user) => {
    const superAdminRoles = ["superadmin", "super_admin", "admin", "administrator", "مدیر", "ادمین"];
    const values = getRoleValues(user);

    return values.some((role) => superAdminRoles.includes(role));
};

export const isUserAdminUser = (user) => {
    const values = getRoleValues(user);

    return values.includes("useradmin");
};

export const isAdminUser = (user) => {
    const adminRoles = ["admin", "administrator", "superadmin", "super_admin", "useradmin", "مدیر", "ادمین"];
    const values = getRoleValues(user);

    return values.some((role) => adminRoles.includes(role));
};
