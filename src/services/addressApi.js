import authApiClient from "./authApi.js";

const normalizeAddress = (address) => ({
    id: address.id,
    title: address.title || "آدرس",
    receiverName: address.receiverName || "",
    phone: address.phone || "",
    province: address.province || "",
    city: address.city || "",
    address: address.address || address.street || "",
    postalCode: address.postalCode || "",
    plateNumber: address.plateNumber || "",
    unitNumber: address.unitNumber || "",
    isDefault: Boolean(address.isDefault),
    provinceId: address.provinceId,
    cityId: address.cityId,
});

const normalizeList = (data) => (data?.addresses || data || []).map(normalizeAddress);

export const getMyAddresses = async () => {
    const { data } = await authApiClient.get("/Address/me");
    return normalizeList(data);
};

export const createAddress = async (payload) => {
    const { data } = await authApiClient.post("/Address/me", payload);
    return normalizeAddress(data);
};

export const updateAddress = async (id, payload) => {
    const { data } = await authApiClient.put(`/Address/me/${id}`, payload);
    return normalizeAddress(data);
};

export const deleteAddress = async (id) => {
    await authApiClient.delete(`/Address/me/${id}`);
};

export const setDefaultAddress = async (id) => {
    await authApiClient.put(`/Address/me/${id}/default`);
};

export default {
    getMyAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
};
