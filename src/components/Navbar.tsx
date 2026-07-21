import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Phone, MapPin, Shield, Menu, X, Sparkles, Scale } from 'lucide-react';
import { useApp } from '../context/AppContext';
import butcheryLogo from '../assets/images/butchery_logo_updated_1784664060628.jpg';

export const Navbar: React.FC = () => {
  const {
    cart,
    setIsCartOpen,
    wishlist,
    compareList,
    setIsCompareOpen,
    searchQuery,
    setSearchQuery,
    setIsAdminOpen,
    isAdminOpen,
    isAdminAuthenticated,
    storeSettings
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + 1, 0);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0c]/90 backdrop-blur-xl border-b border-white/10 text-white transition-all shadow-2xl">
      {/* Top Announcement Bar */}
      {storeSettings.announcementBarActive && storeSettings.announcementBarText && (
        <div className="bg-[#e63946] text-white text-[11px] sm:text-xs py-1.5 px-4 font-black text-center overflow-hidden shadow-inner">
          <div className="animate-pulse flex items-center justify-center gap-2">
            <span>{storeSettings.announcementBarText}</span>
          </div>
        </div>
      )}

      {/* Top Address & Store Status Strip */}
      <div className="bg-[#121216] text-gray-300 text-xs py-2 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3 space-x-reverse flex-wrap gap-y-1">
            <span className="flex items-center text-amber-300 font-bold">
              <MapPin className="w-3.5 h-3.5 inline ml-1 text-[#e63946] animate-bounce" />
              {storeSettings.address}
            </span>

            <span className="text-gray-600">|</span>

            {/* Store Status Indicator */}
            {storeSettings.isStoreOpen === false ? (
              <span className="bg-red-950/90 text-red-300 border border-red-700/60 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>المحل مغلق حالياً 🔴</span>
              </span>
            ) : (
              <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>مفتوح واستقبال الطلبات 🟢</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 space-x-reverse font-medium">
            <a
              href={`https://wa.me/${storeSettings.whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center font-bold"
            >
              <Phone className="w-3.5 h-3.5 ml-1" />
              طلب سريع بالواتساب: {storeSettings.phone1}
            </a>
            {isAdminAuthenticated && (
              <>
                <span className="hidden sm:inline text-gray-600">|</span>
                <button
                  onClick={() => setIsAdminOpen(!isAdminOpen)}
                  className="text-amber-300 hover:text-white transition-colors text-[11px] font-extrabold px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center"
                >
                  <Shield className="w-3 h-3 ml-1 text-amber-400" />
                  {isAdminOpen ? 'الرجوع للمتجر' : 'لوحة الإدارة'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center space-x-3 space-x-reverse cursor-pointer group"
        >
          <div className="relative w-11 h-11 rounded-full p-0.5 bg-[#e63946] shadow-lg group-hover:scale-105 transition-transform">
            <img
              src={butcheryLogo}
              alt="جزارة صاحب السعادة"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="block text-xl md:text-2xl font-black text-white leading-none tracking-tight">
              جزارة صاحب السعادة
            </span>
            <span className="block text-[10px] text-gray-400 font-bold tracking-widest mt-1">
              أجود اللحوم البلدية والجاموسي 100%
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 space-x-reverse text-sm font-bold text-gray-300">
          <button
            onClick={() => scrollToSection('offers-section')}
            className="hover:text-[#e63946] transition-colors flex items-center text-[#e63946]"
          >
            <Sparkles className="w-4 h-4 ml-1.5 animate-pulse" />
            عروض اليوم
          </button>
          <button
            onClick={() => scrollToSection('products-section')}
            className="hover:text-white transition-colors"
          >
            قائمة اللحوم البلدي
          </button>
          <button
            onClick={() => scrollToSection('videos-section')}
            className="hover:text-white transition-colors"
          >
            التقطيع والنظافة
          </button>
          <button
            onClick={() => scrollToSection('location-section')}
            className="hover:text-white transition-colors"
          >
            موقع الجزارة
          </button>
          <button
            onClick={() => scrollToSection('reviews-section')}
            className="hover:text-white transition-colors"
          >
            آراء العملاء
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 space-x-reverse">
          {/* Search Toggle */}
          <div className="relative">
            {showSearchInput ? (
              <div className="flex items-center bg-[#16161a] border border-white/20 rounded-full px-3.5 py-1.5 text-xs">
                <Search className="w-3.5 h-3.5 text-[#e63946] ml-1.5" />
                <input
                  type="text"
                  placeholder="ابحث عن موزة، كبدة، مومبار..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white focus:outline-none w-32 sm:w-44 placeholder:text-gray-500 font-medium"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setShowSearchInput(false);
                    setSearchQuery('');
                  }}
                  className="text-gray-400 hover:text-white mr-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowSearchInput(true);
                  scrollToSection('products-section');
                }}
                className="p-2.5 rounded-full bg-[#16161a] border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-colors"
                title="بحث"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Compare Button */}
          {compareList.length > 0 && (
            <button
              onClick={() => setIsCompareOpen(true)}
              className="p-2.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:scale-105 transition-all relative"
              title="مقارنة المنتجات"
            >
              <Scale className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black font-black text-[10px] rounded-full flex items-center justify-center">
                {compareList.length}
              </span>
            </button>
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => scrollToSection('products-section')}
            className="p-2.5 rounded-full bg-[#16161a] border border-white/10 text-gray-300 hover:text-[#e63946] hover:border-white/20 transition-colors relative"
            title="المفضلة"
          >
            <Heart className="w-4 h-4 text-[#e63946]" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e63946] text-white font-black text-[10px] rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-full bg-[#e63946] hover:bg-[#b91c1c] text-white font-extrabold text-xs shadow-lg transition-transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">السلة</span>
            {cartItemsCount > 0 && (
              <span className="bg-white text-[#e63946] font-black px-2 py-0.5 rounded-full text-[10px]">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full bg-[#16161a] text-gray-300 hover:text-white border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950/95 border-b border-red-900/40 px-6 py-4 space-y-3 text-sm font-semibold">
          <button
            onClick={() => scrollToSection('offers-section')}
            className="block w-full text-right py-2 text-amber-300 hover:text-white border-b border-neutral-900"
          >
            🔥 عروض اليوم
          </button>
          <button
            onClick={() => scrollToSection('products-section')}
            className="block w-full text-right py-2 hover:text-amber-400 border-b border-neutral-900"
          >
            🥩 قائمة اللحوم البلدي
          </button>
          <button
            onClick={() => scrollToSection('videos-section')}
            className="block w-full text-right py-2 hover:text-amber-400 border-b border-neutral-900"
          >
            🎬 التقطيع والنظافة
          </button>
          <button
            onClick={() => scrollToSection('location-section')}
            className="block w-full text-right py-2 hover:text-amber-400 border-b border-neutral-900"
          >
            📍 موقعنا بالجيزة
          </button>
          <button
            onClick={() => scrollToSection('reviews-section')}
            className="block w-full text-right py-2 hover:text-amber-400"
          >
            ⭐️ آراء العملاء
          </button>
        </div>
      )}
    </header>
  );
};
