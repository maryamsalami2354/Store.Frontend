import authApiClient from "./authApi.js";

const normalizeMethod = (method) => ({
    code: method.code || method.value || "",
    title: method.title || method.label || "",
    description: method.description || "",
    cost: Number(method.cost ?? 0),
    estimatedDays: Number(method.estimatedDays ?? 0),
});

const normalizeDeliveryTime = (slot) => ({
    code: slot.code || slot.value || "",
    title: slot.title || slot.label || "",
    timeSlot: slot.timeSlot || slot.time || "",
    description: slot.description || "",
    sortOrder: Number(slot.sortOrder ?? 0),
    dates: (slot.dates || []).map((date) => ({
        id: date.id,
        date: date.date || "",
        sortOrder: Number(date.sortOrder ?? 0),
        capacity: date.capacity ?? null,
    })).filter((date) => date.date),
});

const normalizeDeliverySlot = (slot) => ({
    date: slot.date || "",
    code: slot.code || "",
    title: slot.title || "",
    timeSlot: slot.timeSlot || "",
    label: slot.label || "",
});

export const getShippingOptions = async () => {
    const { data } = await authApiClient.get("/Shipping/options");
    const deliveryTimes = (data?.deliveryTimes || []).map(normalizeDeliveryTime).filter((slot) => slot.code);
    const slots = (data?.slots || []).map(normalizeDeliverySlot).filter((slot) => slot.date && slot.code);
    const slotsFromDeliveryTimes = deliveryTimes.flatMap((timeSlot) =>
        timeSlot.dates.map((date) => ({
            date: date.date,
            code: timeSlot.code,
            title: timeSlot.title,
            timeSlot: timeSlot.timeSlot,
            label: `${date.date} - ${timeSlot.title} (${timeSlot.timeSlot})`,
        }))
    );

    return {
        methods: (data?.methods || []).map(normalizeMethod).filter((method) => method.code),
        deliveryTimes,
        slots: slots.length ? slots : slotsFromDeliveryTimes,
    };
};

export default {
    getShippingOptions,
};
