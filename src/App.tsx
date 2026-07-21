import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Preloader } from './components/Preloader';
import { ToastNotification } from './components/ToastNotification';
import { Navbar } from './components/Navbar';
import { NoticeBanner } from './components/NoticeBanner';
import { Hero } from './components/Hero';
import { OffersSection } from './components/OffersSection';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { ProductCompareModal } from './components/ProductCompareModal';
import { VideoGallery } from './components/VideoGallery';
import { WhyChooseUs } from './components/WhyChooseUs';
import { StatsCounter } from './components/StatsCounter';
import { LocationSection } from './components/LocationSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqSection } from './components/FaqSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AiRecipeAssistantModal } from './components/AiRecipeAssistantModal';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { Sparkles, Search, Beef, ChefHat } from 'lucide-react';

const AppContent: React.FC = () => {
  const { products, activeCategory, searchQuery, meatAgeFilter } = useApp();
  const [isAiChefOpen, setIsAiChefOpen] = useState(false);

  // Filter products by category, meat age/size, and search
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'buffalo' && product.meatType === 'buffalo') ||
      (activeCategory === 'kandouz' && product.meatType === 'kandouz') ||
      product.category === activeCategory;

    const matchesMeatAge =
      !meatAgeFilter ||
      meatAgeFilter === 'all' ||
      product.meatAge === meatAgeFilter;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.englishName.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.recommendedCooking.some((c) => c.toLowerCase().includes(query));

    return matchesCategory && matchesMeatAge && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-slate-100 flex flex-col justify-between selection:bg-red-800 selection:text-white">
      <ToastNotification />
      <Navbar />

      <main className="flex-1">
        <Hero />
        <OffersSection />

        {/* Products Catalogue Section */}
        <section id="products-section" className="py-16 px-4 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-2 space-x-reverse text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">
                <Beef className="w-4 h-4 text-red-500" />
                <span>اللحوم البلدية والجاموسي الفاخرة</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold gold-gradient-text">
                قائمة المنتجات والقطعات المميزة 🥩
              </h2>
            </div>

            <button
              onClick={() => setIsAiChefOpen(true)}
              className="px-4 py-2.5 rounded-full bg-gradient-to-r from-red-950 via-neutral-900 to-amber-950 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs flex items-center space-x-2 space-x-reverse shadow-lg"
            >
              <ChefHat className="w-4 h-4 text-amber-400 ml-1.5 animate-bounce" />
              <span>مساعد اختيار القطعية حسب الأكلة 👨‍🍳</span>
            </button>
          </div>

          {/* Category Badges */}
          <CategoryBar />

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/50 rounded-3xl border border-neutral-800 space-y-3">
              <Search className="w-12 h-12 mx-auto text-neutral-600" />
              <h3 className="text-lg font-bold text-slate-300">لم نجد أي منتجات تطابق بحثك</h3>
              <p className="text-xs text-slate-500">جرب البحث بكلمات أخرى مثل "موزة"، "كبدة"، "مومبار"، أو اختر فئة أخرى.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <VideoGallery />
        <WhyChooseUs />
        <StatsCounter />
        <LocationSection />
        <ReviewsSection />
        <FaqSection />
      </main>

      {/* Global Modals */}
      <ProductModal />
      <ProductCompareModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <AdminDashboard />
      <AiRecipeAssistantModal isOpen={isAiChefOpen} onClose={() => setIsAiChefOpen(false)} />

      <Footer onOpenAiChef={() => setIsAiChefOpen(true)} />
      <FloatingActions />
    </div>
  );
};

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      {!loadingComplete && <Preloader onComplete={() => setLoadingComplete(true)} />}
      <AppProvider>
        <AppContent />
      </AppProvider>
    </>
  );
}
