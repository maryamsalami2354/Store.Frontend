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

export const getAdminProducts = async (params = {}) => {
    const { data } = await authApiClient.get("/Product/admin/products", { params });

    return {
        products: data?.products || [],
        page: Number(data?.page || 1),
        pageSize: Number(data?.pageSize || 100),
        totalCount: Number(data?.totalCount || 0),
        totalPages: Number(data?.totalPages || 1),
    };
};

export const createAdminProduct = async (formData) => {
    const { data } = await authApiClient.post("/Product/admin/products", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return data;
};

export const updateAdminProduct = async (productId, formData) => {
    const { data } = await authApiClient.put(`/Product/admin/products/${productId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return data;
};

export const setAdminProductStatus = async (productId, status) => {
    const { data } = await authApiClient.patch(`/Product/admin/products/${productId}/status`, { status });
    return data;
};

export const getAdminCategories = async () => {
    const { data } = await authApiClient.get("/Category/admin/categories");
    return data?.categories || [];
};

export const createAdminCategory = async (payload) => {
    const { data } = await authApiClient.post("/Category/createCategory", payload);
    return data;
};

export const updateAdminCategory = async (categoryId, payload) => {
    const { data } = await authApiClient.put(`/Category/UpdateCategory?id=${categoryId}`, payload);
    return data;
};

export const setAdminCategoryActive = async (categoryId, isActive) => {
    const { data } = await authApiClient.patch(`/Category/admin/categories/${categoryId}/active`, { isActive });
    return data;
};

export const getAdminBrands = async () => {
    const { data } = await authApiClient.get("/Brand/admin/brands");
    return data?.brands || [];
};

export const createAdminBrand = async (payload) => {
    const { data } = await authApiClient.post("/Brand/CreateBrand", payload);
    return data;
};

export const updateAdminBrand = async (brandId, payload) => {
    const { data } = await authApiClient.put(`/Brand/UpdateBrand?id=${brandId}`, payload);
    return data;
};

export const setAdminBrandActive = async (brandId, isActive) => {
    const { data } = await authApiClient.patch(`/Brand/admin/brands/${brandId}/active`, { isActive });
    return data;
};

export const getAdminAttributeTemplates = async (params = {}) => {
    const { data } = await authApiClient.get("/ProductAttribute/admin/templates", { params });
    return data?.attributes || [];
};

export const createAdminAttributeTemplate = async (payload) => {
    const { data } = await authApiClient.post("/ProductAttribute/admin/templates", payload);
    return data;
};

export const updateAdminAttributeTemplate = async (attributeId, payload) => {
    const { data } = await authApiClient.put(`/ProductAttribute/admin/templates/${attributeId}`, payload);
    return data;
};

export const setAdminAttributeTemplateActive = async (attributeId, isActive) => {
    const { data } = await authApiClient.patch(`/ProductAttribute/admin/templates/${attributeId}/active`, { isActive });
    return data;
};

export const getAdminComments = async (params = {}) => {
    const { data } = await authApiClient.get("/Comment/admin/comments", { params });
    return data?.comments || [];
};

export const updateAdminCommentStatus = async (commentId, payload) => {
    const { data } = await authApiClient.patch(`/Comment/admin/comments/${commentId}/status`, payload);
    return data;
};

export const getAdminQuestions = async (params = {}) => {
    const { data } = await authApiClient.get("/ProductQuestion/admin/questions", { params });
    return data?.questions || [];
};

export const updateAdminQuestionStatus = async (questionId, payload) => {
    const { data } = await authApiClient.patch(`/ProductQuestion/admin/questions/${questionId}/status`, payload);
    return data;
};

export default {
    getAdminUsers,
    getAccessRoles,
    getAccessUsers,
    updateUserRoles,
    getAdminProducts,
    createAdminProduct,
    updateAdminProduct,
    setAdminProductStatus,
    getAdminCategories,
    createAdminCategory,
    updateAdminCategory,
    setAdminCategoryActive,
    getAdminBrands,
    createAdminBrand,
    updateAdminBrand,
    setAdminBrandActive,
    getAdminAttributeTemplates,
    createAdminAttributeTemplate,
    updateAdminAttributeTemplate,
    setAdminAttributeTemplateActive,
    getAdminComments,
    updateAdminCommentStatus,
    getAdminQuestions,
    updateAdminQuestionStatus,
};
