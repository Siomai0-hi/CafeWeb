import { CATEGORY_CONFIG, formatMoney } from "../lib/cafeData.js";

function FeaturedStrip({ items, onAddQuick }) {
  return (
    <section className="featured-strip" aria-labelledby="featuredTitle">
      <div className="section-head">
        <div>
          <p className="eyebrow">Best sellers</p>
          <h2 id="featuredTitle">Today's picks</h2>
        </div>
      </div>

      <div className="featured-grid">
        {items.map((entry) => {
          const category = CATEGORY_CONFIG[entry.categoryKey];
          const image = entry.item.image || category.image;

          return (
            <article className="featured-card" key={`${entry.categoryKey}-${entry.item.id}`}>
              <img src={image} alt={entry.item.name} loading="lazy" />
              <div>
                <span>{category.label}</span>
                <h3>{entry.item.name}</h3>
                <p>{entry.item.description || category.description}</p>
                <button type="button" onClick={() => onAddQuick(entry.categoryKey, entry.item)}>
                  Add {formatMoney(entry.item.basePrice)}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturedStrip;
