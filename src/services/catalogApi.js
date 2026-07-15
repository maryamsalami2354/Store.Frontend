import axios from "axios";
import { API_BASE_URL } from "./authApi.js";

const catalogApiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

const normalizeCatalogError = (error) => {
    const data = error.response?.data;
    return data?.message || error.message || "خطا در دریافت اطلاعات کاتالوگ";
};

catalogApiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(new Error(normalizeCatalogError(error)))
);

export const getCatalogProducts = async (params = {}) => {
    const { data } = await catalogApiClient.get("/Product/catalog", { params });
    return data;
};

export const getCatalogProduct = async (id) => {
    const { data } = await catalogApiClient.get(`/Product/catalog/${id}`);
    return data;
};

export const getRelatedCatalogProducts = async ({ categoryId, excludeId, take = 10 }) => {
    const { data } = await catalogApiClient.get("/Product/catalog/related", {
        params: { categoryId, excludeId, take },
    });
    return data;
};

export const getCatalogCategories = async () => {
    const { data } = await catalogApiClient.get("/Category/catalog");
    return data;
};

export const getCatalogBrands = async () => {
    const { data } = await catalogApiClient.get("/Brand/catalog");
    return data;
};

export default catalogApiClient;
