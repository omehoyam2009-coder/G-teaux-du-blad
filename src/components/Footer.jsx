import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { InstagramIcon, FacebookIcon, TikTokIcon } from './SocialIcons';

export default function Footer() {
  const { lang, t, storeData } = useStore();

  return (
    <footer className="border-t border-[#d6c4a5] py-10 sm:py-16 bg-transparent text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6 sm:gap-8 pb-8 sm:pb-12 border-b border-[#d6c4a5] text-center md:text-start">
          
          {/* Brand */}
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
              {lang === 'ar' ? (storeData.hero?.titleAr || 'حلويات البلاد') : (storeData.hero?.titleEn || 'Gâteaux du blad')}
            </h3>
            <p className="text-stone-500 font-light text-[11px] sm:text-xs">
              {lang === 'ar' 
                ? (storeData.hero?.subtitleAr || 'حلويات جزائرية تقليدية • فيلادلفيا، بنسيلفانيا') 
                : (storeData.hero?.subtitleEn || 'Traditional Algerian Pastries • Philadelphia, PA')}
            </p>
          </div>

          {/* Navigation Links directly to separate pages */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 font-medium text-stone-700">
            <Link to="/" className="hover:text-stone-950 transition-colors active:scale-95">
              {t.navHome}
            </Link>
            <Link to="/menu" className="hover:text-stone-950 transition-colors active:scale-95">
              {t.navMenu}
            </Link>
            <Link to="/contact" className="hover:text-stone-950 transition-colors active:scale-95">
              {t.navContact}
            </Link>
            <Link to="/admin" className="hover:text-stone-950 transition-colors text-stone-400 active:scale-95">
              {t.navAdmin}
            </Link>
          </div>

          {/* Social Icons (Circular, minimal) */}
          <div className="flex items-center justify-center gap-2.5">
            <a 
              href={storeData.contact.instagram}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-400 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-colors active:scale-95"
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a 
              href={storeData.contact.facebook}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-400 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-colors active:scale-95"
              title="Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a 
              href={storeData.contact.tiktok}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-400 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-colors active:scale-95"
              title="TikTok"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-[11px] gap-2 text-center">
          <p>© {new Date().getFullYear()} Gâteaux du blad. Philadelphia, PA, USA.</p>
          <p>{lang === 'ar' ? 'أصالة التراث الجزائري في أمريكا' : 'Authentic Algerian Heritage in America'}</p>
        </div>

      </div>
    </footer>
  );
}
