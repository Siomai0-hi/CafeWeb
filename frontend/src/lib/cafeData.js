function unsplash(id, width = 1200) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const SCENE_IMAGES = {
  login: unsplash("photo-1495474472287-4d71bcdd2085", 1800),
  lounge: unsplash("photo-1442512595331-e89e73853f31", 1800),
  counter: unsplash("photo-1501339847302-ac426a4a7cbb", 1400),
};

export const PLACEHOLDER_IMAGES = {
  hot: "/images/menu/hot-drink.svg",
  cold: "/images/menu/cold-drink.svg",
  dessert: "/images/menu/dessert.svg",
  breakfast: "/images/menu/breakfast.svg",
};

// Product images are intentionally centralized here so they can be replaced later
// without touching the UI components.
export const PRODUCT_IMAGES = {
  espresso: unsplash("photo-1510707577719-ae7c14805e3a"),
  latte: unsplash("photo-1509042239860-f550ce710b93"),
  matcha: unsplash("photo-1536256263959-770b48d82b0a"),
  tea: unsplash("photo-1544787219-7f47ccb76574"),
  coldbrew: unsplash("photo-1461023058943-07fcbe16d735"),
  smoothie: unsplash("photo-1505252585461-04db1eb84625"),
  shake: unsplash("photo-1572490122747-3968b75cc699"),
  icedTea: unsplash("photo-1556679343-c7306c1976bc"),
  cheesecake: unsplash("photo-1533134242443-d4fd215305ad"),
  croissant: unsplash("photo-1555507036-ab1f4038808a"),
  tiramisu: unsplash("photo-1571877227200-a0d98ea607e9"),
  brownie: unsplash("photo-1606313564200-e75d5e30476c"),
  panini: unsplash("photo-1528736235302-52922df5c122"),
  toast: unsplash("photo-1525351484163-7529414344d8"),
  breakfast: unsplash("photo-1533089860892-a7c6f0a88666"),
  sandwich: unsplash("photo-1481070555726-e2fe8357725c"),
};

export const MENU_CATEGORIES = [
  {
    id: "hot-drinks",
    label: "Халуун ундаа",
    description: "Эспрессо, сүүтэй кофе болон халуун цай.",
    accent: "amber",
    image: PRODUCT_IMAGES.latte,
    items: [
      {
        id: "espresso",
        name: "Эспрессо",
        description: "Өтгөн амттай богино кофе.",
        basePrice: 6500,
        image: PRODUCT_IMAGES.espresso,
        popular: true,
      },
      {
        id: "vanilla-latte",
        name: "Ваниль латте",
        description: "Эспрессо, халуун сүү, ванилийн зөөлөн амт.",
        basePrice: 9500,
        image: PRODUCT_IMAGES.latte,
        popular: true,
      },
      {
        id: "matcha-cloud",
        name: "Матча үүлэн",
        description: "Матча болон зөөлөн сүүн хөөс.",
        basePrice: 11000,
        image: PRODUCT_IMAGES.matcha,
      },
      {
        id: "berry-tea",
        name: "Жимстэй цай",
        description: "Жимс, зөгийн бал, нимбэгтэй халуун цай.",
        basePrice: 8000,
        image: PRODUCT_IMAGES.tea,
      },
    ],
  },
  {
    id: "cold-drinks",
    label: "Хүйтэн ундаа",
    description: "Мөстэй кофе, смүүти, өтгөн шейк.",
    accent: "cyan",
    image: PRODUCT_IMAGES.coldbrew,
    items: [
      {
        id: "cold-brew",
        name: "Колд брю",
        description: "Удаан хандалсан мөстэй кофе.",
        basePrice: 10500,
        image: PRODUCT_IMAGES.coldbrew,
        popular: true,
      },
      {
        id: "mango-smoothie",
        name: "Манго смүүти",
        description: "Мангоны зөөлөн, сэрүүн смүүти.",
        basePrice: 9000,
        image: PRODUCT_IMAGES.smoothie,
      },
      {
        id: "oreo-shake",
        name: "Oreo шейк",
        description: "Жигнэмэг, кремтэй өтгөн шейк.",
        basePrice: 10000,
        image: PRODUCT_IMAGES.shake,
        popular: true,
      },
      {
        id: "iced-lemon-tea",
        name: "Мөстэй нимбэгтэй цай",
        description: "Нимбэг, гаатай сэрүүн цай.",
        basePrice: 7500,
        image: PRODUCT_IMAGES.icedTea,
      },
    ],
  },
  {
    id: "desserts",
    label: "Амттан",
    description: "Бялуу, круассан, жижиг амттан.",
    accent: "rose",
    image: PRODUCT_IMAGES.cheesecake,
    items: [
      {
        id: "blueberry-cheesecake",
        name: "Нэрстэй чизкейк",
        description: "Бяслагтай крем, жигнэмэгэн суурь, нэрсний амт.",
        basePrice: 12500,
        image: PRODUCT_IMAGES.cheesecake,
        popular: true,
      },
      {
        id: "butter-croissant",
        name: "Цөцгийн круассан",
        description: "Дулаахан, хөвсгөр круассан.",
        basePrice: 7500,
        image: PRODUCT_IMAGES.croissant,
      },
      {
        id: "tiramisu-cup",
        name: "Тирамису аяга",
        description: "Кофены амттай зөөлөн амттан.",
        basePrice: 9800,
        image: PRODUCT_IMAGES.tiramisu,
      },
      {
        id: "dark-brownie",
        name: "Шоколадтай брауни",
        description: "Өтгөн шоколадтай брауни.",
        basePrice: 9000,
        image: PRODUCT_IMAGES.brownie,
      },
    ],
  },
  {
    id: "breakfast",
    label: "Өглөөний хоол",
    description: "Сэндвич, тост, өглөөний хөнгөн хоол.",
    accent: "emerald",
    image: PRODUCT_IMAGES.breakfast,
    items: [
      {
        id: "chicken-panini",
        name: "Тахиатай панини",
        description: "Тахиа, песто, улаан лооль, бяслагтай.",
        basePrice: 16500,
        image: PRODUCT_IMAGES.panini,
        popular: true,
      },
      {
        id: "avocado-toast",
        name: "Авокадо тост",
        description: "Шаржигнуур талх, зөөлөн авокадо.",
        basePrice: 11500,
        image: PRODUCT_IMAGES.toast,
      },
      {
        id: "english-breakfast",
        name: "Англи өглөөний хоол",
        description: "Өндөг, тост, өглөөний хачиртай таваг.",
        basePrice: 14000,
        image: PRODUCT_IMAGES.breakfast,
      },
      {
        id: "egg-sandwich",
        name: "Өндөгтэй сэндвич",
        description: "Дулаахан талхтай өндөгний сэндвич.",
        basePrice: 8000,
        image: PRODUCT_IMAGES.sandwich,
      },
    ],
  },
];

export const PAYMENT_METHODS = ["Бэлэн", "Карт", "QPay", "SocialPay"];

export const CAFE_NOTES = [
  "Дулаан гэрэл, намуухан хөгжим, шинэхэн кофены үнэр.",
  "Авч явах захиалга барны дарааллаар бэлтгэгдэнэ.",
  "10:00 цагаас хойш цонхны дэргэд суухад хамгийн тухтай.",
];

export const CATEGORY_CONFIG = Object.fromEntries(
  MENU_CATEGORIES.map((category) => [
    category.id,
    {
      label: category.label,
      accent: category.accent,
      badge: category.description,
      description: category.description,
      image: category.image,
      supportsIce: category.id === "cold-drinks",
      sizePrices: { S: 0, M: 2000, L: 4000 },
    },
  ]),
);

export const DEFAULT_MENU = Object.fromEntries(
  MENU_CATEGORIES.map((category) => [category.id, category.items]),
);

export const HERO_IMAGE = SCENE_IMAGES.lounge;

export function formatMoney(amount) {
  return `${new Intl.NumberFormat("mn-MN").format(Math.round(amount))} ₮`;
}

export function getUnitPrice(categoryKey, item, size = "S", hasIce = false) {
  const category = CATEGORY_CONFIG[categoryKey];
  const sizePrice = category?.sizePrices?.[size] ?? 0;
  const icePrice = category?.supportsIce && hasIce ? 500 : 0;
  return item.basePrice + sizePrice + icePrice;
}

export function getDiscount(total, date = new Date()) {
  let percent = 0;
  let label = "";

  if (date.getMonth() === 1 && date.getDate() === 14) {
    percent = 0.3;
    label = "Валентины хямдрал";
  } else if (date.getDate() >= 29 && date.getDate() <= 31 && date.getDay() === 5) {
    percent = 0.2;
    label = "Black Friday";
  } else if (total >= 50000) {
    percent = 0.1;
    label = "50,000₮-өөс дээш";
  }

  return {
    label,
    percent,
    amount: total * percent,
  };
}
