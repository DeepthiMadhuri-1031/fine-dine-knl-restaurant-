export interface AjwaDish {
  id: string;
  name: string;
  category: 'Biryani' | 'Mandi' | 'Kebabs' | 'Mughlai' | 'Chinese' | 'North Indian' | 'Seafood' | 'Beverages';
  description: string;
  price: number;
  isEstimatedPrice: boolean; // Transparently marked as demo/estimated until verified by owner
  isVeg: boolean;
  bestseller?: boolean;
  imageUrl: string;
  fallbackImageUrl?: string;
  altText: string;
  spicyLevel?: 'Mild' | 'Medium' | 'Spicy';
  tags?: string[];
}

export const AJWA_RESTAURANT_INFO = {
  name: "Ajwa Exotica",
  tagline: "Where Flavour Meets Elegance",
  subtitle: "Fine-dining multicuisine family restaurant in Kurnool, Andhra Pradesh",
  businessCategory: "Fine-dining, multicuisine family restaurant",
  address: {
    line1: "3rd Floor, above Vishal Mart",
    locality: "Venkata Ramana Colony, Ameen Abbas Nagar",
    city: "Kurnool",
    state: "Andhra Pradesh",
    pincode: "518003",
    country: "India",
    full: "3rd Floor, above Vishal Mart, Venkata Ramana Colony, Ameen Abbas Nagar, Kurnool, Andhra Pradesh 518003, India"
  },
  phone: "085182 53599",
  phoneDisplay: "085182 53599",
  whatsappNumber: "918518253599", // International normalized format for WhatsApp API
  googleRating: {
    score: 4.4,
    totalReviews: 611,
    source: "Google Reviews (Supplied by Requester)",
    spendRange: "₹200–₹400 per person (Typical reported spend)"
  },
  openingHours: {
    closingTime: "Closes at 11:30 PM",
    displayNotice: "Dine-in closes at 11:30 PM (Daily schedule subject to owner verification)",
    lunchSlot: "11:30 AM – 4:00 PM",
    dinnerSlot: "7:00 PM – 11:30 PM"
  },
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Ajwa+Exotica,+3rd+Floor,+above+Vishal+Mart,+Venkata+Ramana+Colony,+Ameen+Abbas+Nagar,+Kurnool,+Andhra+Pradesh+518003",
  googleMapsEmbedQuery: "Ajwa+Exotica+Kurnool+Andhra+Pradesh",
  highlights: [
    { title: "Family-Friendly Dining", desc: "Spacious luxury seating thoughtfully arranged for family feasts and celebrations." },
    { title: "Authentic Biryani & Mandi", desc: "Signature Chicken & Mutton dum biryanis and aromatic Arabian mandi platters." },
    { title: "Tandoor & Kebabs", desc: "Succulent charcoal-grilled kebabs with traditional mint chutney and onions." },
    { title: "Mughlai & North Indian", desc: "Rich velvety gravies, Shahi curries, and clay-oven tandoori breads." },
    { title: "Chinese & Sizzling Starters", desc: "Crisp wok-tossed starters, spicy noodles, and oriental fried rice." },
    { title: "Coastal Seafood Specials", desc: "Flavourful fish curries and crisp spiced prawns made to order." },
    { title: "Outdoor Terrace Seating", desc: "Breezy third-floor open-air seating overlooking the Kurnool skyline." },
    { title: "Private Dining Room", desc: "Exclusive, elegant private salon for business dinners, birthdays, and parties." },
    { title: "Convenient Parking", desc: "Reported dedicated parking space available for cars and two-wheelers." }
  ]
};

export const MENU_CATEGORIES = [
  "All",
  "Biryani",
  "Mandi",
  "Kebabs",
  "Mughlai",
  "Chinese",
  "North Indian",
  "Seafood",
  "Beverages"
] as const;

export type MenuCategoryType = typeof MENU_CATEGORIES[number];

export const AJWA_DISHES: AjwaDish[] = [
  // --- BIRYANI ---
  {
    id: "ajwa-chicken-dum-biryani",
    name: "Chicken Dum Biryani",
    category: "Biryani",
    description: "Tender chicken pieces marinated in freshly pounded spices, layered with aged basmati rice, saffron, and fried onions, slow-cooked in handi seal.",
    price: 260,
    isEstimatedPrice: true,
    isVeg: false,
    bestseller: true,
    imageUrl: "/images/ajwa/chicken-biryani.jpg",
    fallbackImageUrl: "/images/dishes/spl-hyderabad-biryani.webp",
    altText: "Authentic Hyderabadi Chicken Dum Biryani served with spiced salan and raita at Ajwa Exotica",
    spicyLevel: "Medium",
    tags: ["Signature", "Bestseller"]
  },
  {
    id: "ajwa-mutton-biryani",
    name: "Special Mutton Biryani",
    category: "Biryani",
    description: "Succulent cuts of fresh mutton gently simmered with aromatic spices, brown onions, and long-grain royal basmati rice.",
    price: 340,
    isEstimatedPrice: true,
    isVeg: false,
    bestseller: true,
    imageUrl: "/images/ajwa/mutton-biryani.jpg",
    fallbackImageUrl: "/images/dishes/hyderabad-veg-biryani-hq.webp",
    altText: "Royal Special Mutton Dum Biryani in traditional brass vessel",
    spicyLevel: "Medium",
    tags: ["Chef Special", "Signature"]
  },
  {
    id: "ajwa-paneer-dum-biryani",
    name: "Royal Paneer Dum Biryani",
    category: "Biryani",
    description: "Charred cottage cheese cubes tossed in fragrant Hyderabadi biryani masala, slow-dum cooked with basmati rice and golden cashews.",
    price: 220,
    isEstimatedPrice: true,
    isVeg: true,
    bestseller: false,
    imageUrl: "/images/dishes/kaju-paneer-biryani.webp",
    fallbackImageUrl: "/images/dishes/kaju-biryani.webp",
    altText: "Fragrant Royal Paneer Dum Biryani with fried cashews and herbs",
    spicyLevel: "Mild",
    tags: ["Vegetarian Delight"]
  },

  // --- MANDI ---
  {
    id: "ajwa-chicken-mandi",
    name: "Arabian Chicken Mandi",
    category: "Mandi",
    description: "Traditional Arabian spiced rice cooked with stock, topped with golden crispy roasted chicken, roasted almonds, and accompanied by tangy Dakous sauce.",
    price: 320,
    isEstimatedPrice: true,
    isVeg: false,
    bestseller: true,
    imageUrl: "/images/ajwa/chicken-mandi.jpg",
    fallbackImageUrl: "/images/ajwa/ajwa-hero-feast.jpg",
    altText: "Arabian Chicken Mandi platter with spiced rice, roasted nuts, and garlic dip",
    spicyLevel: "Mild",
    tags: ["Signature Mandi", "Most Ordered"]
  },
  {
    id: "ajwa-mutton-juicy-mandi",
    name: "Mutton Juicy Mandi",
    category: "Mandi",
    description: "Melt-in-mouth mutton shoulder braised until fork-tender with whole cardamom, dried lime, and cloves, served over fragrant mandi rice.",
    price: 420,
    isEstimatedPrice: true,
    isVeg: false,
    bestseller: true,
    imageUrl: "/images/ajwa/ajwa-hero-feast.jpg",
    fallbackImageUrl: "/images/ajwa/mutton-biryani.jpg",
    altText: "Juicy Arabian Mutton Mandi feast on large sharing platter",
    spicyLevel: "Medium",
    tags: ["Family Feast", "Premium"]
  },

  // --- KEBABS ---
  {
    id: "ajwa-tandoori-murgh",
    name: "Tandoori Murgh (Full / Half)",
    category: "Kebabs",
    description: "Whole chicken marinated overnight in Kashmiri chilli, yogurt, crushed ginger-garlic, and roasted over glowing charcoal embers.",
    price: 290,
    isEstimatedPrice: true,
    isVeg: false,
    bestseller: true,
    imageUrl: "/images/ajwa/chicken-tikka-kebab.jpg",
    fallbackImageUrl: "/images/dishes/paneer-65-hq.webp",
    altText: "Charcoal grilled red tandoori chicken kebab with fresh lemon wedges",
    spicyLevel: "Spicy",
    tags: ["Charcoal Tandoor"]
  },
  {
    id: "ajwa-reshmi-kebab",
    name: "Murgh Reshmi Kebab",
    category: "Kebabs",
    description: "Silky boneless chicken skewers coated with cream, cashew paste, roasted gram flour, and delicate green cardamom.",
    price: 280,
    isEstimatedPrice: true,
    isVeg: false,
    bestseller: false,
    imageUrl: "/images/ajwa/chicken-tikka-kebab.jpg",
    fallbackImageUrl: "/images/dishes/paneer-65.webp",
    altText: "Delicate creamy Reshmi chicken kebabs roasted on metal skewers",
    spicyLevel: "Mild",
    tags: ["Melt-in-Mouth"]
  },
  {
    id: "ajwa-paneer-tikka",
    name: "Tandoori Paneer Tikka",
    category: "Kebabs",
    description: "Fresh cottage cheese cubes, bell peppers, and red onions skewers basted in carom-seed spiced yogurt and fire-roasted.",
    price: 210,
    isEstimatedPrice: true,
    isVeg: true,
    bestseller: true,
    imageUrl: "/images/dishes/paneer-65-hq.webp",
    fallbackImageUrl: "/images/dishes/bagara-paneer-hq.webp",
    altText: "Charred cottage cheese paneer tikka with capsicum and mint dip",
    spicyLevel: "Medium",
    tags: ["Vegetarian Starter"]
  },

  // --- MUGHLAI ---
  {
    id: "ajwa-mughlai-butter-chicken",
    name: "Mughlai Butter Chicken",
    category: "Mughlai",
    description: "Succulent shredded tandoori chicken cooked in a velvety tomato, honey, and churned butter gravy, finished with fragrant kasuri methi.",
    price: 280,
    isEstimatedPrice: true,
    isVeg: false,
    bestseller: true,
    imageUrl: "/images/ajwa/mughlai-chicken.jpg",
    fallbackImageUrl: "/images/dishes/kadai-paneer.webp",
    altText: "Rich orange Mughlai Butter Chicken curry topped with fresh cream swirl",
    spicyLevel: "Mild",
    tags: ["Classic Mughlai"]
  },
  {
    id: "ajwa-shahi-kadai-gosht",
    name: "Kadai Mutton",
    category: "Mughlai",
    description: "Slow-cooked mutton pieces braised in an iron kadai with roasted coriander seeds, black peppercorns, bell peppers, and onion gravy.",
    price: 360,
    isEstimatedPrice: true,
    isVeg: false,
    bestseller: false,
    imageUrl: "/images/ajwa/mughlai-chicken.jpg",
    fallbackImageUrl: "/images/dishes/kaju-curry.webp",
    altText: "Spicy Kadai Mutton with fresh ginger juliennes and whole coriander",
    spicyLevel: "Spicy",
    tags: ["North Indian Feast"]
  },

  // --- CHINESE ---
  {
    id: "ajwa-schezwan-fried-rice",
    name: "Schezwan Chicken Fried Rice",
    category: "Chinese",
    description: "Aromatic wok-tossed rice with shredded chicken, eggs, crispy spring onions, and spicy homemade red Schezwan sauce.",
    price: 210,
    isEstimatedPrice: true,
    isVeg: false,
    bestseller: true,
    imageUrl: "/images/dishes/knl-spl-fried-rice.webp",
    fallbackImageUrl: "/images/dishes/veg-fried-rice.webp",
    altText: "Wok tossed spicy Schezwan fried rice with chicken and spring onions",
    spicyLevel: "Spicy",
    tags: ["Wok Special"]
  },
  {
    id: "ajwa-chilli-garlic-noodles",
    name: "Chilli Garlic Hakka Noodles",
    category: "Chinese",
    description: "Stir-fried noodles with crisp julienned vegetables, roasted garlic, dark soy, and toasted sesame.",
    price: 180,
    isEstimatedPrice: true,
    isVeg: true,
    bestseller: false,
    imageUrl: "/images/ajwa/chinese-hakka-noodles.jpg",
    fallbackImageUrl: "/images/dishes/veg-noodles.webp",
    altText: "Sizzling Hakka noodles tossed with bell peppers and shredded cabbage",
    spicyLevel: "Medium",
    tags: ["Indo-Chinese"]
  },
  {
    id: "ajwa-crispy-baby-corn",
    name: "Crispy Baby Corn Manchurian",
    category: "Chinese",
    description: "Golden fried tender baby corn fingers tossed in savoury soy-garlic glaze with diced bell peppers and green chillies.",
    price: 170,
    isEstimatedPrice: true,
    isVeg: true,
    bestseller: false,
    imageUrl: "/images/dishes/baby-corn-manchurian.webp",
    fallbackImageUrl: "/images/dishes/paneer-65.webp",
    altText: "Crispy glazed baby corn Manchurian starter with scallions",
    spicyLevel: "Medium",
    tags: ["Crispy Starter"]
  },

  // --- NORTH INDIAN & BREADS ---
  {
    id: "ajwa-bagara-paneer",
    name: "Royal Bagara Paneer",
    category: "North Indian",
    description: "Soft paneer cubes simmered in a spiced poppy seed and cashew nut gravy tempered with cumin, mustard, and curry leaves.",
    price: 210,
    isEstimatedPrice: true,
    isVeg: true,
    bestseller: true,
    imageUrl: "/images/dishes/bagara-paneer-hq.webp",
    fallbackImageUrl: "/images/dishes/kadai-paneer.webp",
    altText: "Creamy Royal Bagara Paneer curry garnished with fresh coriander",
    spicyLevel: "Mild",
    tags: ["Vegetarian Special"]
  },
  {
    id: "ajwa-butter-naan",
    name: "Clay Oven Butter Naan",
    category: "North Indian",
    description: "Hand-stretched leavened refined flour bread baked against tandoor walls and brushed liberally with creamy butter.",
    price: 45,
    isEstimatedPrice: true,
    isVeg: true,
    bestseller: true,
    imageUrl: "/images/dishes/butter-naan-hq.webp",
    fallbackImageUrl: "/images/dishes/garlic-naan.webp",
    altText: "Hot tandoor baked butter naan with charred blisters and melted butter",
    spicyLevel: "Mild",
    tags: ["Tandoori Bread"]
  },
  {
    id: "ajwa-dal-tadka",
    name: "Dal Tadka (Desi Ghee)",
    category: "North Indian",
    description: "Yellow lentils cooked soft with turmeric, then tempered in bubbling pure cow ghee with cumin, garlic, and dried red chillies.",
    price: 160,
    isEstimatedPrice: true,
    isVeg: true,
    bestseller: false,
    imageUrl: "/images/dishes/dal-tadka-hq.webp",
    fallbackImageUrl: "/images/dishes/dal-fry.webp",
    altText: "Golden Dal Tadka with smoky red chilli ghee tempering",
    spicyLevel: "Mild",
    tags: ["Comfort Food"]
  },

  // --- SEAFOOD ---
  {
    id: "ajwa-coastal-fish-curry",
    name: "Coastal Spiced Fish Curry",
    category: "Seafood",
    description: "Fresh catch fish steaks simmered in a tangy tamarind, coconut, and roasted red chilli gravy, infused with fenugreek and curry leaves.",
    price: 310,
    isEstimatedPrice: true,
    isVeg: false,
    bestseller: true,
    imageUrl: "/images/ajwa/coastal-fish-curry.jpg",
    fallbackImageUrl: "/images/dishes/kaju-curry.webp",
    altText: "Tangy and spicy coastal fish curry in earthenware bowl",
    spicyLevel: "Spicy",
    tags: ["Seafood Special"]
  },
  {
    id: "ajwa-crispy-dragon-prawns",
    name: "Crispy Dragon Prawns",
    category: "Seafood",
    description: "Tiger prawns crisped to golden perfection, basted with fiery sweet chilli wok reduction, cashews, and bell peppers.",
    price: 340,
    isEstimatedPrice: true,
    isVeg: false,
    bestseller: false,
    imageUrl: "/images/ajwa/coastal-fish-curry.jpg",
    fallbackImageUrl: "/images/dishes/paneer-65-hq.webp",
    altText: "Golden wok crisped spicy dragon prawns with sesame seeds",
    spicyLevel: "Spicy",
    tags: ["Chef Special"]
  },

  // --- BEVERAGES & MOCKTAILS ---
  {
    id: "ajwa-blue-lagoon",
    name: "Ajwa Blue Lagoon Mocktail",
    category: "Beverages",
    description: "Refreshing blend of blue curaçao syrup, fresh lime juice, crushed mint, and chilled sparkling soda over crushed ice.",
    price: 120,
    isEstimatedPrice: true,
    isVeg: true,
    bestseller: true,
    imageUrl: "/images/dishes/blue-curacao.webp",
    fallbackImageUrl: "/images/dishes/mocktails.webp",
    altText: "Vibrant blue lagoon mocktail with lemon wheel and fresh mint garnish",
    spicyLevel: "Mild",
    tags: ["Cooler", "Signature Drink"]
  },
  {
    id: "ajwa-fresh-mint-mojito",
    name: "Virgin Mint Mojito",
    category: "Beverages",
    description: "Freshly muddled garden mint leaves, raw cane sugar, tangy key lime juice, and carbonated soda over crystal ice.",
    price: 110,
    isEstimatedPrice: true,
    isVeg: true,
    bestseller: false,
    imageUrl: "/images/dishes/mint-mojito.webp",
    fallbackImageUrl: "/images/dishes/refreshing-beverages-hq.webp",
    altText: "Icy virgin mint mojito in highball glass with crushed ice and mint sprig",
    spicyLevel: "Mild",
    tags: ["Refreshing"]
  },
  {
    id: "ajwa-cold-coffee-icecream",
    name: "Royal Cold Coffee with Ice Cream",
    category: "Beverages",
    description: "Slow-brewed rich espresso blended with chilled milk and topped with a generous scoop of artisanal vanilla ice cream and chocolate drizzle.",
    price: 130,
    isEstimatedPrice: true,
    isVeg: true,
    bestseller: true,
    imageUrl: "/images/dishes/cold-coffee.webp",
    fallbackImageUrl: "/images/dishes/ice-cream-shake.webp",
    altText: "Thick frothy cold coffee with scoop of vanilla ice cream and chocolate sauce",
    spicyLevel: "Mild",
    tags: ["Dessert Beverage"]
  }
];

export const GALLERY_ITEMS = [
  {
    id: "gal-1",
    title: "Signature Arabian Mandi Feast",
    category: "Mandi & Biryani",
    imageUrl: "/images/ajwa/chicken-mandi.jpg",
    caption: "Slow-steamed spiced basmati rice topped with crispy roasted chicken, garnished with toasted dry fruits and accompanied by tangy tomato-herb Dakous sauce."
  },
  {
    id: "gal-2",
    title: "Hyderabadi Chicken Dum Biryani",
    category: "Mandi & Biryani",
    imageUrl: "/images/ajwa/chicken-biryani.jpg",
    caption: "Aged long-grain basmati sealed with pure ghee, whole cardamom, saffron, and tender chicken, served piping hot in royal copper vessels."
  },
  {
    id: "gal-3",
    title: "Third-Floor Outdoor Terrace",
    category: "Ambience",
    imageUrl: "/images/ajwa/outdoor-terrace.jpg",
    caption: "Breezy open-air terrace dining above Vishal Mart, offering refreshing evening winds and an open city skyline for romantic or family dinners."
  },
  {
    id: "gal-4",
    title: "Charcoal Tandoori Murgh Kebabs",
    category: "Starters & Tandoor",
    imageUrl: "/images/ajwa/chicken-tikka-kebab.jpg",
    caption: "Smoky charcoal tandoor skewers marinated in spiced yogurt and hand-ground spices, served sizzling with pickled onions and mint chutney."
  },
  {
    id: "gal-5",
    title: "Main Dining Hall & Ambience",
    category: "Ambience",
    imageUrl: "/images/ajwa/dining-ambience.jpg",
    caption: "Warm champagne lighting, plush comfortable seating, and refined acoustic privacy created specifically for relaxed family dinners."
  },
  {
    id: "gal-6",
    title: "Private Dining Salon",
    category: "Ambience",
    imageUrl: "/images/ajwa/private-dining.jpg",
    caption: "Exclusive private room designed for intimate celebrations, anniversary dinners, corporate hosting, and private family get-togethers."
  },
  {
    id: "gal-7",
    title: "Coastal Spiced Fish Curry",
    category: "Curries & Seafood",
    imageUrl: "/images/ajwa/coastal-fish-curry.jpg",
    caption: "Traditional coastal tamarind and roasted coconut gravy slow-simmered with delicate fish steaks, seasoned with aromatic curry leaves."
  },
  {
    id: "gal-8",
    title: "Signature Blue Lagoon Cooler",
    category: "Mocktails & Drinks",
    imageUrl: "/images/dishes/blue-curacao.webp",
    caption: "Chilled tropical cooler with sparkling citrus fizz, crushed mint, and vibrant blue curaçao notes over mountain ice."
  }
];

export const REVIEWS_DATA = {
  averageRating: 4.4,
  reviewCount: 611,
  spendPerPerson: "₹200–₹400",
  platform: "Google Reviews",
  sourceLabel: "Verified Google Customer Reviews (Supplied Data)",
  ratingBreakdown: [
    { stars: 5, percentage: 72 },
    { stars: 4, percentage: 18 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 }
  ],
  verifiedThemes: [
    {
      title: "Biryani & Mandi Flavour",
      sentiment: "Positive",
      description: "Guests consistently praise the fragrant rice, tender meat quality, and rich spices in both the Chicken Dum Biryani and Arabian Mandi varieties."
    },
    {
      title: "Family Ambience & Hospitality",
      sentiment: "Positive",
      description: "Families appreciate the spacious air-conditioned hall, outdoor terrace breeze, polite staff, and child-friendly environment."
    },
    {
      title: "Value for Spend",
      sentiment: "Positive",
      description: "With reported typical spends of ₹200–₹400 per person, reviewers frequently highlight the generous portions and affordable multicuisine quality."
    },
    {
      title: "Service Speed During Peak Hours",
      sentiment: "Constructive Note",
      description: "Several reviews note that during peak weekend dinner rushes, wait times for fresh tandoor and mandi orders can be slightly longer due to live preparation."
    }
  ]
};
