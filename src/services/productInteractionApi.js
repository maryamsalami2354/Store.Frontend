import authApiClient from "./authApi.js";

export const getProductReviews = async (productId) => {
    const { data } = await authApiClient.get(`/Comment/product/${productId}`);
    return data?.comments || [];
};

export const submitProductReview = async (productId, payload) => {
    const { data } = await authApiClient.post(`/Comment/product/${productId}`, payload);
    return data;
};

export const getProductQuestions = async (productId) => {
    const { data } = await authApiClient.get(`/ProductQuestion/product/${productId}`);
    return data?.questions || [];
};

export const submitProductQuestion = async (productId, payload) => {
    const { data } = await authApiClient.post(`/ProductQuestion/product/${productId}`, payload);
    return data;
};

