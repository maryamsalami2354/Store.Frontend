import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle, Copy, Edit2, Image, Package, Plus, RefreshCw, Save, Tag, ToggleLeft, ToggleRight, Upload, X } from "react-feather";
import { toast } from "react-toastify";
import {
    createAdminAttributeTemplate,
    createAdminBrand,
    createAdminCategory,
    createAdminProduct,
    getAdminAttributeTemplates,
    getAdminBrands,
    getAdminCategories,
    getAdminProducts,
    setAdminAttributeTemplateActive,
    setAdminBrandActive,
    setAdminCategoryActive,
    setAdminProductStatus,
    updateAdminAttributeTemplate,
    updateAdminBrand,
    updateAdminCategory,
    updateAdminProduct,
} from "../../services/adminApi.js";
import { toAssetUrl } from "../../services/authApi.js";

const tabs = [
    { key: "products", label: "محصولات", icon: Package },
    { key: "categories", label: "دسته‌بندی‌ها", icon: Tag },
    { key: "brands", label: "برندها", icon: CheckCircle },
    { key: "attributes", label: "ویژگی‌ها", icon: ToggleRight },
];

const initialProductForm = {
    name: "",
    sku: "",
    categoryId: "",
    brandId: "",
    price: "",
    oldPrice: "",
    stock: "0",
    discount: "0",
    rating: "0",
    status: "active",
    isAmazing: false,
    isNew: false,
    shortDescription: "",
    description: "",
    fullDescription: "",
    technicalSpecifications: "",
    tags: "",
    colors: "",
    attributeIds: [],
    image: null,
    secondaryImages: [],
};

const initialCategoryForm = { title: "", icon: "", banner: "", imagePath: "", isActive: true };
const initialBrandForm = { name: "", description: "", logoUrl: "", isActive: true };
const initialAttributeForm = { key: "", value: "", description: "", isActive: true };
const allowedImageTypes = ["image/png", "image/jpeg", "image/webp"];

const toPersianNumber = (value) => Number(value || 0).toLocaleString("fa-IR");
const splitList = (items = []) => items.join(", ");
const normalizeBoolean = (value) => value === true || value === "true";
const specsToText = (groups = []) => {
    if (!Array.isArray(groups)) return "";

    return groups
        .flatMap((group) => (group.items || []).map((item) => `${group.title || "مشخصات فنی"} | ${item.label || ""} | ${item.value || ""}`))
        .filter((line) => line.split("|").every((part) => part.trim()))
        .join("\n");
};

const AdminProducts = ({ canCreateProducts }) => {
    const [activeTab, setActiveTab] = useState("products");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingBrand, setEditingBrand] = useState(null);
    const [editingAttribute, setEditingAttribute] = useState(null);
    const [productForm, setProductForm] = useState(initialProductForm);
    const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
    const [brandForm, setBrandForm] = useState(initialBrandForm);
    const [attributeForm, setAttributeForm] = useState(initialAttributeForm);
    const [preview, setPreview] = useState("");
    const [secondaryPreviews, setSecondaryPreviews] = useState([]);

    const activeCategories = useMemo(() => categories.filter((item) => item.isActive), [categories]);
    const activeBrands = useMemo(() => brands.filter((item) => item.isActive), [brands]);
    const activeAttributes = useMemo(() => attributes.filter((item) => item.isActive), [attributes]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [productsResult, categoriesResult, brandsResult, attributesResult] = await Promise.all([
                getAdminProducts({ page: 1, pageSize: 300 }),
                getAdminCategories(),
                getAdminBrands(),
                getAdminAttributeTemplates({ includeInactive: true }),
            ]);

            setProducts(productsResult.products || []);
            setCategories(categoriesResult || []);
            setBrands(brandsResult || []);
            setAttributes(attributesResult || []);
        } catch (error) {
            toast.error(error.message || "خطا در دریافت اطلاعات کاتالوگ");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (!productForm.image) {
            setPreview("");
            return undefined;
        }

        const url = URL.createObjectURL(productForm.image);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [productForm.image]);

    useEffect(() => {
        const urls = (productForm.secondaryImages || []).map((image) => URL.createObjectURL(image));
        setSecondaryPreviews(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [productForm.secondaryImages]);

    const productSummary = useMemo(() => {
        const active = products.filter((item) => item.status === "active").length;
        const available = products.filter((item) => Number(item.stock || 0) > 0).length;
        return [
            { label: "کل محصولات", value: products.length },
            { label: "فعال", value: active },
            { label: "موجود", value: available },
        ];
    }, [products]);

    const resetProductForm = () => {
        setEditingProduct(null);
        setProductForm(initialProductForm);
    };

    const resetCategoryForm = () => {
        setEditingCategory(null);
        setCategoryForm(initialCategoryForm);
    };

    const resetBrandForm = () => {
        setEditingBrand(null);
        setBrandForm(initialBrandForm);
    };

    const resetAttributeForm = () => {
        setEditingAttribute(null);
        setAttributeForm(initialAttributeForm);
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!allowedImageTypes.includes(file.type)) {
            toast.error("فرمت تصویر باید png، jpg یا webp باشد");
            event.target.value = "";
            return;
        }

        if (file.size > 8 * 1024 * 1024) {
            toast.error("حجم تصویر نباید بیشتر از ۸ مگابایت باشد");
            event.target.value = "";
            return;
        }

        setProductForm((prev) => ({ ...prev, image: file }));
    };

    const handleSecondaryImagesChange = (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        const invalidFile = files.find((file) => !allowedImageTypes.includes(file.type));
        if (invalidFile) {
            toast.error("فرمت عکس‌های فرعی باید png، jpg یا webp باشد");
            event.target.value = "";
            return;
        }

        const oversizedFile = files.find((file) => file.size > 8 * 1024 * 1024);
        if (oversizedFile) {
            toast.error("حجم هر تصویر نباید بیشتر از ۸ مگابایت باشد");
            event.target.value = "";
            return;
        }

        setProductForm((prev) => ({ ...prev, secondaryImages: files }));
    };

    const buildProductPayload = () => {
        const payload = new FormData();
        [
            "name",
            "sku",
            "categoryId",
            "brandId",
            "price",
            "oldPrice",
            "stock",
            "discount",
            "rating",
            "status",
            "shortDescription",
            "description",
            "fullDescription",
            "tags",
            "colors",
        ].forEach((field) => {
            const value = productForm[field];
            if (value !== undefined && value !== null && String(value).trim() !== "") {
                payload.append(field, String(value).trim());
            }
        });

        ["shortDescription", "description", "fullDescription", "tags", "colors"].forEach((field) => {
            payload.set(field, String(productForm[field] || "").trim());
        });

        payload.append("isAmazing", String(productForm.isAmazing));
        payload.append("isNew", String(productForm.isNew));
        payload.append("attributeIds", JSON.stringify(productForm.attributeIds.map(Number)));
        payload.set("technicalSpecificationsJson", productForm.technicalSpecifications || "");

        if (productForm.image) {
            payload.append("image", productForm.image);
        }

        (productForm.secondaryImages || []).forEach((image) => {
            payload.append("secondaryImages", image);
        });

        return payload;
    };

    const handleProductSubmit = async (event) => {
        event.preventDefault();

        if (!canCreateProducts) return toast.error("حساب شما مجوز مدیریت محصول ندارد");
        if (!productForm.name.trim()) return toast.error("نام محصول الزامی است");
        if (!productForm.categoryId) return toast.error("دسته‌بندی محصول را انتخاب کنید");
        if (!productForm.price || Number(productForm.price) <= 0) return toast.error("قیمت محصول معتبر نیست");
        if (!editingProduct && !productForm.image) return toast.error("تصویر محصول الزامی است");

        setSaving(true);
        try {
            if (editingProduct) {
                await updateAdminProduct(editingProduct.id, buildProductPayload());
                toast.success("محصول ویرایش شد");
            } else {
                await createAdminProduct(buildProductPayload());
                toast.success("محصول جدید ثبت شد");
            }

            resetProductForm();
            await loadData();
        } catch (error) {
            toast.error(error.message || "خطا در ذخیره محصول");
        } finally {
            setSaving(false);
        }
    };

    const startEditProduct = (product) => {
        const matchedAttributeIds = activeAttributes
            .filter((template) => (product.attributes || []).some((item) => item.key === template.key && item.value === template.value))
            .map((item) => item.id);

        setEditingProduct(product);
        setProductForm({
            name: product.name || "",
            sku: product.sku || "",
            categoryId: product.categoryId ? String(product.categoryId) : "",
            brandId: product.brandId ? String(product.brandId) : "",
            price: product.priceValue ? String(product.priceValue) : "",
            oldPrice: product.oldPriceValue ? String(product.oldPriceValue) : "",
            stock: String(product.stock || 0),
            discount: String(product.discount || 0),
            rating: String(product.rating || 0),
            status: product.status || "active",
            isAmazing: normalizeBoolean(product.isAmazing),
            isNew: normalizeBoolean(product.isNew),
            shortDescription: product.shortDescription || "",
            description: product.description || "",
            fullDescription: product.fullDescription || "",
            technicalSpecifications: specsToText(product.technicalSpecifications),
            tags: splitList(product.tags),
            colors: splitList(product.colors),
            attributeIds: matchedAttributeIds,
            image: null,
            secondaryImages: [],
        });
        setPreview("");
        setActiveTab("products");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleProductStatus = async (product) => {
        const nextStatus = product.status === "active" ? "inactive" : "active";
        try {
            await setAdminProductStatus(product.id, nextStatus);
            toast.success(nextStatus === "active" ? "محصول فعال شد" : "محصول غیرفعال شد");
            await loadData();
        } catch (error) {
            toast.error(error.message || "خطا در تغییر وضعیت محصول");
        }
    };

    const handleSimpleSubmit = async (type, event) => {
        event.preventDefault();
        setSaving(true);

        try {
            if (type === "category") {
                if (!categoryForm.title.trim()) throw new Error("نام دسته‌بندی الزامی است");
                if (editingCategory) {
                    await updateAdminCategory(editingCategory.id, categoryForm);
                    toast.success("دسته‌بندی ویرایش شد");
                } else {
                    await createAdminCategory(categoryForm);
                    toast.success("دسته‌بندی ثبت شد");
                }
                resetCategoryForm();
            }

            if (type === "brand") {
                if (!brandForm.name.trim()) throw new Error("نام برند الزامی است");
                if (editingBrand) {
                    await updateAdminBrand(editingBrand.id, brandForm);
                    toast.success("برند ویرایش شد");
                } else {
                    await createAdminBrand(brandForm);
                    toast.success("برند ثبت شد");
                }
                resetBrandForm();
            }

            if (type === "attribute") {
                if (!attributeForm.key.trim() || !attributeForm.value.trim()) throw new Error("عنوان و مقدار ویژگی الزامی است");
                if (editingAttribute) {
                    await updateAdminAttributeTemplate(editingAttribute.id, attributeForm);
                    toast.success("ویژگی ویرایش شد");
                } else {
                    await createAdminAttributeTemplate(attributeForm);
                    toast.success("ویژگی ثبت شد");
                }
                resetAttributeForm();
            }

            await loadData();
        } catch (error) {
            toast.error(error.message || "خطا در ذخیره اطلاعات");
        } finally {
            setSaving(false);
        }
    };

    const toggleEntityActive = async (type, item) => {
        try {
            const next = !item.isActive;
            if (type === "category") await setAdminCategoryActive(item.id, next);
            if (type === "brand") await setAdminBrandActive(item.id, next);
            if (type === "attribute") await setAdminAttributeTemplateActive(item.id, next);
            toast.success(next ? "فعال شد" : "غیرفعال شد");
            await loadData();
        } catch (error) {
            toast.error(error.message || "خطا در تغییر وضعیت");
        }
    };

    const handleCopyImagePath = async (imagePath) => {
        if (!imagePath) return;
        try {
            await navigator.clipboard.writeText(imagePath);
            toast.success("مسیر عکس کپی شد");
        } catch {
            toast.error("کپی مسیر عکس انجام نشد");
        }
    };

    return (
        <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white lg:text-2xl">مدیریت کاتالوگ</h1>
                    <p className="mt-1 text-sm text-gray-500">محصول، دسته‌بندی، برند و ویژگی‌های قابل انتخاب محصول</p>
                </div>
                <button onClick={loadData} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#111] dark:text-gray-300">
                    <RefreshCw size={16} />
                    بروزرسانی
                </button>
            </div>

            <div className="flex gap-2 overflow-x-auto rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-[#111]">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`inline-flex min-w-max items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${activeTab === tab.key ? "bg-[#002874] text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "products" && (
                <ProductSection
                    products={products}
                    categories={activeCategories}
                    brands={activeBrands}
                    attributes={activeAttributes}
                    loading={loading}
                    saving={saving}
                    canCreateProducts={canCreateProducts}
                    form={productForm}
                    setForm={setProductForm}
                    editingProduct={editingProduct}
                    preview={preview}
                    secondaryPreviews={secondaryPreviews}
                    summary={productSummary}
                    onSubmit={handleProductSubmit}
                    onImageChange={handleImageChange}
                    onSecondaryImagesChange={handleSecondaryImagesChange}
                    onCancel={resetProductForm}
                    onEdit={startEditProduct}
                    onToggleStatus={toggleProductStatus}
                    onCopyImagePath={handleCopyImagePath}
                />
            )}

            {activeTab === "categories" && (
                <CategorySection
                    items={categories}
                    form={categoryForm}
                    setForm={setCategoryForm}
                    editingItem={editingCategory}
                    saving={saving}
                    onSubmit={(event) => handleSimpleSubmit("category", event)}
                    onEdit={(item) => {
                        setEditingCategory(item);
                        setCategoryForm({ title: item.title || item.name || "", icon: item.icon || "", banner: item.banner || "", imagePath: item.imagePath || "", isActive: item.isActive });
                    }}
                    onCancel={resetCategoryForm}
                    onToggle={(item) => toggleEntityActive("category", item)}
                />
            )}

            {activeTab === "brands" && (
                <BrandSection
                    items={brands}
                    form={brandForm}
                    setForm={setBrandForm}
                    editingItem={editingBrand}
                    saving={saving}
                    onSubmit={(event) => handleSimpleSubmit("brand", event)}
                    onEdit={(item) => {
                        setEditingBrand(item);
                        setBrandForm({ name: item.name || "", description: item.description || "", logoUrl: item.logoUrl || item.logo || "", isActive: item.isActive });
                    }}
                    onCancel={resetBrandForm}
                    onToggle={(item) => toggleEntityActive("brand", item)}
                />
            )}

            {activeTab === "attributes" && (
                <AttributeSection
                    items={attributes}
                    form={attributeForm}
                    setForm={setAttributeForm}
                    editingItem={editingAttribute}
                    saving={saving}
                    onSubmit={(event) => handleSimpleSubmit("attribute", event)}
                    onEdit={(item) => {
                        setEditingAttribute(item);
                        setAttributeForm({ key: item.key || "", value: item.value || "", description: item.description || "", isActive: item.isActive });
                    }}
                    onCancel={resetAttributeForm}
                    onToggle={(item) => toggleEntityActive("attribute", item)}
                />
            )}
        </section>
    );
};

const ProductSection = ({ products, categories, brands, attributes, loading, saving, canCreateProducts, form, setForm, editingProduct, preview, secondaryPreviews, summary, onSubmit, onImageChange, onSecondaryImagesChange, onCancel, onEdit, onToggleStatus, onCopyImagePath }) => (
    <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
            {summary.map((item) => (
                <div key={item.label} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111]">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{toPersianNumber(item.value)}</p>
                </div>
            ))}
        </div>

        {canCreateProducts && (
            <form onSubmit={onSubmit} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111]">
                <SectionHeading title={editingProduct ? "ویرایش محصول" : "تعریف محصول جدید"} icon={Plus} />
                <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
                    <div className="space-y-3">
                        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-center text-sm text-gray-500 hover:border-[#002874] dark:border-gray-700 dark:bg-gray-900">
                            {preview || editingProduct?.image ? (
                                <img src={preview || toAssetUrl(editingProduct?.mainImage || editingProduct?.image)} alt="پیش‌نمایش محصول" className="h-full w-full rounded-lg object-contain p-2" />
                            ) : (
                                <>
                                    <Image size={32} />
                                    <span className="mt-3">عکس اصلی محصول</span>
                                    <span className="mt-1 text-xs">png / jpg / webp</span>
                                </>
                            )}
                            <input type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden" onChange={onImageChange} />
                        </label>
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-4 text-center text-sm text-gray-500 hover:border-[#002874] dark:border-gray-700 dark:bg-gray-900">
                            <Image size={24} />
                            <span className="mt-2">عکس‌های فرعی</span>
                            <span className="mt-1 text-xs">چند فایل png / jpg / webp</span>
                            <input type="file" accept=".png,.jpg,.jpeg,.webp" multiple className="hidden" onChange={onSecondaryImagesChange} />
                        </label>
                        {(secondaryPreviews.length > 0 || editingProduct?.secondaryImages?.length > 0) && (
                            <div className="grid grid-cols-3 gap-2">
                                {(secondaryPreviews.length > 0 ? secondaryPreviews : editingProduct.secondaryImages).slice(0, 6).map((image, index) => (
                                    <img key={`${image}-${index}`} src={toAssetUrl(image)} alt={`عکس فرعی ${index + 1}`} className="h-16 w-full rounded-lg border border-gray-100 object-contain p-1 dark:border-gray-800" />
                                ))}
                            </div>
                        )}
                        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
                            <Upload size={15} />
                            عکس‌ها در بک‌اند فشرده می‌شوند
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <TextField label="نام محصول" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} required />
                        <TextField label="SKU" value={form.sku} onChange={(value) => setForm((prev) => ({ ...prev, sku: value }))} />
                        <SelectField label="دسته‌بندی" value={form.categoryId} onChange={(value) => setForm((prev) => ({ ...prev, categoryId: value }))} required>
                            <option value="">انتخاب دسته‌بندی</option>
                            {categories.map((item) => <option key={item.id} value={item.id}>{item.title || item.name}</option>)}
                        </SelectField>
                        <SelectField label="برند" value={form.brandId} onChange={(value) => setForm((prev) => ({ ...prev, brandId: value }))}>
                            <option value="">بدون برند</option>
                            {brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                        </SelectField>
                        <TextField label="قیمت" type="number" value={form.price} onChange={(value) => setForm((prev) => ({ ...prev, price: value }))} required />
                        <TextField label="قیمت قبل" type="number" value={form.oldPrice} onChange={(value) => setForm((prev) => ({ ...prev, oldPrice: value }))} />
                        <TextField label="موجودی" type="number" value={form.stock} onChange={(value) => setForm((prev) => ({ ...prev, stock: value }))} />
                        <TextField label="تخفیف" type="number" value={form.discount} onChange={(value) => setForm((prev) => ({ ...prev, discount: value }))} />
                        <TextField label="امتیاز" type="number" step="0.1" value={form.rating} onChange={(value) => setForm((prev) => ({ ...prev, rating: value }))} />
                        <SelectField label="وضعیت" value={form.status} onChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
                            <option value="active">فعال</option>
                            <option value="inactive">غیرفعال</option>
                            <option value="draft">پیش‌نویس</option>
                        </SelectField>
                        <ToggleField label="شگفت‌انگیز" checked={form.isAmazing} onChange={(value) => setForm((prev) => ({ ...prev, isAmazing: value }))} />
                        <ToggleField label="جدید" checked={form.isNew} onChange={(value) => setForm((prev) => ({ ...prev, isNew: value }))} />
                        <TextField label="تگ‌ها" value={form.tags} onChange={(value) => setForm((prev) => ({ ...prev, tags: value }))} />
                        <TextField label="رنگ‌ها" value={form.colors} onChange={(value) => setForm((prev) => ({ ...prev, colors: value }))} placeholder="مثال: مشکی، سفید، آبی" />
                        <TextareaField label="توضیح کوتاه" value={form.shortDescription} onChange={(value) => setForm((prev) => ({ ...prev, shortDescription: value }))} />
                        <TextareaField label="توضیحات" value={form.description} onChange={(value) => setForm((prev) => ({ ...prev, description: value }))} className="xl:col-span-2" />
                        <TextareaField label="معرفی تکمیلی" value={form.fullDescription} onChange={(value) => setForm((prev) => ({ ...prev, fullDescription: value }))} className="xl:col-span-3" rows={5} />
                        <TextareaField
                            label="مشخصات فنی"
                            value={form.technicalSpecifications}
                            onChange={(value) => setForm((prev) => ({ ...prev, technicalSpecifications: value }))}
                            className="xl:col-span-3"
                            rows={6}
                            placeholder={"هر خط: گروه | عنوان | مقدار\nمثال: مشخصات کلی | برند | اپل\nمثال: صفحه نمایش | اندازه | ۶.۷ اینچ"}
                        />
                    </div>
                </div>

                <div className="mt-5 rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                    <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-100">ویژگی‌های انتخابی محصول</p>
                    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                        {attributes.length === 0 && <p className="text-sm text-gray-500">ابتدا از تب ویژگی‌ها، ویژگی محصول تعریف کنید.</p>}
                        {attributes.map((item) => (
                            <label key={item.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-[#111]">
                                <input
                                    type="checkbox"
                                    checked={form.attributeIds.includes(item.id)}
                                    onChange={(event) => {
                                        setForm((prev) => ({
                                            ...prev,
                                            attributeIds: event.target.checked
                                                ? [...prev.attributeIds, item.id]
                                                : prev.attributeIds.filter((id) => id !== item.id),
                                        }));
                                    }}
                                />
                                <span>{item.key}: {item.value}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <FormActions saving={saving} editing={Boolean(editingProduct)} onCancel={onCancel} />
            </form>
        )}

        <ProductTable products={products} loading={loading} onEdit={onEdit} onToggleStatus={onToggleStatus} onCopyImagePath={onCopyImagePath} />
    </div>
);

const ProductTable = ({ products, loading, onEdit, onToggleStatus, onCopyImagePath }) => (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111]">
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1160px] text-right text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-gray-900">
                    <tr>
                        <th className="px-4 py-3">محصول</th>
                        <th className="px-4 py-3">دسته‌بندی</th>
                        <th className="px-4 py-3">برند</th>
                        <th className="px-4 py-3">قیمت</th>
                        <th className="px-4 py-3">موجودی</th>
                        <th className="px-4 py-3">ImagePath</th>
                        <th className="px-4 py-3">وضعیت</th>
                        <th className="px-4 py-3">عملیات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {loading && <TableMessage colSpan={8} text="در حال دریافت محصولات..." />}
                    {!loading && products.length === 0 && <TableMessage colSpan={8} text="محصولی برای نمایش وجود ندارد." />}
                    {!loading && products.map((product) => {
                        const stock = Number(product.stock || 0);
                        const imagePath = product.imagePath || product.image || "";
                        return (
                            <tr key={product.id} className="text-gray-700 dark:text-gray-300">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img src={toAssetUrl(product.image || product.imagePath || "/images/products/placeholder.jpg")} alt={product.name} className="h-12 w-12 rounded-lg border border-gray-100 object-contain dark:border-gray-800" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                                            <p className="mt-1 text-xs text-gray-500">{product.sku || `#${toPersianNumber(product.id)}`}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{product.categoryName || "-"}</td>
                                <td className="px-4 py-3">{product.brandName || "-"}</td>
                                <td className="px-4 py-3">{toPersianNumber(product.priceValue)} تومان</td>
                                <td className="px-4 py-3">{stock > 0 ? <StatusPill tone="green">{toPersianNumber(stock)} عدد</StatusPill> : <StatusPill tone="red">ناموجود</StatusPill>}</td>
                                <td className="px-4 py-3">
                                    {imagePath ? (
                                        <div className="flex max-w-[260px] items-center gap-2 rounded-lg bg-gray-50 px-2 py-1 dark:bg-gray-900">
                                            <span dir="ltr" className="truncate text-xs text-gray-600 dark:text-gray-300" title={imagePath}>{imagePath}</span>
                                            <button type="button" onClick={() => onCopyImagePath(imagePath)} className="shrink-0 rounded-md p-1 text-gray-500 hover:bg-white hover:text-[#002874] dark:hover:bg-[#111]" title="کپی ImagePath">
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                    ) : "-"}
                                </td>
                                <td className="px-4 py-3"><StatusPill tone={product.status === "active" ? "green" : "gray"}>{product.status === "active" ? "فعال" : "غیرفعال"}</StatusPill></td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <IconButton title="ویرایش" onClick={() => onEdit(product)} icon={Edit2} />
                                        <IconButton title={product.status === "active" ? "غیرفعال کردن" : "فعال کردن"} onClick={() => onToggleStatus(product)} icon={product.status === "active" ? ToggleLeft : ToggleRight} />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);

const CategorySection = ({ items, form, setForm, editingItem, saving, onSubmit, onEdit, onCancel, onToggle }) => (
    <SimpleSection
        title={editingItem ? "ویرایش دسته‌بندی" : "تعریف دسته‌بندی"}
        onSubmit={onSubmit}
        saving={saving}
        editing={Boolean(editingItem)}
        onCancel={onCancel}
        formFields={(
            <>
                <TextField label="نام دسته‌بندی" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} required />
                <TextField label="آیکن" value={form.icon} onChange={(value) => setForm((prev) => ({ ...prev, icon: value }))} />
                <TextField label="بنر" value={form.banner} onChange={(value) => setForm((prev) => ({ ...prev, banner: value }))} />
                <TextField label="ImagePath" value={form.imagePath} onChange={(value) => setForm((prev) => ({ ...prev, imagePath: value }))} />
                <ToggleField label="فعال" checked={form.isActive} onChange={(value) => setForm((prev) => ({ ...prev, isActive: value }))} />
            </>
        )}
        table={<SimpleTable columns={["نام", "ImagePath", "وضعیت", "عملیات"]} items={items} renderRow={(item) => (
            <tr key={item.id} className="text-gray-700 dark:text-gray-300">
                <td className="px-4 py-3 font-medium">{item.title || item.name}</td>
                <td className="px-4 py-3" dir="ltr">{item.imagePath || "-"}</td>
                <td className="px-4 py-3"><StatusPill tone={item.isActive ? "green" : "gray"}>{item.isActive ? "فعال" : "غیرفعال"}</StatusPill></td>
                <td className="px-4 py-3"><RowActions item={item} onEdit={onEdit} onToggle={onToggle} /></td>
            </tr>
        )} />}
    />
);

const BrandSection = ({ items, form, setForm, editingItem, saving, onSubmit, onEdit, onCancel, onToggle }) => (
    <SimpleSection
        title={editingItem ? "ویرایش برند" : "تعریف برند"}
        onSubmit={onSubmit}
        saving={saving}
        editing={Boolean(editingItem)}
        onCancel={onCancel}
        formFields={(
            <>
                <TextField label="نام برند" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} required />
                <TextField label="LogoUrl" value={form.logoUrl} onChange={(value) => setForm((prev) => ({ ...prev, logoUrl: value }))} />
                <TextareaField label="توضیحات" value={form.description} onChange={(value) => setForm((prev) => ({ ...prev, description: value }))} />
                <ToggleField label="فعال" checked={form.isActive} onChange={(value) => setForm((prev) => ({ ...prev, isActive: value }))} />
            </>
        )}
        table={<SimpleTable columns={["نام", "LogoUrl", "وضعیت", "عملیات"]} items={items} renderRow={(item) => (
            <tr key={item.id} className="text-gray-700 dark:text-gray-300">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3" dir="ltr">{item.logoUrl || item.logo || "-"}</td>
                <td className="px-4 py-3"><StatusPill tone={item.isActive ? "green" : "gray"}>{item.isActive ? "فعال" : "غیرفعال"}</StatusPill></td>
                <td className="px-4 py-3"><RowActions item={item} onEdit={onEdit} onToggle={onToggle} /></td>
            </tr>
        )} />}
    />
);

const AttributeSection = ({ items, form, setForm, editingItem, saving, onSubmit, onEdit, onCancel, onToggle }) => (
    <SimpleSection
        title={editingItem ? "ویرایش ویژگی محصول" : "تعریف ویژگی محصول"}
        onSubmit={onSubmit}
        saving={saving}
        editing={Boolean(editingItem)}
        onCancel={onCancel}
        formFields={(
            <>
                <TextField label="عنوان ویژگی" value={form.key} onChange={(value) => setForm((prev) => ({ ...prev, key: value }))} required />
                <TextField label="مقدار" value={form.value} onChange={(value) => setForm((prev) => ({ ...prev, value: value }))} required />
                <TextField label="توضیح" value={form.description} onChange={(value) => setForm((prev) => ({ ...prev, description: value }))} />
                <ToggleField label="فعال" checked={form.isActive} onChange={(value) => setForm((prev) => ({ ...prev, isActive: value }))} />
            </>
        )}
        table={<SimpleTable columns={["عنوان", "مقدار", "توضیح", "وضعیت", "عملیات"]} items={items} renderRow={(item) => (
            <tr key={item.id} className="text-gray-700 dark:text-gray-300">
                <td className="px-4 py-3 font-medium">{item.key}</td>
                <td className="px-4 py-3">{item.value}</td>
                <td className="px-4 py-3">{item.description || "-"}</td>
                <td className="px-4 py-3"><StatusPill tone={item.isActive ? "green" : "gray"}>{item.isActive ? "فعال" : "غیرفعال"}</StatusPill></td>
                <td className="px-4 py-3"><RowActions item={item} onEdit={onEdit} onToggle={onToggle} /></td>
            </tr>
        )} />}
    />
);

const SimpleSection = ({ title, formFields, table, onSubmit, saving, editing, onCancel }) => (
    <div className="space-y-5">
        <form onSubmit={onSubmit} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111]">
            <SectionHeading title={title} icon={Plus} />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{formFields}</div>
            <FormActions saving={saving} editing={editing} onCancel={onCancel} />
        </form>
        {table}
    </div>
);

const SimpleTable = ({ columns, items, renderRow }) => (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111]">
        <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-gray-900">
                    <tr>{columns.map((column) => <th key={column} className="px-4 py-3">{column}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {items.length === 0 && <TableMessage colSpan={columns.length} text="موردی برای نمایش وجود ندارد." />}
                    {items.map(renderRow)}
                </tbody>
            </table>
        </div>
    </div>
);

const RowActions = ({ item, onEdit, onToggle }) => (
    <div className="flex gap-2">
        <IconButton title="ویرایش" onClick={() => onEdit(item)} icon={Edit2} />
        <IconButton title={item.isActive ? "غیرفعال کردن" : "فعال کردن"} onClick={() => onToggle(item)} icon={item.isActive ? ToggleLeft : ToggleRight} />
    </div>
);

const SectionHeading = ({ title, icon: Icon }) => (
    <div className="mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
        <Icon size={18} />
        <h2 className="font-bold">{title}</h2>
    </div>
);

const TextField = ({ label, value, onChange, type = "text", required = false, step, placeholder }) => (
    <label className="space-y-1.5">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}{required && " *"}</span>
        <input
            type={type}
            value={value}
            required={required}
            step={step}
            placeholder={placeholder}
            min={type === "number" ? "0" : undefined}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-[#002874] focus:outline-none focus:ring-2 focus:ring-[#002874]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
    </label>
);

const SelectField = ({ label, value, onChange, required = false, children }) => (
    <label className="space-y-1.5">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}{required && " *"}</span>
        <select value={value} required={required} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-[#002874] focus:outline-none focus:ring-2 focus:ring-[#002874]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {children}
        </select>
    </label>
);

const TextareaField = ({ label, value, onChange, className = "", rows = 3, placeholder }) => (
    <label className={`space-y-1.5 ${className}`}>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <textarea
            rows={rows}
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-[#002874] focus:outline-none focus:ring-2 focus:ring-[#002874]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
    </label>
);

const ToggleField = ({ label, checked, onChange }) => (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2.5 dark:border-gray-700">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#002874]" />
    </label>
);

const FormActions = ({ saving, editing, onCancel }) => (
    <div className="mt-5 flex flex-wrap justify-end gap-2">
        {editing && (
            <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                <X size={16} />
                انصراف
            </button>
        )}
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#002874] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#001d5a] disabled:opacity-60">
            <Save size={17} />
            {saving ? "در حال ذخیره..." : editing ? "ذخیره ویرایش" : "ذخیره"}
        </button>
    </div>
);

const IconButton = ({ title, onClick, icon: Icon }) => (
    <button type="button" onClick={onClick} title={title} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#002874] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
        <Icon size={16} />
    </button>
);

const StatusPill = ({ tone = "gray", children }) => {
    const tones = {
        green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200",
        red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-200",
        gray: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    };
    return <span className={`inline-flex rounded-lg px-2 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
};

const TableMessage = ({ colSpan, text }) => (
    <tr>
        <td colSpan={colSpan} className="px-4 py-8 text-center text-sm text-gray-500">{text}</td>
    </tr>
);

export default AdminProducts;
