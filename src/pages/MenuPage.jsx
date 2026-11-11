import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  Phone,
  Sparkles
} from 'lucide-react';
import { FadeInUp } from '../components/ScrollReveal';
import VintageCard from '../components/VintageCard';

export default function MenuPage() {
  const { 
    lang, 
    t, 
    storeData, 
    addToCart, 
    searchQuery, 
    setSearchQuery, 
    cartCount,
    getProductExtrasTotal
  } = useStore();

  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [addedSuccess, setAddedSuccess] = useState(false);

  const categories = [
    { key: 'all', label: t.filterAll },
    { key: 'honeyed', label: t.filterHoneyed },
    { key: 'powdered', label: t.filterPowdered },
    { key: 'dry', label: t.filterDry },
    { key: 'boxes', label: t.filterBoxes },
  ];

  const filteredProducts = storeData.products.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      item.titleEn.toLowerCase().includes(query) ||
      item.titleAr.includes(query) ||
      item.descriptionEn.toLowerCase().includes(query) ||
      item.descriptionAr.includes(query);
    return matchesCategory && matchesSearch;
  });

  const groupedCategories = ['honeyed', 'powdered', 'dry', 'boxes'].map(catKey => {
    const items = filteredProducts.filter(p => p.category === catKey);
    const catObj = categories.find(c => c.key === catKey);
    return {
      key: catKey,
      label: catObj ? catObj.label : catKey,
      items,
    };
  }).filter(group => group.items.length > 0);

  const handleOpenItem = (product) => {
    setSelectedProduct(product);
    setOrderQuantity(product.minQuantity || 1);
    
    // Initialize default options from product.customOptions
    const initialOpts = {};
    if (product.customOptions && Array.isArray(product.customOptions)) {
      product.customOptions.forEach(optGroup => {
        if (optGroup.choices && optGroup.choices.length > 0) {
          if (optGroup.type === 'multiple') {
            initialOpts[optGroup.id] = [];
          } else {
            initialOpts[optGroup.id] = optGroup.choices[0].id;
          }
        }
      });
    }
    setSelectedOptions(initialOpts);
    setAddedSuccess(false);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleSelectOption = (optGroupId, choiceId) => {
    setSelectedOptions(prev => ({ ...prev, [optGroupId]: choiceId }));
  };

  const handleToggleMultipleOption = (optGroupId, choiceId) => {
    setSelectedOptions(prev => {
      const current = prev[optGroupId] || [];
      const updated = current.includes(choiceId)
        ? current.filter(id => id !== choiceId)
        : [...current, choiceId];
      return { ...prev, [optGroupId]: updated };
    });
  };

  const extrasCost = selectedProduct ? getProductExtrasTotal(selectedProduct, selectedOptions) : 0;
  const singleUnitPrice = selectedProduct ? selectedProduct.price + extrasCost : 0;
  const totalModalPrice = singleUnitPrice * orderQuantity;

  const handleConfirmAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, orderQuantity, selectedOptions);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setSelectedProduct(null);
    }, 800);
  };

  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;
  const NextIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen pb-24 pt-4 sm:pt-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Navigation Bar - Highly Responsive for Mobile */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-[#d6c4a5]">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-[#ba8a24] text-xs font-bold text-stone-800 transition-colors cursor-pointer active:scale-95"
          >
            <BackIcon className="w-3.5 h-3.5" />
            <span>{t.navHome}</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => navigate('/custom')}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-[#ba8a24] text-xs font-bold text-stone-800 transition-colors cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ba8a24]" />
              <span>{t.navCustomOrder}</span>
            </button>

            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-[#ba8a24] text-xs font-bold text-stone-800 transition-colors cursor-pointer active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-[#ba8a24]" />
              <span>{t.navContact}</span>
            </button>

            {cartCount > 0 && (
              <button
                onClick={() => navigate('/checkout')}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer active:scale-95"
              >
                <span>{t.checkoutBtn}</span>
                <NextIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Paper Menu Header */}
        <FadeInUp distance={20} className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#ba8a24] uppercase tracking-widest block mb-1.5 font-serif">
            {lang === 'ar' ? (storeData.hero?.subtitleAr || 'حلويات جزائرية تقليدية • فيلادلفيا') : (storeData.hero?.subtitleEn || 'Gâteaux du blad • Philadelphia, PA')}
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 mb-2">
            {t.menuHeroTitle}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm font-light">
            {t.menuHeroSubtitle}
          </p>
          <div className="mt-2.5 inline-block px-3.5 py-1 rounded-full border border-[#d6c4a5] text-[10px] sm:text-[11px] text-stone-800 font-medium bg-[#f5ede0]">
            {t.menuItemClick}
          </div>
        </FadeInUp>

        {/* Filter Pills & Search Bar (Beige Background with Border) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer shrink-0 border ${
                  selectedCategory === cat.key
                    ? 'border-stone-900 bg-stone-900 text-[#f5ede0]'
                    : 'border-[#d6c4a5] bg-[#f5ede0] text-stone-800 hover:border-[#ba8a24]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64 relative">
            <div className="relative flex items-center rounded-full border border-[#d6c4a5] bg-[#f5ede0] px-3 py-1.5">
              <Search className="w-3.5 h-3.5 text-stone-600 shrink-0 me-2" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs text-stone-900 placeholder-stone-500 bg-transparent focus:outline-hidden"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-stone-500 hover:text-stone-900 p-0.5">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PAPER RESTAURANT MENU CONTAINER */}
        <VintageCard innerClassName="p-4 sm:p-10 space-y-8 sm:space-y-12">
          
          {groupedCategories.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              {t.noProductsFound}
            </div>
          ) : (
            groupedCategories.map((group) => (
              <div key={group.key} className="space-y-4 sm:space-y-6">
                
                {/* Category Header with Divider Line */}
                <div className="text-center relative">
                  <div className="inline-block relative px-6 py-1">
                    <span className="font-serif font-bold text-base sm:text-xl text-stone-900 tracking-wide">
                      {group.label}
                    </span>
                    <div className="w-10 sm:w-12 h-0.5 bg-[#ba8a24] mx-auto mt-1" />
                  </div>
                </div>

                {/* Items in Category */}
                <div className="space-y-3 sm:space-y-4">
                  {group.items.map((product) => {
                    const title = lang === 'ar' ? product.titleAr : product.titleEn;
                    const desc = lang === 'ar' ? product.descriptionAr : product.descriptionEn;
                    const unit = lang === 'ar' ? product.unitAr : product.unitEn;
                    const minQty = product.minQuantity || 1;
                    const hasCustomOptions = product.customOptions && product.customOptions.length > 0;

                    return (
                      <div
                        key={product.id}
                        onClick={() => handleOpenItem(product)}
                        className="group p-2.5 sm:p-3 rounded-2xl hover:bg-[#ede3d2] active:bg-[#ede3d2] transition-colors cursor-pointer border border-transparent hover:border-[#d6c4a5]"
                      >
                        {/* Row: Title .......... Price */}
                        <div className="flex items-center justify-between gap-2.5">
                          
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <img 
                              src={product.image} 
                              alt={title}
                              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[#d6c4a5] shrink-0" 
                            />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-serif font-bold text-xs sm:text-base text-stone-900 group-hover:text-[#ba8a24] transition-colors truncate">
                                  {title}
                                </span>
                                {hasCustomOptions && (
                                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-[#ba8a24]/50 text-[#ba8a24] font-bold bg-[#f5ede0]">
                                    {lang === 'ar' ? 'خيارات' : 'Options'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Dotted Menu Leader Line */}
                          <div className="flex-1 border-b border-dotted border-[#d6c4a5] mx-2 mb-1 hidden sm:block" />

                          {/* Price & Unit */}
                          <div className="text-end shrink-0 ps-2">
                            <span className="font-serif font-bold text-sm sm:text-base text-stone-900">
                              ${product.price.toFixed(2)}
                            </span>
                            <div className="text-[9px] sm:text-[10px] text-stone-500 font-light">
                              {t.minOrderLabel} {minQty} {unit}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] sm:text-xs text-stone-600 font-light leading-relaxed mt-1 sm:mt-1.5 ps-12 sm:ps-14 pe-1">
                          {desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

              </div>
            ))
          )}

        </VintageCard>

        {/* Bottom Banner: Custom Order Link */}
        <div className="mt-8 sm:mt-12 text-center">
          <VintageCard innerClassName="p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-start space-y-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#ba8a24] uppercase tracking-widest font-serif">
                Bespoke Pastries
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                {t.customOrderTitle}
              </h3>
              <p className="text-xs text-stone-600 font-light">
                {t.customOrderSubtitle}
              </p>
            </div>

            <button
              onClick={() => navigate('/custom')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-stone-900 text-[#f5ede0] font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ba8a24]" />
              <span>{t.navCustomOrder}</span>
            </button>
          </VintageCard>
        </div>

      </div>

      {/* ===================== ORDER MODAL (CUSTOM OPTIONS & QUANTITY) ===================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="max-w-lg w-full max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden my-0 sm:my-8 bg-[#f5ede0] border border-[#d6c4a5]">
            <div className="p-4 sm:p-7 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
              
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#d6c4a5]">
                <div className="pe-4">
                  <h3 className="font-serif font-bold text-base sm:text-xl text-stone-900">
                    {lang === 'ar' ? selectedProduct.titleAr : selectedProduct.titleEn}
                  </h3>
                  <div className="text-xs text-[#ba8a24] font-bold mt-0.5">
                    ${selectedProduct.price.toFixed(2)} ({lang === 'ar' ? selectedProduct.unitAr : selectedProduct.unitEn})
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full border border-[#d6c4a5] bg-[#f5ede0] flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product Photo & Description */}
              <div className="flex gap-3 sm:gap-4 items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#d6c4a5] shrink-0 bg-[#f5ede0]">
                  <img src={selectedProduct.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs text-stone-600 leading-relaxed font-light">
                  <p className="mb-1 line-clamp-2 sm:line-clamp-none">
                    {lang === 'ar' ? selectedProduct.descriptionAr : selectedProduct.descriptionEn}
                  </p>
                  <div className="text-[10px] text-stone-500">
                    <span className="font-bold text-[#ba8a24]">{t.ingredientsTitle} </span>
                    {lang === 'ar' ? selectedProduct.ingredientsAr : selectedProduct.ingredientsEn}
                  </div>
                </div>
              </div>

              {/* Dynamic Product Customizations set by the Admin */}
              {selectedProduct.customOptions && selectedProduct.customOptions.length > 0 && (
                <div className="space-y-3 sm:space-y-4 pt-3 border-t border-[#d6c4a5]">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-stone-900">
                    {t.customizeOrder}
                  </h4>

                  {selectedProduct.customOptions.map(optGroup => {
                    const isMultiple = optGroup.type === 'multiple';

                    return (
                      <div key={optGroup.id} className="space-y-1.5 sm:space-y-2">
                        <label className="block text-xs font-bold text-stone-800">
                          {lang === 'ar' ? optGroup.nameAr : optGroup.nameEn}
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                          {optGroup.choices?.map(choice => {
                            const isSelected = isMultiple 
                              ? (selectedOptions[optGroup.id] || []).includes(choice.id)
                              : selectedOptions[optGroup.id] === choice.id;

                            const extra = Number(choice.extraPrice || 0);

                            return (
                              <button
                                type="button"
                                key={choice.id}
                                onClick={() => {
                                  if (isMultiple) {
                                    handleToggleMultipleOption(optGroup.id, choice.id);
                                  } else {
                                    handleSelectOption(optGroup.id, choice.id);
                                  }
                                }}
                                className={`p-2 sm:p-2.5 rounded-2xl border text-xs text-start transition-colors cursor-pointer flex items-center justify-between active:scale-[0.98] ${
                                  isSelected
                                    ? 'border-stone-900 bg-stone-900 text-[#f5ede0]'
                                    : 'border-[#d6c4a5] bg-[#f5ede0] text-stone-800 hover:border-stone-900'
                                }`}
                              >
                                <span className="font-medium truncate">
                                  {lang === 'ar' ? choice.labelAr : choice.labelEn}
                                </span>
                                {extra > 0 ? (
                                  <span className={`text-[10px] ms-1 shrink-0 ${isSelected ? 'text-amber-200' : 'text-[#ba8a24]'}`}>
                                    +${extra.toFixed(2)}
                                  </span>
                                ) : (
                                  <span className={`text-[10px] ms-1 shrink-0 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                                    {t.noExtra}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Quantity Stepper & Price Summary */}
              <div className="pt-3 border-t border-[#d6c4a5] flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-stone-700 mb-1">{t.selectQuantity}</div>
                  <div className="flex items-center gap-2 border border-[#d6c4a5] rounded-full px-2 py-1 bg-[#f5ede0]">
                    <button
                      onClick={() => setOrderQuantity(prev => Math.max(selectedProduct.minQuantity || 1, prev - 1))}
                      disabled={orderQuantity <= (selectedProduct.minQuantity || 1)}
                      className={`w-7 h-7 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-stone-700 transition-colors ${
                        orderQuantity <= (selectedProduct.minQuantity || 1) ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-[#ede3d2] active:scale-90'
                      }`}
                    >
                      <Minus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-900 font-mono">
                      {orderQuantity}
                    </span>
                    <button
                      onClick={() => setOrderQuantity(prev => prev + 1)}
                      className="w-7 h-7 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-stone-700 hover:bg-[#ede3d2] cursor-pointer active:scale-90"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-end">
                  <div className="text-[10px] text-stone-500 uppercase tracking-wider">{t.totalPrice}</div>
                  <div className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                    ${totalModalPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleConfirmAddToCart}
                disabled={addedSuccess}
                className={`w-full py-3 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 border active:scale-[0.98] ${
                  addedSuccess
                    ? 'border-emerald-800 bg-emerald-800 text-white'
                    : 'border-stone-900 bg-stone-900 text-[#f5ede0] hover:bg-stone-800'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.addedToCart}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.addToBag} • ${totalModalPrice.toFixed(2)}</span>
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
