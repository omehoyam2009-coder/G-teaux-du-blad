import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DEFAULT_STORE_DATA } from '../data/initialData';
import { TRANSLATIONS } from '../data/translations';

const StoreContext = createContext(null);

const LANG_STORAGE_KEY = 'gdb_lang_v2';
const ADMIN_AUTH_KEY = 'gdb_admin_auth_v2';
const CART_STORAGE_KEY = 'gdb_cart_v4';

export function StoreProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Language
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_STORAGE_KEY) || 'ar');
  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);
  const toggleLanguage = () => setLang(p => (p === 'ar' ? 'en' : 'ar'));
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // 2. Navigation
  const navigateTo = (path) => {
    const formatted = path.startsWith('/') ? path : `/${path === 'home' ? '' : path}`;
    navigate(formatted);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Store Data (Synced with SQLite Backend)
  const [storeData, setStoreData] = useState(DEFAULT_STORE_DATA);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetchStoreData = useCallback(async () => {
    try {
      const res = await fetch('/api/store-data');
      if (res.ok) {
        const data = await res.json();
        setStoreData(data);
        setIsDataLoaded(true);
      }
    } catch (err) {
      console.warn('Backend not responding yet, using default store data:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  // Apply dynamic theme colors to root documentElement
  useEffect(() => {
    if (!storeData?.theme) return;
    const root = document.documentElement;
    const theme = storeData.theme;
    if (theme.bgColor) root.style.setProperty('--theme-bg', theme.bgColor);
    if (theme.cardBg) root.style.setProperty('--theme-card', theme.cardBg);
    if (theme.cardInnerBg) root.style.setProperty('--theme-card-inner', theme.cardInnerBg);
    if (theme.borderColor) root.style.setProperty('--theme-border', theme.borderColor);
    if (theme.accentColor) root.style.setProperty('--theme-accent', theme.accentColor);
    if (theme.textColor) root.style.setProperty('--theme-text', theme.textColor);
    if (theme.buttonBg) root.style.setProperty('--theme-btn-bg', theme.buttonBg);
    if (theme.buttonText) root.style.setProperty('--theme-btn-text', theme.buttonText);
  }, [storeData?.theme]);

  const updateStoreData = async (newData) => {
    setStoreData(newData);
    try {
      await fetch('/api/store-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
    } catch (err) {
      console.error('Failed to sync store data with SQLite:', err);
    }
  };

  const resetStoreData = async () => {
    try {
      const res = await fetch('/api/reset-defaults', { method: 'POST' });
      if (res.ok) {
        await fetchStoreData();
      }
    } catch (err) {
      console.error('Failed to reset defaults:', err);
      setStoreData(DEFAULT_STORE_DATA);
    }
  };

  // 4. File Upload (Videos and Images to Backend /uploads)
  const uploadVideoFile = async (file) => {
    const formData = new FormData();
    formData.append('video', file);

    const res = await fetch('/api/upload-video', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to upload video');
    const result = await res.json();

    // Refresh store data so hero video updates immediately
    if (result.hero) {
      setStoreData(prev => ({ ...prev, hero: result.hero }));
    } else {
      await fetchStoreData();
    }
    return result.videoUrl;
  };

  const uploadImageFile = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to upload image');
    const result = await res.json();
    return result.imageUrl;
  };

  // 5. Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // 6. Cart Management
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const getCartItemKey = (productId, selectedOptions = {}) => {
    const optKey = Object.entries(selectedOptions)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${Array.isArray(v) ? v.sort().join(',') : v}`)
      .join('|');
    return `${productId}__${optKey}`;
  };

  const addToCart = (product, quantity = null, selectedOptions = {}) => {
    const qtyToAdd = quantity || product.minQuantity || 1;
    const itemKey = getCartItemKey(product.id, selectedOptions);

    setCart(prev => {
      const existing = prev.find(item => getCartItemKey(item.product.id, item.selectedOptions) === itemKey);
      if (existing) {
        return prev.map(item =>
          getCartItemKey(item.product.id, item.selectedOptions) === itemKey
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [...prev, { product, quantity: qtyToAdd, selectedOptions }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (itemKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        getCartItemKey(item.product.id, item.selectedOptions) === itemKey
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (itemKey) => {
    setCart(prev => prev.filter(item => getCartItemKey(item.product.id, item.selectedOptions) !== itemKey));
  };

  const clearCart = () => setCart([]);

  const getProductExtrasTotal = (product, selectedOptions = {}) => {
    if (!product || !product.customOptions || !selectedOptions) return 0;
    let extra = 0;
    for (const optGroup of product.customOptions) {
      const chosen = selectedOptions[optGroup.id];
      if (!chosen) continue;
      if (Array.isArray(chosen)) {
        for (const choiceId of chosen) {
          const ch = optGroup.choices?.find(c => c.id === choiceId);
          if (ch) extra += Number(ch.extraPrice || 0);
        }
      } else {
        const ch = optGroup.choices?.find(c => c.id === chosen);
        if (ch) extra += Number(ch.extraPrice || 0);
      }
    }
    return extra;
  };

  const getItemPrice = (item) => {
    return item.product.price + getProductExtrasTotal(item.product, item.selectedOptions);
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 7. Coupons
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const applyCouponCode = (code) => {
    if (!code) return { success: false, message: t.invalidCoupon };
    const clean = code.trim().toUpperCase();
    const found = storeData.coupons?.find(c => c.code.toUpperCase() === clean && c.active);
    if (!found) return { success: false, message: t.invalidCoupon };
    if (cartSubtotal < found.minOrder) return { success: false, message: `${t.minOrderNotMet} $${found.minOrder.toFixed(2)}` };
    setAppliedCoupon(found);
    return { success: true, message: t.couponApplied };
  };
  const removeCoupon = () => setAppliedCoupon(null);
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percent') return (cartSubtotal * appliedCoupon.discountValue) / 100;
    return Math.min(cartSubtotal, appliedCoupon.discountValue);
  };

  // 8. Shipping
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('philly_express');
  const getShippingFee = () => {
    const isFree = cartSubtotal >= (storeData.shipping?.freeShippingThreshold || 90);
    const method = storeData.shipping?.methods?.find(m => m.id === selectedShippingMethod);
    if (!method) return 0;
    if (method.id === 'pickup') return 0;
    if (isFree && method.id === 'philly_express') return 0;
    return method.price;
  };

  // 9. Orders (Synced with SQLite)
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.warn('Could not fetch orders:', e);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const placeOrder = async (orderData) => {
    const newOrderId = `GDB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      status: 'pending',
      ...orderData,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        await fetchOrders();
      }
    } catch (e) {
      console.error('Failed to post order to SQLite:', e);
      setOrders(prev => [newOrder, ...prev]);
    }

    clearCart();
    setAppliedCoupon(null);
    return newOrder;
  };

  const updateOrderStatus = async (orderId, status) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.error('Failed to update order status in SQLite:', e);
    }
  };

  const deleteOrder = async (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    try {
      await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to delete order from SQLite:', e);
    }
  };

  // 10. Custom Orders (Synced with SQLite)
  const [customOrders, setCustomOrders] = useState([]);

  const fetchCustomOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/custom-orders');
      if (res.ok) {
        const data = await res.json();
        setCustomOrders(data);
      }
    } catch (e) {
      console.warn('Could not fetch custom orders:', e);
    }
  }, []);

  useEffect(() => {
    fetchCustomOrders();
  }, [fetchCustomOrders]);

  const submitCustomOrder = async (orderData) => {
    const newId = `CUSTOM-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: newId,
      date: new Date().toISOString(),
      status: 'pending',
      ...orderData,
    };

    try {
      const res = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        await fetchCustomOrders();
      }
    } catch (e) {
      console.error('Failed to post custom order to SQLite:', e);
      setCustomOrders(prev => [newOrder, ...prev]);
    }

    return newOrder;
  };

  const updateCustomOrderStatus = async (orderId, status) => {
    setCustomOrders(prev =>
      prev.map(item => (item.id === orderId ? { ...item, status } : item))
    );
    try {
      await fetch(`/api/custom-orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.error('Failed to update custom order in SQLite:', e);
    }
  };

  const deleteCustomOrder = async (orderId) => {
    setCustomOrders(prev => prev.filter(item => item.id !== orderId));
    try {
      await fetch(`/api/custom-orders/${orderId}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to delete custom order from SQLite:', e);
    }
  };

  // 11. Admin Authentication
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => localStorage.getItem(ADMIN_AUTH_KEY) === 'true');
  const adminLogin = (password) => {
    if (password === 'admin123' || password === 'gateaux2026') {
      setIsAdminLoggedIn(true);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  };
  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(ADMIN_AUTH_KEY);
  };

  return (
    <StoreContext.Provider
      value={{
        lang, setLang, toggleLanguage, t,
        currentPath: location.pathname,
        navigateTo,
        storeData, updateStoreData, resetStoreData, fetchStoreData,
        uploadVideoFile, uploadImageFile,
        searchQuery, setSearchQuery,
        cart, addToCart, updateCartQuantity, removeFromCart, clearCart,
        getCartItemKey, getItemPrice, getProductExtrasTotal,
        cartSubtotal, cartCount, isCartOpen, setIsCartOpen,
        appliedCoupon, applyCouponCode, removeCoupon, calculateDiscount,
        selectedShippingMethod, setSelectedShippingMethod, getShippingFee,
        orders, placeOrder, updateOrderStatus, deleteOrder,
        customOrders, submitCustomOrder, updateCustomOrderStatus, deleteCustomOrder,
        isAdminLoggedIn, adminLogin, adminLogout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
