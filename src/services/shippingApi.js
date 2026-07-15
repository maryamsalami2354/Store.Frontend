import authApiClient from "./authApi.js";

const normalizeMethod = (method) => ({
    code: method.code || method.value || "",
    title: method.title || method.label || "",
    description: method.description || "",
    cost: Number(method.cost ?? 0),
    estimatedDays: Number(method.estimatedDays ?? 0),
});

export const getShippingOptions = async () => {
    const { data } = await authApiClient.get("/Shipping/options");

    return {
        methods: (data?.methods || []).map(normalizeMethod).filter((method) => method.code),
        slots: data?.slots || [],
    };
};

export default {
    getShippingOptions,
};
