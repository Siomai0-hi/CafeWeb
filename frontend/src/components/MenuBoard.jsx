import { useMemo, useState } from "react";
import { CATEGORY_CONFIG, formatMoney, getUnitPrice } from "../lib/cafeData.js";

function ProductCard({ categoryKey, item, onAddToCart }) {
  const config = CATEGORY_CONFIG[categoryKey];
  const [size, setSize] = useState("S");
  const [hasIce, setHasIce] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const unitPrice = getUnitPrice(categoryKey, item, size, hasIce);
  const image = item.image || config.image;

  function submitItem() {
    onAddToCart({
      item,
      categoryKey,
      size,
      hasIce: config.supportsIce && hasIce,
      image,
      quantity,
      unitPrice,
    });
  }

  return (
    <article className="product-card" style={{ "--accent": config.accent }}>
      <div className="product-image-wrap">
        <img className="product-image" src={image} alt={item.name} loading="lazy" />
        <span>{config.badge}</span>
      </div>
      <div className="product-copy">
        <div className="product-kicker">
          <p>{config.label}</p>
          {item.popular && <span>Popular</span>}
        </div>
        <h3>{item.name}</h3>
        <small>{item.description || config.description}</small>
        <strong>{formatMoney(unitPrice)}</strong>
      </div>

      <div className="control-grid">
        <div className="segmented" aria-label={`${item.name} size`}>
          {["S", "M", "L"].map((option) => (
            <button
              className={size === option ? "active" : ""}
              key={option}
              type="button"
              onClick={() => setSize(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {config.supportsIce && (
          <label className="switch-row">
            <input
              checked={hasIce}
              onChange={(event) => setHasIce(event.target.checked)}
              type="checkbox"
            />
            <span>Ice</span>
          </label>
        )}

        <div className="stepper">
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
            -
          </button>
          <input
            aria-label={`${item.name} quantity`}
            min="1"
            max="20"
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            type="number"
            value={quantity}
          />
          <button type="button" onClick={() => setQuantity((value) => Math.min(20, value + 1))}>
            +
          </button>
        </div>

        <button className="add-button" type="button" onClick={submitItem}>
          Add
        </button>
      </div>
    </article>
  );
}

function MenuBoard({ activeCategory, menu, onAddToCart, onSelectCategory }) {
  const [searchTerm, setSearchTerm] = useState("");
  const activeConfig = CATEGORY_CONFIG[activeCategory];
  const items = menu[activeCategory] ?? [];
  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return items;
    }

    return items.filter((item) => {
      const text = `${item.name} ${item.description ?? ""}`.toLowerCase();
      return text.includes(query);
    });
  }, [items, searchTerm]);

  return (
    <section className="menu-section" id="menu" aria-labelledby="menuTitle">
      <div className="section-head">
        <div>
          <p className="eyebrow">Order</p>
          <h2 id="menuTitle">Cafe menu</h2>
        </div>
      </div>

      <div className="category-spotlight" style={{ "--accent": activeConfig.accent }}>
        <img src={activeConfig.image} alt={activeConfig.label} />
        <div>
          <span>{activeConfig.badge}</span>
          <h3>{activeConfig.label}</h3>
          <p>{activeConfig.description}</p>
        </div>
      </div>

      <div className="category-tabs" role="tablist" aria-label="Menu categories">
        {Object.entries(CATEGORY_CONFIG).map(([key, category]) => (
          <button
            className={activeCategory === key ? "active" : ""}
            key={key}
            onClick={() => onSelectCategory(key)}
            role="tab"
            type="button"
          >
            {category.label}
            <span>{menu[key]?.length ?? 0}</span>
          </button>
        ))}
      </div>

      <label className="menu-search">
        <span>Search</span>
        <input
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={`Search ${activeConfig.label.toLowerCase()}...`}
          type="search"
          value={searchTerm}
        />
      </label>

      <div className="product-grid">
        {filteredItems.map((item) => (
          <ProductCard
            categoryKey={activeCategory}
            item={item}
            key={item.id}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="no-results">No menu items match this search.</p>
      )}
    </section>
  );
}

export default MenuBoard;
