import authApiClient from "./authApi.js";

const normalizeUser = (user) => ({
    id: user.userId ?? user.id,
    firstName: user.userName || user.name || "",
    lastName: user.userLastName || user.lastName || "",
    nationalCode: user.userNationalCode || user.nationalCode || "",
    phoneNumber: user.userPhoneNumber || user.phoneNumber || "",
    email: user.userEmail || user.email || "",
});

export const getAdminUsers = async (params = {}) => {
    const { data } = await authApiClient.get("/User/admin/users", { params });

    return {
        users: (data?.users || []).map(normalizeUser),
        page: Number(data?.page || 1),
        pageSize: Number(data?.pageSize || 10),
        totalCount: Number(data?.totalCount || 0),
        totalPages: Number(data?.totalPages || 1),
    };
};

const normalizeRole = (role) => ({
    id: role.id,
    title: role.title || "",
    code: role.code || "",
});

const normalizeAccessUser = (user) => ({
    id: user.id,
    firstName: user.name || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "",
    email: user.email || "",
    nationalCode: user.nationalCode || "",
    roles: (user.roles || []).map(normalizeRole),
});

export const getAccessRoles = async () => {
    const { data } = await authApiClient.get("/AdminAccess/roles");
    return (data?.roles || []).map(normalizeRole);
};

export const getAccessUsers = async (params = {}) => {
    const { data } = await authApiClient.get("/AdminAccess/users", { params });

    return {
        users: (data?.users || []).map(normalizeAccessUser),
        page: Number(data?.page || 1),
        pageSize: Number(data?.pageSize || 10),
        totalCount: Number(data?.totalCount || 0),
        totalPages: Number(data?.totalPages || 1),
    };
};

export const updateUserRoles = async (userId, roleIds) => {
    const { data } = await authApiClient.put(`/AdminAccess/users/${userId}/roles`, { roleIds });
    return data;
};

export default {
    getAdminUsers,
    getAccessRoles,
    getAccessUsers,
    updateUserRoles,
};
