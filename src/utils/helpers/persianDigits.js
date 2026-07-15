import { useEffect } from "react";

const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export const toPersianDigits = (value) => {
    if (value === null || value === undefined) return "";

    return String(value).replace(/[0-9٠-٩]/g, (digit) => {
        const arabicIndex = arabicDigits.indexOf(digit);

        if (arabicIndex >= 0) {
            return persianDigits[arabicIndex];
        }

        return persianDigits[Number(digit)];
    });
};

export const toEnglishDigits = (value) => {
    if (value === null || value === undefined) return "";

    return String(value).replace(/[۰-۹٠-٩]/g, (digit) => {
        const persianIndex = persianDigits.indexOf(digit);

        if (persianIndex >= 0) {
            return String(persianIndex);
        }

        return String(arabicDigits.indexOf(digit));
    });
};

const ignoredTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"]);
const formValueTags = new Set(["INPUT", "TEXTAREA", "SELECT"]);
const convertibleAttributes = ["placeholder", "title", "aria-label"];

const shouldIgnoreTextNode = (node) => {
    const parent = node.parentElement;

    if (!parent) return true;
    if (ignoredTags.has(parent.tagName)) return true;
    if (formValueTags.has(parent.tagName)) return true;

    return false;
};

const convertTextNode = (node) => {
    if (shouldIgnoreTextNode(node)) return;

    const converted = toPersianDigits(node.nodeValue);

    if (converted !== node.nodeValue) {
        node.nodeValue = converted;
    }
};

const convertAttributes = (element) => {
    if (!(element instanceof Element)) return;

    convertibleAttributes.forEach((attribute) => {
        const value = element.getAttribute(attribute);

        if (!value) return;

        const converted = toPersianDigits(value);

        if (converted !== value) {
            element.setAttribute(attribute, converted);
        }
    });
};

const convertTree = (root) => {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
        convertTextNode(root);
        return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
        return;
    }

    convertAttributes(root);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
        convertTextNode(walker.currentNode);
    }

    if (root.querySelectorAll) {
        root.querySelectorAll(convertibleAttributes.map((attribute) => `[${attribute}]`).join(",")).forEach(convertAttributes);
    }
};

const PersianDigitsProvider = ({ children }) => {
    useEffect(() => {
        const root = document.getElementById("root");

        if (!root) return undefined;

        convertTree(root);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "characterData") {
                    convertTextNode(mutation.target);
                    return;
                }

                if (mutation.type === "attributes") {
                    convertAttributes(mutation.target);
                    return;
                }

                mutation.addedNodes.forEach(convertTree);
            });
        });

        observer.observe(root, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: convertibleAttributes,
        });

        return () => observer.disconnect();
    }, []);

    return children;
};

export default PersianDigitsProvider;
