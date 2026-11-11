import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    lang, 
    t, 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal,
    getCartItemKey,
    getItemPrice,
    storeData
  } = useStore();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;
  const presets = storeData.customizationPresets || {};

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className={`fixed inset-y-0 ${lang === 'ar' ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div className="w-screen max-w-sm bg-[#f5ede0] flex flex-col border-s border-[#d6c4a5]">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#d6c4a5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#ba8a24]" />
              <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900">{t.cartTitle}</h3>
              <span className="text-xs font-mono text-stone-500">({cart.length})</span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full border border-[#d6c4a5] flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer bg-[#ede3d2] active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 py-16">
                <ShoppingBag className="w-10 h-10 mb-3 text-[#ba8a24]/40" />
                <p className="text-xs font-medium">{t.emptyCart}</p>
              </div>
            ) : (
              cart.map((item) => {
                const itemKey = getCartItemKey(item.product.id, item.selectedOptions);
                const unitPrice = getItemPrice(item);
                const itemTotal = unitPrice * item.quantity;
                const minQty = item.product.minQuantity || 1;

                return (
                  <div key={itemKey} className="p-3 sm:p-3.5 rounded-2xl border border-[#d6c4a5] bg-[#ede3d2]/60">
                    <div className="flex gap-3 items-center">
                      <img 
                        src={item.product.image} 
                        alt="" 
                        className="w-12 h-12 rounded-xl object-cover border border-[#d6c4a5] shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif font-bold text-xs text-stone-900 truncate">
                            {lang === 'ar' ? item.product.titleAr : item.product.titleEn}
                          </h4>
                          <button
                            onClick={() => removeFromCart(itemKey)}
                            className="text-stone-400 hover:text-red-600 ps-1 cursor-pointer active:scale-90"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <div className="text-xs font-mono font-bold text-[#ba8a24] mt-0.5">
                          ${unitPrice.toFixed(2)}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#d6c4a5]/40">
                          <div className="flex items-center gap-1.5 border border-[#d6c4a5] rounded-full px-2 py-0.5 bg-[#f5ede0]">
                            <button
                              onClick={() => {
                                const newQty = item.quantity - 1;
                                if (newQty < minQty) {
                                  removeFromCart(itemKey);
                                } else {
                                  updateCartQuantity(itemKey, newQty);
                                }
                              }}
                              className="w-5 h-5 rounded-full flex items-center justify-center text-stone-600 hover:bg-[#e4d5be] cursor-pointer active:scale-90"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="w-6 text-center text-xs font-mono font-bold text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(itemKey, item.quantity + 1)}
                              className="w-5 h-5 rounded-full flex items-center justify-center text-stone-600 hover:bg-[#e4d5be] cursor-pointer active:scale-90"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          <span className="text-xs font-mono font-bold text-stone-900">
                            ${itemTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#d6c4a5] bg-[#ede3d2]/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-stone-600">{t.subtotal}</span>
                <span className="font-serif font-bold text-base text-stone-900">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-3 rounded-full bg-stone-900 text-[#f5ede0] font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{t.checkoutBtn}</span>
                <ArrowIcon className="w-4 h-4 text-[#ba8a24]" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
