export const getProductAvailability = (product) => {
    const stockCount = Number(product?.stock || 0);
    const isOutOfStock = stockCount <= 0;

    return {
        stockCount,
        isOutOfStock,
        label: isOutOfStock ? 'ناموجود' : `موجودی: ${stockCount.toLocaleString('fa-IR')} عدد`,
        badgeClass: isOutOfStock
            ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/40'
            : 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/40'
    };
};

export const compareProductAvailability = (a, b) =>
    Number((b?.stock || 0) > 0) - Number((a?.stock || 0) > 0);
