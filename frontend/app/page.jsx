"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CAFE_NOTES,
  MENU_CATEGORIES,
  PAYMENT_METHODS,
  PLACEHOLDER_IMAGES,
  SCENE_IMAGES,
  formatMoney,
  getDiscount,
  getUnitPrice,
} from "../src/lib/cafeData.js";

const MENU_STORAGE_KEY = "cafeweb-next-menu";
const FEEDBACK_STORAGE_KEY = "cafeweb-next-feedback";

const accentClasses = {
  amber: {
    badge: "bg-amber-300/10 text-amber-100 ring-amber-300/25",
    button: "bg-amber-300 text-zinc-950 hover:bg-amber-200",
    line: "border-amber-300/30",
    text: "text-amber-200",
  },
  cyan: {
    badge: "bg-cyan-300/10 text-cyan-100 ring-cyan-300/25",
    button: "bg-cyan-300 text-zinc-950 hover:bg-cyan-200",
    line: "border-cyan-300/30",
    text: "text-cyan-200",
  },
  rose: {
    badge: "bg-rose-300/10 text-rose-100 ring-rose-300/25",
    button: "bg-rose-300 text-zinc-950 hover:bg-rose-200",
    line: "border-rose-300/30",
    text: "text-rose-200",
  },
  emerald: {
    badge: "bg-emerald-300/10 text-emerald-100 ring-emerald-300/25",
    button: "bg-emerald-300 text-zinc-950 hover:bg-emerald-200",
    line: "border-emerald-300/30",
    text: "text-emerald-200",
  },
};

function getFreshMenu() {
  return MENU_CATEGORIES.map((category) => ({
    ...category,
    items: category.items.map((item) => ({ ...item })),
  }));
}

function readStorage(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function readMenuStorage() {
  const stored = readStorage(MENU_STORAGE_KEY, null);
  if (!Array.isArray(stored)) {
    return getFreshMenu();
  }

  return MENU_CATEGORIES.map((baseCategory) => {
    const storedCategory = stored.find((category) => category.id === baseCategory.id);
    const storedItems = Array.isArray(storedCategory?.items) ? storedCategory.items : [];
    const defaultItems = baseCategory.items.map((defaultItem) => ({ ...defaultItem }));
    const customItems = storedItems.filter(
      (item) => !baseCategory.items.some((defaultItem) => defaultItem.id === item.id),
    );

    return {
      ...baseCategory,
      items: [...defaultItems, ...customItems],
    };
  });
}

function slugify(value) {
  const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug || "custom-item";
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submitLogin(event) {
    event.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || cleanPassword.length < 4) {
      setError("Имэйл болон 4-өөс дээш тэмдэгттэй нууц үг оруулна уу.");
      return;
    }

    onLogin({
      email: cleanEmail,
      name: cleanEmail.split("@")[0] || "Зочин",
    });
  }

  return (
    <main className="grid min-h-screen bg-zinc-950 text-zinc-100 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
      <section className="relative min-h-[52vh] overflow-hidden lg:min-h-screen" aria-label="CafeWeb орчин">
        <img className="absolute inset-0 h-full w-full object-cover" src={SCENE_IMAGES.login} alt="" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-6 sm:p-10 lg:p-14">
          <a className="w-fit text-2xl font-black text-white" href="/">
            CafeWeb
          </a>

          <div className="max-w-3xl py-12">
            <p className="mb-3 text-xs font-black uppercase text-amber-200">Улаанбаатар дахь тухтай кафе</p>
            <h1 className="max-w-2xl text-5xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
              Кофегоо хурдан сонгоод захиалаарай.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-200 sm:text-lg">
              Нэвтрээд цэсээ ангиллаар харж, сагсандаа нэмээд төлбөрөө сонгоно.
            </p>
          </div>

          <div className="grid max-w-2xl gap-3 text-sm text-zinc-200 sm:grid-cols-3">
            {[
              ["Нээлттэй", "07:00 - 21:00"],
              ["Бэлтгэх", "8 - 18 мин"],
              ["Төлбөр", "Бэлэн, Карт, QPay"],
            ].map(([label, value]) => (
              <div className="border-l border-white/20 bg-black/20 px-4 py-3 backdrop-blur" key={label}>
                <span className="block text-zinc-400">{label}</span>
                <strong className="mt-1 block text-base text-white">{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <form
          className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-900/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8"
          onSubmit={submitLogin}
        >
          <div className="mb-7">
            <p className="text-sm font-semibold text-amber-200">Тавтай морил</p>
            <h2 className="mt-2 text-3xl font-black text-white">Нэвтрэх</h2>
          </div>

          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-semibold text-zinc-300">Имэйл</span>
            <input
              className="h-12 w-full rounded-md border border-white/10 bg-zinc-950 px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300 focus:ring-4 focus:ring-amber-300/10"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="guest@cafeweb.mn"
              required
              type="email"
              value={email}
            />
          </label>

          <label className="mb-5 block">
            <span className="mb-2 block text-sm font-semibold text-zinc-300">Нууц үг</span>
            <input
              className="h-12 w-full rounded-md border border-white/10 bg-zinc-950 px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300 focus:ring-4 focus:ring-amber-300/10"
              minLength={4}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="coffee2026"
              required
              type="password"
              value={password}
            />
          </label>

          {error && (
            <p className="mb-5 rounded-md border border-rose-300/20 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">
              {error}
            </p>
          )}

          <button
            className="h-12 w-full rounded-md bg-amber-300 font-black text-zinc-950 transition hover:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300/20"
            type="submit"
          >
            Нэвтэрч цэс нээх
          </button>
        </form>
      </section>
    </main>
  );
}

function AppBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-zinc-950">
      <img className="h-full w-full object-cover opacity-40" src={SCENE_IMAGES.lounge} alt="" />
      <div className="absolute inset-0 bg-zinc-950/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-zinc-950/50 to-zinc-950" />
    </div>
  );
}

function Header({ cartCount, onLogout, user }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a className="text-xl font-black text-white" href="#top">
          CafeWeb
        </a>
        <nav className="hidden items-center gap-1 text-sm font-bold text-zinc-300 lg:flex">
          {[
            ["Өнөөдөр", "#today"],
            ["Онцлох", "#picks"],
            ["Цэс", "#menu"],
            ["Нэмэх", "#studio"],
            ["Санал", "#notes"],
          ].map(([label, href]) => (
            <a className="rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white" href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden max-w-[150px] truncate text-sm font-semibold text-zinc-400 sm:inline">
            {user.name}
          </span>
          <a
            className="grid h-10 min-w-10 place-items-center rounded-md bg-white text-sm font-black text-zinc-950"
            href="#cart"
            aria-label={`Сагсанд ${cartCount} бараа байна`}
          >
            {cartCount}
          </a>
          <button
            className="h-10 rounded-md border border-white/10 px-3 text-sm font-bold text-zinc-200 transition hover:bg-white/10 hover:text-white"
            onClick={onLogout}
            type="button"
          >
            Гарах
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ categories, onSelectCategory, user }) {
  const totalItems = categories.reduce((sum, category) => sum + category.items.length, 0);

  return (
    <section id="today" className="relative overflow-hidden border-b border-white/10" aria-label="Кафены мэдээлэл">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase text-amber-200">Сайн уу, {user.name}</p>
          <h1 className="mt-3 text-5xl font-black leading-none text-white sm:text-6xl">
            Кафены захиалга илүү амар боллоо.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
            Ундаа, амттанаа сонгоод сагсанд нэм. Бүх зүйл нэг дэлгэц дээр.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                className="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-zinc-200 backdrop-blur transition hover:bg-white hover:text-zinc-950"
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                type="button"
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <aside className="grid gap-3 rounded-lg border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
          <img className="h-44 w-full rounded-md object-cover" src={SCENE_IMAGES.counter} alt="" />
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-md border border-white/10 bg-zinc-950/70 p-3">
              <strong className="block text-lg text-white">{categories.length}</strong>
              <span className="text-zinc-500">Ангилал</span>
            </div>
            <div className="rounded-md border border-white/10 bg-zinc-950/70 p-3">
              <strong className="block text-lg text-white">{totalItems}</strong>
              <span className="text-zinc-500">Бараа</span>
            </div>
            <div className="rounded-md border border-white/10 bg-zinc-950/70 p-3">
              <strong className="block text-lg text-white">8 мин</strong>
              <span className="text-zinc-500">Хурдан</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ProductImage({ accent, alt, src }) {
  const fallback = PLACEHOLDER_IMAGES.hot;
  const [imageSrc, setImageSrc] = useState(src || fallback);

  useEffect(() => {
    setImageSrc(src || fallback);
  }, [src]);

  return (
    <div className={`overflow-hidden rounded-md border ${accentClasses[accent].line} bg-zinc-950`}>
      <img
        className="aspect-[4/3] h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        src={imageSrc}
        alt={alt}
        loading="lazy"
        onError={() => setImageSrc(fallback)}
      />
    </div>
  );
}

function FeaturedStrip({ items, onAdd }) {
  return (
    <section id="picks" className="scroll-mt-24" aria-labelledby="picksTitle">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase text-amber-200">Онцлох</p>
          <h2 id="picksTitle" className="mt-2 text-3xl font-black text-white">
            Их захиалагддаг
          </h2>
        </div>
        <a className="hidden rounded-md border border-white/10 px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10 hover:text-white sm:inline-flex" href="#menu">
          Цэс харах
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map(({ category, item }) => (
          <article className="group overflow-hidden rounded-lg border border-white/10 bg-zinc-900/90" key={`${category.id}-${item.id}`}>
            <ProductImage accent={category.accent} alt={item.name} src={item.image || category.image} />
            <div className="p-4">
              <span className={`rounded-full px-2 py-1 text-xs font-black ring-1 ${accentClasses[category.accent].badge}`}>
                {category.label}
              </span>
              <h3 className="mt-3 text-lg font-black text-white">{item.name}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">{item.description}</p>
              <button
                className={`mt-4 h-10 w-full rounded-md text-sm font-black transition ${accentClasses[category.accent].button}`}
                onClick={() =>
                  onAdd({
                    category,
                    item,
                    size: "S",
                    hasIce: false,
                    quantity: 1,
                    unitPrice: item.basePrice,
                  })
                }
                type="button"
              >
                Нэмэх {formatMoney(item.basePrice)}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CategoryTabs({ activeCategory, categories, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Цэсний ангилал">
      {categories.map((category) => {
        const active = activeCategory === category.id;
        return (
          <button
            className={`min-h-11 shrink-0 rounded-md border px-4 text-sm font-black transition ${
              active
                ? "border-white bg-white text-zinc-950"
                : "border-white/10 bg-zinc-900/90 text-zinc-300 hover:border-white/25 hover:bg-white/10 hover:text-white"
            }`}
            key={category.id}
            onClick={() => onSelect(category.id)}
            role="tab"
            type="button"
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}

function ProductCard({ category, item, onAdd }) {
  const accent = accentClasses[category.accent];
  const [size, setSize] = useState("S");
  const [hasIce, setHasIce] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const unitPrice = getUnitPrice(category.id, item, size, hasIce);
  const supportsIce = category.id === "cold-drinks";

  return (
    <article className="group grid gap-4 rounded-lg border border-white/10 bg-zinc-900/90 p-3 transition hover:border-white/25 hover:bg-zinc-900">
      <ProductImage accent={category.accent} alt={item.name} src={item.image || category.image} />
      <div className="grid gap-3">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className={`rounded-full px-2 py-1 text-xs font-black ring-1 ${accent.badge}`}>
              {category.label}
            </span>
            {item.popular && <span className="text-xs font-bold text-zinc-400">Онцлох</span>}
          </div>
          <h3 className="text-lg font-black leading-tight text-white">{item.name}</h3>
          <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">{item.description}</p>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <div className="grid grid-cols-3 rounded-md border border-white/10 bg-zinc-950 p-1" aria-label={`${item.name} хэмжээ`}>
            {["S", "M", "L"].map((option) => (
              <button
                className={`h-8 rounded text-xs font-black transition ${
                  size === option ? "bg-white text-zinc-950" : "text-zinc-400 hover:text-white"
                }`}
                key={option}
                onClick={() => setSize(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex rounded-md border border-white/10 bg-zinc-950 p-1">
            <button
              className="grid h-8 w-8 place-items-center rounded text-zinc-300 hover:bg-white/10"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              type="button"
            >
              -
            </button>
            <span className="grid h-8 w-8 place-items-center text-sm font-black text-white">{quantity}</span>
            <button
              className="grid h-8 w-8 place-items-center rounded text-zinc-300 hover:bg-white/10"
              onClick={() => setQuantity((value) => Math.min(20, value + 1))}
              type="button"
            >
              +
            </button>
          </div>
        </div>

        {supportsIce && (
          <label className="flex min-h-10 items-center justify-between rounded-md border border-white/10 bg-zinc-950 px-3 text-sm font-bold text-zinc-300">
            Мөс нэмэх
            <input
              checked={hasIce}
              className="h-4 w-4 accent-cyan-300"
              onChange={(event) => setHasIce(event.target.checked)}
              type="checkbox"
            />
          </label>
        )}

        <div className="flex items-center justify-between gap-3">
          <strong className={`text-base ${accent.text}`}>{formatMoney(unitPrice)}</strong>
          <button
            className={`h-10 rounded-md px-4 text-sm font-black transition ${accent.button}`}
            onClick={() => onAdd({ category, item, size, hasIce: supportsIce && hasIce, quantity, unitPrice })}
            type="button"
          >
            Нэмэх
          </button>
        </div>
      </div>
    </article>
  );
}

function MenuBoard({ activeCategory, categories, onAddToCart, onSelectCategory, query, setQuery }) {
  return (
    <section id="menu" className="scroll-mt-24" aria-labelledby="menuTitle">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-amber-200">Цэс</p>
          <h2 id="menuTitle" className="mt-2 text-3xl font-black text-white sm:text-4xl">
            Ангиллаар сонгох
          </h2>
        </div>
        <label className="w-full lg:max-w-sm">
          <span className="sr-only">Цэс хайх</span>
          <input
            className="h-12 w-full rounded-md border border-white/10 bg-zinc-900/90 px-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-300 focus:ring-4 focus:ring-amber-300/10"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ундаа, амттан хайх..."
            type="search"
            value={query}
          />
        </label>
      </div>

      <CategoryTabs activeCategory={activeCategory} categories={categories} onSelect={onSelectCategory} />

      <div className="mt-6 grid gap-10">
        {categories.map((category) => (
          <section className="scroll-mt-28" id={`category-${category.id}`} key={category.id}>
            <div className="mb-4 grid gap-4 border-b border-white/10 pb-4 md:grid-cols-[180px_1fr_auto] md:items-center">
              <img className="h-28 w-full rounded-md object-cover md:h-24" src={category.image} alt="" />
              <div>
                <h3 className="text-2xl font-black text-white">{category.label}</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-400">{category.description}</p>
              </div>
              <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ring-1 ${accentClasses[category.accent].badge}`}>
                {category.items.length} төрөл
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {category.items.map((item) => (
                <ProductCard category={category} item={item} key={item.id} onAdd={onAddToCart} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="rounded-lg border border-white/10 bg-zinc-900/90 px-4 py-8 text-center text-zinc-400">
          Хайлтад тохирох зүйл алга.
        </p>
      )}
    </section>
  );
}

function CartPanel({
  cart,
  customerName,
  discount,
  finalTotal,
  onCheckout,
  onClear,
  onCustomerNameChange,
  onRemove,
  onUpdateQuantity,
  paymentMethod,
  setPaymentMethod,
  subtotal,
}) {
  return (
    <aside
      id="cart"
      className="sticky top-24 self-start rounded-lg border border-white/10 bg-zinc-900/95 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl"
      aria-labelledby="cartTitle"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-amber-200">Төлбөр</p>
          <h2 id="cartTitle" className="mt-1 text-2xl font-black text-white">
            Сагс
          </h2>
        </div>
        <button
          className="h-9 rounded-md border border-white/10 px-3 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
          disabled={cart.length === 0}
          onClick={onClear}
          type="button"
        >
          Цэвэрлэх
        </button>
      </div>

      <label className="mb-4 block">
        <span className="mb-2 block text-sm font-semibold text-zinc-300">Захиалагчийн нэр</span>
        <input
          className="h-11 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-white outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-300/10"
          onChange={(event) => onCustomerNameChange(event.target.value)}
          placeholder="Davaa"
          type="text"
          value={customerName}
        />
      </label>

      <div className="max-h-[340px] space-y-3 overflow-y-auto pr-1">
        {cart.length === 0 && (
          <p className="rounded-md border border-dashed border-white/10 px-4 py-6 text-center text-sm text-zinc-500">
            Сагс хоосон байна.
          </p>
        )}
        {cart.map((line) => (
          <article className="grid grid-cols-[48px_1fr_auto] gap-3 rounded-md border border-white/10 bg-zinc-950 p-2" key={line.id}>
            <img className="h-12 w-12 rounded object-cover" src={line.image} alt="" loading="lazy" />
            <div className="min-w-0">
              <strong className="block truncate text-sm text-white">{line.name}</strong>
              <span className="text-xs text-zinc-500">
                {line.categoryLabel} / {line.size}
                {line.hasIce ? " / мөстэй" : ""}
              </span>
              <div className="mt-2 flex items-center gap-2">
                <button
                  className="grid h-7 w-7 place-items-center rounded border border-white/10 text-zinc-300 transition hover:bg-white/10"
                  onClick={() => onUpdateQuantity(line.id, line.quantity - 1)}
                  type="button"
                >
                  -
                </button>
                <span className="w-6 text-center text-sm font-black text-white">{line.quantity}</span>
                <button
                  className="grid h-7 w-7 place-items-center rounded border border-white/10 text-zinc-300 transition hover:bg-white/10"
                  onClick={() => onUpdateQuantity(line.id, line.quantity + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
            <button
              className="self-start rounded px-2 py-1 text-xs font-bold text-zinc-500 transition hover:bg-white/10 hover:text-white"
              onClick={() => onRemove(line.id)}
              type="button"
            >
              Устгах
            </button>
          </article>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2" aria-label="Төлбөрийн хэлбэр">
        {PAYMENT_METHODS.map((method) => (
          <button
            className={`h-10 rounded-md border text-sm font-black transition ${
              paymentMethod === method
                ? "border-amber-300 bg-amber-300 text-zinc-950"
                : "border-white/10 bg-zinc-950 text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
            key={method}
            onClick={() => setPaymentMethod(method)}
            type="button"
          >
            {method}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
        <div className="flex justify-between text-zinc-400">
          <span>Дэд нийт</span>
          <strong className="text-zinc-200">{formatMoney(subtotal)}</strong>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>{discount.label || "Хөнгөлөлт"}</span>
          <strong className="text-zinc-200">-{formatMoney(discount.amount)}</strong>
        </div>
        <div className="flex justify-between text-lg font-black text-white">
          <span>Нийт</span>
          <strong>{formatMoney(finalTotal)}</strong>
        </div>
      </div>

      <button
        className="mt-5 h-12 w-full rounded-md bg-white font-black text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-40"
        disabled={cart.length === 0}
        onClick={onCheckout}
        type="button"
      >
        Захиалах
      </button>
    </aside>
  );
}

function MenuManager({ categories, onAddItem, onReset }) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!categories.some((category) => category.id === categoryId)) {
      setCategoryId(categories[0]?.id ?? "");
    }
  }, [categories, categoryId]);

  function submit(event) {
    event.preventDefault();
    const numericPrice = Number(price);

    if (!categoryId || !name.trim() || Number.isNaN(numericPrice) || numericPrice <= 0) {
      return;
    }

    onAddItem(categoryId, {
      id: `${slugify(name)}-${Date.now()}`,
      name: name.trim(),
      description: "Шинээр нэмсэн бүтээгдэхүүн.",
      basePrice: numericPrice,
      image: image.trim() || undefined,
      popular: false,
    });

    setName("");
    setPrice("");
    setImage("");
  }

  return (
    <section id="studio" className="scroll-mt-24 rounded-lg border border-white/10 bg-zinc-900/90 p-5 backdrop-blur-xl" aria-labelledby="studioTitle">
      <div className="mb-5">
        <p className="text-xs font-black uppercase text-amber-200">Цэс удирдах</p>
        <h2 id="studioTitle" className="mt-2 text-2xl font-black text-white">
          Шинэ бүтээгдэхүүн
        </h2>
      </div>

      <form className="grid gap-3 md:grid-cols-2" onSubmit={submit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Ангилал</span>
          <select
            className="h-11 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-white outline-none focus:border-amber-300"
            onChange={(event) => setCategoryId(event.target.value)}
            value={categoryId}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Нэр</span>
          <input
            className="h-11 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-white outline-none focus:border-amber-300"
            onChange={(event) => setName(event.target.value)}
            placeholder="Карамель фраппе"
            value={name}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Үнэ</span>
          <input
            className="h-11 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-white outline-none focus:border-amber-300"
            min="1"
            onChange={(event) => setPrice(event.target.value)}
            placeholder="12000"
            type="number"
            value={price}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-300">Зурагны URL</span>
          <input
            className="h-11 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-white outline-none focus:border-amber-300"
            onChange={(event) => setImage(event.target.value)}
            placeholder="Заавал биш"
            type="url"
            value={image}
          />
        </label>
        <div className="flex gap-2 md:col-span-2">
          <button className="h-11 rounded-md bg-amber-300 px-5 font-black text-zinc-950 hover:bg-amber-200" type="submit">
            Нэмэх
          </button>
          <button
            className="h-11 rounded-md border border-white/10 px-5 font-bold text-zinc-300 hover:bg-white/10 hover:text-white"
            onClick={onReset}
            type="button"
          >
            Цэс сэргээх
          </button>
        </div>
      </form>
    </section>
  );
}

function NotesPanel({ feedbacks, onAddFeedback }) {
  const [text, setText] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!text.trim()) {
      return;
    }
    onAddFeedback(text.trim());
    setText("");
  }

  return (
    <section id="notes" className="scroll-mt-24 rounded-lg border border-white/10 bg-zinc-900/90 p-5 backdrop-blur-xl" aria-labelledby="notesTitle">
      <div className="mb-5">
        <p className="text-xs font-black uppercase text-amber-200">Санал хүсэлт</p>
        <h2 id="notesTitle" className="mt-2 text-2xl font-black text-white">
          Хэрэглэгчийн санал
        </h2>
      </div>

      <form className="grid gap-3" onSubmit={submit}>
        <textarea
          className="min-h-28 rounded-md border border-white/10 bg-zinc-950 p-3 text-white outline-none placeholder:text-zinc-600 focus:border-amber-300"
          onChange={(event) => setText(event.target.value)}
          placeholder="Үйлчилгээ, амт, орчны талаар санал бичих..."
          value={text}
        />
        <button className="h-11 w-fit rounded-md bg-white px-5 font-black text-zinc-950 hover:bg-zinc-200" type="submit">
          Илгээх
        </button>
      </form>

      <div className="mt-5 grid gap-3">
        {(feedbacks.length > 0 ? feedbacks.slice(-4).reverse() : CAFE_NOTES).map((note, index) => {
          const textValue = typeof note === "string" ? note : note.text;
          return (
            <p className="rounded-md border border-white/10 bg-zinc-950 px-4 py-3 text-sm leading-6 text-zinc-300" key={typeof note === "string" ? note : note.id ?? index}>
              {textValue}
            </p>
          );
        })}
      </div>
    </section>
  );
}

function CafeInfo() {
  return (
    <section className="grid gap-4 md:grid-cols-3" aria-label="Кафены мэдээлэл">
      {[
        ["Цагийн хуваарь", "07:00 - 21:00", "Амралтын өдөр 09:00 цагаас нээнэ."],
        ["Салбар", "3 байршил", "Сүхбаатарын талбай, Энхтайваны өргөн чөлөө, Баянгол."],
        ["Орчин", "Тухтай, тайван", "Дулаан гэрэл, цэвэрхэн бар, намуухан хөгжим."],
      ].map(([label, value, description]) => (
        <article className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 backdrop-blur-xl" key={label}>
          <p className="text-xs font-black uppercase text-amber-200">{label}</p>
          <h2 className="mt-2 text-2xl font-black text-white">{value}</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
        </article>
      ))}
    </section>
  );
}

function ReceiptModal({ receipt, onClose }) {
  if (!receipt) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/76 px-4 py-8 backdrop-blur-sm" role="presentation">
      <section
        className="w-full max-w-lg rounded-lg border border-white/10 bg-zinc-900 p-5 shadow-2xl shadow-black"
        aria-labelledby="receiptTitle"
        role="dialog"
        aria-modal="true"
      >
        <p className="text-xs font-black uppercase text-amber-200">Баримт</p>
        <h2 id="receiptTitle" className="mt-2 text-3xl font-black text-white">
          {receipt.id}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          {receipt.customerName || "Зочин"} / {receipt.paymentMethod}
        </p>

        <div className="mt-5 max-h-[320px] space-y-3 overflow-y-auto">
          {receipt.lines.map((line) => (
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3" key={line.id}>
              <div className="flex min-w-0 items-center gap-3">
                <img className="h-11 w-11 rounded object-cover" src={line.image} alt="" loading="lazy" />
                <span className="truncate text-sm text-zinc-200">
                  {line.name} ×{line.quantity}
                </span>
              </div>
              <strong className="text-sm text-white">{formatMoney(line.unitPrice * line.quantity)}</strong>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 text-sm">
          {receipt.discount.amount > 0 && (
            <div className="flex justify-between text-zinc-400">
              <span>{receipt.discount.label}</span>
              <strong>-{formatMoney(receipt.discount.amount)}</strong>
            </div>
          )}
          <div className="flex justify-between text-xl font-black text-white">
            <span>Төлөх дүн</span>
            <strong>{formatMoney(receipt.finalTotal)}</strong>
          </div>
        </div>

        <button
          className="mt-6 h-11 w-full rounded-md bg-amber-300 font-black text-zinc-950 transition hover:bg-amber-200"
          onClick={onClose}
          type="button"
        >
          Дуусгах
        </button>
      </section>
    </div>
  );
}

function CafeExperience({ onLogout, user }) {
  const [menuCategories, setMenuCategories] = useState(readMenuStorage);
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0].id);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState(user.name);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [feedbacks, setFeedbacks] = useState(() => readStorage(FEEDBACK_STORAGE_KEY, []));
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    window.localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuCategories));
  }, [menuCategories]);

  useEffect(() => {
    window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbacks));
  }, [feedbacks]);

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return menuCategories;
    }

    return menuCategories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          `${item.name} ${item.description} ${category.label}`.toLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [menuCategories, query]);

  const featuredItems = useMemo(
    () =>
      menuCategories
        .flatMap((category) => category.items.filter((item) => item.popular).map((item) => ({ category, item })))
        .slice(0, 4),
    [menuCategories],
  );

  const subtotal = useMemo(
    () => cart.reduce((total, line) => total + line.unitPrice * line.quantity, 0),
    [cart],
  );
  const discount = useMemo(() => getDiscount(subtotal), [subtotal]);
  const finalTotal = subtotal - discount.amount;
  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);

  function selectCategory(categoryId) {
    setActiveCategory(categoryId);
    document.getElementById(`category-${categoryId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addToCart(selection) {
    const { category, item, size, hasIce, quantity, unitPrice } = selection;
    const key = `${category.id}-${item.id}-${size}-${hasIce ? "ice" : "no-ice"}`;

    setCart((current) => {
      const existing = current.find((line) => line.key === key);
      if (existing) {
        return current.map((line) =>
          line.key === key ? { ...line, quantity: Math.min(20, line.quantity + quantity) } : line,
        );
      }

      return [
        ...current,
        {
          id: `${key}-${Date.now()}`,
          key,
          categoryLabel: category.label,
          hasIce,
          image: item.image || category.image,
          name: item.name,
          quantity,
          size,
          unitPrice,
        },
      ];
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

  function addItem(categoryId, item) {
    setMenuCategories((current) =>
      current.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: [
                ...category.items,
                {
                  ...item,
                  image: item.image || category.image,
                },
              ],
            }
          : category,
      ),
    );
    setActiveCategory(categoryId);
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

  return (
    <div id="top" className="min-h-screen text-zinc-100">
      <AppBackground />
      <Header cartCount={cartCount} onLogout={onLogout} user={user} />
      <Hero categories={menuCategories} onSelectCategory={selectCategory} user={user} />

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        <div className="grid gap-10">
          <FeaturedStrip items={featuredItems} onAdd={addToCart} />
          <MenuBoard
            activeCategory={activeCategory}
            categories={filteredCategories}
            onAddToCart={addToCart}
            onSelectCategory={selectCategory}
            query={query}
            setQuery={setQuery}
          />
          <div className="grid gap-5 xl:grid-cols-2">
            <MenuManager
              categories={menuCategories}
              onAddItem={addItem}
              onReset={() => {
                setMenuCategories(getFreshMenu());
                setActiveCategory(MENU_CATEGORIES[0].id);
              }}
            />
            <NotesPanel
              feedbacks={feedbacks}
              onAddFeedback={(text) => setFeedbacks((current) => [...current, { id: Date.now(), text }])}
            />
          </div>
          <CafeInfo />
        </div>

        <CartPanel
          cart={cart}
          customerName={customerName}
          discount={discount}
          finalTotal={finalTotal}
          onCheckout={checkout}
          onClear={() => setCart([])}
          onCustomerNameChange={setCustomerName}
          onRemove={(id) => setCart((current) => current.filter((line) => line.id !== id))}
          onUpdateQuantity={updateQuantity}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          subtotal={subtotal}
        />
      </main>
      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
    </div>
  );
}

export default function Home() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return <CafeExperience onLogout={() => setUser(null)} user={user} />;
}
