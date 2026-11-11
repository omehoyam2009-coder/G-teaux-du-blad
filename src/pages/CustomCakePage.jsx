import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Upload, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Info
} from 'lucide-react';
import { FadeInUp } from '../components/ScrollReveal';
import VintageCard from '../components/VintageCard';

export default function CustomCakePage() {
  const { lang, t, uploadImageFile, submitCustomOrder } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: '',
    image: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadImageFile(file);
      setImagePreview(imageUrl);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (err) {
      alert(lang === 'ar' ? 'فشل تحميل الصورة' : 'Image upload failed');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      alert(lang === 'ar' ? 'يرجى ملء الاسم والهاتف والبريد الإلكتروني' : 'Please provide name, phone and email');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const result = submitCustomOrder(formData);
      setSubmitting(false);
      setSuccessResult(result);
    }, 600);
  };

  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen pb-24 pt-4 sm:pt-8">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-[#d6c4a5]">
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-[#ba8a24] text-xs font-bold text-stone-800 transition-colors cursor-pointer active:scale-95"
          >
            <BackIcon className="w-3.5 h-3.5" />
            <span>{t.navMenu}</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-[#ba8a24] text-xs font-bold text-stone-800 transition-colors cursor-pointer active:scale-95"
          >
            <span>{t.navHome}</span>
          </button>
        </div>

        {/* Page Title */}
        <FadeInUp distance={20} className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#ba8a24] uppercase tracking-widest block mb-1.5 font-serif">
            Bespoke Orders
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 mb-2">
            {t.customOrderTitle}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm font-light">
            {t.customOrderSubtitle}
          </p>
        </FadeInUp>

        {successResult ? (
          <FadeInUp distance={20}>
            <VintageCard innerClassName="p-6 sm:p-12 text-center max-w-xl mx-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#ba8a24] bg-[#f5ede0] text-[#ba8a24] flex items-center justify-center mx-auto mb-4 sm:mb-5">
                <Check className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mb-1.5">
                {t.orderRequestSent}
              </h2>
              <div className="text-xs font-mono text-[#ba8a24] font-bold mb-3 sm:mb-4">
                Ref: {successResult.id}
              </div>
              <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                {lang === 'ar' 
                  ? `تم إرسال طلبيتك إلى إدارة المخبز للمراجعة. ستصلك رسالة قبول مباشرة إلى بريدك الإلكتروني (${formData.customerEmail}).`
                  : `Your request has been received. You will receive an approval email at (${formData.customerEmail}) once reviewed.`}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => {
                    setSuccessResult(null);
                    setImagePreview('');
                    setFormData({
                      customerName: '',
                      customerPhone: '',
                      customerEmail: '',
                      notes: '',
                      image: '',
                    });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs font-bold text-stone-800 hover:border-stone-900 active:scale-95"
                >
                  {lang === 'ar' ? 'طلب طلبية أخرى' : 'Submit Another Request'}
                </button>
                <button
                  onClick={() => navigate('/menu')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800 active:scale-95"
                >
                  {t.browseMenu}
                </button>
              </div>
            </VintageCard>
          </FadeInUp>
        ) : (
          <form onSubmit={handleSubmit}>
            <VintageCard innerClassName="p-4 sm:p-8 space-y-5 sm:space-y-6">
              
              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">
                  {t.uploadOrderImage}
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <label className="w-full sm:w-64 h-36 sm:h-44 rounded-2xl border-2 border-dashed border-[#d6c4a5] hover:border-[#ba8a24] bg-[#f5ede0] flex flex-col items-center justify-center p-3 cursor-pointer transition-colors text-center shrink-0 active:scale-[0.99]">
                    <Upload className="w-6 h-6 text-[#ba8a24] mb-1.5" />
                    <span className="text-xs font-bold text-stone-800 mb-0.5">
                      {lang === 'ar' ? 'اختر صورة من جهازك' : 'Upload photo from device'}
                    </span>
                    <span className="text-[10px] text-stone-500 font-light">
                      PNG, JPG, WebP
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>

                  {imagePreview ? (
                    <div className="relative w-full sm:w-48 h-36 sm:h-44 rounded-2xl overflow-hidden border border-[#d6c4a5] shrink-0 bg-[#f5ede0]">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 start-2 bg-stone-900/80 text-white px-2 py-0.5 rounded-full text-[10px]">
                        {lang === 'ar' ? 'تم اختيار الصورة' : 'Selected'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-stone-600 leading-relaxed font-light text-center sm:text-start">
                      {lang === 'ar' 
                        ? 'يمكنك رفع صورة لأي كيك، أو صينية حلوى، أو ديزاين ترغب في تفصيله خصيصاً لمناسبتك.' 
                        : 'Upload an image of any cake, pastry platter, or custom design you want crafted for your event.'}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Notes / Details */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">{t.orderDetails} *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t.orderDetailsPlaceholder}
                  className="w-full p-3.5 sm:p-4 rounded-2xl border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 placeholder-stone-500 focus:outline-hidden focus:border-[#ba8a24] leading-relaxed"
                />
              </div>

              {/* Customer Contact */}
              <div className="pt-3.5 border-t border-[#d6c4a5] space-y-3.5">
                <h3 className="font-serif font-bold text-xs sm:text-sm text-stone-900">
                  {lang === 'ar' ? 'معلومات التواصل لتلقي إشعار القبول' : 'Contact Details for Approval Notification'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold text-stone-700 mb-1">{t.customerName} *</label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Sarah Mansouri"
                      className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold text-stone-700 mb-1">{t.customerPhone} *</label>
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="(267) 884-7644"
                      className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold text-stone-700 mb-1">{t.customerEmail} *</label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="sarah@email.com"
                      className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24]"
                    />
                  </div>
                </div>

                <p className="text-[10px] sm:text-[11px] text-[#ba8a24] font-medium flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === 'ar' 
                      ? 'عند قبول الطلبية من صفحة الإدارة، سيصلك بريد إلكتروني فوري بالموافقة.' 
                      : 'Upon approval by the shop, an instant notification email will be delivered to this address.'}
                  </span>
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-stone-900 text-[#f5ede0] font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#ba8a24]" />
                  <span>{submitting ? '...' : t.submitOrderRequest}</span>
                </button>
              </div>

            </VintageCard>
          </form>
        )}

      </div>
    </div>
  );
}
