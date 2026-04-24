import { useState } from "react";
import { CATEGORY_CONFIG } from "../lib/cafeData.js";

function AdminPanel({ onAddItem, onResetMenu }) {
  const [categoryKey, setCategoryKey] = useState("coffee");
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [image, setImage] = useState("");

  function submit(event) {
    event.preventDefault();
    const price = Number(basePrice);

    if (!name.trim() || Number.isNaN(price) || price <= 0) {
      return;
    }

    onAddItem(categoryKey, {
      id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name: name.trim(),
      basePrice: price,
      image: image.trim() || undefined,
      description: "Custom cafe item added from the menu manager.",
    });
    setName("");
    setBasePrice("");
    setImage("");
  }

  return (
    <section className="admin-panel" id="admin" aria-labelledby="adminTitle">
      <div>
        <p className="eyebrow">Menu manager</p>
        <h2 id="adminTitle">Add new item</h2>
      </div>

      <form className="admin-form" onSubmit={submit}>
        <label className="field">
          <span>Category</span>
          <select value={categoryKey} onChange={(event) => setCategoryKey(event.target.value)}>
            {Object.entries(CATEGORY_CONFIG).map(([key, category]) => (
              <option key={key} value={key}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Item name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Caramel Frappe" />
        </label>

        <label className="field">
          <span>Base price</span>
          <input
            min="1"
            onChange={(event) => setBasePrice(event.target.value)}
            placeholder="12000"
            type="number"
            value={basePrice}
          />
        </label>

        <label className="field">
          <span>Image URL</span>
          <input
            onChange={(event) => setImage(event.target.value)}
            placeholder={CATEGORY_CONFIG[categoryKey].image}
            type="url"
            value={image}
          />
        </label>

        <div className="admin-actions">
          <button className="submit-button" type="submit">
            Add item
          </button>
          <button className="ghost-button" onClick={onResetMenu} type="button">
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminPanel;
