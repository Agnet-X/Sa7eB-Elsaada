import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ShoppingBag, 
  DollarSign, 
  X, 
  FileSpreadsheet, 
  Video, 
  Flame, 
  Settings, 
  BarChart3, 
  Lock, 
  Key, 
  Save, 
  Eye, 
  EyeOff,
  Phone, 
  MapPin, 
  Sparkles,
  Search,
  Calendar,
  Layers,
  Scale,
  Check,
  AlertTriangle,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Order, MeatCategory, HeroVideo, ButcherVideo, OfferItem } from '../types';
import { MediaUploader } from './MediaUploader';

// Play a pleasant notification sound using Web Audio API
function playNewOrderSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playTone = (freq: number, startTime: number, duration: number, vol: number = 0.4) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    const now = ctx.currentTime;
    // Three ascending beeps: ding ding DING
    playTone(880, now, 0.18, 0.35);
    playTone(1100, now + 0.2, 0.18, 0.35);
    playTone(1320, now + 0.4, 0.35, 0.5);
    // Close context after sound finishes
    setTimeout(() => ctx.close(), 1200);
  } catch (e) {
    // Web Audio not supported
    console.warn('Could not play notification sound', e);
  }
}

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    orders,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    clearAllOrders,
    clearCancelledOrders,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    heroVideos,
    addHeroVideo,
    updateHeroVideo,
    deleteHeroVideo,
    galleryVideos,
    addGalleryVideo,
    updateGalleryVideo,
    deleteGalleryVideo,
    offers,
    addOffer,
    updateOffer,
    deleteOffer,
    storeSettings,
    updateStoreSettings,
    showToast,
    setOnNewOrderCallback,
    persistenceMode
  } = useApp();

  // New order sound notification state
  const [newOrderAlert, setNewOrderAlert] = useState<number>(0);

  // Register new order callback to play sound whenever a new order arrives
  useEffect(() => {
    const handleNewOrder = (count: number) => {
      playNewOrderSound();
      setNewOrderAlert(prev => prev + count);
      // Flash tab title
      const originalTitle = document.title;
      let flashes = 0;
      const flashInterval = setInterval(() => {
        document.title = flashes % 2 === 0 ? `🔔 طلب جديد! (${count})` : originalTitle;
        flashes++;
        if (flashes >= 8) {
          clearInterval(flashInterval);
          document.title = originalTitle;
        }
      }, 600);
    };
    setOnNewOrderCallback(handleNewOrder);
    return () => setOnNewOrderCallback(null);
  }, [setOnNewOrderCallback]);

  // Navigation state
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'products' | 'videos' | 'offers' | 'settings'>('orders');
  
  // Auth state
  const [inputPin, setInputPin] = useState('');

  // Orders Tab filters & search
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Inventory Tab filter
  const [auditPeriod, setAuditPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // Product Modals & Forms
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [prodForm, setProdForm] = useState({
    name: '',
    category: 'kandouz' as MeatCategory,
    meatType: 'kandouz' as 'kandouz' | 'buffalo',
    pricePerKg: 420,
    originalPricePerKg: 460,
    description: '',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    meatAge: 'small' as 'small' | 'large' | 'medium',
    customBadge: ''
  });

  // Video Form Modal
  const [editingHeroVideo, setEditingHeroVideo] = useState<HeroVideo | null>(null);
  const [showAddHeroModal, setShowAddHeroModal] = useState(false);
  const [heroForm, setHeroForm] = useState({
    title: 'فيديو واجهة جديد',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-a-piece-of-meat-40919-large.mp4',
    poster: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
  });

  const [editingGalleryVideo, setEditingGalleryVideo] = useState<ButcherVideo | null>(null);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: 'فيديو تقطيع جديد',
    description: 'شاهد التقطيع والنظافة بأعلى المعايير',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-a-piece-of-meat-40919-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
    duration: '01:30',
    category: 'تقطيع بلدي'
  });

  // Offer Form Modal
  const [editingOffer, setEditingOffer] = useState<OfferItem | null>(null);
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [offerForm, setOfferForm] = useState({
    title: 'عرض ملوكي جديد',
    description: 'توفير ممتاز وجودة بلدي 100%',
    discountText: 'خصم 15%',
    originalPrice: 600,
    offerPrice: 500,
    weightLabel: '2 كيلو مشكل',
    productId: 'prod-moza-kandouz',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    badge: 'عرض مميز 🔥'
  });

  // Deletion confirmation states
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [showClearCancelledConfirm, setShowClearCancelledConfirm] = useState(false);

  // Settings form state & PIN visibility
  const [settingsForm, setSettingsForm] = useState(storeSettings);
  const [showPinInLogin, setShowPinInLogin] = useState(false);
  const [showPinInSettings, setShowPinInSettings] = useState(false);

  useEffect(() => {
    setSettingsForm(storeSettings);
  }, [storeSettings]);

  if (!isAdminOpen) return null;

  // Render Login Password Modal if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
        <div className="relative w-full max-w-md bg-[#121218] border border-red-900/60 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#e63946] to-amber-500 p-0.5 flex items-center justify-center shadow-xl">
            <div className="w-full h-full bg-[#121218] rounded-[22px] flex items-center justify-center">
              <Lock className="w-10 h-10 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">تسجيل دخول لوحة الإدارة 🔐</h2>
            <p className="text-xs text-gray-400 font-medium mt-2">
              لوحة تحكم خاصة بصاحب السعادة فقط لضبط الأسعار، الأوردرات والفيديوهات
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginAdmin(inputPin);
            }}
            className="space-y-4"
          >
            <div className="relative">
              <Key className="w-5 h-5 text-amber-400 absolute right-4 top-3.5" />
              <input
                type={showPinInLogin ? "text" : "password"}
                placeholder={`أدخل رمز المرور (الرمز الحالي: ${storeSettings.adminPin || '5553'})...`}
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-[#1a1a24] border border-white/10 rounded-2xl text-white font-mono text-center text-lg focus:outline-none focus:border-[#e63946] transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPinInLogin(!showPinInLogin)}
                className="absolute left-4 top-3.5 text-gray-400 hover:text-amber-400 transition-colors"
                title={showPinInLogin ? 'إخفاء الرمز' : 'إظهار الرمز'}
              >
                {showPinInLogin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#e63946] to-amber-500 text-white font-extrabold rounded-2xl shadow-lg hover:brightness-110 transition-all text-sm flex items-center justify-center space-x-2 space-x-reverse"
            >
              <Shield className="w-4 h-4 ml-1" />
              <span>دخول النظام وتفعيل التحكم</span>
            </button>
          </form>

          <p className="text-[11px] text-gray-500 font-mono">
            * التغييرات تُحفظ على السيرفر وتظهر لجميع الزوار عند ربط Firebase Firestore.
          </p>
        </div>
      </div>
    );
  }

  // --- Calculations for Orders & Financial Audits ---
  const filteredOrders = orders.filter((ord) => {
    const matchesFilter = orderFilter === 'all' || ord.status === orderFilter;
    const matchesSearch =
      ord.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      ord.customerPhone.includes(orderSearchQuery);
    return matchesFilter && matchesSearch;
  });

  // Calculate audit sales based on auditPeriod
  const now = Date.now();
  const auditOrders = orders.filter((ord) => {
    if (auditPeriod === 'all') return true;
    const orderTime = new Date(ord.createdAt).getTime() || now;
    if (auditPeriod === 'today') return now - orderTime <= 24 * 3600 * 1000;
    if (auditPeriod === 'week') return now - orderTime <= 7 * 24 * 3600 * 1000;
    if (auditPeriod === 'month') return now - orderTime <= 30 * 24 * 3600 * 1000;
    return true;
  });

  const totalAuditRevenue = auditOrders.reduce((sum, o) => sum + o.total, 0);
  const completedOrdersCount = auditOrders.filter((o) => o.status === 'delivered').length;
  const pendingOrdersCount = auditOrders.filter((o) => o.status === 'pending' || o.status === 'preparing').length;

  // Calculate total kilograms sold per product in auditOrders
  const productSalesMap: { [prodId: string]: { name: string; category: string; totalKg: number; totalRevenue: number } } = {};

  auditOrders.forEach((order) => {
    order.items.forEach((item) => {
      const prodId = item.product.id;
      if (!productSalesMap[prodId]) {
        productSalesMap[prodId] = {
          name: item.product.name,
          category: item.product.category,
          totalKg: 0,
          totalRevenue: 0
        };
      }
      productSalesMap[prodId].totalKg += item.selectedWeightKg;
      productSalesMap[prodId].totalRevenue += item.calculatedPrice;
    });
  });

  const totalKgSoldInAudit = Object.values(productSalesMap).reduce((sum, item) => sum + item.totalKg, 0);

  // --- Handlers ---
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFFرقم الطلب,العميل,الهاتف,العنوان,التوصيل,الإجمالي,الحالة,التاريخ\n' +
      orders
        .map(
          (o) =>
            `"${o.id}","${o.customerName}","${o.customerPhone}","${o.address}","${o.deliveryType}","${o.total}","${o.status}","${o.createdAt}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saada_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    showToast('تم تصدير تقرير الطلبات كملف Excel/CSV بنجاح 📊');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.pricePerKg) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, prodForm);
      setEditingProduct(null);
      setShowAddProductModal(false);
    } else {
      const newProd: Product = {
        id: `prod-custom-${Date.now()}`,
        name: prodForm.name,
        englishName: prodForm.name,
        category: prodForm.category,
        meatType: prodForm.meatType,
        pricePerKg: Number(prodForm.pricePerKg),
        originalPricePerKg: Number(prodForm.originalPricePerKg),
        isFreshToday: true,
        description: prodForm.description || 'لحم بلدي طازج ذبح اليوم مع أقصى معايير النظافة والتغليف.',
        image: prodForm.image,
        recommendedCooking: ['طاجن', 'سلق', 'شوي'],
        caloriesPer100g: 220,
        proteinPer100g: 25,
        fatPer100g: 12,
        shelfLife: '3 أيام في الثلاجة',
        rating: 5.0,
        reviewsCount: 1,
        inStock: prodForm.inStock,
        meatAge: prodForm.meatAge,
        customBadge: prodForm.customBadge
      };
      addProduct(newProd);
      setShowAddProductModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-7xl my-4 bg-[#0f0f13] border border-amber-500/40 rounded-3xl p-4 sm:p-8 shadow-2xl text-slate-100 min-h-[85vh] flex flex-col justify-between">

        {(persistenceMode === 'memory' || persistenceMode === 'unconfigured' || persistenceMode === 'unknown') && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-amber-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div className="text-sm leading-relaxed">
              <p className="font-bold text-amber-300">تحذير: التعديلات قد لا تظهر لكل الزوار</p>
              <p className="mt-1 text-amber-100/90">
                {persistenceMode === 'memory' || persistenceMode === 'unconfigured'
                  ? 'قاعدة البيانات غير مربوطة. أضف متغير FIREBASE_SERVICE_ACCOUNT في إعدادات Vercel ثم أعد النشر.'
                  : 'تعذّر الاتصال بالسيرفر. تأكد أن الموقع يعمل وأن API متاح.'}
              </p>
            </div>
          </div>
        )}
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/10 gap-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#e63946] to-amber-500 text-white shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">لوحة الإدارة الشاملة</h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  تحكم كامل 100%
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                جزارة صاحب السعادة - الجيزة (مزلقان مني الأمير)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() => setActiveTab('settings')}
              className="px-3.5 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-extrabold text-amber-300 flex items-center transition-colors"
              title="تغيير رمز المرور الخاص بلوحة التحكم"
            >
              <Key className="w-4 h-4 ml-1.5" />
              تغيير الرمز السري (PIN) 🔑
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-300 flex items-center border border-white/10 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 ml-1.5" />
              تصدير شيت الاوردرات
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3.5 py-2 rounded-2xl bg-red-950/80 hover:bg-red-900 border border-red-800/60 text-xs font-bold text-red-300 transition-colors"
            >
              خروج الأدمن
            </button>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2.5 rounded-full bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-2 space-x-reverse border-b border-white/10 my-4 pb-2 overflow-x-auto text-xs font-extrabold">
          <button
            onClick={() => { setActiveTab('orders'); setNewOrderAlert(0); }}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center shrink-0 relative ${
              activeTab === 'orders'
                ? 'bg-[#e63946] text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-4 h-4 ml-1.5" />
            <span>إدارة الاوردرات ({orders.length})</span>
            {newOrderAlert > 0 && (
              <span className="absolute -top-1.5 -left-1.5 bg-amber-400 text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-bounce">
                {newOrderAlert}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-[#e63946] text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-4 h-4 ml-1.5" />
            <span>الجرد المالي والكميات</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center shrink-0 ${
              activeTab === 'products'
                ? 'bg-[#e63946] text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Scale className="w-4 h-4 ml-1.5" />
            <span>اللحوم والأسعار والصور ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center shrink-0 ${
              activeTab === 'videos'
                ? 'bg-[#e63946] text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Video className="w-4 h-4 ml-1.5" />
            <span>الفيديوهات والمعرض</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center shrink-0 ${
              activeTab === 'offers'
                ? 'bg-[#e63946] text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Flame className="w-4 h-4 ml-1.5" />
            <span>عروض اليوم والباكجات ({offers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center shrink-0 ${
              activeTab === 'settings'
                ? 'bg-[#e63946] text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Settings className="w-4 h-4 ml-1.5 text-amber-400" />
            <span>إعدادات المحل والرمز السري 🔑</span>
          </button>
        </div>

        {/* New Order Alert Banner */}
        {newOrderAlert > 0 && (
          <div
            className="flex items-center justify-between gap-3 bg-gradient-to-l from-amber-500/20 to-emerald-500/20 border border-amber-400/50 rounded-2xl px-4 py-3 mb-2 animate-pulse"
            style={{ animation: 'pulse 1s ease-in-out 3' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔔</span>
              <div>
                <p className="text-amber-300 font-extrabold text-sm">
                  {newOrderAlert > 1 ? `${newOrderAlert} طلبات جديدة وصلت!` : 'طلب جديد وصل!'}
                </p>
                <p className="text-gray-400 text-xs">اضغط على تبويب الطلبات لمراجعة الطلبات الجديدة</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setActiveTab('orders'); setNewOrderAlert(0); }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold rounded-xl transition-colors"
              >
                عرض الطلبات
              </button>
              <button
                onClick={() => setNewOrderAlert(0)}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[60vh] pr-1">
            {/* Search & Filter Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#16161a] p-3 rounded-2xl border border-white/10">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="ابحث برقم الاوردر، اسم العميل أو الموبايل..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-1.5 bg-[#121216] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#e63946]"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs font-extrabold">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'pending', label: 'معلق ⏳' },
                  { id: 'preparing', label: 'قيد التحضير 🥩' },
                  { id: 'on_the_way', label: 'خرج للتوصيل 🚚' },
                  { id: 'delivered', label: 'تم التسليم ✅' },
                  { id: 'cancelled', label: 'ملغى ❌' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOrderFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl border transition-all ${
                      orderFilter === f.id
                        ? 'bg-[#e63946] border-[#e63946] text-white'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {orders.length > 0 && (
              <div className="flex flex-wrap items-center justify-between bg-[#121216] p-3 rounded-2xl border border-white/10 text-xs gap-3">
                <span className="text-gray-300 font-bold">
                  إجمالي الطلبات المسجلة: <strong className="text-amber-400 font-mono text-sm">{orders.length}</strong> طلب
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {showClearCancelledConfirm ? (
                    <div className="flex items-center gap-2 bg-red-950/90 border border-red-800 px-3 py-1.5 rounded-xl animate-fadeIn">
                      <span className="text-red-200 font-bold text-[11px]">حذف كل الطلبات الملغية؟</span>
                      <button
                        onClick={() => {
                          clearCancelledOrders();
                          setShowClearCancelledConfirm(false);
                        }}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-lg text-[10px]"
                      >
                        تأكيد الحذف
                      </button>
                      <button
                        onClick={() => setShowClearCancelledConfirm(false)}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-gray-300 font-bold rounded-lg text-[10px]"
                      >
                        تراجع
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowClearCancelledConfirm(true)}
                      className="px-3 py-1.5 bg-red-950/70 hover:bg-red-900 text-red-300 font-extrabold rounded-xl border border-red-900/50 text-xs flex items-center gap-1.5 transition-colors"
                      title="حذف الطلبات المسجلة بـ ملغى فقط"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>مسح الطلبات الملغية ❌</span>
                    </button>
                  )}

                  {showClearAllConfirm ? (
                    <div className="flex items-center gap-2 bg-red-950/90 border border-red-800 px-3 py-1.5 rounded-xl animate-fadeIn">
                      <span className="text-red-200 font-bold text-[11px]">تأكيد مسح جميع الطلبات؟</span>
                      <button
                        onClick={() => {
                          clearAllOrders();
                          setShowClearAllConfirm(false);
                        }}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-lg text-[10px]"
                      >
                        نعم، مسح الكل 🗑️
                      </button>
                      <button
                        onClick={() => setShowClearAllConfirm(false)}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-gray-300 font-bold rounded-lg text-[10px]"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowClearAllConfirm(true)}
                      className="px-3 py-1.5 bg-red-900/80 hover:bg-red-800 text-white font-extrabold rounded-xl border border-red-700 text-xs flex items-center gap-1.5 shadow-md transition-colors"
                      title="حذف جميع الطلبات من قاعدة البيانات"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                      <span>مسح كافة الطلبات 🗑️</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Orders Cards List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-500 font-bold">
                لا توجد اوردرات تطابق هذا البحث أو الفلتر حالياً.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-[#16161a] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs group hover:border-[#e63946]/40 transition-all"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-amber-400 text-sm bg-black/60 px-3 py-1 rounded-xl border border-white/10">
                          {ord.id}
                        </span>
                        <span className="font-extrabold text-white text-base">{ord.customerName}</span>
                        <a
                          href={`tel:${ord.customerPhone}`}
                          className="text-emerald-400 font-mono font-bold bg-emerald-950/50 px-2.5 py-0.5 rounded-lg border border-emerald-800/40 hover:underline"
                        >
                          📱 {ord.customerPhone}
                        </a>
                      </div>

                      <div className="text-gray-300 font-medium">
                        📍 <span className="text-white font-bold">{ord.address}</span>
                        {ord.landmark && <span className="text-gray-400 mr-2">(علامة: {ord.landmark})</span>}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                        <span>🗓️ الموعد: <strong className="text-white">{ord.deliveryDate} - {ord.deliveryTimeSlot}</strong></span>
                        <span>🚚 نوع الاستلام: <strong className="text-amber-300">{ord.deliveryType === 'delivery' ? 'توصيل منزلي' : 'استلام من المحل'}</strong></span>
                        <span>⏰ تم إنشاء الطلب: {ord.createdAt}</span>
                      </div>

                      {/* Items Preview */}
                      <div className="bg-[#0f0f13] p-3 rounded-xl border border-white/5 space-y-1 mt-2">
                        <div className="font-bold text-amber-300 text-[11px] mb-1">القطعيات المطلوبة ({ord.items.length}):</div>
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-gray-300 text-[11px]">
                            <span>
                              • <strong className="text-white">{item.product.name}</strong> ({item.selectedWeightLabel}) - تقطيع: {item.selectedCutting} - تغليف: {item.selectedPackaging}
                            </span>
                            <span className="font-mono font-bold text-emerald-400">{item.calculatedPrice} ج.م</span>
                          </div>
                        ))}
                      </div>

                      {ord.notes && (
                        <div className="text-amber-300/90 text-[11px] font-medium bg-amber-950/30 p-2 rounded-lg border border-amber-800/30">
                          📝 ملاحظات العميل: {ord.notes}
                        </div>
                      )}
                    </div>

                    {/* Order Controls & Pricing */}
                    <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-r border-white/10 pt-3 md:pt-0 md:pr-4 shrink-0 space-y-3">
                      <div className="text-left">
                        <div className="text-xs text-gray-400">الإجمالي الكلي:</div>
                        <div className="text-2xl font-black text-emerald-400 font-mono">{ord.total} ج.م</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['status'])}
                          className="p-2 rounded-xl bg-black border border-amber-500/50 text-amber-300 font-extrabold text-xs focus:outline-none"
                        >
                          <option value="pending">معلق ⏳</option>
                          <option value="preparing">قيد التحضير 🥩</option>
                          <option value="on_the_way">خرج للتوصيل 🚚</option>
                          <option value="delivered">تم التسليم ✅</option>
                          <option value="cancelled">ملغى ❌</option>
                        </select>

                        <a
                          href={ord.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition-colors"
                          title="تأكيد بالواتساب"
                        >
                          💬
                        </a>

                        {deletingOrderId === ord.id ? (
                          <div className="flex items-center gap-1.5 bg-red-950 p-1.5 rounded-xl border border-red-800 animate-fadeIn shrink-0">
                            <span className="text-[11px] font-extrabold text-red-200">تأكيد الحذف؟</span>
                            <button
                              onClick={() => {
                                deleteOrder(ord.id);
                                setDeletingOrderId(null);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>نعم، حذف</span>
                            </button>
                            <button
                              onClick={() => setDeletingOrderId(null)}
                              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 font-bold text-xs"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingOrderId(ord.id)}
                            className="p-2 rounded-xl bg-red-950/80 text-red-400 border border-red-900/60 hover:bg-red-900 transition-colors"
                            title="حذف الاوردر"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVENTORY & FINANCIAL AUDITS */}
        {activeTab === 'inventory' && (
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[60vh] pr-1">
            {/* Period selector */}
            <div className="flex items-center justify-between bg-[#16161a] p-4 rounded-2xl border border-white/10 flex-wrap gap-3">
              <div>
                <h3 className="font-extrabold text-white text-base">تقرير الجرد المالي وكميات اللحوم 📊</h3>
                <p className="text-xs text-gray-400 font-medium">اختر الفترة الزمنية لحساب إجمالي الكيلوات والسيولة النقدية</p>
              </div>

              <div className="flex gap-2">
                {[
                  { id: 'today', label: 'جرد اليوم 📅' },
                  { id: 'week', label: 'جرد الأسبوع 🗓️' },
                  { id: 'month', label: 'جرد الشهر 📆' },
                  { id: 'all', label: 'الجرد الكلي ⏳' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setAuditPeriod(p.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      auditPeriod === p.id
                        ? 'bg-[#e63946] text-white shadow-lg'
                        : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#16161a] p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-xs text-gray-400 font-medium">إجمالي المبيعات والسيولة</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{totalAuditRevenue} ج.م</div>
                <span className="text-[10px] text-gray-500 block">إجمالي الفواتير المحصلة والمستحقة</span>
              </div>

              <div className="bg-[#16161a] p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-xs text-gray-400 font-medium">إجمالي الأوزان المباعة (كيلو)</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{totalKgSoldInAudit.toFixed(1)} كجم</div>
                <span className="text-[10px] text-gray-500 block">إجمالي أوزان القطعيات المباعة</span>
              </div>

              <div className="bg-[#16161a] p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-xs text-gray-400 font-medium">الاوردرات المنفذة</span>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">{completedOrdersCount} / {auditOrders.length}</div>
                <span className="text-[10px] text-gray-500 block">طلبات تم تسليمها بنجاح</span>
              </div>

              <div className="bg-[#16161a] p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-xs text-gray-400 font-medium">متوسط فاتورة العميل</span>
                <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                  {auditOrders.length > 0 ? Math.round(totalAuditRevenue / auditOrders.length) : 0} ج.م
                </div>
                <span className="text-[10px] text-gray-500 block">متوسط قيمة الاوردر الواحد</span>
              </div>
            </div>

            {/* Cut-by-Cut Sales Breakdown Table */}
            <div className="bg-[#16161a] p-5 rounded-2xl border border-white/10 space-y-4">
              <h4 className="font-extrabold text-white text-sm">جرد مبيعات القطعيات بالتفصيل (الكيلوات والإيراد)</h4>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 font-bold pb-2">
                      <th className="py-2.5 px-3">اسم القطعية</th>
                      <th className="py-2.5 px-3">التصنيف</th>
                      <th className="py-2.5 px-3">إجمالي الكيلوات المباعة</th>
                      <th className="py-2.5 px-3">إجمالي الإيراد (ج.م)</th>
                      <th className="py-2.5 px-3">% من المبيعات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {Object.keys(productSalesMap).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-500">
                          لا توجد بيانات جرد كافية لهذه الفترة الحالية.
                        </td>
                      </tr>
                    ) : (
                      Object.entries(productSalesMap).map(([id, item]) => {
                        const pct = totalAuditRevenue > 0 ? Math.round((item.totalRevenue / totalAuditRevenue) * 100) : 0;
                        return (
                          <tr key={id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-3 font-bold text-white">{item.name}</td>
                            <td className="py-3 px-3 text-amber-300">{item.category}</td>
                            <td className="py-3 px-3 font-mono font-bold text-amber-400">{item.totalKg} كجم</td>
                            <td className="py-3 px-3 font-mono font-bold text-emerald-400">{item.totalRevenue} ج.م</td>
                            <td className="py-3 px-3 font-mono text-gray-400">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-black/60 rounded-full h-2 overflow-hidden border border-white/10">
                                  <div className="bg-[#e63946] h-full" style={{ width: `${pct}%` }} />
                                </div>
                                <span>{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS & PRICES MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[60vh] pr-1">
            <div className="flex justify-between items-center bg-[#16161a] p-3.5 rounded-2xl border border-white/10">
              <div>
                <h3 className="font-extrabold text-white text-sm">قائمة اللحوم وتعديل الأسعار والصور 🥩</h3>
                <p className="text-xs text-gray-400 font-medium">تغيير أسعار الكيلو فوراً وتعديل الصور وإدارة التوفر</p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProdForm({
                    name: '',
                    category: 'kandouz',
                    meatType: 'kandouz',
                    pricePerKg: 420,
                    originalPricePerKg: 460,
                    description: '',
                    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
                    inStock: true
                  });
                  setShowAddProductModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#e63946] text-white font-extrabold text-xs flex items-center shadow-lg hover:brightness-110"
              >
                <Plus className="w-4 h-4 ml-1.5" />
                إضافة قطعية لحم جديدة
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-[#16161a] border border-white/10 flex items-start justify-between gap-4 text-xs group hover:border-[#e63946]/40 transition-all"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded-2xl shrink-0 border border-white/10"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-white text-sm truncate">{p.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.inStock ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                        {p.inStock ? 'متوفر' : 'غير متوفر'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-300">
                      <span>سعر الكيلو الحالي:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={p.pricePerKg}
                          onChange={(e) => updateProduct(p.id, { pricePerKg: Number(e.target.value) || 0 })}
                          className="w-20 px-2 py-1 rounded-lg bg-black border border-white/20 text-amber-300 font-extrabold text-xs text-center focus:outline-none"
                        />
                        <span className="font-bold text-white">ج.م</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-[11px] line-clamp-1">{p.description}</p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setProdForm({
                          name: p.name,
                          category: p.category,
                          meatType: p.meatType,
                          pricePerKg: p.pricePerKg,
                          originalPricePerKg: p.originalPricePerKg || p.pricePerKg + 30,
                          description: p.description,
                          image: p.image,
                          inStock: p.inStock,
                          meatAge: p.meatAge || 'small',
                          customBadge: p.customBadge || ''
                        });
                        setShowAddProductModal(true);
                      }}
                      className="p-2 rounded-xl bg-white/10 text-amber-300 hover:bg-white/20 transition-colors"
                      title="تعديل التفاصيل والصورة"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {deletingProductId === p.id ? (
                      <div className="flex flex-col gap-1 bg-red-950 p-1.5 rounded-xl border border-red-800 text-center animate-fadeIn">
                        <span className="text-[10px] font-bold text-red-200">حذف؟</span>
                        <button
                          onClick={() => {
                            deleteProduct(p.id);
                            setDeletingProductId(null);
                          }}
                          className="px-2 py-1 bg-red-600 text-white font-extrabold text-[10px] rounded-lg shadow-sm"
                        >
                          نعم
                        </button>
                        <button
                          onClick={() => setDeletingProductId(null)}
                          className="px-2 py-0.5 bg-white/10 text-gray-300 font-bold text-[10px] rounded-lg"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingProductId(p.id)}
                        className="p-2 rounded-xl bg-red-950/80 text-red-400 hover:bg-red-900 transition-colors"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VIDEOS CONTROL */}
        {activeTab === 'videos' && (
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[60vh] pr-1">
            {/* Hero Videos Section */}
            <div className="bg-[#16161a] p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-white text-base">1. فيديوهات واجهة الصفحة الرئيسية (Hero Slider) 🎬</h3>
                  <p className="text-xs text-gray-400 font-medium">الفيديوهات التي تظهر في أعلى الموقع لتشويق العملاء</p>
                </div>

                <button
                  onClick={() => {
                    setEditingHeroVideo(null);
                    setHeroForm({
                      title: 'فيديو واجهة جديد',
                      url: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-a-piece-of-meat-40919-large.mp4',
                      poster: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
                    });
                    setShowAddHeroModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#e63946] text-white font-bold text-xs flex items-center"
                >
                  <Plus className="w-4 h-4 ml-1" />
                  إضافة فيديو للواجهة
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {heroVideos.map((hv, idx) => (
                  <div key={hv.id || idx} className="bg-[#0f0f13] p-3 rounded-2xl border border-white/10 space-y-2 relative group">
                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                      <video src={hv.url} poster={hv.poster} className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 bg-black/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        فيديو {idx + 1}
                      </span>
                    </div>

                    <div className="font-bold text-white text-xs truncate">{hv.title}</div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setEditingHeroVideo(hv);
                          setHeroForm({ title: hv.title, url: hv.url, poster: hv.poster });
                          setShowAddHeroModal(true);
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-bold"
                      >
                        تعديل الفيديو
                      </button>
                      <button
                        onClick={() => deleteHeroVideo(hv.id)}
                        className="p-1.5 rounded-lg bg-red-950 text-red-400 hover:bg-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Showcase Gallery Videos */}
            <div className="bg-[#16161a] p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-white text-base">2. معرض فيديوهات التقطيع والنظافة والمعالجة 🎥</h3>
                  <p className="text-xs text-gray-400 font-medium">الفيديوهات التي تظهر في قسم "شاهد التقطيع بـ عينك"</p>
                </div>

                <button
                  onClick={() => {
                    setEditingGalleryVideo(null);
                    setGalleryForm({
                      title: 'فيديو تقطيع وتجهيز جديد',
                      description: 'تقطيع وتغليف فاكيوم أوتوماتيك بأعلى المعايير',
                      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-a-piece-of-meat-40919-large.mp4',
                      thumbnail: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
                      duration: '01:30',
                      category: 'تقطيع وتغليف'
                    });
                    setShowAddGalleryModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#e63946] text-white font-bold text-xs flex items-center"
                >
                  <Plus className="w-4 h-4 ml-1" />
                  إضافة فيديو للمعرض
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {galleryVideos.map((gv) => (
                  <div key={gv.id} className="bg-[#0f0f13] p-4 rounded-2xl border border-white/10 space-y-3">
                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                      <img src={gv.thumbnail} alt={gv.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 right-2 bg-black/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {gv.duration}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-xs">{gv.title}</h4>
                      <p className="text-gray-400 text-[11px] line-clamp-1">{gv.description}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                      <button
                        onClick={() => {
                          setEditingGalleryVideo(gv);
                          setGalleryForm({
                            title: gv.title,
                            description: gv.description,
                            videoUrl: gv.videoUrl,
                            thumbnail: gv.thumbnail,
                            duration: gv.duration,
                            category: gv.category
                          });
                          setShowAddGalleryModal(true);
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-bold"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => deleteGalleryVideo(gv.id)}
                        className="p-1.5 rounded-lg bg-red-950 text-red-400 hover:bg-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: OFFERS & PACKAGES CONTROL */}
        {activeTab === 'offers' && (
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[60vh] pr-1">
            <div className="flex justify-between items-center bg-[#16161a] p-4 rounded-2xl border border-white/10">
              <div>
                <h3 className="font-extrabold text-white text-sm">إدارة عروض وتخفيضات صاحب السعادة 🔥</h3>
                <p className="text-xs text-gray-400 font-medium">التحكم في الباكجات اليومية والتخفيضات المباشرة</p>
              </div>

              <button
                onClick={() => {
                  setEditingOffer(null);
                  setOfferForm({
                    title: 'عرض ملوكي جديد',
                    description: '1 كيلو موزة + 1 كيلو مفروم بلدي',
                    discountText: 'خصم 20%',
                    originalPrice: 850,
                    offerPrice: 720,
                    weightLabel: '2 كيلو مشكل',
                    productId: products[0]?.id || 'prod-1',
                    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
                    badge: 'عرض حصري 🔥'
                  });
                  setShowAddOfferModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#e63946] text-white font-extrabold text-xs flex items-center shadow-lg"
              >
                <Plus className="w-4 h-4 ml-1.5" />
                إضافة عرض جديد
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {offers.map((off) => (
                <div key={off.id} className="bg-[#16161a] p-4 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between">
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                    <img src={off.image} alt={off.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-[#e63946] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {off.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-white text-sm">{off.title}</h4>
                    <p className="text-gray-400 text-xs line-clamp-2">{off.description}</p>
                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="text-gray-500 line-through font-mono">{off.originalPrice} ج.م</span>
                      <span className="text-emerald-400 font-black font-mono text-base">{off.offerPrice} ج.م</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        setEditingOffer(off);
                        setOfferForm({
                          title: off.title,
                          description: off.description,
                          discountText: off.discountText,
                          originalPrice: off.originalPrice,
                          offerPrice: off.offerPrice,
                          weightLabel: off.weightLabel,
                          productId: off.productId,
                          image: off.image,
                          badge: off.badge
                        });
                        setShowAddOfferModal(true);
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 font-bold text-xs"
                    >
                      تعديل العرض
                    </button>
                    <button
                      onClick={() => deleteOffer(off.id)}
                      className="p-1.5 rounded-xl bg-red-950 text-red-400 hover:bg-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[60vh] pr-1">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateStoreSettings(settingsForm);
              }}
              className="bg-[#16161a] p-6 rounded-2xl border border-white/10 space-y-6"
            >
              <h3 className="font-extrabold text-white text-base border-b border-white/10 pb-3">
                إعدادات المحل والجزارة العامة ⚙️
              </h3>

              {/* SECTION 1: TODAY SLAUGHTER CONTROLS */}
              <div className="p-5 rounded-2xl bg-[#0f0f13] border border-amber-500/40 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🩸</span>
                    <div>
                      <h4 className="font-extrabold text-amber-300 text-sm">التحكم في اللحمة المدبوحة اليوم (Today Slaughter)</h4>
                      <p className="text-[11px] text-gray-400 font-medium">التحكم المباشر في إعلان الذبحة اليومية ونوع اللحم الظاهر للعملاء</p>
                    </div>
                  </div>

                  <label className="flex items-center space-x-2 space-x-reverse cursor-pointer bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                    <input
                      type="checkbox"
                      checked={settingsForm.todaySlaughterStatus ?? true}
                      onChange={(e) => setSettingsForm({ ...settingsForm, todaySlaughterStatus: e.target.checked })}
                      className="w-4 h-4 rounded text-[#e63946]"
                    />
                    <span className="text-xs font-bold text-amber-300">تفعيل شريط "ذبح اليوم"</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="text-gray-300 block mb-1">نوع اللحمة المدبوحة اليوم وتفاصيلها:</label>
                    <input
                      type="text"
                      placeholder="مثال: كندوز بلدي صغير (لباني 🥩) - طازج بختم المحافظة"
                      value={settingsForm.todaySlaughterNote || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, todaySlaughterNote: e.target.value })}
                      className="w-full p-2.5 bg-[#181822] border border-amber-500/30 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">توقيت وملاحظات الذبح والتقطيع:</label>
                    <input
                      type="text"
                      placeholder="مثال: تم الذبح والتقطيع اليوم الساعة 6:00 ص"
                      value={settingsForm.todaySlaughterTime || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, todaySlaughterTime: e.target.value })}
                      className="w-full p-2.5 bg-[#181822] border border-amber-500/30 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: STORE OPEN / CLOSED CONTROLS */}
              <div className="p-5 rounded-2xl bg-[#0f0f13] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏪</span>
                    <div>
                      <h4 className="font-extrabold text-white text-sm">حالة فتح وإغلاق المحل واستقبال الطلبات</h4>
                      <p className="text-[11px] text-gray-400 font-medium">التحكم في استقبال الطلبات أونلاين أو تنبيه العملاء بتوقف الاستلام مؤقتاً</p>
                    </div>
                  </div>

                  <label className="flex items-center space-x-2 space-x-reverse cursor-pointer bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    <input
                      type="checkbox"
                      checked={settingsForm.isStoreOpen ?? true}
                      onChange={(e) => setSettingsForm({ ...settingsForm, isStoreOpen: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-500"
                    />
                    <span className={`text-xs font-bold ${settingsForm.isStoreOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                      {settingsForm.isStoreOpen ? 'المحل مفتوح للطلبات 🟢' : 'المحل مغلق حالياً 🔴'}
                    </span>
                  </label>
                </div>

                {!settingsForm.isStoreOpen && (
                  <div>
                    <label className="text-gray-300 block mb-1">رسالة التنبيه للعملاء عند إغلاق المحل:</label>
                    <input
                      type="text"
                      placeholder="مثال: نعتذر، تم اكتفاء طلبات اليوم وسيتم استئناف العمل غداً الساعة 8:00 صباحاً."
                      value={settingsForm.storeClosedNotice || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeClosedNotice: e.target.value })}
                      className="w-full p-2.5 bg-[#181822] border border-red-500/40 rounded-xl text-red-200 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 3: ANNOUNCEMENT BAR & COUNTDOWN */}
              <div className="p-5 rounded-2xl bg-[#0f0f13] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📣</span>
                    <div>
                      <h4 className="font-extrabold text-white text-sm">شريط الإعلانات العليوي وعداد العروض</h4>
                      <p className="text-[11px] text-gray-400 font-medium">إظهار شريط أحمر عاجل أعلى الموقع وساعات عداد العروض اليومية</p>
                    </div>
                  </div>

                  <label className="flex items-center space-x-2 space-x-reverse cursor-pointer bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    <input
                      type="checkbox"
                      checked={settingsForm.announcementBarActive ?? true}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementBarActive: e.target.checked })}
                      className="w-4 h-4 rounded text-[#e63946]"
                    />
                    <span className="text-xs font-bold text-white">تفعيل الشريط العليوي</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                  <div className="sm:col-span-2">
                    <label className="text-gray-300 block mb-1">نص الإعلان العليوي المميز:</label>
                    <input
                      type="text"
                      placeholder="مثال: 🔥 خصم خاص 10% عند طلب 5 كيلو أو أكثر عبر الواتساب - توصيل سريع لمنازل الحوامدية والبدرشين"
                      value={settingsForm.announcementBarText || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementBarText: e.target.value })}
                      className="w-full p-2.5 bg-[#181822] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#e63946]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">ساعات عداد العروض المتبقية:</label>
                    <input
                      type="number"
                      value={settingsForm.globalOfferCountdownHours || 14}
                      onChange={(e) => setSettingsForm({ ...settingsForm, globalOfferCountdownHours: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#181822] border border-white/10 rounded-xl text-amber-300 font-mono font-bold focus:outline-none focus:border-[#e63946]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: CONTACT & DELIVERY SETTINGS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="text-gray-400 block mb-1">رقم الهاتف الأول (الأساسي):</label>
                  <input
                    type="text"
                    value={settingsForm.phone1}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone1: e.target.value })}
                    className="w-full p-2.5 bg-[#0f0f13] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">رقم الهاتف الثاني (الاحتياطي):</label>
                  <input
                    type="text"
                    value={settingsForm.phone2}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone2: e.target.value })}
                    className="w-full p-2.5 bg-[#0f0f13] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">رقم الواتساب لاستقبال الطلبات (صيغة دولية بدون +):</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappPhone: e.target.value })}
                    className="w-full p-2.5 bg-[#0f0f13] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">رسوم التوصيل العادية (ج.م):</label>
                  <input
                    type="number"
                    value={settingsForm.deliveryFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#0f0f13] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-gray-400 block mb-1">عنوان المحل التفصيلي:</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full p-2.5 bg-[#0f0f13] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-gray-400 block mb-1">رابط خرائط جوجل (Google Maps):</label>
                  <input
                    type="text"
                    value={settingsForm.gmapsLink}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gmapsLink: e.target.value })}
                    className="w-full p-2.5 bg-[#0f0f13] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#e63946]"
                  />
                </div>
              </div>

              {/* REAL-TIME CONTROLS SECTION */}

              {/* 1. Live Slaughter Controls */}
              <div className="p-5 rounded-2xl bg-[#0f0f13] border border-red-900/60 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-600/30">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm">التحكم في بيانات ذبح اليوم المعتمد (Live Slaughter) 🩸</h4>
                      <p className="text-[11px] text-gray-400">تنبيه العملاء بالنوع والتوقيت والختم الرسمي المعتمد</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.todaySlaughterStatus ?? true}
                      onChange={(e) => setSettingsForm({ ...settingsForm, todaySlaughterStatus: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 block mb-1">نوع اللحم المذبوح اليوم:</label>
                    <input
                      type="text"
                      value={settingsForm.todaySlaughterType || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, todaySlaughterType: e.target.value })}
                      placeholder="مثال: كندوز صغير لباني 🥩"
                      className="w-full p-2.5 bg-[#181822] border border-white/10 rounded-xl text-amber-300 font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">توقيت وساعة الذبح والقطع اليوم:</label>
                    <input
                      type="text"
                      value={settingsForm.todaySlaughterTime || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, todaySlaughterTime: e.target.value })}
                      placeholder="مثال: تم الذبح والقطع اليوم الساعة 6:00 صباحاً"
                      className="w-full p-2.5 bg-[#181822] border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-gray-400 block mb-1">وصف شريط ذبح اليوم الرئيسي:</label>
                    <input
                      type="text"
                      value={settingsForm.todaySlaughterNote || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, todaySlaughterNote: e.target.value })}
                      placeholder="مثال: كندوز بلدي صغير (لباني) - ذبح اليوم طازج 100% بختم المحافظة الوردي"
                      className="w-full p-2.5 bg-[#181822] border border-white/10 rounded-xl text-white font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Store Open/Closed Status */}
              <div className="p-5 rounded-2xl bg-[#0f0f13] border border-emerald-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-600/30">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm">حالة تشغيل المحل واستقبال الطلبات 🟢🔴</h4>
                      <p className="text-[11px] text-gray-400">فتح أو إغلاق استقبال الطلبات المباشرة فوراً</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, isStoreOpen: !(settingsForm.isStoreOpen ?? true) })}
                    className={`px-4 py-2 rounded-xl font-black text-xs transition-all shadow-md ${
                      settingsForm.isStoreOpen ?? true
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {settingsForm.isStoreOpen ?? true ? 'المحل مفتوح الآن 🟢' : 'المحل مغلق حالياً 🔴'}
                  </button>
                </div>

                {!(settingsForm.isStoreOpen ?? true) && (
                  <div>
                    <label className="text-gray-400 block mb-1">تنبيه إغلاق المحل للعملاء:</label>
                    <input
                      type="text"
                      value={settingsForm.storeClosedNotice || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeClosedNotice: e.target.value })}
                      className="w-full p-2.5 bg-[#181822] border border-red-500/40 rounded-xl text-red-300 font-bold focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* 3. Top Announcement Bar */}
              <div className="p-5 rounded-2xl bg-[#0f0f13] border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm">الشريط الإعلاني العلوي وعروض اليوم 📣</h4>
                      <p className="text-[11px] text-gray-400">إعلان يظهر فوق شريط العنوان في أعلى الصفحة تماماً</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.announcementBarActive ?? true}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementBarActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-gray-400 block mb-1">نص الشريط الإعلاني:</label>
                    <input
                      type="text"
                      value={settingsForm.announcementBarText || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementBarText: e.target.value })}
                      className="w-full p-2.5 bg-[#181822] border border-white/10 rounded-xl text-white font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Dedicated Security PIN Card */}
              <div className="p-5 rounded-2xl bg-[#0f0f13] border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm">رمز المرور السري للوحة التحكم (Admin PIN) 🔑</h4>
                      <p className="text-[11px] text-gray-400 font-medium">
                        يمكنك تغيير هذا الرمز في أي وقت لحماية لوحة التحكم. الرمز الحالي: <strong className="text-amber-300 font-mono">{storeSettings.adminPin || '5553'}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative max-w-md">
                  <input
                    type={showPinInSettings ? "text" : "password"}
                    value={settingsForm.adminPin}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                    placeholder="أدخل رمز المرور الجديد..."
                    className="w-full pr-4 pl-12 py-3 bg-[#181822] border border-amber-500/40 rounded-xl text-amber-300 font-mono text-center text-lg font-bold focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPinInSettings(!showPinInSettings)}
                    className="absolute left-3 top-3.5 text-gray-400 hover:text-amber-400 transition-colors"
                    title={showPinInSettings ? 'إخفاء الرمز' : 'إظهار الرمز'}
                  >
                    {showPinInSettings ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 font-mono">
                  * سيتم اعتماد هذا الرمز فور الضغط على زر "حفظ إعدادات المحل والجزارة" بالأسفل.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#e63946] text-white font-extrabold text-sm flex items-center space-x-2 space-x-reverse shadow-lg hover:brightness-110"
                >
                  <Save className="w-4 h-4 ml-1.5" />
                  <span>حفظ إعدادات المحل والجزارة</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PRODUCT ADD / EDIT MODAL */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-[#121218] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 text-xs font-semibold space-y-4 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowAddProductModal(false)}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-black text-amber-300">
                {editingProduct ? 'تعديل قطعية اللحم والصورة' : 'إضافة قطعية لحم جديدة'}
              </h3>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="text-gray-400 block mb-1">اسم القطعية (مثال: موزة بلدي كندر):</label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full p-2.5 bg-[#1a1a24] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#e63946]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 block mb-1">سن وحجم اللحم:</label>
                    <select
                      value={prodForm.meatAge || 'small'}
                      onChange={(e) => setProdForm({ ...prodForm, meatAge: e.target.value as any })}
                      className="w-full p-2.5 bg-[#1a1a24] border border-white/10 rounded-xl text-white focus:outline-none"
                    >
                      <option value="small">لحم صغير (كندوز لباني) 🥩</option>
                      <option value="large">لحم كبير (عجالي/جاموسي) 🍖</option>
                      <option value="medium">لحم وسط 🥩</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">شارة مخصصة (مثال: ذبح اليوم 🔥):</label>
                    <input
                      type="text"
                      placeholder="شارة تظهر فوق الكارت..."
                      value={prodForm.customBadge || ''}
                      onChange={(e) => setProdForm({ ...prodForm, customBadge: e.target.value })}
                      className="w-full p-2.5 bg-[#1a1a24] border border-white/10 rounded-xl text-amber-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 block mb-1">حجم وسن اللحم (صغير / كبير):</label>
                    <select
                      value={prodForm.meatAge}
                      onChange={(e) => setProdForm({ ...prodForm, meatAge: e.target.value as any })}
                      className="w-full p-2.5 bg-[#1a1a24] border border-white/10 rounded-xl text-amber-300 font-bold focus:outline-none"
                    >
                      <option value="small">كندوز صغير (لباني) 🥩</option>
                      <option value="large">لحم كبير (عجالي/جاموسي) 🍖</option>
                      <option value="medium">وسط 🥩</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">الشارة المخصصة (Badge):</label>
                    <input
                      type="text"
                      placeholder="مثال: ذبح اليوم 🥩 أو طازج بلدي 🔥"
                      value={prodForm.customBadge}
                      onChange={(e) => setProdForm({ ...prodForm, customBadge: e.target.value })}
                      className="w-full p-2.5 bg-[#1a1a24] border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 block mb-1">التصنيف الرئيسي:</label>
                    <select
                      value={prodForm.category}
                      onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as MeatCategory })}
                      className="w-full p-2.5 bg-[#1a1a24] border border-white/10 rounded-xl text-white focus:outline-none"
                    >
                      <option value="kandouz">كندوز بلدي 🥩</option>
                      <option value="minced_kofta">مفروم وكفتة 🍔</option>
                      <option value="offal_liver">كبدة وحلويات 🍳</option>
                      <option value="mombar_kaware">مومبار وكوارع ✨</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">سعر الكيلو الأساسي (ج.م):</label>
                    <input
                      type="number"
                      required
                      value={prodForm.pricePerKg}
                      onChange={(e) => setProdForm({ ...prodForm, pricePerKg: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#1a1a24] border border-white/10 rounded-xl text-amber-300 font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <MediaUploader
                  type="image"
                  label="صورة المنتج (سحب وإسقاط، رفع محلي من الجهاز، نسخ/لصق، وحذف)"
                  value={prodForm.image}
                  onChange={(val) => setProdForm({ ...prodForm, image: val })}
                  onDelete={() => setProdForm({ ...prodForm, image: '' })}
                />

                <div>
                  <label className="text-gray-400 block mb-1">وصف وطريقة تجهيز القطعية:</label>
                  <textarea
                    rows={2}
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    className="w-full p-2.5 bg-[#1a1a24] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2 space-x-reverse pt-2">
                  <input
                    type="checkbox"
                    id="stockCheck"
                    checked={prodForm.inStock}
                    onChange={(e) => setProdForm({ ...prodForm, inStock: e.target.checked })}
                    className="w-4 h-4 rounded text-[#e63946]"
                  />
                  <label htmlFor="stockCheck" className="text-white cursor-pointer">
                    المنتج متوفر حالياً في المحل للطلب الذبيحة اليومية
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#e63946] text-white font-extrabold text-sm shadow-lg hover:brightness-110"
                >
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج فوراً'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* HERO VIDEO MODAL */}
        {showAddHeroModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-[#121218] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 text-xs font-semibold space-y-4">
              <button
                onClick={() => setShowAddHeroModal(false)}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-black text-amber-300">
                {editingHeroVideo ? 'تعديل فيديو الواجهة' : 'إضافة فيديو جديد للواجهة'}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingHeroVideo) {
                    updateHeroVideo(editingHeroVideo.id, heroForm);
                  } else {
                    addHeroVideo({
                      id: `hero-vid-${Date.now()}`,
                      title: heroForm.title,
                      url: heroForm.url,
                      poster: heroForm.poster
                    });
                  }
                  setShowAddHeroModal(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-gray-400 block mb-1">عنوان الفيديو (مثال: تقطيع الكندوز البلدي):</label>
                  <input
                    type="text"
                    required
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="w-full p-2.5 bg-[#1a1a24] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <MediaUploader
                  type="video"
                  label="فيديو الواجهة MP4 (سحب وإسقاط، رفع محلي من الجهاز، نسخ/لصق، وحذف)"
                  value={heroForm.url}
                  onChange={(val) => setHeroForm({ ...heroForm, url: val })}
                  onDelete={() => setHeroForm({ ...heroForm, url: '' })}
                />

                <MediaUploader
                  type="image"
                  label="صورة غلاف الفيديو المعاينة Poster (سحب وإسقاط، رفع محلي من الجهاز، نسخ/لصق، وحذف)"
                  value={heroForm.poster}
                  onChange={(val) => setHeroForm({ ...heroForm, poster: val })}
                  onDelete={() => setHeroForm({ ...heroForm, poster: '' })}
                />

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#e63946] text-white font-extrabold text-sm shadow-lg"
                >
                  حفظ الفيديو
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SHOWCASE GALLERY VIDEO MODAL */}
        {showAddGalleryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-[#121218] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 text-xs font-semibold space-y-4">
              <button
                onClick={() => setShowAddGalleryModal(false)}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-black text-amber-300">
                {editingGalleryVideo ? 'تعديل فيديو المعرض' : 'إضافة فيديو جديد لمعرض التقطيع'}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingGalleryVideo) {
                    updateGalleryVideo(editingGalleryVideo.id, galleryForm);
                  } else {
                    addGalleryVideo({
                      id: `gal-vid-${Date.now()}`,
                      title: galleryForm.title,
                      description: galleryForm.description,
                      videoUrl: galleryForm.videoUrl,
                      thumbnail: galleryForm.thumbnail,
                      duration: galleryForm.duration,
                      category: galleryForm.category
                    });
                  }
                  setShowAddGalleryModal(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="text-gray-400 block mb-1">عنوان الفيديو:</label>
                  <input
                    type="text"
                    required
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    className="w-full p-2 bg-[#1a1a24] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">الوصف المختصر:</label>
                  <input
                    type="text"
                    required
                    value={galleryForm.description}
                    onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                    className="w-full p-2 bg-[#1a1a24] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <MediaUploader
                  type="video"
                  label="فيديو التقطيع MP4 (سحب وإسقاط، رفع محلي من الجهاز، نسخ/لصق، وحذف)"
                  value={galleryForm.videoUrl}
                  onChange={(val) => setGalleryForm({ ...galleryForm, videoUrl: val })}
                  onDelete={() => setGalleryForm({ ...galleryForm, videoUrl: '' })}
                />

                <MediaUploader
                  type="image"
                  label="صورة معاينة الفيديو المصغرة Thumbnail (سحب وإسقاط، رفع محلي من الجهاز، نسخ/لصق، وحذف)"
                  value={galleryForm.thumbnail}
                  onChange={(val) => setGalleryForm({ ...galleryForm, thumbnail: val })}
                  onDelete={() => setGalleryForm({ ...galleryForm, thumbnail: '' })}
                />

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-400 block mb-1">مدة الفيديو (مثال 01:20):</label>
                    <input
                      type="text"
                      value={galleryForm.duration}
                      onChange={(e) => setGalleryForm({ ...galleryForm, duration: e.target.value })}
                      className="w-full p-2 bg-[#1a1a24] border border-white/10 rounded-xl text-white font-mono text-center focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">التصنيف:</label>
                    <input
                      type="text"
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      className="w-full p-2 bg-[#1a1a24] border border-white/10 rounded-xl text-white text-center focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#e63946] text-white font-extrabold text-sm shadow-lg mt-2"
                >
                  حفظ الفيديو
                </button>
              </form>
            </div>
          </div>
        )}

        {/* OFFER MODAL */}
        {showAddOfferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-[#121218] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 text-xs font-semibold space-y-4 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowAddOfferModal(false)}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-black text-amber-300">
                {editingOffer ? 'تعديل عرض اليوم' : 'إضافة عرض وتخفيض جديد'}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingOffer) {
                    updateOffer(editingOffer.id, offerForm);
                  } else {
                    addOffer({
                      id: `off-${Date.now()}`,
                      ...offerForm,
                      endsAtTimestamp: Date.now() + 24 * 3600 * 1000
                    });
                  }
                  setShowAddOfferModal(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="text-gray-400 block mb-1">عنوان العرض:</label>
                  <input
                    type="text"
                    required
                    value={offerForm.title}
                    onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                    className="w-full p-2 bg-[#1a1a24] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">وصف العرض:</label>
                  <textarea
                    rows={2}
                    required
                    value={offerForm.description}
                    onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                    className="w-full p-2 bg-[#1a1a24] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-400 block mb-1">السعر الأصلي (ج.م):</label>
                    <input
                      type="number"
                      required
                      value={offerForm.originalPrice}
                      onChange={(e) => setOfferForm({ ...offerForm, originalPrice: Number(e.target.value) })}
                      className="w-full p-2 bg-[#1a1a24] border border-white/10 rounded-xl text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">سعر العرض (ج.م):</label>
                    <input
                      type="number"
                      required
                      value={offerForm.offerPrice}
                      onChange={(e) => setOfferForm({ ...offerForm, offerPrice: Number(e.target.value) })}
                      className="w-full p-2 bg-[#1a1a24] border border-white/10 rounded-xl text-emerald-400 font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-400 block mb-1">عنوان الشارة (Badge):</label>
                    <input
                      type="text"
                      value={offerForm.badge}
                      onChange={(e) => setOfferForm({ ...offerForm, badge: e.target.value })}
                      className="w-full p-2 bg-[#1a1a24] border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">تسمية الوزن (مثال: 2 كيلو):</label>
                    <input
                      type="text"
                      value={offerForm.weightLabel}
                      onChange={(e) => setOfferForm({ ...offerForm, weightLabel: e.target.value })}
                      className="w-full p-2 bg-[#1a1a24] border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>

                <MediaUploader
                  type="image"
                  label="صورة العرض والباكج (سحب وإسقاط، رفع محلي من الجهاز، نسخ/لصق، وحذف)"
                  value={offerForm.image}
                  onChange={(val) => setOfferForm({ ...offerForm, image: val })}
                  onDelete={() => setOfferForm({ ...offerForm, image: '' })}
                />

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#e63946] text-white font-extrabold text-sm shadow-lg mt-2"
                >
                  حفظ العرض
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
