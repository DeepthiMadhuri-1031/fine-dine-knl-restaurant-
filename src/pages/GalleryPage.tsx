import React, { useState } from 'react';
import { Sparkles, Maximize2, X, ChevronRight, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  desc: string;
}

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: "g-1",
      title: "Hyderabad Veg Biryani",
      category: "Biryani & Rice",
      image: "/images/dishes/hyderabad-veg-biryani-hq.webp",
      desc: "Fragrant basmati layered with vegetables, saffron, mint and crispy golden onions in a traditional handi."
    },
    {
      id: "g-2",
      title: "KNL Special Veg Biryani",
      category: "Biryani & Rice",
      image: "/images/dishes/knl-special-veg-biryani-hq.webp",
      desc: "House specialty dum biryani garnished with browned paneer, mushrooms, and roasted cashews."
    },
    {
      id: "g-3",
      title: "Paneer 65 Platter",
      category: "Starters",
      image: "/images/dishes/paneer-65-hq.webp",
      desc: "Crisp spiced paneer cubes tossed with fresh curry leaves, green chillies, and served with mint chutney."
    },
    {
      id: "g-4",
      title: "Bagara Paneer Kadai",
      category: "Curries",
      image: "/images/dishes/bagara-paneer-hq.webp",
      desc: "Velvety nutty Andhra peanut-sesame gravy with fresh paneer and cream in a copper kadai."
    },
    {
      id: "g-5",
      title: "Sizzling Dal Tadka",
      category: "Curries",
      image: "/images/dishes/dal-tadka-hq.webp",
      desc: "Yellow dal slow-cooked and tempered with desi ghee, garlic, cumin, and whole dry red chillies."
    },
    {
      id: "g-6",
      title: "Tandoori Butter Naan",
      category: "Breads",
      image: "/images/dishes/butter-naan-hq.webp",
      desc: "Freshly baked clay oven flatbread brushed with golden melted butter and sprinkled with herbs."
    },
    {
      id: "g-7",
      title: "Fresh Mango Lassi & Coolers",
      category: "Beverages",
      image: "/images/dishes/refreshing-beverages-hq.webp",
      desc: "Chilled thick mango lassi with saffron alongside an icy fresh mint lemon cooler."
    },
    {
      id: "g-8",
      title: "Royal Dining Feast",
      category: "Ambience",
      image: "/images/hero/restaurant-hero-hq.webp",
      desc: "Fine Dine KNL's warm dining table spread with authentic Indian dishes, curries, and warm hospitality."
    }
  ];

  const categories = ['All', 'Biryani & Rice', 'Starters', 'Curries', 'Breads', 'Beverages', 'Ambience'];

  const filteredItems = galleryItems.filter(
    item => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <div className="pt-28 pb-24 bg-charcoal-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Showcase</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-100">
            From Our Kitchen & Tables
          </h1>
          <p className="text-sm sm:text-base text-cream-300">
            A celebration of authentic Indian flavors, crafted with fresh ingredients, traditional spices, and genuine Kurnool warmth.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md'
                    : 'bg-charcoal-850 text-cream-300 hover:bg-charcoal-800 border border-charcoal-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative bg-charcoal-850 rounded-2xl overflow-hidden border border-charcoal-700/80 hover:border-gold-500/40 cursor-pointer shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden bg-charcoal-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
                <span className="text-[10px] text-gold-400 uppercase tracking-widest font-semibold block">
                  {item.category}
                </span>
                <h3 className="font-serif text-base font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-cream-300/80 line-clamp-2">
                  {item.desc}
                </p>
              </div>

              <div className="absolute top-3 right-3 p-2 rounded-lg bg-charcoal-900/80 text-cream-200 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Link to Menu Scans */}
        <div className="bg-charcoal-850 border border-charcoal-700 rounded-2xl p-8 text-center space-y-4">
          <h3 className="font-serif text-2xl font-bold text-cream-100">
            Looking for the printed menu photographs?
          </h3>
          <p className="text-sm text-cream-300 max-w-xl mx-auto">
            You can view all 19 original and digitally enhanced printed menu scans directly in our dedicated menu viewer.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 text-charcoal-950 text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition-all shadow-md"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Open Menu Scans Section</span>
          </Link>
        </div>

        {/* Lightbox Modal */}
        {activeItem && (
          <div
            className="fixed inset-0 z-50 bg-charcoal-950/95 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn"
            onClick={() => setActiveItem(null)}
          >
            <div
              className="bg-charcoal-900 border border-charcoal-700 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-charcoal-950/80 text-cream-300 hover:text-white hover:bg-charcoal-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[16/10] bg-black">
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-2">
                <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold">
                  {activeItem.category}
                </span>
                <h3 className="font-serif text-2xl font-bold text-cream-100">
                  {activeItem.title}
                </h3>
                <p className="text-sm text-cream-300 leading-relaxed">
                  {activeItem.desc}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
