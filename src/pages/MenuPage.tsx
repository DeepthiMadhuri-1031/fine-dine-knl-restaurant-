import React, { useState } from 'react';
import { MenuViewer } from '../components/MenuViewer';
import { DigitalMenu } from '../components/DigitalMenu';
import { Layers, Utensils, AlertTriangle, ShieldCheck } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scans' | 'digital'>('digital');

  const handleSelectMenuPage = (pageId: string) => {
    setActiveTab('scans');
    // Smooth scroll to top of viewer
    const el = document.getElementById('menu-view-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-28 pb-24 bg-charcoal-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="menu-view-container">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            <Utensils className="w-3.5 h-3.5" />
            <span>Pure Vegetarian Indian Menu</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-100">
            The Restaurant Menu
          </h1>
          <p className="text-sm sm:text-base text-cream-300 leading-relaxed">
            Explore authentic Indian curries, slow-cooked Hyderabadi biryanis, sizzling paneer starters, and clay-oven flatbreads. View both the original printed menu scans and our interactive searchable digital menu.
          </p>
        </div>

        {/* Verification and Price Conflict Reassurance Banner */}
        <div className="bg-charcoal-850 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-cream-100">
                Menu Revision Notice & Transparency Commitment
              </h4>
              <p className="text-xs text-cream-300 mt-0.5 leading-relaxed">
                The restaurant's physical menu archive includes multiple revisions (early printings vs. updated stickered menus). Where price conflicts exist (e.g. Bagara Paneer ₹220 vs ₹280, Biryani ₹180 vs ₹210), prices are marked <em>Under Review</em> until confirmed by the restaurant owner.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>19 Authentic Scans Verified</span>
          </div>
        </div>

        {/* Main Section Navigation Tabs */}
        <div className="flex justify-center">
          <div className="bg-charcoal-950 p-1.5 rounded-2xl border border-charcoal-700/80 flex flex-col sm:flex-row w-full sm:w-auto shadow-xl gap-1">
            <button
              onClick={() => setActiveTab('digital')}
              className={`flex items-center justify-center gap-2 px-4 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'digital'
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md'
                  : 'text-cream-300 hover:text-cream-100 hover:bg-charcoal-850'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Section B: Searchable Digital Menu</span>
            </button>

            <button
              onClick={() => setActiveTab('scans')}
              className={`flex items-center justify-center gap-2 px-4 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'scans'
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md'
                  : 'text-cream-300 hover:text-cream-100 hover:bg-charcoal-850'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Section A: Original & Enhanced Scans (19)</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'digital' ? (
          <div className="animate-fadeIn">
            <DigitalMenu onSelectMenuPage={handleSelectMenuPage} />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <MenuViewer />
          </div>
        )}

      </div>
    </div>
  );
};
