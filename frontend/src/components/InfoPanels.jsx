function InfoPanels() {
  return (
    <section className="info-grid" aria-label="Cafe information">
      <article>
        <p className="eyebrow">Opening hours</p>
        <h2>07:00 - 21:00</h2>
        <dl>
          <div>
            <dt>Mon - Fri</dt>
            <dd>07:00 - 21:00</dd>
          </div>
          <div>
            <dt>Sat - Sun</dt>
            <dd>09:00 - 20:00</dd>
          </div>
        </dl>
      </article>

      <article>
        <p className="eyebrow">Location</p>
        <h2>3 branches</h2>
        <ul>
          <li>Sukhbaatar Square</li>
          <li>Peace Avenue</li>
          <li>Bayangol District</li>
        </ul>
      </article>
    </section>
  );
}

export default InfoPanels;
