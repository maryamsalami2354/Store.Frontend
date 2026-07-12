import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Boxes,
  CreditCard,
  Database,
  LayoutGrid,
  LogIn,
  LogOut,
  Minus,
  PackagePlus,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Store,
  Trash2,
  UserRound
} from "lucide-react";
import {
  apiFetch,
  buildUrl,
  extractList,
  formatMoney,
  getApiBase,
  getGuestToken,
  getToken,
  normalizeProduct,
  setApiBase,
  setToken
} from "./api";

const fallbackImage = "/uploads/products/ecf2dc0f-9fa8-47f2-b127-ed4fd2557e6c.jpg";

const emptyLogin = { phoneNumber: "", password: "" };
const emptyRegister = {
  name: "",
  lastName: "",
  nationalCode: "",
  phoneNumber: "",
  email: "",
  password: ""
};
const emptyProduct = { name: "", price: "", categoryId: "" };
const emptyCategory = { title: "" };
const emptyWarehouse = { name: "", code: "", address: "" };
const emptyStock = { warehouseId: "", productId: "", quantity: "", reorderLevel: "0" };

export default function App() {
  const [view, setView] = useState("store");
  const [apiBaseInput, setApiBaseInput] = useState(getApiBase());
  const [apiStatus, setApiStatus] = useState("checking");
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [registerForm, setRegisterForm] = useState(emptyRegister);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [cart, setCart] = useState(null);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [warehouseForm, setWarehouseForm] = useState(emptyWarehouse);
  const [stockForm, setStockForm] = useState(emptyStock);

  const cartCount = useMemo(() => cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0, [cart]);
  const cartTotal = useMemo(
    () => cart?.items?.reduce((sum, item) => sum + item.quantity * item.unitPriceSnapshot, 0) || 0,
    [cart]
  );
  const isAdminLike = user?.roles?.some((role) => /admin|مدیر/i.test(role)) || user?.roleCodes?.some((role) => /admin/i.test(role));

  useEffect(() => {
    boot();
  }, []);

  async function boot() {
    await checkApi();
    await Promise.all([loadProducts(), loadCategories(), loadBrands()]);
    if (getToken()) await loadMe();
    await loadCart();
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

  async function run(action, successText) {
    setBusy(true);
    setMessage("");
    try {
      const result = await action();
      if (successText) setMessage(successText);
      return result;
    } catch (error) {
      setMessage(error.message);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function loadMe() {
    const me = await run(() => apiFetch("/Auth/Me"));
    if (me) setUser(me);
  }

  async function loadProducts() {
    const query = new URLSearchParams({ page: "1", pageSize: "48" });
    if (search.trim()) query.set("search", search.trim());
    const payload = await run(() => apiFetch(`/Product/getAllProductsWithCategories?${query}`));
    if (!payload) return;
    setProducts(extractList(payload, ["products", "Products"]).map(normalizeProduct).filter((p) => p.id));
  }

  async function loadCategories() {
    const payload = await run(() => apiFetch("/Category/getAllCategories?page=1&pageSize=100"));
    if (payload) setCategories(extractList(payload, ["categories", "Categories"]));
  }

  async function loadBrands() {
    const payload = await run(() => apiFetch("/Brand/getAllBrandsResponseDto?page=1&pageSize=100"));
    if (payload) setBrands(extractList(payload, ["brands", "Brands"]));
  }

  async function loadWarehouses() {
    const payload = await run(() => apiFetch("/Inventory/warehouses?page=1&pageSize=100"));
    if (payload) setWarehouses(extractList(payload, ["warehouses"]));
  }

  function cartQuery() {
    if (user?.id) return `userId=${user.id}`;
    return `guestToken=${encodeURIComponent(getGuestToken())}`;
  }

  async function loadCart() {
    const loaded = await run(() => apiFetch(`/Cart?${cartQuery()}`));
    setCart(loaded?.id ? loaded : null);
  }

  async function addToCart(productId) {
    await run(
      () => apiFetch(`/Cart/items?${cartQuery()}`, { method: "POST", body: { productId, quantity: 1 } }),
      "محصول به سبد اضافه شد."
    );
    await loadCart();
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

  async function checkout() {
    const result = await run(() => apiFetch("/Cart/checkout", { method: "POST" }), "سفارش ثبت شد.");
    if (result) await loadCart();
  }

  async function login(event) {
    event.preventDefault();
    const result = await run(() => apiFetch("/Auth/Login", { method: "POST", body: loginForm }), "ورود انجام شد.");
    if (!result?.token) return;
    setToken(result.token);
    setUser(result.user);
    setLoginForm(emptyLogin);
    await loadCart();
  }

  async function register(event) {
    event.preventDefault();
    const result = await run(() => apiFetch("/Auth/Register", { method: "POST", body: registerForm }), "ثبت نام انجام شد.");
    if (result) {
      setRegisterForm(emptyRegister);
      setLoginForm({ phoneNumber: registerForm.phoneNumber, password: registerForm.password });
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    setCart(null);
    setMessage("خروج انجام شد.");
    loadCart();
  }

  async function saveApiBase(event) {
    event.preventDefault();
    setApiBase(apiBaseInput);
    await boot();
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
            categoryId: Number(productForm.categoryId)
          }
        }),
      "محصول ساخته شد."
    );
    setProductForm(emptyProduct);
    await loadProducts();
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
    <main className="shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="mark">
            <Store size={24} />
          </div>
          <div>
            <h1>Store Console</h1>
            <p>{apiStatus === "online" ? "API online" : apiStatus === "offline" ? "API offline" : "Checking API"}</p>
          </div>
        </div>

        <nav className="view-tabs" aria-label="Main navigation">
          <button className={view === "store" ? "active" : ""} onClick={() => setView("store")}>
            <LayoutGrid size={18} /> فروشگاه
          </button>
          <button className={view === "cart" ? "active" : ""} onClick={() => setView("cart")}>
            <ShoppingCart size={18} /> سبد <span>{cartCount}</span>
          </button>
          <button className={view === "admin" ? "active" : ""} onClick={() => { setView("admin"); loadWarehouses(); }}>
            <Settings size={18} /> مدیریت
          </button>
          <button className={view === "account" ? "active" : ""} onClick={() => setView("account")}>
            <UserRound size={18} /> حساب
          </button>
        </nav>
      </header>

      <section className="status-line">
        <form className="api-form" onSubmit={saveApiBase}>
          <Database size={17} />
          <input value={apiBaseInput} onChange={(e) => setApiBaseInput(e.target.value)} />
          <button type="submit" title="ذخیره API">
            <RefreshCw size={16} />
          </button>
        </form>
        <div className="session-chip">
          {user ? <BadgeCheck size={17} /> : <ShieldCheck size={17} />}
          <span>{user ? `${user.name} ${user.lastName}` : "Guest session"}</span>
        </div>
      </section>

      {message && <div className="message">{message}</div>}
      {busy && <div className="progress" />}

      {view === "store" && (
        <Storefront
          products={products}
          brands={brands}
          search={search}
          setSearch={setSearch}
          loadProducts={loadProducts}
          addToCart={addToCart}
        />
      )}
      {view === "cart" && (
        <CartView
          cart={cart}
          total={cartTotal}
          user={user}
          loadCart={loadCart}
          updateCartItem={updateCartItem}
          removeCartItem={removeCartItem}
          checkout={checkout}
          setView={setView}
        />
      )}
      {view === "admin" && (
        <AdminView
          isAdminLike={isAdminLike}
          categories={categories}
          products={products}
          warehouses={warehouses}
          categoryForm={categoryForm}
          productForm={productForm}
          warehouseForm={warehouseForm}
          stockForm={stockForm}
          setCategoryForm={setCategoryForm}
          setProductForm={setProductForm}
          setWarehouseForm={setWarehouseForm}
          setStockForm={setStockForm}
          saveField={saveField}
          createCategory={createCategory}
          createProduct={createProduct}
          createWarehouse={createWarehouse}
          setStock={setStock}
          loadWarehouses={loadWarehouses}
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
        />
      )}
    </main>
  );
}

function Storefront({ products, brands, search, setSearch, loadProducts, addToCart }) {
  return (
    <section className="workspace">
      <div className="toolbar">
        <div className="searchbox">
          <Search size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadProducts()} placeholder="جستجو" />
          <button onClick={loadProducts}>اعمال</button>
        </div>
        <div className="metric">
          <span>{products.length}</span>
          <small>محصول</small>
        </div>
        <div className="metric">
          <span>{brands.length}</span>
          <small>برند</small>
        </div>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <img src={product.imageUrl || buildUrl(fallbackImage)} alt={product.name} />
            <div className="product-body">
              <div>
                <h2>{product.name}</h2>
                <p>{product.categoryName}</p>
              </div>
              <div className="price-row">
                <strong>{formatMoney(product.price)}</strong>
                <button onClick={() => addToCart(product.id)} title="افزودن به سبد">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CartView({ cart, total, user, loadCart, updateCartItem, removeCartItem, checkout, setView }) {
  return (
    <section className="workspace cart-layout">
      <div className="panel">
        <div className="panel-head">
          <h2>سبد خرید</h2>
          <button className="icon-button" onClick={loadCart} title="بازخوانی">
            <RefreshCw size={17} />
          </button>
        </div>
        {!cart?.items?.length ? (
          <div className="empty-state">
            <ShoppingCart size={32} />
            <button onClick={() => setView("store")}>رفتن به فروشگاه</button>
          </div>
        ) : (
          <div className="cart-items">
            {cart.items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <strong>{item.productName}</strong>
                  <span>{formatMoney(item.unitPriceSnapshot)}</span>
                </div>
                <div className="stepper">
                  <button onClick={() => updateCartItem(item.id, item.quantity - 1)} title="کم کردن">
                    <Minus size={15} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateCartItem(item.id, item.quantity + 1)} title="زیاد کردن">
                    <Plus size={15} />
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

      <aside className="summary">
        <h2>پرداخت</h2>
        <div className="summary-line">
          <span>جمع</span>
          <strong>{formatMoney(total)}</strong>
        </div>
        <button className="primary" disabled={!user || !cart?.items?.length} onClick={checkout}>
          <CreditCard size={18} /> ثبت سفارش
        </button>
      </aside>
    </section>
  );
}

function AdminView(props) {
  const {
    categories,
    products,
    warehouses,
    categoryForm,
    productForm,
    warehouseForm,
    stockForm,
    setCategoryForm,
    setProductForm,
    setWarehouseForm,
    setStockForm,
    saveField,
    createCategory,
    createProduct,
    createWarehouse,
    setStock,
    loadWarehouses
  } = props;

  return (
    <section className="workspace admin-grid">
      <form className="panel compact-form" onSubmit={createProduct}>
        <div className="panel-head">
          <h2>محصول</h2>
          <PackagePlus size={18} />
        </div>
        <input placeholder="نام" value={productForm.name} onChange={saveField(setProductForm, "name")} required />
        <input placeholder="قیمت" type="number" value={productForm.price} onChange={saveField(setProductForm, "price")} required />
        <select value={productForm.categoryId} onChange={saveField(setProductForm, "categoryId")} required>
          <option value="">دسته بندی</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
        <button className="primary" type="submit">
          <Plus size={17} /> ثبت محصول
        </button>
      </form>

      <form className="panel compact-form" onSubmit={createCategory}>
        <div className="panel-head">
          <h2>دسته بندی</h2>
          <LayoutGrid size={18} />
        </div>
        <input placeholder="عنوان" value={categoryForm.title} onChange={saveField(setCategoryForm, "title")} required />
        <button className="primary" type="submit">
          <Plus size={17} /> ثبت دسته
        </button>
      </form>

      <form className="panel compact-form" onSubmit={createWarehouse}>
        <div className="panel-head">
          <h2>انبار</h2>
          <Boxes size={18} />
        </div>
        <input placeholder="نام" value={warehouseForm.name} onChange={saveField(setWarehouseForm, "name")} required />
        <input placeholder="کد" value={warehouseForm.code} onChange={saveField(setWarehouseForm, "code")} required />
        <input placeholder="آدرس" value={warehouseForm.address} onChange={saveField(setWarehouseForm, "address")} />
        <button className="primary" type="submit">
          <Plus size={17} /> ثبت انبار
        </button>
      </form>

      <form className="panel compact-form" onSubmit={setStock}>
        <div className="panel-head">
          <h2>موجودی</h2>
          <button type="button" className="icon-button" onClick={loadWarehouses} title="بازخوانی">
            <RefreshCw size={16} />
          </button>
        </div>
        <select value={stockForm.warehouseId} onChange={saveField(setStockForm, "warehouseId")} required>
          <option value="">انبار</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </select>
        <select value={stockForm.productId} onChange={saveField(setStockForm, "productId")} required>
          <option value="">محصول</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <input placeholder="موجودی" type="number" value={stockForm.quantity} onChange={saveField(setStockForm, "quantity")} required />
        <input placeholder="حد سفارش مجدد" type="number" value={stockForm.reorderLevel} onChange={saveField(setStockForm, "reorderLevel")} />
        <button className="primary" type="submit">
          <Plus size={17} /> ثبت موجودی
        </button>
      </form>
    </section>
  );
}

function AccountView({ user, loginForm, registerForm, setLoginForm, setRegisterForm, saveField, login, register, logout }) {
  if (user) {
    return (
      <section className="workspace account-grid">
        <div className="panel profile-panel">
          <UserRound size={34} />
          <h2>{user.name} {user.lastName}</h2>
          <p>{user.phoneNumber}</p>
          <div className="role-list">
            {(user.roles || []).map((role) => <span key={role}>{role}</span>)}
          </div>
          <button className="danger" onClick={logout}>
            <LogOut size={18} /> خروج
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="workspace account-grid">
      <form className="panel compact-form" onSubmit={login}>
        <div className="panel-head">
          <h2>ورود</h2>
          <LogIn size={18} />
        </div>
        <input placeholder="موبایل" value={loginForm.phoneNumber} onChange={saveField(setLoginForm, "phoneNumber")} required />
        <input placeholder="رمز عبور" type="password" value={loginForm.password} onChange={saveField(setLoginForm, "password")} required />
        <button className="primary" type="submit">
          <LogIn size={18} /> ورود
        </button>
      </form>

      <form className="panel compact-form" onSubmit={register}>
        <div className="panel-head">
          <h2>ثبت نام</h2>
          <UserRound size={18} />
        </div>
        <input placeholder="نام" value={registerForm.name} onChange={saveField(setRegisterForm, "name")} required />
        <input placeholder="نام خانوادگی" value={registerForm.lastName} onChange={saveField(setRegisterForm, "lastName")} required />
        <input placeholder="کد ملی" value={registerForm.nationalCode} onChange={saveField(setRegisterForm, "nationalCode")} />
        <input placeholder="موبایل" value={registerForm.phoneNumber} onChange={saveField(setRegisterForm, "phoneNumber")} required />
        <input placeholder="ایمیل" type="email" value={registerForm.email} onChange={saveField(setRegisterForm, "email")} />
        <input placeholder="رمز عبور" type="password" value={registerForm.password} onChange={saveField(setRegisterForm, "password")} required />
        <button className="primary" type="submit">
          <UserRound size={18} /> ثبت نام
        </button>
      </form>
    </section>
  );
}
