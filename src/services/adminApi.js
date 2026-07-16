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

export default {
    getAdminUsers,
};
