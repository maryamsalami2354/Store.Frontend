const colorMap = {
    black: { name: "مشکی", hex: "#1A1A1A" },
    "مشکی": { name: "مشکی", hex: "#1A1A1A" },
    white: { name: "سفید", hex: "#FFFFFF" },
    "سفید": { name: "سفید", hex: "#FFFFFF" },
    red: { name: "قرمز", hex: "#EF4444" },
    "قرمز": { name: "قرمز", hex: "#EF4444" },
    blue: { name: "آبی", hex: "#3B82F6" },
    "آبی": { name: "آبی", hex: "#3B82F6" },
    green: { name: "سبز", hex: "#22C55E" },
    "سبز": { name: "سبز", hex: "#22C55E" },
    yellow: { name: "زرد", hex: "#EAB308" },
    "زرد": { name: "زرد", hex: "#EAB308" },
    gray: { name: "خاکستری", hex: "#6B7280" },
    grey: { name: "خاکستری", hex: "#6B7280" },
    "خاکستری": { name: "خاکستری", hex: "#6B7280" },
    silver: { name: "نقره‌ای", hex: "#C0C0C0" },
    "نقره‌ای": { name: "نقره‌ای", hex: "#C0C0C0" },
    gold: { name: "طلایی", hex: "#FFD700" },
    "طلایی": { name: "طلایی", hex: "#FFD700" },
    purple: { name: "بنفش", hex: "#8B5CF6" },
    "بنفش": { name: "بنفش", hex: "#8B5CF6" },
    pink: { name: "صورتی", hex: "#EC4899" },
    "صورتی": { name: "صورتی", hex: "#EC4899" },
    orange: { name: "نارنجی", hex: "#F97316" },
    "نارنجی": { name: "نارنجی", hex: "#F97316" },
    brown: { name: "قهوه‌ای", hex: "#92400E" },
    "قهوه‌ای": { name: "قهوه‌ای", hex: "#92400E" },
};

const hexNameMap = {
    "#000000": "مشکی",
    "#111111": "مشکی",
    "#1A1A1A": "مشکی",
    "#FFFFFF": "سفید",
    "#EF4444": "قرمز",
    "#FF0000": "قرمز",
    "#3B82F6": "آبی",
    "#0000FF": "آبی",
    "#22C55E": "سبز",
    "#008000": "سبز",
    "#EAB308": "زرد",
    "#FFFF00": "زرد",
    "#6B7280": "خاکستری",
    "#808080": "خاکستری",
    "#C0C0C0": "نقره‌ای",
    "#FFD700": "طلایی",
    "#8B5CF6": "بنفش",
    "#800080": "بنفش",
    "#EC4899": "صورتی",
    "#FFC0CB": "صورتی",
    "#F97316": "نارنجی",
    "#FFA500": "نارنجی",
    "#92400E": "قهوه‌ای",
    "#A52A2A": "قهوه‌ای",
};

const isHexColor = (value) => /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(String(value || "").trim());

export const normalizeHexColor = (value) => {
    if (!isHexColor(value)) return "";

    let hex = String(value).trim().replace("#", "");
    if (hex.length === 3) {
        hex = hex.split("").map((char) => `${char}${char}`).join("");
    }

    return `#${hex.toUpperCase()}`;
};

export const normalizeColorOption = (color) => {
    if (!color) return { name: "", hex: "" };

    if (typeof color === "object") {
        const hex = normalizeHexColor(color.hex || color.value || color.code);
        const valueText = String(color.value || "").trim();
        const name = color.name || (hex ? hexNameMap[hex] : "") || (!isHexColor(valueText) ? valueText : "");
        return { name: name || "رنگ سفارشی", hex };
    }

    const raw = String(color).trim();
    const hex = normalizeHexColor(raw);
    if (hex) return { name: hexNameMap[hex] || "رنگ سفارشی", hex };

    const mapped = colorMap[raw] || colorMap[raw.toLowerCase()];
    return mapped || { name: raw, hex: "" };
};

export const getColorName = (color) => normalizeColorOption(color).name;

export const getColorHex = (color) => normalizeColorOption(color).hex || normalizeColorOption(color).name;

export const normalizeColorOptions = (colors = [], colorOptions = []) => {
    const source = colorOptions.length ? colorOptions : colors;
    const seen = new Set();

    return source
        .map(normalizeColorOption)
        .filter((item) => item.name)
        .filter((item) => {
            const key = item.name.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
};
