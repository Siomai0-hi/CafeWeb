export const CATEGORY_CONFIG = {
  coffee: {
    label: "Coffee",
    accent: "#2f6f73",
    badge: "Fresh brew",
    description: "Espresso drinks, iced coffee, and rich milk classics.",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    supportsIce: true,
    sizePrices: { S: 0, M: 2000, L: 4000 },
  },
  tea: {
    label: "Tea",
    accent: "#9d4edd",
    badge: "Calm cup",
    description: "Green, milk, lemon, iced, and black tea for slower moments.",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",
    supportsIce: true,
    sizePrices: { S: 0, M: 1500, L: 3000 },
  },
  milkshake: {
    label: "Milkshake",
    accent: "#d86c47",
    badge: "Creamy",
    description: "Sweet blended shakes with chocolate, caramel, fruit, and Oreo.",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80",
    supportsIce: true,
    sizePrices: { S: 0, M: 2000, L: 4000 },
  },
  smoothie: {
    label: "Smoothie",
    accent: "#4a7c59",
    badge: "Fruit blend",
    description: "Bright fruit smoothies with mango, berries, and cranberry.",
    image:
      "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=900&q=80",
    supportsIce: true,
    sizePrices: { S: 0, M: 2000, L: 4000 },
  },
  dessert: {
    label: "Dessert",
    accent: "#e0a458",
    badge: "Baked today",
    description: "Cake slices, brownie, tiramisu, and warm croissants.",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",
    supportsIce: false,
    sizePrices: { S: 0, M: 1500, L: 3000 },
  },
  breakfast: {
    label: "Breakfast",
    accent: "#577590",
    badge: "Morning plate",
    description: "Sandwiches, pancakes, toast, omelette, and full breakfast plates.",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
    supportsIce: false,
    sizePrices: { S: 0, M: 1500, L: 3000 },
  },
};

export const DEFAULT_MENU = {
  coffee: [
    { id: "latte", name: "Latte", basePrice: 12000, description: "Soft milk foam with a smooth espresso base.", popular: true },
    { id: "americano", name: "Americano", basePrice: 10000, description: "Clean espresso stretched with hot water." },
    { id: "cappuccino", name: "Cappuccino", basePrice: 13000, description: "Balanced espresso, steamed milk, and thick foam.", popular: true },
    { id: "espresso", name: "Espresso", basePrice: 8000, description: "Short, bold, and aromatic double shot." },
    { id: "mocha", name: "Mocha", basePrice: 14000, description: "Chocolate, espresso, milk, and a mellow finish." },
  ],
  tea: [
    { id: "green-tea", name: "Green Tea", basePrice: 5000, description: "Light, grassy, and refreshing." },
    { id: "milk-tea", name: "Milk Tea", basePrice: 7000, description: "Creamy black tea with a gentle sweet note.", popular: true },
    { id: "lemon-tea", name: "Lemon Tea", basePrice: 6500, description: "Bright citrus tea served warm or iced." },
    { id: "ice-tea", name: "Ice Tea", basePrice: 6000, description: "Cold brewed tea with a clean finish." },
    { id: "black-tea", name: "Black Tea", basePrice: 5000, description: "Classic strong tea with deep aroma." },
  ],
  milkshake: [
    { id: "vanilla", name: "Vanilla", basePrice: 9000, description: "Creamy vanilla shake with a clean dairy finish." },
    { id: "chocolate", name: "Chocolate", basePrice: 9500, description: "Deep cocoa blended with chilled milk.", popular: true },
    { id: "strawberry-shake", name: "Strawberry", basePrice: 8700, description: "Sweet berry shake with a bright pink color." },
    { id: "oreo", name: "Oreo", basePrice: 10000, description: "Cookies, cream, and a thick blended texture.", popular: true },
    { id: "caramel", name: "Caramel", basePrice: 9500, description: "Smooth caramel shake with a buttery note." },
  ],
  smoothie: [
    { id: "mango", name: "Mango", basePrice: 8000, description: "Sunny mango blend with a silky body.", popular: true },
    { id: "strawberry-smoothie", name: "Strawberry", basePrice: 8500, description: "Fresh strawberry smoothie with light tartness." },
    { id: "blueberry", name: "Blueberry", basePrice: 9000, description: "Blueberry blend with a mellow berry finish." },
    { id: "cranberry", name: "Cranberry", basePrice: 9500, description: "Crisp cranberry smoothie with a bright edge." },
    { id: "blackberry", name: "Blackberry", basePrice: 9000, description: "Dark berry blend with natural sweetness." },
  ],
  dessert: [
    { id: "cheesecake", name: "Cheesecake", basePrice: 10000, description: "Creamy slice with a biscuit base.", popular: true },
    { id: "brownie", name: "Brownie", basePrice: 9000, description: "Dense chocolate brownie with crisp edges." },
    { id: "chocolate-cake", name: "Chocolate Cake", basePrice: 8500, description: "Layered chocolate cake with soft crumb." },
    { id: "tiramisu", name: "Tiramisu", basePrice: 8700, description: "Coffee-soaked dessert with mascarpone cream." },
    { id: "croissant", name: "Croissant", basePrice: 7000, description: "Flaky butter pastry, warmed before serving.", popular: true },
  ],
  breakfast: [
    { id: "egg-sandwich", name: "Egg Sandwich", basePrice: 8000, description: "Warm egg sandwich with a soft toasted bun." },
    { id: "english-breakfast", name: "English Breakfast", basePrice: 12000, description: "Full plate with eggs, toast, and sides.", popular: true },
    { id: "pancake", name: "Pancake", basePrice: 9500, description: "Soft pancakes with a gentle sweet finish." },
    { id: "avocado-toast", name: "Avocado Toast", basePrice: 11500, description: "Creamy avocado over crisp toast.", popular: true },
    { id: "omelette", name: "Omelette", basePrice: 10000, description: "Folded eggs with a fluffy center." },
  ],
};

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1800&q=80";

export const PAYMENT_METHODS = ["Cash", "Card", "QPay", "SocialPay"];

export function formatMoney(amount) {
  return `${new Intl.NumberFormat("en-US").format(Math.round(amount))} MNT`;
}

export function getUnitPrice(categoryKey, item, size, hasIce) {
  const category = CATEGORY_CONFIG[categoryKey];
  const sizePrice = category.sizePrices[size] ?? 0;
  const icePrice = category.supportsIce && hasIce ? 500 : 0;
  return item.basePrice + sizePrice + icePrice;
}

export function getDiscount(total, date = new Date()) {
  let percent = 0;
  let label = "";

  if (date.getMonth() === 1 && date.getDate() === 14) {
    percent = 0.3;
    label = "Valentine's Day";
  } else if (date.getDate() >= 29 && date.getDate() <= 31 && date.getDay() === 5) {
    percent = 0.2;
    label = "Black Friday";
  } else if (total >= 50000) {
    percent = 0.1;
    label = "Order over 50,000";
  }

  return {
    label,
    percent,
    amount: total * percent,
  };
}
