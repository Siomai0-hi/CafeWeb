import { PAYMENT_METHODS, formatMoney } from "../lib/cafeData.js";

function CartPanel({
  cart,
  customerName,
  discount,
  finalTotal,
  onCheckout,
  onClearCart,
  onCustomerNameChange,
  onRemoveItem,
  onUpdateQuantity,
  paymentMethod,
  setPaymentMethod,
  subtotal,
}) {
  return (
    <aside className="checkout-panel" id="checkout" aria-labelledby="checkoutTitle">
      <div className="section-head compact">
        <div>
          <p className="eyebrow">Checkout</p>
          <h2 id="checkoutTitle">Cart</h2>
        </div>
        <button className="ghost-button" disabled={cart.length === 0} onClick={onClearCart} type="button">
          Clear
        </button>
      </div>

      <label className="field">
        <span>Customer name</span>
        <input
          onChange={(event) => onCustomerNameChange(event.target.value)}
          placeholder="Davaa"
          type="text"
          value={customerName}
        />
      </label>

      <div className="cart-lines">
        {cart.length === 0 && <p className="empty-cart">No items selected.</p>}
        {cart.map((line) => (
          <article className="cart-line" key={line.id}>
            {line.image && <img src={line.image} alt="" loading="lazy" />}
            <div>
              <strong>{line.name}</strong>
              <span>
                {line.categoryLabel} · {line.size}
                {line.hasIce ? " · Ice" : ""}
              </span>
            </div>
            <div className="cart-actions">
              <button type="button" onClick={() => onUpdateQuantity(line.id, line.quantity - 1)}>
                -
              </button>
              <span>{line.quantity}</span>
              <button type="button" onClick={() => onUpdateQuantity(line.id, line.quantity + 1)}>
                +
              </button>
            </div>
            <strong>{formatMoney(line.unitPrice * line.quantity)}</strong>
            <button className="remove-button" type="button" onClick={() => onRemoveItem(line.id)}>
              Remove
            </button>
          </article>
        ))}
      </div>

      <div className="payment-grid" aria-label="Payment method">
        {PAYMENT_METHODS.map((method) => (
          <button
            className={paymentMethod === method ? "active" : ""}
            key={method}
            onClick={() => setPaymentMethod(method)}
            type="button"
          >
            {method}
          </button>
        ))}
      </div>

      <div className="summary-box">
        <div>
          <span>Subtotal</span>
          <strong>{formatMoney(subtotal)}</strong>
        </div>
        <div>
          <span>{discount.label || "Discount"}</span>
          <strong>-{formatMoney(discount.amount)}</strong>
        </div>
        <div className="grand-total">
          <span>Total</span>
          <strong>{formatMoney(finalTotal)}</strong>
        </div>
      </div>

      <button className="submit-button" disabled={cart.length === 0} onClick={onCheckout} type="button">
        Place order
      </button>
    </aside>
  );
}

export default CartPanel;
