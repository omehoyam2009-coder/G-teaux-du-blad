import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  Video, 
  UtensilsCrossed, 
  MapPin, 
  Truck, 
  Tag, 
  ShoppingBag, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw, 
  LogOut, 
  Lock, 
  Download,
  Upload,
  Mail,
  XCircle,
  CheckCircle2,
  Sparkles,
  LayoutDashboard,
  Layers,
  Phone,
  FileText,
  Menu,
  X,
  Palette,
  Type,
  CreditCard,
  Image as ImageIcon
} from 'lucide-react';
import VintageCard from '../components/VintageCard';

export default function AdminPage() {
  const { 
    lang, 
    t, 
    storeData, 
    updateStoreData, 
    resetStoreData, 
    orders, 
    updateOrderStatus, 
    deleteOrder,
    customOrders,
    updateCustomOrderStatus,
    deleteCustomOrder,
    uploadVideoFile,
    uploadImageFile,
    isAdminLoggedIn,
    adminLogin,
    adminLogout
  } = useStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [emailNotice, setEmailNotice] = useState(null);

  const [draft, setDraft] = useState(storeData);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newCouponModalOpen, setNewCouponModalOpen] = useState(false);
  const [newPartnerModalOpen, setNewPartnerModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // New product form
  const [newProduct, setNewProduct] = useState({
    titleEn: '',
    titleAr: '',
    category: 'honeyed',
    price: 25.00,
    minQuantity: 6,
    unitEn: 'pieces (Box of 6)',
    unitAr: 'حبات (علبة 6 حبات)',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    descriptionEn: '',
    descriptionAr: '',
    ingredientsEn: 'Almonds, Pure Honey, Orange Blossom Water',
    ingredientsAr: 'لوز صافي، عسل طبيعي، ماء زهر',
    inStock: true,
    customOptions: [],
  });

  // Helper state for adding a custom option group to a product
  const [newOptGroup, setNewOptGroup] = useState({
    nameAr: '',
    nameEn: '',
    type: 'single', // 'single' or 'multiple'
    choices: []
  });
  const [newChoice, setNewChoice] = useState({
    labelAr: '',
    labelEn: '',
    extraPrice: 0
  });

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percent',
    discountValue: 10,
    minOrder: 50.00,
    expiresAt: '2027-12-31',
    descriptionEn: '',
    descriptionAr: '',
    active: true,
  });

  const [newPartner, setNewPartner] = useState({
    nameEn: '',
    nameAr: '',
    addressEn: '',
    addressAr: '',
    phone: '(267) 000-0000',
    typeEn: 'Retail Partner',
    typeAr: 'نقطة بيع شريكة',
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = adminLogin(passwordInput);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
      setPasswordInput('');
    }
  };

  const handleSaveAllChanges = () => {
    updateStoreData(draft);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleProductImageUpload = async (e, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadImageFile(file);
      if (isEditing && editingProduct) {
        setEditingProduct({ ...editingProduct, image: imageUrl });
      } else {
        setNewProduct({ ...newProduct, image: imageUrl });
      }
    } catch (err) {
      alert(lang === 'ar' ? 'فشل تحميل الصورة' : 'Image upload failed');
    }
  };

  useEffect(() => {
    if (storeData) {
      setDraft(storeData);
    }
  }, [storeData]);

  const THEME_PRESETS = [
    {
      id: 'default',
      nameAr: 'البيج والذهب الكلاسيكي (الأصل)',
      nameEn: 'Classic Beige & Gold (Default)',
      theme: {
        bgColor: '#f7f1e7',
        cardBg: '#f5ede0',
        cardInnerBg: '#ede3d2',
        borderColor: '#d6c4a5',
        accentColor: '#ba8a24',
        textColor: '#1c1917',
        buttonBg: '#1c1917',
        buttonText: '#f5ede0'
      }
    },
    {
      id: 'warm_sand',
      nameAr: 'الرمل الدافئ والبرونز',
      nameEn: 'Warm Sand & Bronze',
      theme: {
        bgColor: '#fdfbf7',
        cardBg: '#f4ede4',
        cardInnerBg: '#e8ded2',
        borderColor: '#cfbeab',
        accentColor: '#ad7332',
        textColor: '#292524',
        buttonBg: '#292524',
        buttonText: '#fdfbf7'
      }
    },
    {
      id: 'royal_ivory',
      nameAr: 'العاجي والفحم الملكي',
      nameEn: 'Royal Ivory & Charcoal',
      theme: {
        bgColor: '#faf6f0',
        cardBg: '#f2eae1',
        cardInnerBg: '#e5d9cd',
        borderColor: '#cbbaa6',
        accentColor: '#8a6230',
        textColor: '#171717',
        buttonBg: '#171717',
        buttonText: '#faf6f0'
      }
    },
    {
      id: 'pure_gold',
      nameAr: 'الأبيض النقي والذهب الفاخر',
      nameEn: 'Pure White & Luxury Gold',
      theme: {
        bgColor: '#ffffff',
        cardBg: '#faf7f2',
        cardInnerBg: '#f0eae0',
        borderColor: '#dfd3c3',
        accentColor: '#c4932d',
        textColor: '#1a1a1a',
        buttonBg: '#1a1a1a',
        buttonText: '#ffffff'
      }
    }
  ];

  const applyThemePreset = (presetTheme) => {
    const updated = {
      ...draft,
      theme: { ...draft.theme, ...presetTheme }
    };
    setDraft(updated);
    updateStoreData(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleHeroLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadImageFile(file);
      setDraft({
        ...draft,
        hero: { ...draft.hero, logoUrl: imageUrl }
      });
    } catch (err) {
      alert(lang === 'ar' ? 'فشل تحميل الشعار' : 'Logo upload failed');
    }
  };

  const handlePackagingImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadImageFile(file);
      setDraft({
        ...draft,
        packaging: { ...draft.packaging, image: imageUrl }
      });
    } catch (err) {
      alert(lang === 'ar' ? 'فشل تحميل صورة التغليف' : 'Packaging image upload failed');
    }
  };

  const handleFeatureImageUpload = async (e, featureId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadImageFile(file);
      const updatedFeatures = (draft.about?.features || []).map(f => 
        f.id === featureId ? { ...f, image: imageUrl } : f
      );
      setDraft({
        ...draft,
        about: { ...draft.about, features: updatedFeatures }
      });
    } catch (err) {
      alert(lang === 'ar' ? 'فشل تحميل أيقونة الميزة' : 'Feature icon upload failed');
    }
  };

  const handleHeroVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const videoUrl = await uploadVideoFile(file);
      const updated = {
        ...draft,
        hero: { ...draft.hero, videoUrl, mediaType: 'video' }
      };
      setDraft(updated);
      updateStoreData(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(lang === 'ar' ? 'فشل تحميل الفيديو' : 'Video upload failed');
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadImageFile(file);
      const updated = {
        ...draft,
        hero: { ...draft.hero, imageUrl, mediaType: 'image' }
      };
      setDraft(updated);
      updateStoreData(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(lang === 'ar' ? 'فشل تحميل صورة الهيرو' : 'Hero image upload failed');
    }
  };

  // Order status actions with email notifications
  const handleSetOrderStatus = (orderId, newStatus, customerEmail) => {
    updateOrderStatus(orderId, newStatus);
    setEmailNotice({
      email: customerEmail,
      type: newStatus === 'accepted' ? 'accept' : newStatus === 'rejected' ? 'reject' : 'update',
      orderId,
    });
    setTimeout(() => setEmailNotice(null), 4000);
  };

  const handleSetCustomOrderStatus = (orderId, newStatus, customerEmail) => {
    updateCustomOrderStatus(orderId, newStatus);
    setEmailNotice({
      email: customerEmail,
      type: newStatus === 'accepted' ? 'accept' : 'reject',
      orderId,
    });
    setTimeout(() => setEmailNotice(null), 4000);
  };

  // Custom Options Management within product editor
  const handleAddChoiceToGroup = () => {
    if (!newChoice.labelAr && !newChoice.labelEn) return;
    const choiceItem = {
      id: `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      labelAr: newChoice.labelAr || newChoice.labelEn,
      labelEn: newChoice.labelEn || newChoice.labelAr,
      extraPrice: Number(newChoice.extraPrice || 0)
    };
    setNewOptGroup(prev => ({
      ...prev,
      choices: [...prev.choices, choiceItem]
    }));
    setNewChoice({ labelAr: '', labelEn: '', extraPrice: 0 });
  };

  const handleAddOptionGroupToProduct = (isEditing = false) => {
    if (!newOptGroup.nameAr && !newOptGroup.nameEn) return;
    if (newOptGroup.choices.length === 0) {
      alert(lang === 'ar' ? 'أضف خياراً واحداً على الأقل (مثل: غاناش شوكولاتة)' : 'Add at least one choice option');
      return;
    }
    const groupItem = {
      id: `opt-${Date.now()}`,
      nameAr: newOptGroup.nameAr || newOptGroup.nameEn,
      nameEn: newOptGroup.nameEn || newOptGroup.nameAr,
      type: newOptGroup.type,
      choices: newOptGroup.choices
    };

    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        customOptions: [...(editingProduct.customOptions || []), groupItem]
      });
    } else {
      setNewProduct({
        ...newProduct,
        customOptions: [...(newProduct.customOptions || []), groupItem]
      });
    }

    setNewOptGroup({ nameAr: '', nameEn: '', type: 'single', choices: [] });
  };

  const handleRemoveOptionGroup = (groupId, isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        customOptions: (editingProduct.customOptions || []).filter(g => g.id !== groupId)
      });
    } else {
      setNewProduct({
        ...newProduct,
        customOptions: (newProduct.customOptions || []).filter(g => g.id !== groupId)
      });
    }
  };

  // Product CRUD
  const handleAddProduct = (e) => {
    e.preventDefault();
    const id = `prod-${Date.now()}`;
    const updated = {
      ...draft,
      products: [
        { 
          ...newProduct, 
          id, 
          price: Number(newProduct.price), 
          minQuantity: Number(newProduct.minQuantity),
          customOptions: newProduct.customOptions || []
        },
        ...draft.products,
      ],
    };
    setDraft(updated);
    updateStoreData(updated);
    setIsNewProductModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveEditedProduct = (e) => {
    e.preventDefault();
    const updated = {
      ...draft,
      products: draft.products.map(p =>
        p.id === editingProduct.id
          ? { 
              ...editingProduct, 
              price: Number(editingProduct.price), 
              minQuantity: Number(editingProduct.minQuantity),
              customOptions: editingProduct.customOptions || []
            }
          : p
      ),
    };
    setDraft(updated);
    updateStoreData(updated);
    setEditingProduct(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteProduct = (id) => {
    if (confirm(lang === 'ar' ? 'حذف هذا الصنف؟' : 'Delete this item?')) {
      const updated = {
        ...draft,
        products: draft.products.filter(p => p.id !== id),
      };
      setDraft(updated);
      updateStoreData(updated);
    }
  };

  const handleToggleProductStock = (id) => {
    const updated = {
      ...draft,
      products: draft.products.map(p => (p.id === id ? { ...p, inStock: !p.inStock } : p)),
    };
    setDraft(updated);
    updateStoreData(updated);
  };

  // Coupons
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    const cleanCode = newCoupon.code.trim().toUpperCase();
    const updated = {
      ...draft,
      coupons: [
        { 
          ...newCoupon, 
          code: cleanCode, 
          discountValue: Number(newCoupon.discountValue), 
          minOrder: Number(newCoupon.minOrder) 
        },
        ...draft.coupons,
      ],
    };
    setDraft(updated);
    updateStoreData(updated);
    setNewCouponModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteCoupon = (code) => {
    const updated = {
      ...draft,
      coupons: draft.coupons.filter(c => c.code !== code),
    };
    setDraft(updated);
    updateStoreData(updated);
  };

  // Partners
  const handleAddPartner = (e) => {
    e.preventDefault();
    const id = `partner-${Date.now()}`;
    const updated = {
      ...draft,
      contact: {
        ...draft.contact,
        partnerStores: [...draft.contact.partnerStores, { ...newPartner, id }],
      },
    };
    setDraft(updated);
    updateStoreData(updated);
    setNewPartnerModalOpen(false);
  };

  const handleDeletePartner = (id) => {
    const updated = {
      ...draft,
      contact: {
        ...draft.contact,
        partnerStores: draft.contact.partnerStores.filter(p => p.id !== id),
      },
    };
    setDraft(updated);
    updateStoreData(updated);
  };

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'rejected' ? (o.total || 0) : 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const pendingCustomOrders = customOrders.filter(c => c.status === 'pending');

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          <VintageCard innerClassName="p-8 sm:p-10 text-center">
            <div className="w-12 h-12 rounded-full border border-[#d6c4a5] bg-[#f5ede0] flex items-center justify-center mx-auto mb-4 text-[#ba8a24]">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">
              {t.adminLoginTitle}
            </h2>
            <p className="text-xs text-stone-500 mb-6 font-light">
              {lang === 'ar' ? 'لوحة التحكم وإدارة المتجر والطلبيات' : 'Control panel for store management'}
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={t.adminPasswordPlaceholder}
                className="w-full px-4 py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24] text-center"
              />
              {loginError && (
                <p className="text-xs text-red-600 font-bold">{t.invalidPassword}</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-stone-900 text-[#f5ede0] font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer"
              >
                {t.loginBtn}
              </button>
            </form>
          </VintageCard>
        </div>
      </div>
    );
  }

  const navMenuItems = [
    { id: 'overview', label: t.tabOverview, icon: LayoutDashboard },
    { id: 'theme', label: t.tabTheme || (lang === 'ar' ? 'الألوان والمظهر' : 'Theme & Colors'), icon: Palette },
    { id: 'content', label: t.tabContent || (lang === 'ar' ? 'نصوص وأقسام الموقع' : 'Site Content & Texts'), icon: Type },
    { id: 'menu', label: t.tabMenu, count: draft.products.length, icon: UtensilsCrossed },
    { id: 'custom-orders', label: t.tabCustomOrders, count: customOrders.length, badge: pendingCustomOrders.length, icon: Sparkles },
    { id: 'orders', label: t.tabOrders, count: orders.length, badge: pendingOrders.length, icon: ShoppingBag },
    { id: 'payment', label: t.tabPayment || (lang === 'ar' ? 'معلومات دفع Zelle' : 'Zelle Payment'), icon: CreditCard },
    { id: 'hero', label: t.tabHero, icon: Video },
    { id: 'contact', label: t.tabContact, icon: Phone },
    { id: 'shipping', label: t.tabShipping, icon: Truck },
    { id: 'coupons', label: t.tabCoupons, icon: Tag },
    { id: 'backup', label: t.tabBackup, icon: RotateCcw },
  ];

  return (
    <div className="min-h-screen pb-20 pt-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Email Toast Notice */}
        {emailNotice && (
          <div className="mb-4 p-3.5 rounded-2xl bg-stone-900 text-[#f5ede0] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#ba8a24]" />
              <span>
                {lang === 'ar'
                  ? `تم إرسال إشعار (${emailNotice.type === 'accept' ? 'الموافقة' : 'الاعتذار'}) إلى بريد العميل: ${emailNotice.email}`
                  : `Notification email sent to customer: ${emailNotice.email}`}
              </span>
            </div>
            <span className="text-[10px] font-mono text-stone-400">Ref: {emailNotice.orderId}</span>
          </div>
        )}

        {/* ===================== MOBILE TOP CONTROL BAR (3-Lines Hamburger) ===================== */}
        <div className="lg:hidden w-full mb-3 flex items-center justify-between p-3 rounded-2xl border border-[#d6c4a5] bg-[#f5ede0]">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-9 h-9 rounded-full border border-[#d6c4a5] bg-[#ede3d2] flex items-center justify-center text-stone-900 active:scale-95 cursor-pointer hover:border-stone-800 transition-colors"
              title="القائمة"
            >
              <Menu className="w-4 h-4 text-stone-900" />
            </button>
            <div>
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <span>{navMenuItems.find(i => i.id === activeTab)?.label || t.adminTitle}</span>
              </div>
              <div className="text-[10px] text-[#ba8a24] font-medium font-serif">Gâteaux du blad</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAllChanges}
              className="px-3.5 py-1.5 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-[#ba8a24]" />
              <span>{saveSuccess ? '✓' : (lang === 'ar' ? 'حفظ' : 'Save')}</span>
            </button>
            <button
              onClick={adminLogout}
              className="w-8 h-8 rounded-full border border-[#d6c4a5] bg-[#f5ede0] flex items-center justify-center text-stone-600 active:scale-95"
              title={t.logoutBtn}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ===================== MOBILE POPUP SIDEBAR DRAWER ===================== */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-stretch justify-start lg:hidden">
            <div className="w-72 max-w-[85vw] h-full bg-[#f5ede0] border-e border-[#d6c4a5] p-4 flex flex-col justify-between shadow-2xl overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#d6c4a5]">
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900">{t.adminTitle}</h3>
                    <p className="text-[11px] text-[#ba8a24] font-serif">Gâteaux du blad</p>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full border border-[#d6c4a5] bg-[#ede3d2] flex items-center justify-center text-stone-700 active:scale-95 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors flex items-center justify-between gap-2 cursor-pointer border active:scale-95 ${
                          isActive
                            ? 'border-stone-900 bg-stone-900 text-[#f5ede0]'
                            : 'border-transparent text-stone-800 hover:border-[#d6c4a5] hover:bg-[#ede3d2]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#ba8a24]' : 'text-stone-600'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge > 0 ? (
                          <span className="w-4 h-4 rounded-full bg-[#ba8a24] text-white text-[9px] font-bold flex items-center justify-center">
                            {item.badge}
                          </span>
                        ) : item.count !== undefined ? (
                          <span className="text-[10px] text-stone-500 font-mono">
                            {item.count}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-[#d6c4a5] space-y-2">
                <button
                  onClick={() => {
                    handleSaveAllChanges();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-[#ba8a24]" />
                  <span>{saveSuccess ? t.changesSaved : t.saveChanges}</span>
                </button>
                <button
                  onClick={adminLogout}
                  className="w-full py-2 rounded-full border border-[#d6c4a5] text-stone-700 text-xs font-medium flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.logoutBtn}</span>
                </button>
              </div>
            </div>

            {/* Click backdrop to close */}
            <div className="flex-1 h-full cursor-pointer" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* SIDEBAR + MAIN CONTENT LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
          
          {/* ===================== DESKTOP SIDEBAR ===================== */}
          <aside className="hidden lg:block w-64 shrink-0">
            <VintageCard innerClassName="p-3.5 sm:p-5 space-y-3 sm:space-y-4">
              
              {/* Admin Brand */}
              <div className="pb-3 sm:pb-4 border-b border-[#d6c4a5] flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                    {t.adminTitle}
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-[#ba8a24] font-medium font-serif">
                    Gâteaux du blad
                  </p>
                </div>
                <button
                  onClick={adminLogout}
                  className="w-8 h-8 rounded-full border border-[#d6c4a5] bg-[#f5ede0] flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer active:scale-95"
                  title={t.logoutBtn}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Navigation Links in Sidebar — Vertical Stack */}
              <nav className="flex flex-col gap-1.5">
                {navMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl text-xs font-medium transition-colors flex items-center justify-between gap-2 cursor-pointer border active:scale-95 whitespace-nowrap ${
                        isActive
                          ? 'border-stone-900 bg-stone-900 text-[#f5ede0]'
                          : 'border-transparent text-stone-800 hover:border-[#d6c4a5] hover:bg-[#ede3d2]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-[#ba8a24]' : 'text-stone-600'}`} />
                        <span>{item.label}</span>
                      </div>
                      
                      {item.badge > 0 ? (
                        <span className="w-4 h-4 rounded-full bg-[#ba8a24] text-white text-[9px] font-bold flex items-center justify-center ms-1">
                          {item.badge}
                        </span>
                      ) : item.count !== undefined ? (
                        <span className="text-[10px] text-stone-500 font-mono ms-1">
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>

              {/* Save All Button in Sidebar */}
              <div className="pt-2 sm:pt-3 border-t border-[#d6c4a5]">
                <button
                  onClick={handleSaveAllChanges}
                  className="w-full py-2 sm:py-2.5 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Save className="w-3.5 h-3.5 text-[#ba8a24]" />
                  <span>{saveSuccess ? t.changesSaved : t.saveChanges}</span>
                </button>
              </div>

            </VintageCard>
          </aside>

          {/* ===================== MAIN CONTENT AREA ===================== */}
          <main className="flex-1 w-full min-w-0 space-y-4 sm:space-y-6">
            
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <VintageCard innerClassName="p-5">
                    <span className="text-[10px] text-[#ba8a24] uppercase tracking-wider block mb-1 font-bold">Total Sales</span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-stone-900">${totalRevenue.toFixed(2)}</span>
                  </VintageCard>
                  <VintageCard innerClassName="p-5">
                    <span className="text-[10px] text-[#ba8a24] uppercase tracking-wider block mb-1 font-bold">Pending Orders</span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-stone-900">{pendingOrders.length}</span>
                  </VintageCard>
                  <VintageCard innerClassName="p-5">
                    <span className="text-[10px] text-[#ba8a24] uppercase tracking-wider block mb-1 font-bold">Custom Requests</span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-stone-900">{customOrders.length}</span>
                  </VintageCard>
                  <VintageCard innerClassName="p-5">
                    <span className="text-[10px] text-[#ba8a24] uppercase tracking-wider block mb-1 font-bold">Menu Items</span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-stone-900">{draft.products.length}</span>
                  </VintageCard>
                </div>

                <VintageCard innerClassName="p-6 space-y-3">
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {lang === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => setIsNewProductModalOpen(true)}
                      className="px-4 py-2 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.addNewProduct}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('theme')}
                      className="px-4 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-900 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Palette className="w-3.5 h-3.5 text-[#ba8a24]" />
                      <span>{lang === 'ar' ? 'تخصيص الألوان' : 'Theme & Colors'}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('content')}
                      className="px-4 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-900 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Type className="w-3.5 h-3.5 text-[#ba8a24]" />
                      <span>{lang === 'ar' ? 'نصوص وأقسام الموقع' : 'Site Texts'}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('custom-orders')}
                      className="px-4 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-900 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#ba8a24]" />
                      <span>{t.tabCustomOrders}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('payment')}
                      className="px-4 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-900 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#ba8a24]" />
                      <span>{lang === 'ar' ? 'دفع Zelle' : 'Zelle Payment'}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('hero')}
                      className="px-4 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-900 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Video className="w-3.5 h-3.5 text-[#ba8a24]" />
                      <span>{t.tabHero}</span>
                    </button>
                  </div>
                </VintageCard>
              </div>
            )}

            {/* THEME & COLORS */}
            {activeTab === 'theme' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    {lang === 'ar' ? 'تخصيص ألوان وثيم الموقع' : 'Site Theme & Colors Customization'}
                  </h3>
                  <p className="text-xs text-stone-500 font-light">
                    {lang === 'ar'
                      ? 'اختر من الثيمات الجاهزة أو عدل الألوان يدوياً. التغييرات تنعكس فورياً في الموقع وتُحفظ في قاعدة البيانات لتظهر لجميع الزوار.'
                      : 'Pick a pre-made palette or customize hex colors directly. Changes apply immediately and save to database.'}
                  </p>
                </div>

                {/* Presets */}
                <VintageCard innerClassName="p-5 sm:p-6 space-y-3">
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    {lang === 'ar' ? 'ثيمات وألوان جاهزة بنقرة واحدة:' : 'Pre-made Theme Presets:'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {THEME_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyThemePreset(preset.theme)}
                        className="p-3.5 rounded-2xl border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-900 text-start transition-all cursor-pointer group active:scale-95 space-y-2"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: preset.theme.bgColor }} />
                          <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: preset.theme.cardBg }} />
                          <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: preset.theme.accentColor }} />
                          <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: preset.theme.buttonBg }} />
                        </div>
                        <div className="text-xs font-bold text-stone-900 group-hover:text-[#ba8a24]">
                          {lang === 'ar' ? preset.nameAr : preset.nameEn}
                        </div>
                      </button>
                    ))}
                  </div>
                </VintageCard>

                {/* Custom Color Pickers */}
                <VintageCard innerClassName="p-5 sm:p-7 space-y-5">
                  <h4 className="font-serif font-bold text-sm text-stone-900 pb-2 border-b border-[#d6c4a5]">
                    {lang === 'ar' ? 'تعديل الألوان الدقيقة يدوياً (Color Pickers):' : 'Fine-Tune Colors Manually:'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { key: 'bgColor', labelAr: 'خلفية الموقع العامة', labelEn: 'Site Background' },
                      { key: 'cardBg', labelAr: 'خلفية البطاقات الرئيسية', labelEn: 'Card Background' },
                      { key: 'cardInnerBg', labelAr: 'خلفية الصناديق الداخلية', labelEn: 'Inner Box Background' },
                      { key: 'borderColor', labelAr: 'لون الحدود والإطارات', labelEn: 'Border / Outline' },
                      { key: 'accentColor', labelAr: 'لون الذهب والتمييز', labelEn: 'Gold / Accent Color' },
                      { key: 'textColor', labelAr: 'لون النصوص الأساسية', labelEn: 'Main Text Color' },
                      { key: 'buttonBg', labelAr: 'خلفية الأزرار الداكنة', labelEn: 'Buttons Background' },
                      { key: 'buttonText', labelAr: 'لون نص الأزرار', labelEn: 'Buttons Text Color' },
                    ].map((item) => (
                      <div key={item.key} className="p-3 rounded-2xl border border-[#d6c4a5] bg-[#f5ede0] space-y-1.5">
                        <label className="block text-[11px] font-bold text-stone-800">
                          {lang === 'ar' ? item.labelAr : item.labelEn}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={draft.theme?.[item.key] || '#f5ede0'}
                            onChange={(e) => setDraft({
                              ...draft,
                              theme: { ...(draft.theme || {}), [item.key]: e.target.value }
                            })}
                            className="w-9 h-9 rounded-full border border-[#d6c4a5] cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            value={draft.theme?.[item.key] || ''}
                            onChange={(e) => setDraft({
                              ...draft,
                              theme: { ...(draft.theme || {}), [item.key]: e.target.value }
                            })}
                            className="w-full px-2.5 py-1 rounded-full border border-[#d6c4a5] bg-white text-xs font-mono uppercase text-stone-900"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Live Preview Card */}
                  <div className="pt-4 border-t border-[#d6c4a5] space-y-2">
                    <span className="text-[11px] font-bold text-stone-600 block">
                      {lang === 'ar' ? 'معاينة حية لشكل العناصر بالألوان المختارة:' : 'Live Component Preview with Selected Colors:'}
                    </span>
                    <div 
                      className="p-5 rounded-3xl border transition-all space-y-3"
                      style={{
                        backgroundColor: draft.theme?.cardBg || '#f5ede0',
                        borderColor: draft.theme?.borderColor || '#d6c4a5',
                        color: draft.theme?.textColor || '#1c1917',
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span 
                          className="text-xs font-serif font-bold"
                          style={{ color: draft.theme?.accentColor || '#ba8a24' }}
                        >
                          Gâteaux du blad • حلويات البلاد
                        </span>
                        <span 
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                          style={{
                            backgroundColor: draft.theme?.buttonBg || '#1c1917',
                            color: draft.theme?.buttonText || '#f5ede0',
                          }}
                        >
                          Preview Badge
                        </span>
                      </div>
                      <div 
                        className="p-3 rounded-2xl border text-xs"
                        style={{
                          backgroundColor: draft.theme?.cardInnerBg || '#ede3d2',
                          borderColor: draft.theme?.borderColor || '#d6c4a5',
                        }}
                      >
                        {lang === 'ar' ? 'صندوق تجريبي لمعاينة التناسق بين الألوان المختارة.' : 'Sample box to preview harmony between colors.'}
                      </div>
                      <button
                        type="button"
                        className="px-5 py-2 rounded-full text-xs font-bold transition-all"
                        style={{
                          backgroundColor: draft.theme?.buttonBg || '#1c1917',
                          color: draft.theme?.buttonText || '#f5ede0',
                        }}
                      >
                        {lang === 'ar' ? 'زر تجريبي' : 'Sample Button'}
                      </button>
                    </div>
                  </div>
                </VintageCard>
              </div>
            )}

            {/* SITE CONTENT & TEXTS */}
            {activeTab === 'content' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    {lang === 'ar' ? 'تعديل نصوص وأقسام الموقع' : 'Site Texts & Sections Customization'}
                  </h3>
                  <p className="text-xs text-stone-500 font-light">
                    {lang === 'ar'
                      ? 'تعديل شعار الهيرو، نصوص المقدمة، الأيقونات الدائرية الخمس، وقسم علب الهدايا والتغليف.'
                      : 'Customize the hero emblem, intro text, 5 highlight circular icons, and packaging showcase.'}
                  </p>
                </div>

                {/* Section 1: Hero Logo & Titles */}
                <VintageCard innerClassName="p-5 sm:p-7 space-y-4">
                  <h4 className="font-serif font-bold text-sm text-stone-900 pb-2 border-b border-[#d6c4a5]">
                    1. {lang === 'ar' ? 'شعار واسم المتجر في الهيرو' : 'Hero Logo & Brand Titles'}
                  </h4>

                  {/* Logo upload */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-2xl border border-[#d6c4a5] bg-[#ede3d2]">
                    <div className="w-20 h-20 rounded-full border-2 border-[#d6c4a5] overflow-hidden bg-[#f5ede0] shrink-0 p-1">
                      <img 
                        src={draft.hero?.logoUrl || '/images/logo.png'} 
                        alt="Logo" 
                        className="w-full h-full object-contain rounded-full" 
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-start">
                      <span className="block text-xs font-bold text-stone-900">
                        {lang === 'ar' ? 'شعار المتجر الدائري' : 'Circular Brand Logo'}
                      </span>
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer active:scale-95">
                        <Upload className="w-3.5 h-3.5 text-[#ba8a24]" />
                        <span>{lang === 'ar' ? 'رفع شعار جديد من جهازك' : 'Upload New Logo from Device'}</span>
                        <input type="file" accept="image/*" onChange={handleHeroLogoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'اسم المتجر بالإنجليزية' : 'Brand Name (English)'}
                      </label>
                      <input
                        type="text"
                        value={draft.hero?.titleEn || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          hero: { ...(draft.hero || {}), titleEn: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-serif"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'اسم المتجر بالعربية' : 'Brand Name (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={draft.hero?.titleAr || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          hero: { ...(draft.hero || {}), titleAr: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-serif"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'العنوان الفرعي بالإنجليزية' : 'Subtitle (English)'}
                      </label>
                      <input
                        type="text"
                        value={draft.hero?.subtitleEn || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          hero: { ...(draft.hero || {}), subtitleEn: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'العنوان الفرعي بالعربية' : 'Subtitle (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={draft.hero?.subtitleAr || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          hero: { ...(draft.hero || {}), subtitleAr: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                    </div>
                  </div>
                </VintageCard>

                {/* Section 2: Intro under Video */}
                <VintageCard innerClassName="p-5 sm:p-7 space-y-4">
                  <h4 className="font-serif font-bold text-sm text-stone-900 pb-2 border-b border-[#d6c4a5]">
                    2. {lang === 'ar' ? 'قسم المقدمة والوصف تحت الفيديو' : 'About Section Under Video'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'شارة المدينة بالعربية' : 'City Tag (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={draft.about?.subtitleAr || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          about: { ...(draft.about || {}), subtitleAr: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'شارة المدينة بالإنجليزية' : 'City Tag (English)'}
                      </label>
                      <input
                        type="text"
                        value={draft.about?.subtitleEn || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          about: { ...(draft.about || {}), subtitleEn: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'العنوان الرئيسي بالعربية' : 'Main Title (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={draft.about?.titleAr || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          about: { ...(draft.about || {}), titleAr: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-serif"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'العنوان الرئيسي بالإنجليزية' : 'Main Title (English)'}
                      </label>
                      <input
                        type="text"
                        value={draft.about?.titleEn || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          about: { ...(draft.about || {}), titleEn: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-serif"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'نص الوصف بالعربية' : 'Description Text (Arabic)'}
                      </label>
                      <textarea
                        rows={3}
                        value={draft.about?.descriptionAr || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          about: { ...(draft.about || {}), descriptionAr: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'نص الوصف بالإنجليزية' : 'Description Text (English)'}
                      </label>
                      <textarea
                        rows={3}
                        value={draft.about?.descriptionEn || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          about: { ...(draft.about || {}), descriptionEn: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                    </div>
                  </div>
                </VintageCard>

                {/* Section 3: 5 Circular Highlight Icons */}
                <VintageCard innerClassName="p-5 sm:p-7 space-y-4">
                  <h4 className="font-serif font-bold text-sm text-stone-900 pb-2 border-b border-[#d6c4a5]">
                    3. {lang === 'ar' ? 'الأيقونات الدائرية الخمس الترويجية' : '5 Circular Highlight Features'}
                  </h4>

                  <div className="space-y-4">
                    {(draft.about?.features || []).map((feat) => (
                      <div key={feat.id} className="p-4 rounded-2xl border border-[#d6c4a5] bg-[#f5ede0] flex flex-col md:flex-row items-center gap-4">
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <div className="w-16 h-16 rounded-full overflow-hidden border border-[#d6c4a5] bg-white p-0.5">
                            <img src={feat.image} alt="" className="w-full h-full object-cover rounded-full" />
                          </div>
                          <label className="px-2.5 py-1 rounded-full border border-[#d6c4a5] bg-[#ede3d2] hover:border-stone-900 text-[10px] font-bold cursor-pointer active:scale-95">
                            {lang === 'ar' ? 'تغيير الصورة' : 'Change Image'}
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleFeatureImageUpload(e, feat.id)} 
                              className="hidden" 
                            />
                          </label>
                        </div>

                        <div className="flex-1 w-full space-y-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input
                              type="text"
                              placeholder="Title in Arabic"
                              value={feat.titleAr}
                              onChange={(e) => {
                                const updated = draft.about.features.map(f => f.id === feat.id ? { ...f, titleAr: e.target.value } : f);
                                setDraft({ ...draft, about: { ...draft.about, features: updated } });
                              }}
                              className="px-3 py-1.5 rounded-full border border-[#d6c4a5] bg-white text-xs font-bold"
                            />
                            <input
                              type="text"
                              placeholder="Title in English"
                              value={feat.titleEn}
                              onChange={(e) => {
                                const updated = draft.about.features.map(f => f.id === feat.id ? { ...f, titleEn: e.target.value } : f);
                                setDraft({ ...draft, about: { ...draft.about, features: updated } });
                              }}
                              className="px-3 py-1.5 rounded-full border border-[#d6c4a5] bg-white text-xs font-bold"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input
                              type="text"
                              placeholder="Description in Arabic"
                              value={feat.descAr}
                              onChange={(e) => {
                                const updated = draft.about.features.map(f => f.id === feat.id ? { ...f, descAr: e.target.value } : f);
                                setDraft({ ...draft, about: { ...draft.about, features: updated } });
                              }}
                              className="px-3 py-1.5 rounded-full border border-[#d6c4a5] bg-white text-xs font-light"
                            />
                            <input
                              type="text"
                              placeholder="Description in English"
                              value={feat.descEn}
                              onChange={(e) => {
                                const updated = draft.about.features.map(f => f.id === feat.id ? { ...f, descEn: e.target.value } : f);
                                setDraft({ ...draft, about: { ...draft.about, features: updated } });
                              }}
                              className="px-3 py-1.5 rounded-full border border-[#d6c4a5] bg-white text-xs font-light"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </VintageCard>

                {/* Section 4: Packaging Box Showcase */}
                <VintageCard innerClassName="p-5 sm:p-7 space-y-4">
                  <h4 className="font-serif font-bold text-sm text-stone-900 pb-2 border-b border-[#d6c4a5]">
                    4. {lang === 'ar' ? 'قسم علب الهدايا والتغليف الفاخر' : 'Packaging & Gift Boxes Showcase'}
                  </h4>

                  <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-2xl border border-[#d6c4a5] bg-[#ede3d2]">
                    <div className="w-24 h-20 rounded-xl border border-[#d6c4a5] overflow-hidden bg-[#f5ede0] shrink-0">
                      <img 
                        src={draft.packaging?.image || '/images/packaging-box.jpg'} 
                        alt="Box" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-start">
                      <span className="block text-xs font-bold text-stone-900">
                        {lang === 'ar' ? 'صورة علبة التغليف الحالية' : 'Packaging Box Image'}
                      </span>
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer active:scale-95">
                        <Upload className="w-3.5 h-3.5 text-[#ba8a24]" />
                        <span>{lang === 'ar' ? 'رفع صورة علبة من جهازك' : 'Upload Box Image from Device'}</span>
                        <input type="file" accept="image/*" onChange={handlePackagingImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'الشارة العلوية بالعربية' : 'Top Tag (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={draft.packaging?.tagAr || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          packaging: { ...(draft.packaging || {}), tagAr: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'الشارة العلوية بالإنجليزية' : 'Top Tag (English)'}
                      </label>
                      <input
                        type="text"
                        value={draft.packaging?.tagEn || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          packaging: { ...(draft.packaging || {}), tagEn: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'العنوان بالعربية' : 'Title (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={draft.packaging?.titleAr || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          packaging: { ...(draft.packaging || {}), titleAr: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-serif"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'العنوان بالإنجليزية' : 'Title (English)'}
                      </label>
                      <input
                        type="text"
                        value={draft.packaging?.titleEn || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          packaging: { ...(draft.packaging || {}), titleEn: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-serif"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'الوصف بالعربية' : 'Description (Arabic)'}
                      </label>
                      <textarea
                        rows={2}
                        value={draft.packaging?.descAr || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          packaging: { ...(draft.packaging || {}), descAr: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-2xl border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'الوصف بالإنجليزية' : 'Description (English)'}
                      </label>
                      <textarea
                        rows={2}
                        value={draft.packaging?.descEn || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          packaging: { ...(draft.packaging || {}), descEn: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-2xl border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                    </div>
                  </div>
                </VintageCard>
              </div>
            )}

            {/* MENU PRODUCTS MANAGEMENT */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">{t.tabMenu}</h3>
                    <p className="text-xs text-stone-500 font-light">
                      {lang === 'ar' ? 'تعديل وحذف الأصناف وإضافة خيارات وتعديلات مخصصة (غاناش، حشوات، توبينق) يكتبها صاحب المتجر بنفسه' : 'Edit items, prices, and write custom add-ons (ganache, fillings, toppings) freely'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsNewProductModalOpen(true)}
                    className="px-4 py-2 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#ba8a24]" />
                    <span>{t.addNewProduct}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {draft.products.map((prod) => (
                    <VintageCard key={prod.id} innerClassName="p-5 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={prod.image} 
                            alt="" 
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#d6c4a5]" 
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-serif font-bold text-sm text-stone-900 truncate">
                              {lang === 'ar' ? prod.titleAr : prod.titleEn}
                            </div>
                            <div className="text-xs font-bold text-[#ba8a24]">
                              ${prod.price.toFixed(2)} • Min {prod.minQuantity} {lang === 'ar' ? prod.unitAr : prod.unitEn}
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-2 mb-3 font-light">
                          {lang === 'ar' ? prod.descriptionAr : prod.descriptionEn}
                        </p>

                        {/* Custom Options Groups created by owner */}
                        <div className="space-y-1 mb-3">
                          {prod.customOptions && prod.customOptions.length > 0 ? (
                            prod.customOptions.map(opt => (
                              <div key={opt.id} className="text-[11px] text-stone-700 bg-[#ede3d2] px-2.5 py-1 rounded-lg">
                                <span className="font-bold text-[#ba8a24]">{opt.nameAr} / {opt.nameEn}: </span>
                                <span>{opt.choices?.map(c => `${c.labelAr} (${c.extraPrice > 0 ? `+$${c.extraPrice}` : '0'})`).join(', ')}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-[10px] text-stone-400 italic">
                              {lang === 'ar' ? 'بدون إضافات مخصصة' : 'Standard item (no custom options)'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#d6c4a5] flex items-center justify-between">
                        <button
                          onClick={() => handleToggleProductStock(prod.id)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                            prod.inStock ? 'border-emerald-800 bg-emerald-50 text-emerald-800' : 'border-stone-300 text-stone-400'
                          }`}
                        >
                          {prod.inStock ? t.inStock : t.outOfStock}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="w-8 h-8 rounded-full border border-[#d6c4a5] bg-[#f5ede0] flex items-center justify-center text-stone-700 hover:text-stone-950 cursor-pointer"
                            title={t.editProduct}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="w-8 h-8 rounded-full border border-[#d6c4a5] bg-[#f5ede0] flex items-center justify-center text-stone-400 hover:text-red-700 cursor-pointer"
                            title={t.deleteProduct}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </VintageCard>
                  ))}
                </div>
              </div>
            )}

            {/* CUSTOM ORDERS (طلبيات مخصصة) */}
            {activeTab === 'custom-orders' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">{t.tabCustomOrders}</h3>
                  <p className="text-xs text-stone-500 font-light">
                    {lang === 'ar' ? 'طلبيات الزبائن مع الصور والملاحظات. الضغط على قبول أو رفض يرسل إشعاراً بريدياً للزبون مباشرة.' : 'Custom orders submitted with photos and notes. Accept or Reject automatically triggers an email.'}
                  </p>
                </div>

                {customOrders.length === 0 ? (
                  <VintageCard innerClassName="p-12 text-center text-stone-400 text-xs">
                    {lang === 'ar' ? 'لا توجد طلبيات مخصصة حالياً' : 'No custom orders submitted yet'}
                  </VintageCard>
                ) : (
                  customOrders.map((order) => {
                    const isAccepted = order.status === 'accepted';
                    const isRejected = order.status === 'rejected';

                    return (
                      <VintageCard key={order.id} innerClassName="p-6">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                          
                          {/* Photo */}
                          {order.image ? (
                            <div className="w-full md:w-40 h-40 rounded-2xl overflow-hidden border border-[#d6c4a5] shrink-0 bg-[#f5ede0]">
                              <img src={order.image} alt="Reference" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-full md:w-40 h-40 rounded-2xl border border-dashed border-[#d6c4a5] flex items-center justify-center text-stone-400 text-xs shrink-0">
                              {lang === 'ar' ? 'بدون صورة' : 'No photo'}
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-[#ba8a24]">{order.id}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                isAccepted 
                                  ? 'border-emerald-800 bg-emerald-50 text-emerald-800' 
                                  : isRejected 
                                  ? 'border-red-800 bg-red-50 text-red-800' 
                                  : 'border-amber-700 bg-amber-50 text-amber-800'
                              }`}>
                                {isAccepted ? t.statusAccepted : isRejected ? t.statusRejected : t.statusPending}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono">
                                {new Date(order.date).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="font-serif font-bold text-sm text-stone-900">
                              {order.customerName} • {order.customerPhone} • {order.customerEmail}
                            </div>

                            <p className="text-xs text-stone-700 bg-[#ede3d2] p-3 rounded-xl border border-[#d6c4a5] whitespace-pre-wrap font-light">
                              {order.notes}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-row md:flex-col items-center gap-2 shrink-0 justify-end w-full md:w-auto">
                            <button
                              onClick={() => handleSetCustomOrderStatus(order.id, 'accepted', order.customerEmail)}
                              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                                isAccepted
                                  ? 'bg-emerald-800 text-white'
                                  : 'border border-emerald-800 text-emerald-900 bg-emerald-50 hover:bg-emerald-100'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{t.acceptOrder}</span>
                            </button>

                            <button
                              onClick={() => handleSetCustomOrderStatus(order.id, 'rejected', order.customerEmail)}
                              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                                isRejected
                                  ? 'bg-red-800 text-white'
                                  : 'border border-red-800 text-red-900 bg-red-50 hover:bg-red-100'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{t.rejectOrder}</span>
                            </button>

                            <button
                              onClick={() => deleteCustomOrder(order.id)}
                              className="p-1.5 text-stone-400 hover:text-stone-900 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      </VintageCard>
                    );
                  })
                )}
              </div>
            )}

            {/* STORE ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">{t.tabOrders}</h3>
                  <p className="text-xs text-stone-500 font-light">
                    {lang === 'ar' ? 'الطلبات المباشرة من المتجر. تغيير الحالة يرسل إشعاراً لبريد العميل.' : 'Direct store orders. Status updates alert customer email.'}
                  </p>
                </div>

                {orders.length === 0 ? (
                  <VintageCard innerClassName="p-12 text-center text-stone-400 text-xs">
                    {lang === 'ar' ? 'لا توجد طلبات بعد' : 'No orders recorded'}
                  </VintageCard>
                ) : (
                  orders.map((o) => (
                    <VintageCard key={o.id} innerClassName="p-5 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-stone-900">{o.id}</span>
                          <span className="font-mono font-bold text-sm text-[#ba8a24]">${(o.total || 0).toFixed(2)}</span>
                          <span className="text-[10px] text-stone-400">({new Date(o.date).toLocaleDateString()})</span>
                        </div>

                        <div className="text-stone-800 font-bold">
                          {o.customerName} • {o.phone} • {o.email}
                        </div>

                        <div className="text-stone-500 text-[11px]">
                          {o.shippingAddress?.street}, {o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.zip}
                        </div>

                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {o.items?.map((it, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-[11px] text-stone-800">
                              {it.quantity}x {lang === 'ar' ? it.titleAr : it.titleEn}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                        <select
                          value={o.status}
                          onChange={(e) => handleSetOrderStatus(o.id, e.target.value, o.email)}
                          className="px-3 py-1.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-bold text-stone-800"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted (Send Email)</option>
                          <option value="preparing">Preparing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="rejected">Rejected (Send Email)</option>
                        </select>

                        <button 
                          onClick={() => deleteOrder(o.id)} 
                          className="p-1.5 text-stone-400 hover:text-stone-900 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </VintageCard>
                  ))
                )}
              </div>
            )}

            {/* ZELLE PAYMENT SETTINGS */}
            {activeTab === 'payment' && (
              <VintageCard innerClassName="p-6 sm:p-8 space-y-5 max-w-2xl">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {lang === 'ar' ? 'بيانات وإعدادات الدفع عبر Zelle' : 'Zelle® Payment Details'}
                  </h3>
                  <p className="text-xs text-stone-500 font-light">
                    {lang === 'ar'
                      ? 'المعلومات التي تظهر للزبائن في صفحة إتمام الطلب لتحويل قيمة المشتريات عبر Zelle.'
                      : 'Details presented to customers at checkout to transfer payments via Zelle.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'ar' ? 'رقم هاتف حساب Zelle' : 'Zelle Phone Number'}
                    </label>
                    <input
                      type="text"
                      value={draft.payment?.zellePhone || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        payment: { ...(draft.payment || {}), zellePhone: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'ar' ? 'البريد الإلكتروني لحساب Zelle' : 'Zelle Email Address'}
                    </label>
                    <input
                      type="email"
                      value={draft.payment?.zelleEmail || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        payment: { ...(draft.payment || {}), zelleEmail: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'ar' ? 'اسم صاحب الحساب أو المتجر' : 'Recipient Name / Business Name'}
                    </label>
                    <input
                      type="text"
                      value={draft.payment?.zelleName || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        payment: { ...(draft.payment || {}), zelleName: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'إرشادات التحويل بالعربية' : 'Payment Instructions (Arabic)'}
                      </label>
                      <textarea
                        rows={3}
                        value={draft.payment?.instructionsAr || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          payment: { ...(draft.payment || {}), instructionsAr: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {lang === 'ar' ? 'إرشادات التحويل بالإنجليزية' : 'Payment Instructions (English)'}
                      </label>
                      <textarea
                        rows={3}
                        value={draft.payment?.instructionsEn || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          payment: { ...(draft.payment || {}), instructionsEn: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                    </div>
                  </div>
                </div>
              </VintageCard>
            )}

            {/* HERO MEDIA: VIDEO OR IMAGE CHOICE */}
            {activeTab === 'hero' && (
              <VintageCard innerClassName="p-6 sm:p-8 space-y-6 max-w-2xl">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {lang === 'ar' ? 'وسائط الواجهة الترحيبية (فيديو أو صورة)' : 'Hero Welcome Media (Video or Image)'}
                  </h3>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    {lang === 'ar' 
                      ? 'اختر ما إذا كنت ترغب في عرض فيديو ترحيبي أو صورة بانر خلفية في الواجهة.' 
                      : 'Choose whether to display a background video or a banner image in the hero section.'}
                  </p>
                </div>

                {/* Media Type Toggle Selector */}
                <div className="flex items-center gap-3 p-1.5 rounded-full border border-[#d6c4a5] bg-[#ede3d2] w-fit">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = {
                        ...draft,
                        hero: { ...(draft.hero || {}), mediaType: 'video' }
                      };
                      setDraft(updated);
                      updateStoreData(updated);
                    }}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      (draft.hero?.mediaType || 'video') === 'video'
                        ? 'bg-stone-900 text-[#f5ede0] shadow-sm'
                        : 'text-stone-700 hover:text-stone-950'
                    }`}
                  >
                    🎥 {lang === 'ar' ? 'فيديو ترحيبي (Video)' : 'Background Video'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = {
                        ...draft,
                        hero: { ...(draft.hero || {}), mediaType: 'image' }
                      };
                      setDraft(updated);
                      updateStoreData(updated);
                    }}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      draft.hero?.mediaType === 'image'
                        ? 'bg-stone-900 text-[#f5ede0] shadow-sm'
                        : 'text-stone-700 hover:text-stone-950'
                    }`}
                  >
                    🖼️ {lang === 'ar' ? 'صورة بانر (Image)' : 'Banner Image'}
                  </button>
                </div>

                {/* Video Controls */}
                {(draft.hero?.mediaType || 'video') === 'video' ? (
                  <div className="space-y-4 pt-2 border-t border-[#d6c4a5]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-xs font-bold text-stone-800">
                        {lang === 'ar' ? 'ملف الفيديو الحالي:' : 'Current Video File:'}
                      </span>
                      <label className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer active:scale-95">
                        <Upload className="w-3.5 h-3.5 text-[#ba8a24]" />
                        <span>{lang === 'ar' ? 'رفع فيديو جديد من جهازك' : 'Upload Video File from Device'}</span>
                        <input type="file" accept="video/*" onChange={handleHeroVideoUpload} className="hidden" />
                      </label>
                    </div>

                    <div className="text-[11px] text-stone-500">{t.orEnterUrl}</div>
                    <input
                      type="text"
                      placeholder="e.g. /videos/my-video.mp4"
                      value={draft.hero?.videoUrl || ''}
                      onChange={(e) => {
                        const updated = {
                          ...draft,
                          hero: { ...(draft.hero || {}), videoUrl: e.target.value }
                        };
                        setDraft(updated);
                      }}
                      className="w-full px-4 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-mono"
                    />

                    {draft.hero?.videoUrl && (
                      <div className="aspect-video max-w-md rounded-2xl overflow-hidden border border-[#d6c4a5] bg-black mt-2">
                        <video src={draft.hero?.videoUrl} controls className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ) : (
                  /* Image Controls */
                  <div className="space-y-4 pt-2 border-t border-[#d6c4a5]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-xs font-bold text-stone-800">
                        {lang === 'ar' ? 'صورة البانر الحالية:' : 'Current Banner Image:'}
                      </span>
                      <label className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer active:scale-95">
                        <Upload className="w-3.5 h-3.5 text-[#ba8a24]" />
                        <span>{lang === 'ar' ? 'رفع صورة بانر من جهازك' : 'Upload Banner Image from Device'}</span>
                        <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                      </label>
                    </div>

                    <div className="text-[11px] text-stone-500">{t.orEnterUrl}</div>
                    <input
                      type="text"
                      placeholder="e.g. /images/banner.jpg"
                      value={draft.hero?.imageUrl || ''}
                      onChange={(e) => {
                        const updated = {
                          ...draft,
                          hero: { ...(draft.hero || {}), imageUrl: e.target.value }
                        };
                        setDraft(updated);
                      }}
                      className="w-full px-4 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-mono"
                    />

                    {draft.hero?.imageUrl && (
                      <div className="aspect-video max-w-md rounded-2xl overflow-hidden border border-[#d6c4a5] bg-stone-900 mt-2">
                        <img src={draft.hero?.imageUrl} alt="Hero Banner" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </VintageCard>
            )}

            {/* CONTACT & MAP */}
            {activeTab === 'contact' && (
              <VintageCard innerClassName="p-6 sm:p-8 space-y-5 max-w-2xl">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">{t.tabContact}</h3>
                  <p className="text-xs text-stone-500 font-light">
                    {lang === 'ar' ? 'تعديل جميع معلومات التواصل، العنوان، ساعات العمل، ومواقع التواصل والخريطة' : 'Edit all contact details, address, working hours, socials and Google Maps'}
                  </p>
                </div>
                
                {/* Contact numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">{t.phoneLabel}</label>
                    <input
                      type="text"
                      value={draft.contact.phone || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        contact: { ...draft.contact, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp</label>
                    <input
                      type="text"
                      value={draft.contact.whatsapp || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        contact: { ...draft.contact, whatsapp: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">{t.emailLabel}</label>
                    <input
                      type="email"
                      value={draft.contact.email || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        contact: { ...draft.contact, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                    />
                  </div>
                </div>

                {/* Physical Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#d6c4a5]">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'ar' ? 'العنوان بالعربية' : 'Address (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={draft.contact.addressAr || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        contact: { ...draft.contact, addressAr: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'ar' ? 'العنوان بالإنجليزية' : 'Address (English)'}
                    </label>
                    <input
                      type="text"
                      value={draft.contact.addressEn || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        contact: { ...draft.contact, addressEn: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                    />
                  </div>
                </div>

                {/* Working hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'ar' ? 'ساعات العمل بالعربية' : 'Working Hours (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={draft.contact.workingHoursAr || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        contact: { ...draft.contact, workingHoursAr: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'ar' ? 'ساعات العمل بالإنجليزية' : 'Working Hours (English)'}
                    </label>
                    <input
                      type="text"
                      value={draft.contact.workingHoursEn || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        contact: { ...draft.contact, workingHoursEn: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                    />
                  </div>
                </div>

                {/* Social media links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#d6c4a5]">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Instagram Link</label>
                    <input
                      type="text"
                      value={draft.contact.instagram || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        contact: { ...draft.contact, instagram: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Facebook Link</label>
                    <input
                      type="text"
                      value={draft.contact.facebook || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        contact: { ...draft.contact, facebook: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">TikTok Link</label>
                    <input
                      type="text"
                      value={draft.contact.tiktok || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        contact: { ...draft.contact, tiktok: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Google Maps Embed Code */}
                <div className="pt-2 border-t border-[#d6c4a5]">
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.mapIframeLabel}</label>
                  <textarea
                    rows={3}
                    value={draft.contact.mapEmbedCode || ''}
                    onChange={(e) => setDraft({
                      ...draft,
                      contact: { ...draft.contact, mapEmbedCode: e.target.value }
                    })}
                    className="w-full px-4 py-2 rounded-xl border border-[#d6c4a5] bg-[#f5ede0] text-xs font-mono"
                  />
                </div>

                {/* Partner Stores */}
                <div className="pt-3 border-t border-[#d6c4a5]">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-serif font-bold text-sm text-stone-900">{t.partnerStoresTitle}</h4>
                    <button
                      type="button"
                      onClick={() => setNewPartnerModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-bold hover:border-stone-900 active:scale-95 cursor-pointer"
                    >
                      {t.addNewPartner}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {draft.contact.partnerStores.map(p => (
                      <div key={p.id} className="p-3 rounded-xl border border-[#d6c4a5] bg-[#ede3d2] flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-stone-900">{lang === 'ar' ? p.nameAr : p.nameEn}</div>
                          <div className="text-stone-500">{p.phone}</div>
                        </div>
                        <button type="button" onClick={() => handleDeletePartner(p.id)} className="text-stone-400 hover:text-stone-900 p-1 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </VintageCard>
            )}

            {/* SHIPPING */}
            {activeTab === 'shipping' && (
              <VintageCard innerClassName="p-6 sm:p-8 space-y-4 max-w-xl">
                <h3 className="font-serif font-bold text-base text-stone-900">{t.tabShipping}</h3>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Free Delivery Minimum ($)</label>
                  <input
                    type="number"
                    value={draft.shipping.freeShippingThreshold}
                    onChange={(e) => setDraft({
                      ...draft,
                      shipping: { ...draft.shipping, freeShippingThreshold: Number(e.target.value) }
                    })}
                    className="w-28 px-3 py-1.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-bold"
                  />
                </div>

                <div className="space-y-2 pt-3 border-t border-[#d6c4a5]">
                  {draft.shipping.methods.map((method, idx) => (
                    <div key={method.id} className="p-3 rounded-xl border border-[#d6c4a5] bg-[#ede3d2] flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold">{lang === 'ar' ? method.titleAr : method.titleEn}</div>
                        <div className="text-stone-500 text-[11px]">{method.descEn}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">$</span>
                        <input
                          type="number"
                          value={method.price}
                          onChange={(e) => {
                            const newMethods = [...draft.shipping.methods];
                            newMethods[idx] = { ...method, price: Number(e.target.value) };
                            setDraft({ ...draft, shipping: { ...draft.shipping, methods: newMethods } });
                          }}
                          className="w-16 px-2 py-1 rounded-full border border-[#d6c4a5] bg-[#f5ede0] font-bold text-center text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </VintageCard>
            )}

            {/* COUPONS */}
            {activeTab === 'coupons' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-bold text-base text-stone-900">{t.tabCoupons}</h3>
                  <button
                    onClick={() => setNewCouponModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800"
                  >
                    {t.addNewCoupon}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {draft.coupons.map((c) => (
                    <VintageCard key={c.code} innerClassName="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-mono font-bold text-sm text-stone-900">{c.code}</div>
                        <div className="text-xs text-[#ba8a24] font-medium mt-0.5">
                          {c.discountType === 'percent' ? `${c.discountValue}%` : `$${c.discountValue}`} (Min ${c.minOrder})
                        </div>
                      </div>
                      <button onClick={() => handleDeleteCoupon(c.code)} className="text-stone-400 hover:text-stone-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </VintageCard>
                  ))}
                </div>
              </div>
            )}

            {/* BACKUP */}
            {activeTab === 'backup' && (
              <VintageCard innerClassName="p-6 space-y-4 max-w-md">
                <h3 className="font-serif font-bold text-base text-stone-900">{t.tabBackup}</h3>
                <button
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(draft, null, 2));
                    const a = document.createElement('a');
                    a.href = dataStr;
                    a.download = `gateaux_du_blad_${Date.now()}.json`;
                    a.click();
                  }}
                  className="w-full py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-bold hover:border-stone-900 flex items-center justify-center gap-1.5 text-stone-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON Backup</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(t.resetConfirm)) {
                      resetStoreData();
                      setDraft(storeData);
                    }
                  }}
                  className="w-full py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-600 hover:text-red-600 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.resetDefaults}</span>
                </button>
              </VintageCard>
            )}

          </main>

        </div>

      </div>

      {/* ===================== ADD / EDIT PRODUCT MODAL WITH CUSTOM ADD-ONS ===================== */}
      {(isNewProductModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="max-w-xl w-full my-0 sm:my-8 max-h-[92vh] overflow-y-auto">
            <VintageCard innerClassName="p-4 sm:p-8 space-y-4 rounded-b-none sm:rounded-3xl">
              
              <div className="flex justify-between items-center pb-2 border-b border-[#d6c4a5]">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {editingProduct ? t.editProduct : t.addNewProduct}
                </h3>
                <button 
                  onClick={() => {
                    setIsNewProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="text-stone-500 hover:text-stone-900 text-xs font-bold active:scale-95 p-1"
                >
                  ✕
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-4">
                
                {/* Photo Upload from device */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.uploadProductImage}
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-900 text-xs font-bold text-stone-800 transition-colors cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-[#ba8a24]" />
                      <span>{lang === 'ar' ? 'اختر صورة من جهازك' : 'Upload photo'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleProductImageUpload(e, Boolean(editingProduct))} 
                        className="hidden" 
                      />
                    </label>
                    {(editingProduct ? editingProduct.image : newProduct.image) && (
                      <img 
                        src={editingProduct ? editingProduct.image : newProduct.image} 
                        alt="Preview" 
                        className="w-10 h-10 rounded-xl object-cover border border-[#d6c4a5]" 
                      />
                    )}
                  </div>
                </div>

                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">{t.productTitleAr} *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct ? editingProduct.titleAr : newProduct.titleAr}
                      onChange={(e) => {
                        if (editingProduct) setEditingProduct({ ...editingProduct, titleAr: e.target.value });
                        else setNewProduct({ ...newProduct, titleAr: e.target.value });
                      }}
                      className="w-full px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">{t.productTitleEn} *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct ? editingProduct.titleEn : newProduct.titleEn}
                      onChange={(e) => {
                        if (editingProduct) setEditingProduct({ ...editingProduct, titleEn: e.target.value });
                        else setNewProduct({ ...newProduct, titleEn: e.target.value });
                      }}
                      className="w-full px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                    />
                  </div>
                </div>

                {/* Price, Min Qty, Category */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">{t.productPrice}</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingProduct ? editingProduct.price : newProduct.price}
                      onChange={(e) => {
                        if (editingProduct) setEditingProduct({ ...editingProduct, price: e.target.value });
                        else setNewProduct({ ...newProduct, price: e.target.value });
                      }}
                      className="w-full px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">{t.productMinQty}</label>
                    <input
                      type="number"
                      required
                      value={editingProduct ? editingProduct.minQuantity : newProduct.minQuantity}
                      onChange={(e) => {
                        if (editingProduct) setEditingProduct({ ...editingProduct, minQuantity: e.target.value });
                        else setNewProduct({ ...newProduct, minQuantity: e.target.value });
                      }}
                      className="w-full px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">{t.productCategory}</label>
                    <select
                      value={editingProduct ? editingProduct.category : newProduct.category}
                      onChange={(e) => {
                        if (editingProduct) setEditingProduct({ ...editingProduct, category: e.target.value });
                        else setNewProduct({ ...newProduct, category: e.target.value });
                      }}
                      className="w-full px-2 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                    >
                      <option value="honeyed">{t.filterHoneyed}</option>
                      <option value="powdered">{t.filterPowdered}</option>
                      <option value="dry">{t.filterDry}</option>
                      <option value="boxes">{t.filterBoxes}</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">{t.productDescAr}</label>
                  <textarea
                    rows={2}
                    value={editingProduct ? editingProduct.descriptionAr : newProduct.descriptionAr}
                    onChange={(e) => {
                      if (editingProduct) setEditingProduct({ ...editingProduct, descriptionAr: e.target.value });
                      else setNewProduct({ ...newProduct, descriptionAr: e.target.value });
                    }}
                    className="w-full p-2.5 rounded-xl border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                  />
                </div>

                {/* ===================== DYNAMIC CUSTOM ADD-ONS BUILDER ===================== */}
                <div className="pt-3 border-t border-[#d6c4a5] space-y-3">
                  <div>
                    <h4 className="font-serif font-bold text-xs text-stone-900">
                      {lang === 'ar' ? 'تعديلات وإضافات هذا الصنف (تكتبها بنفسك: غاناش، حشو، توبينق...)' : 'Custom Add-on Options for this Item'}
                    </h4>
                    <p className="text-[10px] text-stone-500 font-light">
                      {lang === 'ar' ? 'يمكنك كتابة أي نوع إضافة بالعربية والإنجليزية مع تحديد سعرها الإضافي' : 'Add custom options with bilingual names and extra costs'}
                    </p>
                  </div>

                  {/* List of currently attached custom options */}
                  <div className="space-y-2">
                    {((editingProduct ? editingProduct.customOptions : newProduct.customOptions) || []).map(group => (
                      <div key={group.id} className="p-2.5 rounded-xl border border-[#d6c4a5] bg-[#ede3d2] flex justify-between items-start text-xs">
                        <div>
                          <div className="font-bold text-stone-900">
                            {group.nameAr} / {group.nameEn} ({group.type === 'multiple' ? (lang === 'ar' ? 'متعدد' : 'Multiple') : (lang === 'ar' ? 'خيار واحد' : 'Single')})
                          </div>
                          <div className="text-[11px] text-stone-600 mt-0.5">
                            {group.choices?.map(c => `${c.labelAr} (+$${c.extraPrice || 0})`).join(' • ')}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionGroup(group.id, Boolean(editingProduct))}
                          className="text-stone-400 hover:text-red-700 ps-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Form to add a new option group */}
                  <div className="p-3 rounded-xl border border-dashed border-[#d6c4a5] bg-[#f5ede0] space-y-2.5">
                    <div className="font-bold text-[11px] text-[#ba8a24]">
                      {lang === 'ar' ? '+ إضافة قسم خيارات جديد (مثال: نوع الغاناش)' : '+ Create Option Group'}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="اسم القسم بالعربية (مثلاً: الغاناش)"
                        value={newOptGroup.nameAr}
                        onChange={(e) => setNewOptGroup({ ...newOptGroup, nameAr: e.target.value })}
                        className="px-2.5 py-1.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Name in English (e.g. Ganache)"
                        value={newOptGroup.nameEn}
                        onChange={(e) => setNewOptGroup({ ...newOptGroup, nameEn: e.target.value })}
                        className="px-2.5 py-1.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      />
                      <select
                        value={newOptGroup.type}
                        onChange={(e) => setNewOptGroup({ ...newOptGroup, type: e.target.value })}
                        className="px-2 py-1.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                      >
                        <option value="single">{lang === 'ar' ? 'يختار واحد فقط' : 'Single Select'}</option>
                        <option value="multiple">{lang === 'ar' ? 'يختار أكثر من خيار' : 'Multi Select'}</option>
                      </select>
                    </div>

                    {/* Choices builder within this group */}
                    <div className="pt-2 border-t border-[#d6c4a5] space-y-2">
                      <div className="text-[10px] text-stone-600 font-bold">
                        {lang === 'ar' ? 'الخيارات المتاحة داخل هذا القسم:' : 'Choices in this group:'}
                      </div>

                      {newOptGroup.choices.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {newOptGroup.choices.map((c, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full border border-[#d6c4a5] bg-white text-stone-800">
                              {c.labelAr} / {c.labelEn} (+${c.extraPrice})
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          placeholder="الخيار بالعربية (مثلاً: شوكولاتة داكنة)"
                          value={newChoice.labelAr}
                          onChange={(e) => setNewChoice({ ...newChoice, labelAr: e.target.value })}
                          className="flex-1 min-w-[140px] px-2.5 py-1 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Choice in English (e.g. Dark Choc)"
                          value={newChoice.labelEn}
                          onChange={(e) => setNewChoice({ ...newChoice, labelEn: e.target.value })}
                          className="flex-1 min-w-[140px] px-2.5 py-1 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                        />
                        <input
                          type="number"
                          step="0.5"
                          placeholder="+$ Extra"
                          value={newChoice.extraPrice}
                          onChange={(e) => setNewChoice({ ...newChoice, extraPrice: Number(e.target.value) })}
                          className="w-20 px-2 py-1 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-bold text-center"
                        />
                        <button
                          type="button"
                          onClick={handleAddChoiceToGroup}
                          className="px-3 py-1 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800"
                        >
                          + {lang === 'ar' ? 'إضافة الخيار' : 'Add Choice'}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleAddOptionGroupToProduct(Boolean(editingProduct))}
                        className="w-full py-1.5 rounded-full border border-[#ba8a24] text-[#ba8a24] hover:bg-[#ba8a24] hover:text-white text-xs font-bold transition-colors"
                      >
                        ✓ {lang === 'ar' ? 'اعتماد هذا القسم للصنف' : 'Save Option Group to Item'}
                      </button>
                    </div>

                  </div>
                </div>

                {/* Final Modal Actions */}
                <div className="flex gap-2 pt-3 border-t border-[#d6c4a5]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewProductModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="flex-1 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-700"
                  >
                    {t.closeModal}
                  </button>
                  <button
                    type="button"
                    onClick={editingProduct ? handleSaveEditedProduct : handleAddProduct}
                    className="flex-1 py-2 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800"
                  >
                    {t.saveChanges}
                  </button>
                </div>

              </div>

            </VintageCard>
          </div>
        </div>
      )}

      {/* ===================== COUPON MODAL ===================== */}
      {newCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="max-w-sm w-full">
            <VintageCard innerClassName="p-5 sm:p-6 space-y-3 rounded-b-none sm:rounded-3xl">
              <h3 className="font-serif font-bold text-base text-stone-900">{t.addNewCoupon}</h3>
              <form onSubmit={handleAddCoupon} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Code e.g. AID2026"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-mono uppercase"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                    className="px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                  >
                    <option value="percent">Percentage %</option>
                    <option value="fixed">Fixed $</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Value"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                    className="px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-bold"
                  />
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Minimum Order $"
                  value={newCoupon.minOrder}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                  className="w-full px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setNewCouponModalOpen(false)}
                    className="flex-1 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-700 active:scale-95"
                  >
                    {t.closeModal}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold active:scale-95"
                  >
                    {t.saveChanges}
                  </button>
                </div>
              </form>
            </VintageCard>
          </div>
        </div>
      )}

      {/* ===================== PARTNER MODAL ===================== */}
      {newPartnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="max-w-sm w-full">
            <VintageCard innerClassName="p-5 sm:p-6 space-y-3 rounded-b-none sm:rounded-3xl">
              <h3 className="font-serif font-bold text-base text-stone-900">{t.addNewPartner}</h3>
              <form onSubmit={handleAddPartner} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Name (Arabic)"
                  value={newPartner.nameAr}
                  onChange={(e) => setNewPartner({ ...newPartner, nameAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Name (English)"
                  value={newPartner.nameEn}
                  onChange={(e) => setNewPartner({ ...newPartner, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Address in Philadelphia, PA"
                  value={newPartner.addressEn}
                  onChange={(e) => setNewPartner({ ...newPartner, addressEn: e.target.value, addressAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Phone Number"
                  value={newPartner.phone}
                  onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setNewPartnerModalOpen(false)}
                    className="flex-1 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-700 active:scale-95"
                  >
                    {t.closeModal}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold active:scale-95"
                  >
                    {t.saveChanges}
                  </button>
                </div>
              </form>
            </VintageCard>
          </div>
        </div>
      )}

    </div>
  );
}
