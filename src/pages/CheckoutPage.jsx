import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { US_STATES } from '../data/usStates';
import { 
  Check, 
  Printer, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  MapPin 
} from 'lucide-react';
import VintageCard from '../components/VintageCard';

export default function CheckoutPage() {
  const { 
    lang, 
    t, 
    cart, 
    cartSubtotal, 
    storeData, 
    appliedCoupon, 
    applyCouponCode, 
    removeCoupon, 
    calculateDiscount,
    selectedShippingMethod,
    setSelectedShippingMethod,
    getShippingFee,
    placeOrder,
    getItemPrice
  } = useStore();

  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    city: 'Philadelphia',
    state: 'PA',
    zip: '19104',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('zelle');
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const discountAmount = calculateDiscount();
  const shippingFee = getShippingFee();
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCouponCode(couponInput);
    setCouponFeedback(res);
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.street || !customerInfo.email) {
      alert(lang === 'ar' ? 'يرجى إكمال بيانات العميل والبريد الإلكتروني وعنوان التوصيل.' : 'Please fill all required customer info, email, and US shipping address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        customerName: customerInfo.fullName,
        phone: customerInfo.phone,
        email: customerInfo.email,
        shippingAddress: {
          street: customerInfo.street,
          city: customerInfo.city,
          state: customerInfo.state,
          zip: customerInfo.zip,
        },
        shippingMethod: selectedShippingMethod,
        shippingFee: shippingFee,
        discount: discountAmount,
        subtotal: cartSubtotal,
        total: finalTotal,
        paymentMethod: 'Zelle',
        notes: customerInfo.notes,
        items: cart.map(item => ({
          id: item.product.id,
          titleEn: item.product.titleEn,
          titleAr: item.product.titleAr,
          price: getItemPrice(item),
          quantity: item.quantity,
          selectedOptions: item.selectedOptions || {}
        })),
      });

      setIsSubmitting(false);
      setConfirmedOrder(order);
    }, 1000);
  };

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;
  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <VintageCard innerClassName="p-8 sm:p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-[#ba8a24] mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">
              {t.emptyCart}
            </h2>
            <p className="text-stone-500 text-xs mb-6 font-light">
              {lang === 'ar' ? 'أضف بعض الحلويات من القائمة أولاً' : 'Add authentic pastries from the menu to proceed'}
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-2.5 rounded-full bg-stone-900 text-[#f5ede0] font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer"
            >
              {t.startShopping}
            </button>
          </VintageCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-4 sm:pt-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Navigation Elements Bar */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-[#d6c4a5]">
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-900 text-xs font-bold text-stone-800 transition-colors cursor-pointer active:scale-95"
          >
            <BackIcon className="w-3.5 h-3.5" />
            <span>{t.navMenu}</span>
          </button>

          <span className="text-[10px] sm:text-xs text-[#ba8a24] font-bold">
            {t.usOnlyNotice}
          </span>
        </div>

        {/* Minimalist Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1.5 sm:mb-2">
            {t.checkoutTitle}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm font-light">
            {t.checkoutSubtitle}
          </p>
        </div>

        <form onSubmit={handleConfirmOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Customer Details & Shipping */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              
              {/* Customer Info */}
              <VintageCard innerClassName="p-4 sm:p-8 space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#d6c4a5]">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                    {t.customerInfoTitle}
                  </h3>
                  <span className="text-[10px] font-bold text-[#ba8a24] bg-[#ede3d2] px-2.5 py-0.5 rounded-full border border-[#d6c4a5]">
                    Philadelphia, PA
                  </span>
                </div>

                {/* Philadelphia Local Notice */}
                <div className="p-3 rounded-2xl border border-[#d6c4a5] bg-[#ede3d2] text-xs text-stone-800 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#ba8a24] shrink-0" />
                  <span className="leading-snug text-[11px] sm:text-xs">
                    {lang === 'ar' 
                      ? 'تنويه: التوصيل متاح حصرياً داخل نطاق مدينة فيلادلفيا، بنسيلفانيا (PA) أو الاستلام المباشر من المخبز.' 
                      : 'Notice: Delivery is exclusively available within Philadelphia, PA or via bakery pickup.'}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">{t.fullName} *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24]"
                    placeholder="Karim Bensalem"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">{t.phoneInput} *</label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24]"
                      placeholder="(267) 884-7644"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">{t.emailInput} *</label>
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24]"
                      placeholder="karim@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">{t.streetAddress} *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.street}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, street: e.target.value })}
                    className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24]"
                    placeholder="3801 Chestnut St, Apt 4"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">{t.cityInput} *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24]"
                      placeholder="Philadelphia"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">{t.stateSelect} (PA Only) *</label>
                    <input
                      type="text"
                      readOnly
                      value="PA - Pennsylvania"
                      className="w-full px-3 py-2 sm:py-2.5 rounded-full border border-[#d6c4a5] bg-[#ede3d2] text-xs font-bold text-stone-900 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">{t.zipCode} *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.zip}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, zip: e.target.value })}
                      className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24]"
                      placeholder="19104"
                    />
                  </div>
                </div>
              </VintageCard>

              {/* Shipping Method */}
              <VintageCard innerClassName="p-4 sm:p-8 space-y-3">
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 pb-2.5 sm:pb-3 border-b border-[#d6c4a5]">
                  {t.shippingMethodTitle}
                </h3>

                {storeData.shipping.methods.map((method) => {
                  const isSelected = selectedShippingMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedShippingMethod(method.id)}
                      className={`p-3 sm:p-4 rounded-2xl border transition-colors cursor-pointer flex items-center justify-between active:scale-[0.99] ${
                        isSelected ? 'border-stone-900 bg-[#ede3d2]' : 'border-[#d6c4a5] hover:border-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={isSelected}
                          onChange={() => setSelectedShippingMethod(method.id)}
                          className="text-stone-900"
                        />
                        <div>
                          <div className="font-bold text-xs text-stone-900">
                            {lang === 'ar' ? method.titleAr : method.titleEn}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-stone-500 font-light">
                            {lang === 'ar' ? method.descAr : method.descEn}
                          </div>
                        </div>
                      </div>

                      <span className="font-serif font-bold text-xs text-stone-900 shrink-0 ms-2">
                        {method.price === 0 ? (lang === 'ar' ? 'مجاني' : 'Free') : `$${method.price.toFixed(2)}`}
                      </span>
                    </div>
                  );
                })}
              </VintageCard>

              {/* Payment Method - Zelle Only */}
              <VintageCard innerClassName="p-4 sm:p-8 space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#d6c4a5]">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                    {t.paymentMethodTitle}
                  </h3>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full border border-stone-900 bg-stone-900 text-[#f5ede0]">
                    Zelle® Only
                  </span>
                </div>

                <div className="p-4 rounded-2xl border border-[#d6c4a5] bg-[#ede3d2] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-stone-900">
                      {lang === 'ar' ? 'الدفع عبر تطبيق Zelle' : 'Zelle® Transfer Details'}
                    </span>
                    <span className="text-[10px] text-[#ba8a24] font-bold uppercase tracking-wider">
                      {lang === 'ar' ? 'طريقة الدفع المعتمدة' : 'Official Payment'}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1 text-stone-800">
                    <div className="flex justify-between items-center py-1.5 border-b border-[#d6c4a5]/60">
                      <span className="text-stone-600 text-[11px]">{lang === 'ar' ? 'رقم التحويل (Zelle Phone):' : 'Zelle Phone:'}</span>
                      <span className="font-mono font-bold text-stone-950" dir="ltr">
                        {storeData.payment?.zellePhone || '(267) 884-7644'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-[#d6c4a5]/60">
                      <span className="text-stone-600 text-[11px]">{lang === 'ar' ? 'البريد الإلكتروني (Zelle Email):' : 'Zelle Email:'}</span>
                      <span className="font-mono font-bold text-stone-950">
                        {storeData.payment?.zelleEmail || 'contact@gateauxdublad.com'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-stone-600 text-[11px]">{lang === 'ar' ? 'اسم المستلم (Recipient):' : 'Recipient Name:'}</span>
                      <span className="font-serif font-bold text-stone-950">
                        {storeData.payment?.zelleName || 'Gâteaux du blad'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-600 font-light pt-1 leading-relaxed border-t border-[#d6c4a5]/60">
                    {lang === 'ar'
                      ? (storeData.payment?.instructionsAr || 'يرجى إرسال قيمة الطلب عبر تطبيق البنك الخاص بك بواسطة Zelle إلى الرقم أو البريد أعلاه مع وضع اسمك في الملاحظة.')
                      : (storeData.payment?.instructionsEn || 'Please send the total payment via Zelle using the phone number or email above, including your name in the transfer memo.')}
                  </p>
                </div>
              </VintageCard>

            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-20 sm:top-28">
                <VintageCard innerClassName="p-4 sm:p-8 space-y-4 sm:space-y-6">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 pb-2.5 sm:pb-3 border-b border-[#d6c4a5]">
                    {t.orderSummary}
                  </h3>

                  {/* Items */}
                  <div className="divide-y divide-[#d6c4a5] max-h-48 sm:max-h-56 overflow-y-auto">
                    {cart.map((item, idx) => {
                      const unitPrice = getItemPrice(item);
                      return (
                        <div key={idx} className="py-2 sm:py-2.5 flex items-center justify-between text-xs">
                          <div className="pe-2">
                            <div className="font-medium text-stone-900">
                              {lang === 'ar' ? item.product.titleAr : item.product.titleEn}
                            </div>
                            <div className="text-stone-500 font-light text-[11px]">
                              {item.quantity} × ${unitPrice.toFixed(2)}
                            </div>
                          </div>
                          <span className="font-mono font-bold text-stone-900 shrink-0">
                            ${(unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Coupon */}
                  <div className="pt-2 sm:pt-3 border-t border-[#d6c4a5]">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between text-xs p-2 sm:p-2.5 rounded-full border border-[#d6c4a5] bg-[#ede3d2]">
                        <span className="font-bold text-stone-800">{appliedCoupon.code}</span>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-stone-600 hover:text-stone-900 underline text-[11px] active:scale-95"
                        >
                          {lang === 'ar' ? 'إزالة' : 'Remove'}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            placeholder={t.couponPlaceholder}
                            className="flex-1 px-3 py-1.5 sm:py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-mono uppercase"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-stone-800 text-xs font-bold hover:bg-stone-900 hover:text-white active:scale-95 transition-colors cursor-pointer"
                          >
                            {t.applyCoupon}
                          </button>
                        </div>
                        {couponFeedback && (
                          <p className="text-[11px] text-stone-600 mt-1">
                            {couponFeedback.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 text-xs text-stone-700 pt-2 sm:pt-3 border-t border-[#d6c4a5]">
                    <div className="flex justify-between">
                      <span>{t.subtotal}</span>
                      <span className="font-mono font-bold text-stone-900">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#ba8a24] font-bold">
                        <span>{t.discount}</span>
                        <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>{t.shipping}</span>
                      <span className="font-mono font-bold text-stone-900">
                        {shippingFee === 0 ? (lang === 'ar' ? 'مجاني' : 'Free') : `$${shippingFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 sm:pt-3 border-t border-[#d6c4a5]">
                      <span>{t.total}</span>
                      <span className="font-serif text-base sm:text-lg text-stone-950">${finalTotal.toFixed(2)} USD</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-[#f5ede0] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    {isSubmitting ? t.processingOrder : t.confirmOrderBtn}
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </VintageCard>
              </div>
            </div>

          </div>
        </form>

      </div>

      {/* Confirmation Modal */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="max-w-md w-full max-h-[92vh] overflow-y-auto">
            <VintageCard innerClassName="p-5 sm:p-8 text-center space-y-4 rounded-b-none sm:rounded-3xl">
              <div className="w-12 h-12 rounded-full border border-[#ba8a24] flex items-center justify-center mx-auto bg-[#f5ede0]">
                <Check className="w-6 h-6 text-[#ba8a24]" />
              </div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900">
                {t.orderConfirmedTitle}
              </h3>
              <p className="text-xs text-[#ba8a24] font-mono font-bold">
                {t.orderConfirmedSubtitle} {confirmedOrder.id}
              </p>

              <div className="text-xs text-stone-700 space-y-1 text-start p-3.5 sm:p-4 rounded-2xl border border-[#d6c4a5] bg-[#ede3d2]">
                <p><strong>{t.fullName}:</strong> {confirmedOrder.customerName}</p>
                <p><strong>{t.streetAddress}:</strong> {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} {confirmedOrder.shippingAddress.zip}</p>
                <p><strong>{t.total}:</strong> ${confirmedOrder.total.toFixed(2)} USD</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-full border border-[#d6c4a5] text-xs font-bold hover:border-stone-900 cursor-pointer flex items-center justify-center gap-1.5 bg-[#f5ede0] active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.printInvoice}</span>
                </button>
                <button
                  onClick={() => {
                    setConfirmedOrder(null);
                    navigate('/');
                  }}
                  className="flex-1 py-2.5 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800 cursor-pointer active:scale-95"
                >
                  {t.continueShopping}
                </button>
              </div>
            </VintageCard>
          </div>
        </div>
      )}

    </div>
  );
}
