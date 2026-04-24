import { useEffect, useMemo, useState } from "react";
import AdminPanel from "./components/AdminPanel.jsx";
import CartPanel from "./components/CartPanel.jsx";
import FeaturedStrip from "./components/FeaturedStrip.jsx";
import FeedbackPanel from "./components/FeedbackPanel.jsx";
import Header from "./components/Header.jsx";
import InfoPanels from "./components/InfoPanels.jsx";
import MenuBoard from "./components/MenuBoard.jsx";
import Receipt from "./components/Receipt.jsx";
import {
  CATEGORY_CONFIG,
  DEFAULT_MENU,
  HERO_IMAGE,
  PAYMENT_METHODS,
  getDiscount,
  getUnitPrice,
} from "./lib/cafeData.js";

const MENU_STORAGE_KEY = "cafeweb-react-menu";
const FEEDBACK_STORAGE_KEY = "cafeweb-react-feedback";

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function readMenuStorage() {
  const stored = readStorage(MENU_STORAGE_KEY, DEFAULT_MENU);

  return Object.fromEntries(
    Object.entries(DEFAULT_MENU).map(([categoryKey, defaultItems]) => {
      const storedItems = Array.isArray(stored[categoryKey]) ? stored[categoryKey] : [];
      const mergedDefaults = defaultItems.map((defaultItem) => ({
        ...defaultItem,
        ...(storedItems.find((item) => item.id === defaultItem.id) ?? {}),
      }));
      const customItems = storedItems.filter(
        (item) => !defaultItems.some((defaultItem) => defaultItem.id === item.id),
      );

      return [categoryKey, [...mergedDefaults, ...customItems]];
    }),
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState("coffee");
  const [menu, setMenu] = useState(readMenuStorage);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [feedbacks, setFeedbacks] = useState(() => readStorage(FEEDBACK_STORAGE_KEY, []));
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    document.title = "CafeWeb React";
  }, []);

  useEffect(() => {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbacks));
  }, [feedbacks]);

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [cart],
  );
  const discount = useMemo(() => getDiscount(subtotal), [subtotal]);
  const finalTotal = subtotal - discount.amount;
  const totalItems = cart.reduce((sum, line) => sum + line.quantity, 0);
  const popularItems = useMemo(
    () =>
      Object.entries(menu)
        .flatMap(([categoryKey, items]) =>
          items.filter((item) => item.popular).map((item) => ({ categoryKey, item })),
        )
        .slice(0, 4),
    [menu],
  );

  function addToCart(selection) {
    const category = CATEGORY_CONFIG[selection.categoryKey];
    const key = [
      selection.categoryKey,
      selection.item.id,
      selection.size,
      selection.hasIce ? "ice" : "no-ice",
    ].join("|");

    setCart((current) => {
      const existing = current.find((line) => line.key === key);
      if (existing) {
        return current.map((line) =>
          line.key === key
            ? { ...line, quantity: Math.min(20, line.quantity + selection.quantity) }
            : line,
        );
      }

      return [
        ...current,
        {
          id: `${key}-${Date.now()}`,
          key,
          categoryLabel: category.label,
          image: selection.image || category.image,
          name: selection.item.name,
          size: selection.size,
          hasIce: selection.hasIce,
          quantity: selection.quantity,
          unitPrice: selection.unitPrice,
        },
      ];
    });
  }

  function addQuickItem(categoryKey, item) {
    addToCart({
      item,
      categoryKey,
      size: "S",
      hasIce: false,
      image: item.image || CATEGORY_CONFIG[categoryKey].image,
      quantity: 1,
      unitPrice: getUnitPrice(categoryKey, item, "S", false),
    });
  }

  function updateQuantity(id, quantity) {
    if (quantity <= 0) {
      setCart((current) => current.filter((line) => line.id !== id));
      return;
    }

    setCart((current) =>
      current.map((line) => (line.id === id ? { ...line, quantity: Math.min(20, quantity) } : line)),
    );
  }

  function addItem(categoryKey, item) {
    setMenu((current) => ({
      ...current,
      [categoryKey]: [...current[categoryKey], item],
    }));
    setActiveCategory(categoryKey);
  }

  function resetMenu() {
    setMenu(DEFAULT_MENU);
  }

  function checkout() {
    if (cart.length === 0) {
      return;
    }

    setReceipt({
      id: `CW-${Date.now().toString().slice(-6)}`,
      customerName,
      discount,
      finalTotal,
      lines: cart,
      paymentMethod,
    });
    setCart([]);
  }

  function addFeedback(text) {
    setFeedbacks((current) => [...current, { id: Date.now(), text }]);
  }

  return (
    <>
      <Header totalItems={totalItems} />
      <main>
        <section className="hero" style={{ "--hero-image": `url("${HERO_IMAGE}")` }}>
          <div className="hero-copy">
            <p className="eyebrow">Specialty cafe in Ulaanbaatar</p>
            <h1>CafeWeb</h1>
            <p>Fresh coffee, tea, breakfast plates, and desserts prepared for pickup.</p>
            <div className="hero-actions">
              <a className="submit-button" href="#menu">Order now</a>
              <a className="ghost-link" href="#admin">Manage menu</a>
            </div>
          </div>
          <div className="hero-panel">
            <span>Open today</span>
            <strong>07:00 - 21:00</strong>
            <p>Average prep time 8-18 minutes</p>
          </div>
        </section>

        <FeaturedStrip items={popularItems} onAddQuick={addQuickItem} />

        <div className="workspace">
          <MenuBoard
            activeCategory={activeCategory}
            menu={menu}
            onAddToCart={addToCart}
            onSelectCategory={setActiveCategory}
          />
          <CartPanel
            cart={cart}
            customerName={customerName}
            discount={discount}
            finalTotal={finalTotal}
            onCheckout={checkout}
            onClearCart={() => setCart([])}
            onCustomerNameChange={setCustomerName}
            onRemoveItem={(id) => setCart((current) => current.filter((line) => line.id !== id))}
            onUpdateQuantity={updateQuantity}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            subtotal={subtotal}
          />
        </div>

        <div className="lower-grid">
          <AdminPanel onAddItem={addItem} onResetMenu={resetMenu} />
          <FeedbackPanel feedbacks={feedbacks} onAddFeedback={addFeedback} />
        </div>

        <InfoPanels />
      </main>
      <Receipt receipt={receipt} onClose={() => setReceipt(null)} />
    </>
  );
}

export default App;
