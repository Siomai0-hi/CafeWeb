function Header({ totalItems }) {
  return (
    <header className="topbar">
      <a className="brand" href="#menu" aria-label="CafeWeb home">
        CafeWeb
      </a>
      <nav aria-label="Main navigation">
        <a href="#menu">Menu</a>
        <a href="#checkout">Checkout</a>
        <a href="#admin">Add item</a>
      </nav>
      <a className="cart-chip" href="#checkout" aria-label={`${totalItems} items in cart`}>
        {totalItems}
      </a>
    </header>
  );
}

export default Header;
