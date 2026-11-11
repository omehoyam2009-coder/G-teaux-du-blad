import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { 
  FadeInUp, 
  FadeInScale, 
  StaggerContainer, 
  StaggerItem 
} from '../components/ScrollReveal';
import VintageCard from '../components/VintageCard';
import FoldedMenuPreview from '../components/FoldedMenuPreview';

export default function HomePage() {
  const { 
    lang, 
    t, 
    storeData, 
    searchQuery, 
    setSearchQuery 
  } = useStore();

  const navigate = useNavigate();
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const videoRef = useRef(null);
  const introSectionRef = useRef(null);

  const toggleVideoSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(videoRef.current.muted);
    }
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const scrollToIntro = () => {
    introSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/menu');
  };

  const filteredSearchItems = searchQuery.trim() 
    ? storeData.products.filter(p => {
        const query = searchQuery.toLowerCase();
        return (
          p.titleEn.toLowerCase().includes(query) ||
          p.titleAr.includes(query)
        );
      }).slice(0, 4)
    : [];

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="relative">
      
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative w-full h-[76vh] sm:h-[88vh] min-h-[480px] overflow-hidden bg-black flex flex-col justify-between">
        
        {/* Background Welcome Video */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            src={storeData.hero.videoUrl}
            poster={storeData.hero.videoPoster || '/images/C1.jpg'}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* TOP: Search Bar - Beige Background with Border (No Liquid Glass) */}
        <div className="relative z-20 w-full max-w-xl mx-auto px-3 pt-2 sm:pt-6 pe-24 sm:pe-28">
          <form onSubmit={handleHeroSearchSubmit} className="relative">
            <div className={`relative flex items-center rounded-full border border-[#d6c4a5] bg-[#f5ede0] transition-colors p-1 ${
              searchFocused ? 'border-[#ba8a24]' : 'hover:border-[#ba8a24]'
            }`}>
              <div className="ps-3.5 pe-2 text-stone-700">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder={lang === 'ar' ? "بحث.." : "Search.."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                className="w-full py-1.5 sm:py-2 text-xs sm:text-sm bg-transparent text-stone-900 placeholder-stone-600 focus:outline-hidden font-normal"
              />
            </div>

            {/* Live Autocomplete Results */}
            {searchFocused && filteredSearchItems.length > 0 && (
              <div className="absolute top-full start-0 end-0 mt-2 bg-[#f5ede0] border border-[#d6c4a5] rounded-3xl p-3 z-50 divide-y divide-[#e5d8c3] max-h-64 overflow-y-auto">
                {filteredSearchItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate('/menu')}
                    className="flex items-center justify-between p-2.5 hover:bg-[#ede3d2] rounded-2xl cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.titleEn}
                        className="w-10 h-10 rounded-full object-cover border border-[#d6c4a5]" 
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          {lang === 'ar' ? item.titleAr : item.titleEn}
                        </div>
                        <div className="text-[11px] text-[#ba8a24]">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <ArrowIcon className="w-3.5 h-3.5 text-stone-600" />
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* CENTER: Logo Emblem & Brand Name in Beige */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center px-4 py-6 pointer-events-none select-none">
          <div className="flex flex-col sm:flex-row items-center justify-center">
            
            {/* Circular Logo Emblem */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shrink-0">
              <img 
                src={storeData.hero?.logoUrl || '/images/logo.png'} 
                alt="Gâteaux du blad Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            {/* Brand Title in Beige */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-start space-y-1">
              <h1 className="font-serif font-bold text-2xl sm:text-4xl text-[#f5ede0] tracking-wide">
                {storeData.hero?.titleEn || 'Gâteaux du blad'}
              </h1>
              <h2 className="font-serif font-bold text-xl sm:text-3xl text-[#ede3d2]">
                {storeData.hero?.titleAr || 'حلويات البلاد'}
              </h2>
              <p className="text-[10px] sm:text-xs text-[#d6c4a5] font-serif tracking-widest uppercase font-medium pt-0.5">
                {lang === 'ar' 
                  ? (storeData.hero?.subtitleAr || 'حلويات جزائرية تقليدية أصيلة • فيلادلفيا، بنسيلفانيا') 
                  : (storeData.hero?.subtitleEn || 'Pâtisserie Algérienne Artisanale • Philadelphia, PA')}
              </p>
            </div>

          </div>
        </div>

      </section>

      {/* ===================== ANIMATED BOUNCING TRIANGLE ===================== */}
      <div className="py-4 sm:py-8 flex justify-center bg-transparent">
        <button
          onClick={scrollToIntro}
          className="flex flex-col items-center cursor-pointer group focus:outline-hidden active:scale-95"
          title={t.scrollDownNotice}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-[#ba8a24] flex items-center justify-center text-stone-700 animate-soft-bounce transition-colors">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-stone-700" viewBox="0 0 24 24">
              <path d="M12 17.5L5 7.5h14L12 17.5z" />
            </svg>
          </div>
        </button>
      </div>

      {/* ===================== SHOP INTRO & 5 CIRCULAR HIGHLIGHT ICONS ===================== */}
      <section ref={introSectionRef} className="py-8 sm:py-12 px-3 sm:px-4 max-w-5xl mx-auto">
        
        {/* Intro text on scroll */}
        <FadeInUp distance={20} className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span className="text-[10px] sm:text-[11px] font-medium tracking-widest text-[#ba8a24] uppercase block mb-1.5 font-serif">
            {lang === 'ar' ? 'فيلادلفيا، بنسيلفانيا' : 'Philadelphia, PA'}
          </span>
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-stone-900 mb-2.5 sm:mb-4">
            {lang === 'ar' ? storeData.about.titleAr : storeData.about.titleEn}
          </h2>
          <p className="text-stone-600 text-xs sm:text-base leading-relaxed font-light">
            {lang === 'ar' 
              ? (storeData.about?.descriptionAr || 'حلويات جزائرية تقليدية أصيلة، تُصنع يدوياً في فيلادلفيا، وتستند إلى حرفية تقليدية عريقة.') 
              : (storeData.about?.descriptionEn || 'Authentic traditional Algerian sweets, handcrafted in Philadelphia and rooted in long-standing, traditional craftsmanship.')}
          </p>
        </FadeInUp>

        {/* 5 Circular Highlight Icons — Responsive Mobile Grid / Row */}
        <StaggerContainer 
          staggerDelay={0.06}
          className="flex flex-wrap items-start justify-center gap-3 sm:gap-8 mb-12 sm:mb-20"
        >
          {storeData.about.features.map((feature) => (
            <StaggerItem 
              key={feature.id} 
              className="flex flex-col items-center text-center group cursor-pointer w-[92px] sm:w-[130px]"
            >
              <div 
                onClick={() => {
                  if (feature.id === 'menu' || feature.id === 'gifts') navigate('/menu');
                  else navigate('/contact');
                }}
                className="relative mb-2 transition-transform group-hover:scale-105 active:scale-95"
              >
                <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-full overflow-hidden border border-[#d6c4a5] group-hover:border-[#ba8a24] transition-all p-0.5 sm:p-1 bg-[#f5ede0]">
                  <img 
                    src={feature.image} 
                    alt={feature.titleEn}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              <h3 
                onClick={() => {
                  if (feature.id === 'menu' || feature.id === 'gifts') navigate('/menu');
                  else navigate('/contact');
                }}
                className="font-serif font-bold text-xs sm:text-sm text-stone-900 mt-0.5 hover:text-[#ba8a24] transition-colors"
              >
                {lang === 'ar' ? feature.titleAr : feature.titleEn}
              </h3>

              <p className="text-[10px] sm:text-[11px] text-stone-500 leading-tight mt-0.5 font-light line-clamp-2">
                {lang === 'ar' ? feature.descAr : feature.descEn}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* ===================== FOLDED LUXURY PAPER MENU PREVIEW ===================== */}
        <FadeInScale distance={20} className="w-full">
          <FoldedMenuPreview storeData={storeData} lang={lang} t={t} />
        </FadeInScale>

        {/* ===================== SIGNATURE PACKAGING SHOWCASE ===================== */}
       

        {/* ===================== NAVIGATION ACTION CARDS ===================== */}
        <FadeInUp distance={20} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
          
          

          <VintageCard
            onClick={() => navigate('/custom')}
            className="cursor-pointer group active:scale-[0.99]"
            innerClassName="p-4 sm:p-7 flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#ba8a24] font-bold block mb-0.5">
                {lang === 'ar' ? 'طلبية مخصصة' : 'Custom Order'}
              </span>
              <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 group-hover:text-[#ba8a24] transition-colors">
                {lang === 'ar' ? 'طلب حلوى أو كيك مخصص' : 'Custom Pastry & Cake Request'}
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-600 font-light mt-0.5">
                {lang === 'ar' ? 'ارفع صورة طلبك وملاحظاتك ونرسل لك الموافقة' : 'Upload photo & notes, receive approval email'}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#d6c4a5] group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center transition-all shrink-0 ms-3 text-stone-800 bg-[#f5ede0]">
               <ArrowIcon className="w-3.5 h-3.5" />
            </div>
          </VintageCard>

        </FadeInUp>

      </section>

    </div>
  );
}
