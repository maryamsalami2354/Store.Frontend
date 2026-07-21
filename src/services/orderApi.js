import authApiClient from "./authApi.js";

const toUiStatus = (status) => {
    switch (status) {
        case "PendingPayment":
        case "Pending":
            return "pending";
        case "AwaitingShipment":
        case "Processing":
        case "ReadyToShip":
            return "processing";
        case "Shipped":
        case "InTransit":
            return "shipped";
        case "Delivered":
        case "Completed":
            return "completed";
        case "Cancelled":
            return "cancelled";
        default:
            return String(status || "pending").toLowerCase();
    }
};

const toApiStatus = (status) => {
    switch (status) {
        case "pending":
            return "PendingPayment";
        case "processing":
            return "AwaitingShipment";
        case "shipped":
            return "Shipped";
        case "completed":
            return "Delivered";
        case "cancelled":
            return "Cancelled";
        default:
            return status;
    }
};

const formatDate = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("fa-IR");
};

const formatTime = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
};

const normalizeTrackingEvent = (event) => ({
    id: event.id,
    rawStatus: event.status,
    status: toUiStatus(event.status),
    title: event.title || event.statusLabel || event.status || "",
    statusLabel: event.statusLabel || event.title || event.status || "",
    description: event.description || "",
    createdAt: event.createdAt,
    date: formatDate(event.createdAt),
    time: formatTime(event.createdAt),
    source: event.source || "",
    createdByUserId: event.createdByUserId,
    isVisibleToCustomer: event.isVisibleToCustomer !== false,
});

const normalizeOrder = (order) => {
    const totalAmount = Number(order.totalAmount ?? order.amount ?? 0);
    const trackingHistory = (order.trackingHistory || order.history || [])
        .map(normalizeTrackingEvent)
        .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

    const items = (order.orderItems || order.items || []).map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product?.name || item.name || `کالا ${item.productId}`,
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0).toLocaleString("fa-IR"),
        discount: Number(item.discount || 0),
    }));

    return {
        id: order.id,
        rawStatus: order.status,
        status: toUiStatus(order.status),
        date: formatDate(order.orderDate || order.date),
        amount: totalAmount.toLocaleString("fa-IR"),
        amountValue: totalAmount,
        trackingCode: order.trackingCode || "",
        shippingMethod: order.shippingMethod || "",
        shippingCost: Number(order.shippingCost || 0),
        deliveryDate: order.deliveryDate,
        deliveryTimeSlot: order.deliveryTimeSlot || "",
        recipientName: order.recipientName || "",
        recipientPhone: order.recipientPhone || "",
        canEditShippingAddress: Boolean(order.canEditShippingAddress ?? ["pending", "processing"].includes(toUiStatus(order.status))),
        customer: {
            name: order.recipientName || "مشتری",
            phone: order.recipientPhone || "",
            email: order.customerEmail || "",
        },
        address: {
            full: order.shippingAddress || "",
        },
        items,
        trackingHistory,
        history: trackingHistory,
        latestTracking: trackingHistory[trackingHistory.length - 1] || null,
        paymentMethod: order.paymentMethod || "زرین‌پال",
    };
};

const normalizeOrderList = (data) => ({
    orders: (data?.ordersAndItems || data?.orders || []).map(normalizeOrder),
    page: Number(data?.page || 1),
    pageSize: Number(data?.pageSize || 10),
    totalCount: Number(data?.totalCount || 0),
    totalPages: Number(data?.totalPages || 1),
});

export const getMyOrders = async (params = {}) => {
    const { data } = await authApiClient.get("/Order/my-orders", { params });
    return normalizeOrderList(data);
};

export const getAdminOrders = async (params = {}) => {
    const { data } = await authApiClient.get("/Order/admin/orders", { params });
    return normalizeOrderList(data);
};

export const updateOrderStatus = async (orderId, status) => {
    const { data } = await authApiClient.patch(`/Order/${orderId}/status`, {
        status: toApiStatus(status),
    });
    return data;
};

export const updateAdminOrder = async (orderId, payload) => {
    const { data } = await authApiClient.patch(`/Order/${orderId}/admin`, {
        ...payload,
        status: payload.status ? toApiStatus(payload.status) : undefined,
    });
    return data;
};

export const updateMyOrderShippingAddress = async (orderId, payload) => {
    const { data } = await authApiClient.patch(`/Order/${orderId}/shipping-address`, payload);
    return data;
};

export const getOrderTracking = async (orderId) => {
    const { data } = await authApiClient.get(`/Order/${orderId}/tracking`);
    return {
        ...data,
        trackingHistory: (data?.trackingHistory || []).map(normalizeTrackingEvent),
    };
};

export default {
    getMyOrders,
    getAdminOrders,
    updateOrderStatus,
    updateAdminOrder,
    updateMyOrderShippingAddress,
    getOrderTracking,
};
