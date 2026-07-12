import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Bell,
  Boxes,
  ChevronLeft,
  ClipboardList,
  Clock3,
  CreditCard,
  Heart,
  Home,
  LayoutGrid,
  LogIn,
  LogOut,
  Menu,
  Minus,
  PackageCheck,
  PackagePlus,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Store,
  Trash2,
  Truck,
  UserRound
} from "lucide-react";
import {
  apiFetch,
  buildUrl,
  extractList,
  formatMoney,
  getGuestToken,
  getToken,
  normalizeProduct,
  setToken
} from "./api";

const fallbackImage = "/uploads/products/ecf2dc0f-9fa8-47f2-b127-ed4fd2557e6c.jpg";

const emptyLogin = { identifier: "", password: "" };
const emptyRegister = {
  username: "",
  name: "",
  lastName: "",
  nationalCode: "",
  phoneNumber: "",
  email: "",
  password: ""
};
const emptyProduct = { name: "", price: "", categoryId: "", brandId: "" };
const emptyCategory = { title: "" };
const emptyBrand = { name: "", description: "", logoUrl: "" };
const emptyAttribute = { productId: "", key: "", value: "", description: "" };
const emptyWarehouse = { name: "", code: "", address: "" };
const emptyStock = { warehouseId: "", productId: "", quantity: "", reorderLevel: "0" };
const emptyCheckout = {
  recipientName: "",
  recipientPhone: "",
  shippingAddress: "",
  shippingMethodCode: "standard",
  deliverySlotKey: ""
};

const fallbackShipping = {
  methods: [
    { code: "express", title: "ارسال سریع", description: "تحویل سریع شهری", cost: 75000 },
    { code: "standard", title: "ارسال عادی", description: "ارسال اقتصادی", cost: 45000 },
    { code: "pickup", title: "تحویل حضوری", description: "دریافت از انبار", cost: 0 }
  ],
  slots: Array.from({ length: 5 }).flatMap((_, day) => {
    const date = new Date();
    date.setDate(date.getDate() + day + 1);
    return ["09:00-12:00", "12:00-15:00", "15:00-18:00"].map((timeSlot) => ({
      date: date.toISOString(),
      timeSlot,
      label: `${date.toLocaleDateString("fa-IR")} - ${timeSlot}`
    }));
  })
};

export default function App() {
  const [view, setView] = useState("home");
  const [apiStatus, setApiStatus] = useState("checking");
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [registerForm, setRegisterForm] = useState(emptyRegister);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [shipping, setShipping] = useState(fallbackShipping);
  const [checkoutForm, setCheckoutForm] = useState(emptyCheckout);
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [brandForm, setBrandForm] = useState(emptyBrand);
  const [attributeForm, setAttributeForm] = useState(emptyAttribute);
  const [warehouseForm, setWarehouseForm] = useState(emptyWarehouse);
  const [stockForm, setStockForm] = useState(emptyStock);

  const cartCount = useMemo(() => cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0, [cart]);
  const cartTotal = useMemo(
    () => cart?.items?.reduce((sum, item) => sum + item.quantity * item.unitPriceSnapshot, 0) || 0,
    [cart]
  );
  const selectedShipping = useMemo(
    () => shipping.methods.find((method) => method.code === checkoutForm.shippingMethodCode) || shipping.methods[0],
    [checkoutForm.shippingMethodCode, shipping.methods]
  );
  const selectedSlot = useMemo(
    () => shipping.slots.find((slot) => slotKey(slot) === checkoutForm.deliverySlotKey),
    [checkoutForm.deliverySlotKey, shipping.slots]
  );
  const payableTotal = cartTotal + Number(selectedShipping?.cost || 0);
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === "all" || String(product.categoryId) === String(selectedCategory);
      const matchesSearch = !search.trim() || product.name?.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);
  const isAdminLike =
    user?.roles?.some((role) => /admin|مدیر/i.test(role)) ||
    user?.roleCodes?.some((role) => /admin/i.test(role));

  useEffect(() => {
    boot();
  }, []);

  useEffect(() => {
    if (!user) return;
    setCheckoutForm((current) => ({
      ...current,
      recipientName: current.recipientName || `${user.name || ""} ${user.lastName || ""}`.trim(),
      recipientPhone: current.recipientPhone || user.phoneNumber || ""
    }));
  }, [user]);

  async function boot() {
    await checkApi();
    await Promise.all([loadProducts(), loadCategories(), loadBrands(), loadShipping()]);
    if (getToken()) await loadMe();
    await loadCart({ silent: true });
  }

  async function checkApi() {
    try {
      setApiStatus("checking");
      await apiFetch("/health");
      setApiStatus("online");
    } catch {
      setApiStatus("offline");
    }
  }

  async function run(action, successText, options = {}) {
    setBusy(true);
    if (!options.keepMessage) setMessage("");
    try {
      const result = await action();
      if (successText) setMessage(successText);
      return result;
    } catch (error) {
      if (!options.silent) setMessage(error.message);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function loadMe() {
    const me = await run(() => apiFetch("/Auth/Me"), "", { silent: true });
    if (me) {
      setUser(me);
      await loadOrders();
    } else {
      setToken(null);
    }
  }

  async function loadProducts() {
    const query = new URLSearchParams({ page: "1", pageSize: "80" });
    const payload = await run(() => apiFetch(`/Product/getAllProductsWithCategories?${query}`), "", { silent: true });
    if (!payload) return;
    setProducts(extractList(payload, ["products", "Products"]).map(normalizeProduct).filter((p) => p.id));
  }

  async function loadCategories() {
    const payload = await run(() => apiFetch("/Category/getAllCategories?page=1&pageSize=100"), "", { silent: true });
    if (payload) setCategories(extractList(payload, ["categories", "Categories"]));
  }

  async function loadBrands() {
    const payload = await run(() => apiFetch("/Brand/getAllBrandsResponseDto?page=1&pageSize=100"), "", { silent: true });
    if (payload) setBrands(extractList(payload, ["brands", "Brands"]));
  }

  async function loadShipping() {
    const payload = await run(() => apiFetch("/Shipping/options"), "", { silent: true });
    if (payload?.methods?.length) {
      setShipping({
        methods: payload.methods,
        slots: payload.slots?.length ? payload.slots : fallbackShipping.slots
      });
      setCheckoutForm((current) => ({
        ...current,
        deliverySlotKey: current.deliverySlotKey || slotKey(payload.slots?.[0] || fallbackShipping.slots[0])
      }));
    }
  }

  async function loadWarehouses() {
    const payload = await run(() => apiFetch("/Inventory/warehouses?page=1&pageSize=100"));
    if (payload) setWarehouses(extractList(payload, ["warehouses"]));
  }

  async function loadOrders() {
    if (!getToken()) return;
    const payload = await run(() => apiFetch("/Order/my-orders?page=1&pageSize=20"), "", { silent: true });
    if (payload) setOrders(extractList(payload, ["ordersAndItems", "OrdersAndItems", "orders"]));
  }

  function cartQuery(account = user) {
    if (account?.id) return `userId=${account.id}`;
    return `guestToken=${encodeURIComponent(getGuestToken())}`;
  }

  async function loadCart(options = {}) {
    const loaded = await run(() => apiFetch(`/Cart?${cartQuery(options.user)}`), "", { silent: options.silent });
    setCart(loaded?.id ? loaded : null);
  }

  async function getGuestCartSnapshot() {
    try {
      return await apiFetch(`/Cart?guestToken=${encodeURIComponent(getGuestToken())}`, { skipAuth: true });
    } catch {
      return null;
    }
  }

  async function mergeGuestCartToUser(account, guestCart) {
    if (!account?.id || !guestCart?.items?.length) return;

    for (const item of guestCart.items) {
      await apiFetch(`/Cart/items?userId=${account.id}`, {
        method: "POST",
        body: {
          productId: item.productId,
          quantity: item.quantity
        }
      });
    }

    try {
      await apiFetch(`/Cart/clear?guestToken=${encodeURIComponent(getGuestToken())}`, {
        method: "DELETE",
        skipAuth: true
      });
    } catch {
      // The merge already succeeded; a stale guest cart should not block login.
    }
  }

  async function addToCart(productId) {
    await run(
      () => apiFetch(`/Cart/items?${cartQuery()}`, { method: "POST", body: { productId, quantity: 1 } }),
      "محصول به سبد اضافه شد."
    );
    await loadCart({ silent: true });
  }

  async function updateCartItem(itemId, quantity) {
    if (quantity <= 0) return removeCartItem(itemId);
    const loaded = await run(() =>
      apiFetch(`/Cart/items/${itemId}?${cartQuery()}`, { method: "PUT", body: { quantity } })
    );
    if (loaded) setCart(loaded);
  }

  async function removeCartItem(itemId) {
    const loaded = await run(() => apiFetch(`/Cart/items/${itemId}?${cartQuery()}`, { method: "DELETE" }));
    setCart(loaded?.id ? loaded : null);
  }

  async function checkout(event) {
    event.preventDefault();
    if (!user) {
      setView("account");
      setMessage("برای ثبت سفارش وارد حساب کاربری شوید.");
      return;
    }

    const result = await run(
      () =>
        apiFetch("/Cart/checkout", {
          method: "POST",
          body: {
            recipientName: checkoutForm.recipientName,
            recipientPhone: checkoutForm.recipientPhone,
            shippingAddress: checkoutForm.shippingAddress,
            shippingMethodCode: checkoutForm.shippingMethodCode,
            deliveryDate: selectedSlot?.date,
            deliveryTimeSlot: selectedSlot?.timeSlot
          }
        }),
      "سفارش ثبت شد."
    );

    if (!result) return;
    setTrackingCode(result.trackingCode || "");
    setCheckoutForm(emptyCheckout);
    setCart(null);
    await Promise.all([loadCart({ silent: true }), loadOrders()]);
    setView("orders");
  }

  async function login(event) {
    event.preventDefault();
    const identifier = loginForm.identifier.trim();
    const guestCart = cart?.items?.length ? cart : await getGuestCartSnapshot();
    const result = await run(
      () =>
        apiFetch("/Auth/Login", {
          method: "POST",
          body: {
            username: identifier,
            email: identifier.includes("@") ? identifier : null,
            password: loginForm.password
          }
        }),
      "ورود انجام شد."
    );
    if (!result?.token) return;
    setToken(result.token);
    setUser(result.user);
    await mergeGuestCartToUser(result.user, guestCart);
    setLoginForm(emptyLogin);
    await Promise.all([loadCart({ silent: true, user: result.user }), loadOrders()]);
    setView("home");
  }

  async function register(event) {
    event.preventDefault();
    const result = await run(
      () => apiFetch("/Auth/Register", { method: "POST", body: registerForm }),
      "ثبت نام انجام شد. حالا می‌توانید وارد شوید."
    );
    if (!result) return;
    setLoginForm({ identifier: registerForm.username || registerForm.email, password: registerForm.password });
    setRegisterForm(emptyRegister);
  }

  function logout() {
    setToken(null);
    setUser(null);
    setCart(null);
    setOrders([]);
    setMessage("خروج انجام شد.");
    loadCart({ silent: true });
  }

  async function trackOrder(event) {
    event.preventDefault();
    const code = trackingCode.trim();
    if (!code) return;
    const payload = await run(() => apiFetch(`/Order/track/${encodeURIComponent(code)}`));
    if (payload) setTrackingResult(payload);
  }

  async function createCategory(event) {
    event.preventDefault();
    await run(() => apiFetch("/Category/createCategory", { method: "POST", body: categoryForm }), "دسته بندی ساخته شد.");
    setCategoryForm(emptyCategory);
    await loadCategories();
  }

  async function createProduct(event) {
    event.preventDefault();
    await run(
      () =>
        apiFetch("/Product/CreateProduct", {
          method: "POST",
          body: {
            name: productForm.name,
            price: Number(productForm.price),
            categoryId: Number(productForm.categoryId),
            brandId: productForm.brandId ? Number(productForm.brandId) : null
          }
        }),
      "محصول ساخته شد."
    );
    setProductForm(emptyProduct);
    await loadProducts();
  }

  async function createBrand(event) {
    event.preventDefault();
    await run(
      () =>
        apiFetch("/Brand/CreateBrand", {
          method: "POST",
          body: {
            name: brandForm.name,
            description: brandForm.description || "برند فروشگاه",
            logoUrl: brandForm.logoUrl || "https://example.com/logo.png"
          }
        }),
      "برند ساخته شد."
    );
    setBrandForm(emptyBrand);
    await loadBrands();
  }

  async function createAttribute(event) {
    event.preventDefault();
    await run(
      () =>
        apiFetch("/ProductAttribute", {
          method: "POST",
          body: {
            productId: Number(attributeForm.productId),
            key: attributeForm.key,
            value: attributeForm.value,
            description: attributeForm.description || attributeForm.key
          }
        }),
      "ویژگی محصول ثبت شد."
    );
    setAttributeForm(emptyAttribute);
  }

  async function createWarehouse(event) {
    event.preventDefault();
    await run(() => apiFetch("/Inventory/warehouses", { method: "POST", body: warehouseForm }), "انبار ساخته شد.");
    setWarehouseForm(emptyWarehouse);
    await loadWarehouses();
  }

  async function setStock(event) {
    event.preventDefault();
    await run(
      () =>
        apiFetch("/Inventory/stock/set", {
          method: "POST",
          body: {
            warehouseId: Number(stockForm.warehouseId),
            productId: Number(stockForm.productId),
            quantity: Number(stockForm.quantity),
            reorderLevel: Number(stockForm.reorderLevel || 0)
          }
        }),
      "موجودی ثبت شد."
    );
    setStockForm(emptyStock);
  }

  function saveField(setter, key) {
    return (event) => setter((current) => ({ ...current, [key]: event.target.value }));
  }

  return (
    <main className="market">
      <TopHeader
        user={user}
        view={view}
        setView={setView}
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        apiStatus={apiStatus}
      />

      {message && <div className="toast">{message}</div>}
      {busy && <div className="loading-line" />}

      {view === "home" && (
        <Storefront
          products={filteredProducts}
          categories={categories}
          brands={brands}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          addToCart={addToCart}
          setView={setView}
        />
      )}

      {view === "cart" && (
        <CartView
          cart={cart}
          cartTotal={cartTotal}
          shippingCost={Number(selectedShipping?.cost || 0)}
          payableTotal={payableTotal}
          user={user}
          loadCart={loadCart}
          updateCartItem={updateCartItem}
          removeCartItem={removeCartItem}
          setView={setView}
        />
      )}

      {view === "checkout" && (
        <CheckoutView
          cart={cart}
          cartTotal={cartTotal}
          payableTotal={payableTotal}
          shipping={shipping}
          checkoutForm={checkoutForm}
          selectedShipping={selectedShipping}
          setCheckoutForm={setCheckoutForm}
          saveField={saveField}
          checkout={checkout}
          user={user}
          setView={setView}
        />
      )}

      {view === "orders" && (
        <OrdersView
          orders={orders}
          trackingCode={trackingCode}
          setTrackingCode={setTrackingCode}
          trackingResult={trackingResult}
          trackOrder={trackOrder}
          loadOrders={loadOrders}
        />
      )}

      {view === "account" && (
        <AccountView
          user={user}
          loginForm={loginForm}
          registerForm={registerForm}
          setLoginForm={setLoginForm}
          setRegisterForm={setRegisterForm}
          saveField={saveField}
          login={login}
          register={register}
          logout={logout}
          setView={setView}
        />
      )}

      {view === "admin" && (
        <AdminView
          isAdminLike={isAdminLike}
          categories={categories}
          products={products}
          brands={brands}
          warehouses={warehouses}
          categoryForm={categoryForm}
          productForm={productForm}
          brandForm={brandForm}
          attributeForm={attributeForm}
          warehouseForm={warehouseForm}
          stockForm={stockForm}
          setCategoryForm={setCategoryForm}
          setProductForm={setProductForm}
          setBrandForm={setBrandForm}
          setAttributeForm={setAttributeForm}
          setWarehouseForm={setWarehouseForm}
          setStockForm={setStockForm}
          saveField={saveField}
          createCategory={createCategory}
          createProduct={createProduct}
          createBrand={createBrand}
          createAttribute={createAttribute}
          createWarehouse={createWarehouse}
          setStock={setStock}
          loadWarehouses={loadWarehouses}
        />
      )}
    </main>
  );
}

function TopHeader({ user, view, setView, search, setSearch, cartCount, apiStatus }) {
  return (
    <header className="site-header">
      <div className="header-main">
        <button className="icon-action menu-button" type="button" title="دسته بندی‌ها">
          <Menu size={21} />
        </button>
        <button className="logo-button" type="button" onClick={() => setView("home")}>
          <Store size={26} />
          <span>StoreKala</span>
        </button>
        <label className="global-search">
          <Search size={20} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="جستجو در محصولات"
          />
        </label>
        <nav className="header-actions">
          <button className={`icon-action ${view === "orders" ? "active" : ""}`} onClick={() => setView("orders")} title="اعلان‌ها و سفارش‌ها">
            <Bell size={21} />
          </button>
          <button className={`text-action login-entry ${view === "account" ? "active" : ""}`} onClick={() => setView("account")}>
            <LogIn size={20} />
            <span>{user ? user.username || user.name : "ورود | ثبت‌نام"}</span>
          </button>
          <span className="action-divider" />
          <button className={`cart-action ${view === "cart" ? "active" : ""}`} onClick={() => setView("cart")} title="سبد خرید">
            <ShoppingCart size={21} />
            <span>{cartCount}</span>
          </button>
        </nav>
      </div>
      <div className="header-nav">
        <button onClick={() => setView("home")} className={view === "home" ? "active" : ""}>
          <Home size={17} /> خانه
        </button>
        <button onClick={() => setView("orders")} className={view === "orders" ? "active" : ""}>
          <PackageCheck size={17} /> پیگیری سفارش
        </button>
        <button onClick={() => setView("admin")} className={view === "admin" ? "active" : ""}>
          <Settings size={17} /> مدیریت
        </button>
        <span className={`api-dot ${apiStatus}`}>{apiStatus === "online" ? "API آنلاین" : "API آفلاین"}</span>
      </div>
    </header>
  );
}

function Storefront({
  products,
  categories,
  brands,
  selectedCategory,
  setSelectedCategory,
  addToCart,
  setView
}) {
  return (
    <section className="shop-grid">
      <aside className="category-rail">
        <div className="rail-title">
          <LayoutGrid size={18} />
          <span>دسته‌ها</span>
        </div>
        <button className={selectedCategory === "all" ? "active" : ""} onClick={() => setSelectedCategory("all")}>
          همه کالاها
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={String(selectedCategory) === String(category.id) ? "active" : ""}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.title || category.name}
          </button>
        ))}
      </aside>

      <section className="store-content">
        <div className="promo-strip">
          <div>
            <strong>پیشنهادهای امروز</strong>
            <span>ارسال زمان‌بندی‌شده، سبد خرید سریع و رهگیری سفارش</span>
          </div>
          <button onClick={() => setView("cart")}>
            مشاهده سبد <ChevronLeft size={17} />
          </button>
        </div>

        <div className="quick-row">
          <div><Truck size={20} /> ارسال سریع</div>
          <div><BadgeCheck size={20} /> ضمانت اصالت</div>
          <div><CreditCard size={20} /> پرداخت امن</div>
          <div><Bell size={20} /> پیگیری لحظه‌ای</div>
        </div>

        <div className="section-head">
          <h1>کالاهای فروشگاه</h1>
          <div className="filter-chip">
            <SlidersHorizontal size={17} />
            <span>{products.length} کالا</span>
          </div>
        </div>

        <div className="brand-ribbon">
          {(brands.length ? brands : [{ id: "local", name: "StoreKala" }]).slice(0, 8).map((brand) => (
            <span key={brand.id}>{brand.name || brand.title}</span>
          ))}
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </section>
    </section>
  );
}

function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card">
      <button className="favorite" title="علاقه‌مندی">
        <Heart size={18} />
      </button>
      <img src={product.imageUrl || buildUrl(fallbackImage)} alt={product.name} />
      <div className="product-info">
        <div className="rating"><Star size={15} /> ۴.۶</div>
        <h2>{product.name}</h2>
        <p>{product.categoryName}</p>
        <div className="product-footer">
          <strong>{formatMoney(product.price)} <small>تومان</small></strong>
          <button onClick={() => addToCart(product.id)} title="افزودن به سبد">
            <Plus size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

function CartView({ cart, cartTotal, shippingCost, payableTotal, user, loadCart, updateCartItem, removeCartItem, setView }) {
  const hasItems = Boolean(cart?.items?.length);
  return (
    <section className="checkout-layout">
      <div className="basket-panel">
        <div className="panel-heading">
          <h1>سبد خرید</h1>
          <button className="icon-action" onClick={() => loadCart()} title="بروزرسانی">
            <RefreshCw size={17} />
          </button>
        </div>
        {!hasItems ? (
          <div className="empty-box">
            <ShoppingCart size={36} />
            <strong>سبد خرید خالی است</strong>
            <button onClick={() => setView("home")}>بازگشت به فروشگاه</button>
          </div>
        ) : (
          <div className="cart-list">
            {cart.items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={buildUrl(fallbackImage)} alt={item.productName} />
                <div className="cart-title">
                  <strong>{item.productName}</strong>
                  <span>{formatMoney(item.unitPriceSnapshot)} تومان</span>
                </div>
                <div className="quantity-box">
                  <button onClick={() => updateCartItem(item.id, item.quantity + 1)} title="افزایش">
                    <Plus size={15} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateCartItem(item.id, item.quantity - 1)} title="کاهش">
                    <Minus size={15} />
                  </button>
                  <button onClick={() => removeCartItem(item.id)} title="حذف">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <OrderSummary
        cartTotal={cartTotal}
        shippingCost={shippingCost}
        payableTotal={payableTotal}
        disabled={!hasItems}
        actionText={user ? "ادامه ثبت سفارش" : "ورود و ادامه"}
        onAction={() => setView(user ? "checkout" : "account")}
      />
    </section>
  );
}

function CheckoutView({
  cart,
  cartTotal,
  payableTotal,
  shipping,
  checkoutForm,
  selectedShipping,
  setCheckoutForm,
  saveField,
  checkout,
  user,
  setView
}) {
  if (!cart?.items?.length) {
    return (
      <section className="empty-box page-empty">
        <ShoppingCart size={36} />
        <strong>برای ثبت سفارش ابتدا کالا انتخاب کنید</strong>
        <button onClick={() => setView("home")}>رفتن به فروشگاه</button>
      </section>
    );
  }

  return (
    <section className="checkout-layout">
      <form className="delivery-panel" onSubmit={checkout}>
        <div className="panel-heading">
          <h1>انتخاب زمان و روش ارسال</h1>
          <Truck size={22} />
        </div>

        <div className="form-grid">
          <label>
            <span>نام گیرنده</span>
            <input value={checkoutForm.recipientName} onChange={saveField(setCheckoutForm, "recipientName")} required />
          </label>
          <label>
            <span>شماره تماس</span>
            <input value={checkoutForm.recipientPhone} onChange={saveField(setCheckoutForm, "recipientPhone")} required />
          </label>
          <label className="wide">
            <span>آدرس تحویل</span>
            <textarea value={checkoutForm.shippingAddress} onChange={saveField(setCheckoutForm, "shippingAddress")} required />
          </label>
        </div>

        <div className="option-grid">
          {shipping.methods.map((method) => (
            <label className={`choice-card ${checkoutForm.shippingMethodCode === method.code ? "selected" : ""}`} key={method.code}>
              <input
                type="radio"
                name="shipping"
                value={method.code}
                checked={checkoutForm.shippingMethodCode === method.code}
                onChange={saveField(setCheckoutForm, "shippingMethodCode")}
              />
              <Truck size={20} />
              <strong>{method.title}</strong>
              <span>{method.description}</span>
              <em>{formatMoney(method.cost)} تومان</em>
            </label>
          ))}
        </div>

        <label className="slot-select">
          <Clock3 size={20} />
          <select value={checkoutForm.deliverySlotKey} onChange={saveField(setCheckoutForm, "deliverySlotKey")} required>
            <option value="">انتخاب بازه تحویل</option>
            {shipping.slots.map((slot) => (
              <option key={slotKey(slot)} value={slotKey(slot)}>
                {slot.label || `${formatDate(slot.date)} - ${slot.timeSlot}`}
              </option>
            ))}
          </select>
        </label>

        <button className="primary-button" type="submit" disabled={!user}>
          <CreditCard size={19} /> ثبت نهایی سفارش
        </button>
      </form>

      <OrderSummary
        cartTotal={cartTotal}
        shippingCost={Number(selectedShipping?.cost || 0)}
        payableTotal={payableTotal}
        disabled={false}
        actionText="بازگشت به سبد"
        onAction={() => setView("cart")}
        passive
      />
    </section>
  );
}

function OrderSummary({ cartTotal, shippingCost, payableTotal, disabled, actionText, onAction, passive = false }) {
  return (
    <aside className="summary-card">
      <h2>خلاصه سفارش</h2>
      <div><span>جمع کالاها</span><strong>{formatMoney(cartTotal)} تومان</strong></div>
      <div><span>ارسال</span><strong>{formatMoney(shippingCost)} تومان</strong></div>
      <div className="payable"><span>قابل پرداخت</span><strong>{formatMoney(payableTotal)} تومان</strong></div>
      <button className={passive ? "secondary-button" : "primary-button"} disabled={disabled} onClick={onAction}>
        {passive ? <ChevronLeft size={18} /> : <CreditCard size={18} />} {actionText}
      </button>
    </aside>
  );
}

function OrdersView({ orders, trackingCode, setTrackingCode, trackingResult, trackOrder, loadOrders }) {
  return (
    <section className="orders-page">
      <div className="tracking-card">
        <div className="panel-heading">
          <h1>پیگیری سفارش</h1>
          <button className="icon-action" onClick={loadOrders} title="بروزرسانی">
            <RefreshCw size={17} />
          </button>
        </div>
        <form className="tracking-form" onSubmit={trackOrder}>
          <input value={trackingCode} onChange={(event) => setTrackingCode(event.target.value)} placeholder="کد رهگیری" />
          <button className="primary-button" type="submit">
            <PackageCheck size={18} /> رهگیری
          </button>
        </form>
        {trackingResult && (
          <div className="timeline">
            {trackingResult.steps?.map((step) => (
              <div className={`timeline-step ${step.done ? "done" : ""} ${step.current ? "current" : ""}`} key={step.code}>
                <span />
                <strong>{step.title}</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="order-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div>
              <strong>سفارش #{order.id}</strong>
              <span>{formatDate(order.orderDate)} | {statusLabel(order.status)}</span>
            </div>
            <div>
              <span>{order.trackingCode}</span>
              <button onClick={() => setTrackingCode(order.trackingCode)}>کپی برای رهگیری</button>
            </div>
            <div>
              <Truck size={18} />
              <span>{shippingLabel(order.shippingMethod)} - {formatDate(order.deliveryDate)} - {order.deliveryTimeSlot}</span>
            </div>
            <strong>{formatMoney(order.totalAmount)} تومان</strong>
          </article>
        ))}
        {!orders.length && (
          <div className="empty-box">
            <ClipboardList size={34} />
            <strong>هنوز سفارشی ثبت نشده است</strong>
          </div>
        )}
      </div>
    </section>
  );
}

function AccountView({ user, loginForm, registerForm, setLoginForm, setRegisterForm, saveField, login, register, logout, setView }) {
  const [authMode, setAuthMode] = useState("login");

  if (user) {
    return (
      <section className="account-page">
        <div className="profile-card">
          <UserRound size={38} />
          <h1>{user.name} {user.lastName}</h1>
          <p>{user.username}</p>
          <div className="profile-meta">
            <span>{user.phoneNumber || "بدون شماره"}</span>
            <span>{user.email || "بدون ایمیل"}</span>
          </div>
          <button className="danger-button" onClick={logout}>
            <LogOut size={18} /> خروج
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <form className={`auth-card auth-entry-card ${authMode === "register" ? "register-mode" : ""}`} onSubmit={authMode === "login" ? login : register}>
        <button className="auth-back" type="button" onClick={() => setView("home")} title="بازگشت">
          <ChevronLeft size={24} />
        </button>

        <div className="auth-logo">
          <Store size={34} />
          <strong>StoreKala</strong>
        </div>

        <div className="auth-tabs">
          <button type="button" className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>
            ورود
          </button>
          <button type="button" className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>
            ثبت‌نام
          </button>
        </div>

        {authMode === "login" ? (
          <>
            <div className="auth-copy">
              <h1>ورود یا ثبت‌نام در StoreKala</h1>
              <p>لطفا نام کاربری یا ایمیل و رمز عبور خود را وارد کنید</p>
            </div>
            <label className="floating-field">
              <span>نام کاربری یا ایمیل</span>
              <input value={loginForm.identifier} onChange={saveField(setLoginForm, "identifier")} required autoFocus />
            </label>
            <label className="floating-field">
              <span>رمز عبور</span>
              <input type="password" value={loginForm.password} onChange={saveField(setLoginForm, "password")} required />
            </label>
          </>
        ) : (
          <>
            <div className="auth-copy">
              <h1>ساخت حساب کاربری</h1>
              <p>برای ورود بعدی، نام کاربری یا ایمیل و رمز عبور را استفاده می‌کنید</p>
            </div>
            <div className="register-fields">
              <label className="floating-field">
                <span>نام کاربری</span>
                <input value={registerForm.username} onChange={saveField(setRegisterForm, "username")} required autoFocus />
              </label>
              <label className="floating-field">
                <span>ایمیل</span>
                <input type="email" value={registerForm.email} onChange={saveField(setRegisterForm, "email")} required />
              </label>
              <label className="floating-field">
                <span>نام</span>
                <input value={registerForm.name} onChange={saveField(setRegisterForm, "name")} required />
              </label>
              <label className="floating-field">
                <span>نام خانوادگی</span>
                <input value={registerForm.lastName} onChange={saveField(setRegisterForm, "lastName")} required />
              </label>
              <label className="floating-field">
                <span>شماره موبایل</span>
                <input value={registerForm.phoneNumber} onChange={saveField(setRegisterForm, "phoneNumber")} />
              </label>
              <label className="floating-field">
                <span>رمز عبور</span>
                <input type="password" value={registerForm.password} onChange={saveField(setRegisterForm, "password")} required />
              </label>
            </div>
          </>
        )}

        <button className="primary-button" type="submit">
          <LogIn size={18} /> {authMode === "login" ? "ورود به StoreKala" : "ثبت‌نام در StoreKala"}
        </button>
        <p className="auth-terms">
          ورود شما به معنای پذیرش <span>شرایط StoreKala</span> و <span>قوانین حریم خصوصی</span> است.
        </p>
      </form>
    </section>
  );
}

function AdminView(props) {
  const {
    isAdminLike,
    categories,
    products,
    brands,
    warehouses,
    categoryForm,
    productForm,
    brandForm,
    attributeForm,
    warehouseForm,
    stockForm,
    setCategoryForm,
    setProductForm,
    setBrandForm,
    setAttributeForm,
    setWarehouseForm,
    setStockForm,
    saveField,
    createCategory,
    createProduct,
    createBrand,
    createAttribute,
    createWarehouse,
    setStock,
    loadWarehouses
  } = props;

  return (
    <section className="admin-page">
      <div className="admin-banner">
        <Settings size={22} />
        <span>{isAdminLike ? "پنل مدیریت فروشگاه" : "برای عملیات مدیریتی توکن مجوزدار لازم است"}</span>
      </div>

      <form className="admin-card" onSubmit={createProduct}>
        <div className="panel-heading">
          <h2>محصول</h2>
          <PackagePlus size={18} />
        </div>
        <input placeholder="نام" value={productForm.name} onChange={saveField(setProductForm, "name")} required />
        <input placeholder="قیمت" type="number" value={productForm.price} onChange={saveField(setProductForm, "price")} required />
        <select value={productForm.categoryId} onChange={saveField(setProductForm, "categoryId")} required>
          <option value="">دسته بندی</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.title}</option>
          ))}
        </select>
        <select value={productForm.brandId} onChange={saveField(setProductForm, "brandId")}>
          <option value="">برند</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>
        <button className="primary-button" type="submit"><Plus size={17} /> ثبت محصول</button>
      </form>

      <form className="admin-card" onSubmit={createCategory}>
        <div className="panel-heading">
          <h2>دسته بندی</h2>
          <LayoutGrid size={18} />
        </div>
        <input placeholder="عنوان" value={categoryForm.title} onChange={saveField(setCategoryForm, "title")} required />
        <button className="primary-button" type="submit"><Plus size={17} /> ثبت دسته</button>
      </form>

      <form className="admin-card" onSubmit={createBrand}>
        <div className="panel-heading">
          <h2>برند</h2>
          <BadgeCheck size={18} />
        </div>
        <input placeholder="نام برند" value={brandForm.name} onChange={saveField(setBrandForm, "name")} required />
        <input placeholder="توضیحات" value={brandForm.description} onChange={saveField(setBrandForm, "description")} />
        <input placeholder="آدرس لوگو" value={brandForm.logoUrl} onChange={saveField(setBrandForm, "logoUrl")} />
        <button className="primary-button" type="submit"><Plus size={17} /> ثبت برند</button>
      </form>

      <form className="admin-card" onSubmit={createAttribute}>
        <div className="panel-heading">
          <h2>ویژگی محصول</h2>
          <SlidersHorizontal size={18} />
        </div>
        <select value={attributeForm.productId} onChange={saveField(setAttributeForm, "productId")} required>
          <option value="">محصول</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
        <input placeholder="عنوان ویژگی مثل رم" value={attributeForm.key} onChange={saveField(setAttributeForm, "key")} required />
        <input placeholder="مقدار مثل ۸ گیگابایت" value={attributeForm.value} onChange={saveField(setAttributeForm, "value")} required />
        <input placeholder="توضیحات" value={attributeForm.description} onChange={saveField(setAttributeForm, "description")} />
        <button className="primary-button" type="submit"><Plus size={17} /> ثبت ویژگی</button>
      </form>

      <form className="admin-card" onSubmit={createWarehouse}>
        <div className="panel-heading">
          <h2>انبار</h2>
          <Boxes size={18} />
        </div>
        <input placeholder="نام" value={warehouseForm.name} onChange={saveField(setWarehouseForm, "name")} required />
        <input placeholder="کد" value={warehouseForm.code} onChange={saveField(setWarehouseForm, "code")} required />
        <input placeholder="آدرس" value={warehouseForm.address} onChange={saveField(setWarehouseForm, "address")} />
        <button className="primary-button" type="submit"><Plus size={17} /> ثبت انبار</button>
      </form>

      <form className="admin-card" onSubmit={setStock}>
        <div className="panel-heading">
          <h2>موجودی</h2>
          <button type="button" className="icon-action" onClick={loadWarehouses} title="بروزرسانی">
            <RefreshCw size={16} />
          </button>
        </div>
        <select value={stockForm.warehouseId} onChange={saveField(setStockForm, "warehouseId")} required>
          <option value="">انبار</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
          ))}
        </select>
        <select value={stockForm.productId} onChange={saveField(setStockForm, "productId")} required>
          <option value="">محصول</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
        <input placeholder="موجودی" type="number" value={stockForm.quantity} onChange={saveField(setStockForm, "quantity")} required />
        <input placeholder="حد سفارش مجدد" type="number" value={stockForm.reorderLevel} onChange={saveField(setStockForm, "reorderLevel")} />
        <button className="primary-button" type="submit"><Plus size={17} /> ثبت موجودی</button>
      </form>
    </section>
  );
}

function slotKey(slot) {
  if (!slot) return "";
  return `${slot.date}|${slot.timeSlot}`;
}

function formatDate(value) {
  if (!value) return "نامشخص";
  return new Date(value).toLocaleDateString("fa-IR");
}

function statusLabel(status) {
  const labels = {
    Pending: "ثبت شده",
    Processing: "در حال پردازش",
    ReadyToShip: "آماده ارسال",
    Shipped: "ارسال شده",
    InTransit: "در مسیر",
    Delivered: "تحویل شده",
    Cancelled: "لغو شده"
  };
  return labels[status] || status;
}

function shippingLabel(code) {
  const labels = {
    express: "ارسال سریع",
    standard: "ارسال عادی",
    pickup: "تحویل حضوری"
  };
  return labels[code] || code;
}
