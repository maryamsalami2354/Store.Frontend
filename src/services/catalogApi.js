import axios from "axios";
import { API_BASE_URL, toAssetUrl } from "./authApi.js";
import { normalizeColorOptions } from "../utils/helpers/colorHelpers.js";

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

const normalizeCatalogProduct = (product) => {
    if (!product) return product;

    const image = product.mainImage || product.primaryImage || product.image || product.imagePath || product.thumbnailUrl || product.imageUrl || "";
    const gallery = Array.isArray(product.gallery)
        ? product.gallery.map((item) => toAssetUrl(item)).filter(Boolean)
        : [];
    const colorOptions = normalizeColorOptions(product.colors || [], product.colorOptions || []);

    return {
        ...product,
        image: toAssetUrl(image),
        mainImage: toAssetUrl(product.mainImage || image),
        primaryImage: toAssetUrl(product.primaryImage || image),
        imagePath: product.imagePath ? toAssetUrl(product.imagePath) : product.imagePath,
        thumbnailUrl: product.thumbnailUrl ? toAssetUrl(product.thumbnailUrl) : product.thumbnailUrl,
        imageUrl: product.imageUrl ? toAssetUrl(product.imageUrl) : product.imageUrl,
        gallery,
        secondaryImages: Array.isArray(product.secondaryImages)
            ? product.secondaryImages.map((item) => toAssetUrl(item)).filter(Boolean)
            : gallery.slice(1),
        colorOptions,
        colors: colorOptions.map((item) => item.name),
    };
};

const normalizeCatalogCategory = (category) => {
    if (!category) return category;

    return {
        ...category,
        image: category.image ? toAssetUrl(category.image) : category.image,
        imagePath: category.imagePath ? toAssetUrl(category.imagePath) : category.imagePath,
        banner: category.banner ? toAssetUrl(category.banner) : category.banner,
        subcategories: Array.isArray(category.subcategories)
            ? category.subcategories.map(normalizeCatalogCategory)
            : category.subcategories,
    };
};

const normalizeCatalogBrand = (brand) => {
    if (!brand) return brand;

    return {
        ...brand,
        logo: brand.logo ? toAssetUrl(brand.logo) : brand.logo,
        image: brand.image ? toAssetUrl(brand.image) : brand.image,
        imagePath: brand.imagePath ? toAssetUrl(brand.imagePath) : brand.imagePath,
    };
};

const normalizeProductsResponse = (data) => {
    if (Array.isArray(data)) {
        return data.map(normalizeCatalogProduct);
    }

    return {
        ...data,
        products: Array.isArray(data?.products)
            ? data.products.map(normalizeCatalogProduct)
            : data?.products,
    };
};

export const getCatalogProducts = async (params = {}) => {
    const { data } = await catalogApiClient.get("/Product/catalog", { params });
    return normalizeProductsResponse(data);
};

export const getCatalogProduct = async (id) => {
    const { data } = await catalogApiClient.get(`/Product/catalog/${id}`);
    return normalizeCatalogProduct(data);
};

export const getRelatedCatalogProducts = async ({ categoryId, excludeId, productId, take = 10 }) => {
    const { data } = await catalogApiClient.get("/Product/catalog/related", {
        params: { categoryId, excludeId, productId, take },
    });
    return normalizeProductsResponse(data);
};

export const getCatalogCategories = async () => {
    const { data } = await catalogApiClient.get("/Category/catalog");
    return {
        ...data,
        categories: Array.isArray(data?.categories)
            ? data.categories.map(normalizeCatalogCategory)
            : data?.categories,
    };
};

export const getCatalogBrands = async () => {
    const { data } = await catalogApiClient.get("/Brand/catalog");
    return {
        ...data,
        brands: Array.isArray(data?.brands)
            ? data.brands.map(normalizeCatalogBrand)
            : data?.brands,
    };
};

export default catalogApiClient;
