import React, { useState, useEffect } from 'react';
import { Search, Heart, Share2, AlertCircle, Sparkles, Filter, CheckCircle2, Copy, Send, Upload, Image as ImageIcon, X } from 'lucide-react';
import { MenuItem, UserProfile } from '../types';

interface MenuSectionProps {
  menuItems: MenuItem[];
  profile: UserProfile | null;
  lowStockThreshold: number;
  onAddToCart: (item: MenuItem, text?: string) => void;
  onToggleFavorite: (id: string) => void;
  onScrollToView: (id: string) => void;
}

export default function MenuSection({ menuItems, profile, lowStockThreshold, onAddToCart, onToggleFavorite, onScrollToView }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [showPromptBanner, setShowPromptBanner] = useState(false);

  useEffect(() => {
    const handleSelectPhotoPrintCakes = () => {
      setSelectedCategory('PhotoPrint Cakes');
      setSelectedSubCategory('All');
      setShowPromptBanner(true);
      const menuSection = document.getElementById('menu-gallery');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('select-photoprint-cakes', handleSelectPhotoPrintCakes);
    return () => {
      window.removeEventListener('select-photoprint-cakes', handleSelectPhotoPrintCakes);
    };
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSeasonalOnly, setShowSeasonalOnly] = useState(false);
  const [shareItem, setShareItem] = useState<MenuItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState<{ [key: string]: string }>({});
  const [comingSoonMessage, setComingSoonMessage] = useState<string | null>(null);
  const [selectedPhotoCake, setSelectedPhotoCake] = useState<MenuItem | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [customPhotoText, setCustomPhotoText] = useState<string>('');

  const categories = [
    'All',
    'Cool Cakes',
    'Normal Cakes',
    'Special Items',
    'Theme Cakes',
    'PhotoPrint Cakes',
    'Puffs',
    'Rolls',
    'Biscuits',
    'Special Snacks'
  ];

  // Derive subcategories if 'Special Items' is picked
  const subCategories = ['All', 'Bombolini', 'Brownies', 'Cheese Cakes', 'Kunafa', 'Mini Cakes', 'Tresleches Cakes'];
  // Derive subcategories if 'Special Snacks' is picked
  const snackSubCategories = ['All', 'CupCakes', 'Others'];

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    // Subcategory logic
    let matchesSubCategory = true;
    if (selectedCategory === 'Special Items' && selectedSubCategory !== 'All') {
      matchesSubCategory = item.subCategory === selectedSubCategory;
    } else if (selectedCategory === 'Special Snacks' && selectedSubCategory !== 'All') {
      if (selectedSubCategory === 'CupCakes') {
        matchesSubCategory = item.subCategory === 'CupCakes';
      } else {
        matchesSubCategory = item.subCategory !== 'CupCakes';
      }
    }

    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeasonal = !showSeasonalOnly || item.isSeasonal;

    return matchesCategory && matchesSubCategory && matchesSearch && matchesSeasonal;
  });

  const handleShareClick = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setShareItem(item);
    setCopiedLink(false);
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
      setShareItem(null);
    }, 2000);
  };

  const handleDirectCopyLink = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?item=${item.id}`;
    const textToCopy = `Check out this delicious ${item.name} at Cake Zone! Only for ₹${item.price}. Order here: ${shareUrl}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedItemId(item.id);
      setTimeout(() => {
        setCopiedItemId(null);
      }, 2000);
    });
  };

  return (
    <div className="space-y-8">
      {/* Category Selection Tabs & Filters */}
      <div className="flex flex-col gap-4">
        {/* Search bar & simple filter switches */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search dense truffles, ghee cookies, egg puffs, tresleches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSeasonalOnly(!showSeasonalOnly)}
              className={`px-4 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                showSeasonalOnly
                  ? 'bg-amber-900 text-white border-amber-950'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seasonal Specials</span>
            </button>
          </div>
        </div>

        {/* Categories Horizontal scrolling container */}
        <div className="flex gap-2 overflow-x-auto pb-2 pr-4 custom-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory('All'); // Reset subcategory
                }}
                className={`px-4.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap tracking-wide border transition-all shrink-0 ${
                  isSelected
                    ? 'bg-amber-950 text-amber-50 border-amber-950 shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-transparent'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Subcategories picker (if category is Special Items or Special Snacks) */}
        {(selectedCategory === 'Special Items' || selectedCategory === 'Special Snacks') && (
          <div className="flex items-center gap-2 flex-wrap bg-amber-50/50 p-2 rounded-2xl border border-amber-100/30">
            <span className="text-[10px] uppercase font-mono font-bold text-amber-900 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Sub-type:
            </span>
            {(selectedCategory === 'Special Items' ? subCategories : snackSubCategories).map((subCat) => {
              const isSelected = selectedSubCategory === subCat;
              return (
                <button
                  key={subCat}
                  type="button"
                  onClick={() => setSelectedSubCategory(subCat)}
                  className={`text-xs px-3 py-1 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-amber-900 text-white font-medium shadow-xs'
                      : 'bg-white hover:bg-amber-100/50 text-stone-600 border border-stone-200/50'
                  }`}
                >
                  {subCat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* PhotoPrint Model Prompt Banner */}
      {showPromptBanner && selectedCategory === 'PhotoPrint Cakes' && (
        <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 flex items-start justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex gap-2.5">
            <div className="bg-amber-100 rounded-xl p-1.5 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-amber-950 font-mono">Custom Edible Photo Print Selected</h4>
              <p className="text-stone-700 text-xs mt-0.5">
                Please select a model from the list below to proceed with your PhotoPrint ordering.
              </p>
              <p className="text-[10px] text-stone-500 mt-1 font-mono">
                💡 Tip: You can change the photo to your own customized file once you open the product card.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowPromptBanner(false)}
            className="text-stone-400 hover:text-stone-600 transition-colors p-1"
            aria-label="Dismiss message"
          >
            <span className="text-xs font-mono font-bold">✕</span>
          </button>
        </div>
      )}

      {/* Grid listing */}
      {filteredItems.length === 0 ? (
        <div className="bg-stone-50 border border-stone-100 rounded-3xl p-12 text-center">
          <p className="text-stone-500 text-sm">No delicious bakery items found matching your filter selection.</p>
          <button 
            onClick={() => {
              setSelectedCategory('All');
              setSelectedSubCategory('All');
              setSearchQuery('');
              setShowSeasonalOnly(false);
            }}
            className="text-amber-800 text-xs font-mono font-bold underline mt-2 hover:text-amber-950 block mx-auto"
          >
            Clear current filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isFavorite = profile?.savedFavorites?.includes(item.id) || false;
            const isLowStock = item.inStock > 0 && item.inStock <= lowStockThreshold;
            const isOutOfStock = item.inStock === 0;

            return (
              <div
                key={item.id}
                className="group bg-white border border-stone-100/70 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image Panel with Floating badges */}
                <div className="relative overflow-hidden aspect-[4/3] bg-stone-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className={`${item.id === 'theme-cake-dinosaur' ? 'h-[550px] w-[457.6px]' : (item.id === 'theme-cake-animal' ? 'h-[556px] w-[454.6px]' : (item.id === 'theme-cake-teddybear' ? 'h-[500px] w-full' : (item.id === 'theme-cake-lion' ? 'h-[500px] w-full' : (item.id === 'theme-cake-tomjerry' ? 'h-[500px] w-full' : (item.id === 'theme-cake-bossbaby' ? 'h-[500px] w-full' : 'w-full h-full')))))} object-cover group-hover:scale-105 transition-transform duration-500`}
                  />
                  
                  {/* Hearts & Shares on absolute top banner */}
                  <div className="absolute top-3 inset-x-3 flex justify-between items-center pointer-events-none">
                    <div>
                      {item.isSeasonal && (
                        <span className="bg-amber-900 border border-amber-950 text-white text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full uppercase shadow-sm pointer-events-auto">
                          Seasonal ✨
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1.5 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => handleShareClick(item, e)}
                        className="p-1 px-1.5 bg-white/95 hover:bg-amber-50 text-stone-600 rounded-full shadow-md active:scale-90 transition-all flex items-center"
                        title="Share on social media"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleFavorite(item.id)}
                        className="p-1 bg-white/95 hover:bg-amber-50 text-rose-600 rounded-full shadow-md active:scale-90 transition-all flex items-center justify-center w-6.5 h-6.5"
                        title={isFavorite ? "Remove favorite" : "Save to favorites"}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-600' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Stock alerting indicator overlay */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="bg-red-900 text-red-100 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 animate-bounce" /> Freshly Sold Out
                      </div>
                    </div>
                  )}

                  {isLowStock && (
                    <div className="absolute bottom-2 left-2 bg-amber-900/90 text-white text-[9px] font-mono font-semibold px-2.5 py-0.5 rounded-full shadow-md uppercase flex items-center gap-1 ring-1 ring-amber-950">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" /> Only {item.inStock} left today!
                    </div>
                  )}
                </div>

                {/* Info & pricing Block */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-amber-900 font-mono tracking-wider uppercase font-semibold">
                      {item.category} {item.subCategory ? `• ${item.subCategory}` : ''}
                    </span>
                    <h4 className="font-serif font-black text-stone-900 text-sm mt-1 leading-snug group-hover:text-amber-900 transition-colors">
                      {item.name}
                    </h4>
                    <p className={`text-stone-500 text-xs mt-1.5 leading-relaxed font-sans ${item.category === 'PhotoPrint Cakes' ? '' : 'line-clamp-2'}`}>
                      {item.description}
                      {item.category === 'PhotoPrint Cakes' && (
                        <span className="block mt-1 text-amber-800 font-bold text-[10px]">
                          you can change the photo and add other !!
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Custom Cake piping box (only for cool-cakes, theme-cakes or normal-cakes) */}
                  {(item.category === 'Cool Cakes' || item.category === 'Normal Cakes') && (
                    <div className="mt-4 pt-1">
                      <input 
                        type="text" 
                        placeholder="Option: Custom piped name (e.g. 'To Mom')"
                        maxLength={22}
                        value={customMessage[item.id] || ''}
                        onChange={(e) => setCustomMessage({ ...customMessage, [item.id]: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200/65 rounded-lg px-2 py-1 text-[10px] text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white font-serif italic"
                      />
                    </div>
                  )}

                  <div className="mt-4 pt-3.5 border-t border-stone-50 flex items-center justify-between gap-1.5">
                    {item.category !== 'PhotoPrint Cakes' ? (
                      <div>
                        <span className="text-stone-400 text-[10px] font-mono leading-none block">Our Price</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-base font-serif font-bold text-stone-900">₹{item.price}</span>
                          {(item.id === 'biscuit-bombay' || item.id === 'biscuit-badam' || item.name.includes('250grams')) && (
                            <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                              250g Pack
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="text-stone-400 text-[10px] font-mono leading-none block">Pricing</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/40">
                            By Weight
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleDirectCopyLink(item, e)}
                        className={`text-xs p-2 rounded-xl border flex items-center justify-center gap-1 font-semibold transition-all active:scale-95 ${
                          copiedItemId === item.id
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                        title="Copy shareable link with description"
                      >
                        {copiedItemId === item.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                            <span className="text-[10px]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Copy Link</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`https://wa.me/?text=Check%20out%20this%20delicious%20${encodeURIComponent(item.name)}%20at%2520Cake%2520Zone!%20Order%20here:%20${encodeURIComponent(window.location.origin + '?item=' + item.id)}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs p-2 rounded-xl border border-emerald-200/80 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center gap-1 font-semibold transition-all active:scale-95"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px]">Share</span>
                      </a>

                      <button
                        onClick={() => {
                          if (item.category === 'PhotoPrint Cakes') {
                            const event = new CustomEvent('photoprint-model-selected', {
                              detail: {
                                name: item.name,
                                imageUrl: item.imageUrl,
                              }
                            });
                            window.dispatchEvent(event);
                          } else if (item.id === 'theme-cake-dinosaur') {
                            const event = new CustomEvent('preorder-dinosaur-cake', {
                              detail: {
                                item: item,
                              }
                            });
                            window.dispatchEvent(event);
                          } else if (item.id === 'theme-cake-animal') {
                            const event = new CustomEvent('preorder-animal-cake', {
                              detail: {
                                item: item,
                              }
                            });
                            window.dispatchEvent(event);
                          } else if (item.id === 'theme-cake-teddybear') {
                            const event = new CustomEvent('preorder-teddybear-cake', {
                              detail: {
                                item: item,
                              }
                            });
                            window.dispatchEvent(event);
                          } else if (item.id === 'theme-cake-lion') {
                            const event = new CustomEvent('preorder-lion-cake', {
                              detail: {
                                item: item,
                              }
                            });
                            window.dispatchEvent(event);
                          } else if (item.id === 'theme-cake-tomjerry') {
                            const event = new CustomEvent('preorder-tomjerry-cake', {
                              detail: {
                                item: item,
                              }
                            });
                            window.dispatchEvent(event);
                          } else if (item.id === 'theme-cake-bossbaby') {
                            const event = new CustomEvent('preorder-bossbaby-cake', {
                              detail: {
                                item: item,
                              }
                            });
                            window.dispatchEvent(event);
                          } else {
                            setComingSoonMessage(`Sorry , This Option will be Updated Soon !!
With Regards -- Cake Zone Bakery (Kadapa)`);
                          }
                        }}
                        disabled={isOutOfStock}
                        className={`text-xs py-2 px-3.5 rounded-xl font-semibold transition-all shadow-sm ${
                          isOutOfStock
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none'
                            : 'bg-amber-900 hover:bg-amber-950 text-white hover:shadow active:scale-95'
                        }`}
                      >
                        Pre-order Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Social Platform Mock Sharing dialog */}
      {shareItem && (
        <div className="fixed inset-0 bg-stone-950/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-100 shadow-xl space-y-4">
            <h4 className="font-serif font-bold text-stone-900 flex items-center gap-1.5">
              <Share2 className="w-4.5 h-4.5 text-amber-700" /> Share with Sweet Friends
            </h4>
            <p className="text-xs text-stone-500">
              Tell your family in Kadapa about the mouth-watering <strong>{shareItem.name}</strong>!
            </p>

            <div className="grid grid-cols-3 gap-2 py-2">
              <a
                href={`https://wa.me/?text=Check%20out%20this%20delicious%20${encodeURIComponent(shareItem.name)}%20at%20Cake%20Zone!%20Only%20for%20Rs.${shareItem.price}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 hover:border-emerald-200 text-emerald-800 p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1 transition-all"
              >
                <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">W</div>
                <span className="text-[9px] font-semibold">WhatsApp</span>
              </a>

              <a
                href="https://www.instagram.com/cake_zone_kadapa/"
                target="_blank"
                rel="noreferrer"
                className="bg-pink-50 hover:bg-pink-100 border border-pink-100 hover:border-pink-200 text-pink-800 p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1 transition-all"
              >
                <div className="w-7 h-7 bg-gradient-to-tr from-yellow-400 via-pink-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">IG</div>
                <span className="text-[9px] font-semibold">Instagram</span>
              </a>

              <a
                href="https://www.facebook.com/cakezonekadapa"
                target="_blank"
                rel="noreferrer"
                className="bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-200 text-blue-800 p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1 transition-all"
              >
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold font-serif">f</div>
                <span className="text-[9px] font-semibold">Facebook</span>
              </a>
            </div>

            <div className="pt-2 border-t border-stone-50 flex gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedLink ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 animate-bounce" /> Copied link!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Link URL
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShareItem(null)}
                className="bg-stone-900 hover:bg-stone-950 text-white px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {comingSoonMessage && (
        <div id="coming-soon-modal" className="fixed inset-0 bg-stone-950/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-100 shadow-xl space-y-4">
            <div className="mx-auto w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-800">
              <AlertCircle className="w-6 h-6 animate-bounce text-amber-700" />
            </div>
            
            <div className="text-center">
              <h4 className="font-serif font-black text-amber-950 text-base">Option Update Notice</h4>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100/60 shadow-inner">
              <p className="text-stone-800 font-sans text-xs whitespace-pre-wrap leading-relaxed text-center">
                {comingSoonMessage}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setComingSoonMessage(null)}
                className="w-full bg-amber-900 hover:bg-amber-950 text-white py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PhotoPrint Cake customizer modal */}
      {selectedPhotoCake && (
        <div id="photoprint-customizer-modal" className="fixed inset-0 bg-stone-950/45 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-100 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="font-serif font-black text-amber-950 text-base flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-700 animate-pulse" /> Customize PhotoPrint Cake
              </h4>
              <button 
                onClick={() => setSelectedPhotoCake(null)} 
                className="text-stone-400 hover:text-stone-700 transition-colors p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Model details card */}
            <div className="bg-stone-50 border border-stone-100 rounded-2xl p-3 flex gap-3">
              <img 
                src={uploadedPhotoUrl || selectedPhotoCake.imageUrl} 
                alt={selectedPhotoCake.name} 
                className="w-20 h-20 object-cover rounded-xl border border-stone-200 shadow-xs shrink-0" 
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <h5 className="font-serif font-bold text-stone-900 text-sm leading-tight">{selectedPhotoCake.name}</h5>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug line-clamp-2">
                    {selectedPhotoCake.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] font-mono text-stone-500">Base Price:</span>
                  <span className="text-sm font-serif font-bold text-amber-950">₹{selectedPhotoCake.price}</span>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider font-mono flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-amber-700" /> Edible Photo Choice
              </label>
              
              {!uploadedPhotoUrl ? (
                <div className="relative border-2 border-dashed border-amber-200/60 rounded-2xl p-4 bg-amber-50/5 hover:bg-amber-50/20 text-center transition-all cursor-pointer group flex flex-col justify-center items-center h-[110px]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setUploadedPhotoUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <ImageIcon className="w-5 h-5 text-amber-700 mb-1.5 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-stone-700 font-semibold leading-tight">Click or drag your custom photo here</p>
                  <p className="text-[10px] text-stone-400 mt-1">Or keep default {selectedPhotoCake.name.replace(' PhotoPrint Cake', '')} photo if none uploaded</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 relative h-[110px]">
                  <img src={uploadedPhotoUrl} alt="Uploaded print" className="w-16 h-16 object-cover rounded-xl border border-emerald-200 shrink-0 shadow-xs" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-emerald-850 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-650 shrink-0" /> Custom Photo Selected
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-snug truncate font-medium">Ready for edible photo printing</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedPhotoUrl(null)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-white rounded-lg transition-all absolute top-2 right-2 border border-stone-100 shadow-xs bg-stone-50"
                    title="Remove uploaded photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Custom piping message */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider font-mono">
                Message on Cake
              </label>
              <input 
                type="text" 
                placeholder="Name or text to write on the cake (e.g. 'Happy 5th Birthday')"
                maxLength={30}
                value={customPhotoText}
                onChange={(e) => setCustomPhotoText(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200/70 rounded-xl px-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-stone-100 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedPhotoCake(null)}
                className="flex-1 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/60 font-semibold py-2.5 rounded-xl text-xs transition-all active:scale-95"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={() => {
                  // Add configured photo cake to cart!
                  const configuredItem = {
                    ...selectedPhotoCake,
                    // If uploaded a custom photo, use that image for the item in the cart!
                    imageUrl: uploadedPhotoUrl || selectedPhotoCake.imageUrl,
                    // Append custom configuration to description if customized
                    description: uploadedPhotoUrl 
                      ? `${selectedPhotoCake.description} (Custom photo printed).` 
                      : selectedPhotoCake.description
                  };
                  
                  onAddToCart(configuredItem, customPhotoText || undefined);
                  setSelectedPhotoCake(null);
                }}
                className="flex-1 bg-amber-900 hover:bg-amber-950 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
              >
                Confirm & Pre-order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
