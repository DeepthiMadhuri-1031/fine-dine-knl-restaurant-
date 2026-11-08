import React, { useState } from 'react';
import { Sparkles, Maximize2, X, UtensilsCrossed, CalendarCheck, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GALLERY_ITEMS } from '../data/ajwaData';

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<{ id: string; title: string; category: string; imageUrl: string; caption: string } | null>(null);

  const categories = ['All', 'Mandi & Biryani', 'Ambience', 'Starters & Tandoor', 'Curries & Seafood', 'Mocktails & Drinks'];

  const filteredItems = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category.includes(activeCategory) || activeCategory.includes(item.category));

  return (
    <div className="pt-28 pb-24 bg-charcoal-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Visual Repertoire</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-100">
            Ajwa Exotica Gallery
          </h1>
          <p className="text-sm sm:text-base text-cream-300 font-light">
            A visual journey through our biryani craft, Arabian mandi platters, outdoor terrace, and private dining rooms.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md shadow-gold-500/20'
                  : 'bg-charcoal-900 text-cream-300 hover:text-gold-300 hover:bg-charcoal-850 border border-charcoal-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-2xl overflow-hidden bg-charcoal-900 border border-charcoal-800 cursor-pointer shadow-xl hover:border-gold-500/40 transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-charcoal-950/80 border border-charcoal-700 text-gold-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-base font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-cream-300/80 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {activeItem && (
          <div
            className="fixed inset-0 z-50 bg-charcoal-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setActiveItem(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-charcoal-900 border border-gold-500/40 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[70vh] bg-charcoal-950 flex items-center justify-center overflow-hidden">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="max-h-[70vh] w-auto object-contain"
                />
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-charcoal-950/80 border border-charcoal-700 text-cream-200 hover:text-gold-400 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 bg-charcoal-900 border-t border-charcoal-800">
                <span className="text-xs uppercase tracking-wider text-gold-400 font-semibold block mb-1">
                  {activeItem.category}
                </span>
                <h3 className="font-serif text-2xl font-bold text-cream-100">
                  {activeItem.title}
                </h3>
                <p className="text-sm text-cream-300 mt-2 leading-relaxed">
                  {activeItem.caption}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center pt-8 border-t border-charcoal-800 flex justify-center">
          <Link
            to="/#reservation"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xl"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Reserve a Table</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
