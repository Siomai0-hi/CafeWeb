import { formatMoney } from "../lib/cafeData.js";

function Receipt({ receipt, onClose }) {
  if (!receipt) {
    return null;
  }

  return (
    <div className="receipt-backdrop" role="presentation">
      <section className="receipt-dialog" aria-labelledby="receiptTitle" role="dialog" aria-modal="true">
        <p className="eyebrow">Receipt</p>
        <h2 id="receiptTitle">{receipt.id}</h2>
        <p className="receipt-meta">
          {receipt.customerName || "Guest"} · {receipt.paymentMethod}
        </p>

        <div className="receipt-lines">
          {receipt.lines.map((line) => (
            <div key={line.id}>
              {line.image && <img src={line.image} alt="" loading="lazy" />}
              <span>{line.name} x{line.quantity}</span>
              <strong>{formatMoney(line.unitPrice * line.quantity)}</strong>
            </div>
          ))}
        </div>

        {receipt.discount.amount > 0 && (
          <div className="receipt-total muted">
            <span>{receipt.discount.label}</span>
            <strong>-{formatMoney(receipt.discount.amount)}</strong>
          </div>
        )}

        <div className="receipt-total">
          <span>Amount due</span>
          <strong>{formatMoney(receipt.finalTotal)}</strong>
        </div>

        <button className="submit-button" type="button" onClick={onClose}>
          Done
        </button>
      </section>
    </div>
  );
}

export default Receipt;
