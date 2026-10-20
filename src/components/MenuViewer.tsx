import React, { useState, useEffect, useRef } from 'react';
import { MENU_PAGES, MenuPage } from '../data/menuPagesData';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Columns, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';

export const MenuViewer: React.FC = () => {
  // Global default: Enhanced view
  const [globalMode, setGlobalMode] = useState<'enhanced' | 'original' | 'compare'>('enhanced');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalPage, setActiveModalPage] = useState<MenuPage | null>(null);
  
  // Modal viewer state
  const [modalMode, setModalMode] = useState<'enhanced' | 'original' | 'split'>('enhanced');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPos, setPanPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filter pages
  const filteredPages = MENU_PAGES.filter((page) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Spreads') return page.type === 'spread';
    if (selectedCategory === 'Single Pages') return page.type === 'single';
    if (selectedCategory === 'Revised Editions') return page.edition.includes('Revised');
    return page.categories.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase()));
  });

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeModalPage) return;
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        navigateModal(1);
      } else if (e.key === 'ArrowLeft') {
        navigateModal(-1);
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel(z => Math.min(3, z + 0.25));
      } else if (e.key === '-') {
        setZoomLevel(z => Math.max(1, z - 0.25));
      } else if (e.key === '0') {
        resetZoom();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalPage]);

  const openModal = (page: MenuPage) => {
    setActiveModalPage(page);
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
    setModalMode(globalMode === 'original' ? 'original' : 'enhanced');
  };

  const closeModal = () => {
    setActiveModalPage(null);
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  const navigateModal = (direction: number) => {
    if (!activeModalPage) return;
    const currentIndex = MENU_PAGES.findIndex(p => p.id === activeModalPage.id);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = MENU_PAGES.length - 1;
    if (nextIndex >= MENU_PAGES.length) nextIndex = 0;
    setActiveModalPage(MENU_PAGES[nextIndex]);
    resetZoom();
  };

  // Mouse pan handlers for zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panPos.x, y: e.clientY - panPos.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPos({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls Toolbar */}
      <div className="bg-charcoal-850 border border-charcoal-700/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                Section A
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All 19 Scans Enhanced with Pillow
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-cream-100 mt-2">
              Menu Photographs & Enhancement Viewer
            </h3>
            <p className="text-sm text-cream-300 mt-1 max-w-2xl">
              Inspect all 19 original photographs from the restaurant's printed menu alongside high-definition enhanced editions with sharpened typography, balanced exposure, and crisp dish colors.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-charcoal-900 p-1.5 rounded-xl border border-charcoal-700">
            <button
              onClick={() => setGlobalMode('enhanced')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                globalMode === 'enhanced'
                  ? 'bg-gold-500 text-charcoal-950 shadow-md font-bold'
                  : 'text-cream-300 hover:text-cream-100 hover:bg-charcoal-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enhanced View (Default)</span>
            </button>

            <button
              onClick={() => setGlobalMode('compare')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                globalMode === 'compare'
                  ? 'bg-gold-500 text-charcoal-950 shadow-md font-bold'
                  : 'text-cream-300 hover:text-cream-100 hover:bg-charcoal-800'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side Compare</span>
            </button>

            <button
              onClick={() => setGlobalMode('original')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                globalMode === 'original'
                  ? 'bg-gold-500 text-charcoal-950 shadow-md font-bold'
                  : 'text-cream-300 hover:text-cream-100 hover:bg-charcoal-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Original Photo Backup</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-6 pt-5 border-t border-charcoal-700/60 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-cream-400 mr-2 font-medium">Filter Scans:</span>
          {['All', 'Spreads', 'Single Pages', 'Revised Editions', 'Biryani', 'Paneer Curries', 'Vegetable'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                selectedCategory === cat
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40 font-medium'
                  : 'bg-charcoal-900 text-cream-300 hover:bg-charcoal-800 border border-charcoal-800'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs text-cream-400 font-mono">
            Showing {filteredPages.length} of 19 pages
          </span>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.map((page) => {
          const displayImage = globalMode === 'original' ? page.originalSrc : page.enhancedSrc;
          
          return (
            <div
              key={page.id}
              className="bg-charcoal-850 rounded-2xl border border-charcoal-700/70 overflow-hidden hover:border-gold-500/40 transition-all duration-300 shadow-xl group flex flex-col"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-charcoal-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gold-400 px-2 py-0.5 rounded bg-charcoal-900 border border-gold-500/30">
                      Page {page.pageNumber}
                    </span>
                    <span className="text-[11px] text-cream-400 uppercase tracking-wider">
                      {page.type === 'spread' ? 'Two-Page Spread' : 'Single Portrait'}
                    </span>
                  </div>
                  <h4 className="font-serif font-semibold text-cream-100 text-sm mt-1.5 line-clamp-1">
                    {page.title}
                  </h4>
                </div>

                <button
                  onClick={() => openModal(page)}
                  className="p-2 rounded-lg bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-cream-300 transition-colors"
                  title="Expand to Fullscreen Viewer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Image Preview Container */}
              <div className="relative bg-charcoal-950 overflow-hidden aspect-[4/3] flex items-center justify-center p-2">
                {globalMode === 'compare' ? (
                  // Side-by-side thumbnail comparison
                  <div className="grid grid-cols-2 gap-1 w-full h-full">
                    <div className="relative h-full overflow-hidden rounded border border-charcoal-800">
                      <span className="absolute top-1 left-1 z-10 text-[9px] px-1.5 py-0.5 rounded bg-charcoal-900/80 text-cream-300 font-mono">
                        Original
                      </span>
                      <img
                        src={page.originalSrc}
                        alt={`Original menu page ${page.pageNumber}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="relative h-full overflow-hidden rounded border border-gold-500/30">
                      <span className="absolute top-1 left-1 z-10 text-[9px] px-1.5 py-0.5 rounded bg-gold-500 text-charcoal-950 font-bold font-mono">
                        Enhanced
                      </span>
                      <img
                        src={page.enhancedSrc}
                        alt={`Enhanced menu page ${page.pageNumber}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : (
                  // Single enhanced or original view
                  <div className="relative w-full h-full overflow-hidden rounded-lg">
                    <img
                      src={displayImage}
                      alt={`${globalMode === 'enhanced' ? 'Enhanced' : 'Original'} menu scan - Page ${page.pageNumber}`}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      {globalMode === 'enhanced' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 backdrop-blur-sm">
                          <Sparkles className="w-2.5 h-2.5" /> Enhanced
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-charcoal-900/90 text-cream-300 border border-charcoal-700 backdrop-blur-sm">
                          Original Backup
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Hover overlay button */}
                <div 
                  onClick={() => openModal(page)}
                  className="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                >
                  <span className="px-4 py-2 rounded-xl bg-gold-500 text-charcoal-950 font-bold text-xs flex items-center gap-1.5 shadow-xl">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Open Zoom & Compare Viewer
                  </span>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-4 flex-1 flex flex-col justify-between bg-charcoal-900/40">
                <div>
                  <p className="text-xs text-cream-300 line-clamp-2">
                    {page.subtitle}
                  </p>

                  {/* Price Conflict Callout if present */}
                  {page.hasPriceConflictNotes && (
                    <div className="mt-2 p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{page.hasPriceConflictNotes}</span>
                    </div>
                  )}

                  {/* Items Preview */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {page.itemsPreview.slice(0, 4).map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-charcoal-800 text-cream-300 border border-charcoal-700/60"
                      >
                        {item}
                      </span>
                    ))}
                    {page.itemsPreview.length > 4 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-cream-400">
                        +{page.itemsPreview.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-charcoal-800 flex items-center justify-between text-[11px] text-cream-400">
                  <span className="truncate max-w-[180px]">{page.edition}</span>
                  <span className="font-mono">{page.width}x{page.height}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULLSCREEN ZOOM & PAN MODAL VIEWER */}
      {activeModalPage && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/95 backdrop-blur-md flex flex-col animate-fadeIn select-none">
          {/* Modal Topbar */}
          <div className="bg-charcoal-900 border-b border-charcoal-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-gold-500 text-charcoal-950 font-bold font-mono text-xs">
                Page {activeModalPage.pageNumber} / 19
              </span>
              <div>
                <h3 className="font-serif font-bold text-cream-100 text-sm sm:text-base">
                  {activeModalPage.title}
                </h3>
                <p className="text-xs text-cream-400 hidden sm:block">
                  {activeModalPage.subtitle} • {activeModalPage.edition}
                </p>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center gap-2">
              {/* Enhanced vs Original vs Split toggle */}
              <div className="flex items-center bg-charcoal-950 rounded-lg p-1 border border-charcoal-700">
                <button
                  onClick={() => setModalMode('enhanced')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    modalMode === 'enhanced'
                      ? 'bg-gold-500 text-charcoal-950 font-bold'
                      : 'text-cream-300 hover:text-white'
                  }`}
                >
                  Enhanced
                </button>
                <button
                  onClick={() => setModalMode('original')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    modalMode === 'original'
                      ? 'bg-gold-500 text-charcoal-950 font-bold'
                      : 'text-cream-300 hover:text-white'
                  }`}
                >
                  Original
                </button>
                <button
                  onClick={() => setModalMode('split')}
                  className={`hidden sm:inline-block px-2.5 py-1 rounded text-xs font-semibold ${
                    modalMode === 'split'
                      ? 'bg-gold-500 text-charcoal-950 font-bold'
                      : 'text-cream-300 hover:text-white'
                  }`}
                >
                  Side-by-Side
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center gap-1 bg-charcoal-950 rounded-lg p-1 border border-charcoal-700">
                <button
                  onClick={() => setZoomLevel(z => Math.max(1, z - 0.25))}
                  className="p-1 rounded text-cream-300 hover:text-gold-400 hover:bg-charcoal-800"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-cream-300 px-1 min-w-[3rem] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(z => Math.min(3, z + 0.25))}
                  className="p-1 rounded text-cream-300 hover:text-gold-400 hover:bg-charcoal-800"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={resetZoom}
                  className="p-1 rounded text-cream-300 hover:text-gold-400 hover:bg-charcoal-800"
                  title="Reset Zoom (0)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="p-2 rounded-lg bg-charcoal-800 hover:bg-red-500/20 hover:text-red-400 text-cream-300 transition-colors ml-2"
                title="Close Viewer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Stage */}
          <div 
            className="flex-1 relative overflow-hidden flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* Prev button */}
            <button
              onClick={() => navigateModal(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-charcoal-900/80 hover:bg-gold-500 hover:text-charcoal-950 text-cream-100 border border-charcoal-700 transition-all shadow-xl"
              title="Previous Page (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next button */}
            <button
              onClick={() => navigateModal(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-charcoal-900/80 hover:bg-gold-500 hover:text-charcoal-950 text-cream-100 border border-charcoal-700 transition-all shadow-xl"
              title="Next Page (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Canvas */}
            <div
              className="max-w-full max-h-full transition-transform duration-75 flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel}) translate(${panPos.x / zoomLevel}px, ${panPos.y / zoomLevel}px)`,
              }}
            >
              {modalMode === 'split' ? (
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-5xl">
                  <div className="flex-1 text-center">
                    <span className="inline-block px-3 py-1 rounded bg-charcoal-850 text-xs font-mono text-cream-300 mb-2 border border-charcoal-700">
                      Original Photograph (Unprocessed)
                    </span>
                    <img
                      src={activeModalPage.originalSrc}
                      alt="Original menu scan"
                      className="max-h-[75vh] object-contain rounded-lg shadow-2xl border border-charcoal-700 pointer-events-none"
                    />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="inline-block px-3 py-1 rounded bg-gold-500 text-xs font-mono text-charcoal-950 font-bold mb-2 shadow">
                      Enhanced Master Copy (Pillow Processed)
                    </span>
                    <img
                      src={activeModalPage.enhancedSrc}
                      alt="Enhanced menu scan"
                      className="max-h-[75vh] object-contain rounded-lg shadow-2xl border border-gold-500/40 pointer-events-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={modalMode === 'enhanced' ? activeModalPage.enhancedSrc : activeModalPage.originalSrc}
                    alt={`Menu Page ${activeModalPage.pageNumber}`}
                    className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-charcoal-700 pointer-events-none"
                  />
                  <div className="absolute bottom-3 right-3 bg-charcoal-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-charcoal-700 text-xs font-mono text-cream-200">
                    {modalMode === 'enhanced' ? '★ Enhanced HD' : 'Original Raw Scan'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Bottom Bar with Navigation Info */}
          <div className="bg-charcoal-900 border-t border-charcoal-800 px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400 gap-3">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-cream-200">{activeModalPage.title}</span>
              {activeModalPage.hasPriceConflictNotes && (
                <span className="hidden sm:inline-flex items-center gap-1 text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  <AlertTriangle className="w-3 h-3" />
                  {activeModalPage.hasPriceConflictNotes}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>Use <strong>←</strong> / <strong>→</strong> arrow keys to browse</span>
              <span>•</span>
              <span><strong>+</strong> / <strong>-</strong> to zoom</span>
              <span>•</span>
              <span><strong>Esc</strong> to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
