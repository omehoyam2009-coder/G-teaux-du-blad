import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Check, 
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  UtensilsCrossed
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, TikTokIcon } from '../components/SocialIcons';
import { FadeInUp } from '../components/ScrollReveal';
import VintageCard from '../components/VintageCard';

export default function ContactPage() {
  const { lang, t, storeData } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 4000);
  };

  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;
  const NextIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen pb-24 pt-4 sm:pt-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Navigation Elements Bar */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-[#d6c4a5]">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-900 text-xs font-bold text-stone-800 transition-colors cursor-pointer active:scale-95"
          >
            <BackIcon className="w-3.5 h-3.5" />
            <span>{t.navHome}</span>
          </button>

          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer active:scale-95"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>{t.navMenu}</span>
          </button>
        </div>

        {/* Minimalist Page Header */}
        <FadeInUp distance={20} className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 mb-2 sm:mb-3">
            {t.contactTitle}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm font-light">
            {t.contactSubtitle}
          </p>
        </FadeInUp>

        {/* Contact Info Cards Grid in BEIGE THEME */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-16">
          
          <FadeInUp delay={0.05} distance={20} className="h-full">
            <VintageCard className="h-full" innerClassName="p-5 sm:p-7 flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#d6c4a5] bg-[#ede3d2] flex items-center justify-center text-[#ba8a24] mb-3 sm:mb-4">
                  <Phone className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 mb-1">
                  {t.phoneLabel}
                </h3>
                <a 
                  href={`tel:${storeData.contact.phone.replace(/[^0-9]/g, '')}`}
                  className="text-stone-800 hover:text-[#ba8a24] text-xs sm:text-sm block mb-2 font-mono font-bold transition-colors"
                  dir="ltr"
                >
                  {storeData.contact.phone}
                </a>
              </div>
              <a 
                href={`https://wa.me/${storeData.contact.whatsapp}`}
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#ba8a24] font-bold hover:underline"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </VintageCard>
          </FadeInUp>

          <FadeInUp delay={0.1} distance={20} className="h-full">
            <VintageCard className="h-full" innerClassName="p-5 sm:p-7 flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#d6c4a5] bg-[#ede3d2] flex items-center justify-center text-[#ba8a24] mb-3 sm:mb-4">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 mb-1">
                  {t.addressLabel}
                </h3>
                <p className="text-stone-700 text-xs leading-relaxed">
                  {lang === 'ar' ? storeData.contact.addressAr : storeData.contact.addressEn}
                </p>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#ba8a24] font-medium mt-2">Philadelphia, PA</span>
            </VintageCard>
          </FadeInUp>

          <FadeInUp delay={0.15} distance={20} className="h-full">
            <VintageCard className="h-full" innerClassName="p-5 sm:p-7 flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#d6c4a5] bg-[#ede3d2] flex items-center justify-center text-[#ba8a24] mb-3 sm:mb-4">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 mb-1">
                  {t.workingHoursLabel}
                </h3>
                <p className="text-stone-700 text-xs leading-relaxed">
                  {lang === 'ar' ? storeData.contact.workingHoursAr : storeData.contact.workingHoursEn}
                </p>
              </div>
              <div className="flex items-center gap-2.5 mt-4">
                <a 
                  href={storeData.contact.instagram}
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-[#d6c4a5] bg-[#f5ede0] flex items-center justify-center text-stone-700 hover:text-stone-950 transition-colors"
                  title="Instagram"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a 
                  href={storeData.contact.facebook}
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-[#d6c4a5] bg-[#f5ede0] flex items-center justify-center text-stone-700 hover:text-stone-950 transition-colors"
                  title="Facebook"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
                <a 
                  href={storeData.contact.tiktok}
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-[#d6c4a5] bg-[#f5ede0] flex items-center justify-center text-stone-700 hover:text-stone-950 transition-colors"
                  title="TikTok"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </VintageCard>
          </FadeInUp>

        </div>

        {/* Partner Stores in BEIGE THEME */}
        <div className="mb-10 sm:mb-16">
          <FadeInUp distance={15}>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mb-4 sm:mb-6">
              {t.partnerStoresTitle}
            </h2>
          </FadeInUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
            {storeData.contact.partnerStores.map((store, idx) => (
              <FadeInUp key={store.id} delay={idx * 0.08} distance={20}>
                <VintageCard innerClassName="p-4 sm:p-6">
                  <span className="text-[10px] text-[#ba8a24] uppercase font-bold block mb-1">
                    {lang === 'ar' ? store.typeAr : store.typeEn}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-stone-900 mb-1">
                    {lang === 'ar' ? store.nameAr : store.nameEn}
                  </h4>
                  <p className="text-xs text-stone-600 mb-2 font-light">
                    {lang === 'ar' ? store.addressAr : store.addressEn}
                  </p>
                  <span className="text-xs font-mono font-bold text-stone-800" dir="ltr">
                    {store.phone}
                  </span>
                </VintageCard>
              </FadeInUp>
            ))}
          </div>
        </div>

        {/* Google Maps Embed & Contact Form in BEIGE THEME */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start mb-10 sm:mb-16">
          
          {/* Map Frame */}
          <FadeInUp distance={20} className="lg:col-span-7">
            <h3 className="text-sm font-serif font-bold text-stone-900 mb-2.5 sm:mb-3">
              {t.googleMapTitle}
            </h3>
            <VintageCard innerClassName="p-2 sm:p-3">
              <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-[#d6c4a5] bg-[#f5ede0]">
                {storeData.contact.mapEmbedCode ? (
                  <div 
                    className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                    dangerouslySetInnerHTML={{ __html: storeData.contact.mapEmbedCode }}
                  />
                ) : null}
              </div>
            </VintageCard>
          </FadeInUp>

          {/* Clean Message Form */}
          <FadeInUp delay={0.1} distance={20} className="lg:col-span-5">
            <VintageCard innerClassName="p-4 sm:p-8">
              <h3 className="text-sm sm:text-base font-serif font-bold text-stone-900 mb-3 sm:mb-4 pb-2 border-b border-[#d6c4a5]">
                {t.sendMessageTitle}
              </h3>

              {submitted ? (
                <div className="py-8 sm:py-12 text-center text-stone-700">
                  <div className="w-10 h-10 rounded-full border border-[#d6c4a5] flex items-center justify-center mx-auto mb-3 bg-[#f5ede0]">
                    <Check className="w-5 h-5 text-stone-800" />
                  </div>
                  <p className="text-xs font-medium">{t.messageSentSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      {t.yourName}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {t.yourPhone}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {t.yourEmail}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-full border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      {t.yourMessage}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#d6c4a5] bg-[#f5ede0] text-xs text-stone-900 focus:outline-hidden focus:border-[#ba8a24]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 sm:py-3 rounded-full bg-stone-900 text-[#f5ede0] text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer active:scale-95"
                  >
                    {t.sendButton}
                  </button>
                </form>
              )}
            </VintageCard>
          </FadeInUp>

        </div>

        {/* Bottom Page Navigation */}
        <div className="pt-6 sm:pt-8 border-t border-[#d6c4a5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 py-2.5 sm:py-0 text-xs font-bold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer active:scale-95"
          >
            <BackIcon className="w-4 h-4" />
            <span>{lang === 'ar' ? 'العودة للرئيسية' : 'Return to Home'}</span>
          </button>

          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-900 text-stone-900 text-xs font-bold transition-colors cursor-pointer active:scale-95"
          >
            <span>{lang === 'ar' ? 'طلب الحلويات وتصفح المينيو' : 'View Pastries Menu & Order'}</span>
            <NextIcon className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
