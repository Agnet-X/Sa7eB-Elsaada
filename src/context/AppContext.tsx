import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Product, CartItem, Order, Review, MeatCategory, CuttingMethod,
  PackagingType, FatLevel, HeroVideo, ButcherVideo, OfferItem, StoreSettings
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_REVIEWS } from '../data/reviews';
import { HERO_VIDEOS, BUTCHER_SHOWCASE_VIDEOS } from '../data/videos';
import { TODAY_OFFERS } from '../data/offers';

const STORE_DOC = 'store_state/main';

const DEFAULT_SETTINGS: StoreSettings = {
  phone1: '01124795553',
  phone2: '01020404613',
  whatsappPhone: '201124795553',
  address: 'الجيزة - مزلقان مني الأمير - شارع زكريا إدريس (بجوار صيدلية د. محمد حامد)',
  deliveryFee: 30,
  freeDeliveryThreshold: 1000,
  workingHours: 'يومياً من 8 صباحاً حتى 12 منتصف الليل',
  gmapsLink: 'https://maps.app.goo.gl/UzvBcroJ8unswcgC7',
  adminPin: '5553',
  todaySlaughterNote: 'كندوز بلدي صغير (لباني) 🥩 - ذبح اليوم طازج 100% بختم المحافظة الوردي',
  todaySlaughterType: 'كندوز صغير (لباني)',
  todaySlaughterStatus: true,
  todaySlaughterTime: 'تم الذبح والقطع اليوم الساعة 6:00 صباحاً',
  isStoreOpen: true,
  storeClosedNotice: 'المحل مغلق حالياً، يسعدنا استقبال طلباتكم ابتداءً من الساعة 8:00 صباحاً',
  globalOfferCountdownHours: 24,
  announcementBarText: '🎉 خصومات وتوصيل مجاني للطلبات أكثر من 1000 جنيه | ذبح اليوم طازج بلدي 100%',
  announcementBarActive: true,
};

interface AppContextType {
  products: Product[];
  activeCategory: MeatCategory;
  setActiveCategory: (category: MeatCategory) => void;
  meatAgeFilter: 'all' | 'small' | 'large' | 'medium';
  setMeatAgeFilter: (filter: 'all' | 'small' | 'large' | 'medium') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  heroVideos: HeroVideo[];
  galleryVideos: ButcherVideo[];
  offers: OfferItem[];
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => Promise<void>;
  addHeroVideo: (video: HeroVideo) => Promise<void>;
  updateHeroVideo: (id: string, updated: Partial<HeroVideo>) => Promise<void>;
  deleteHeroVideo: (id: string) => Promise<void>;
  addGalleryVideo: (video: ButcherVideo) => Promise<void>;
  updateGalleryVideo: (id: string, updated: Partial<ButcherVideo>) => Promise<void>;
  deleteGalleryVideo: (id: string) => Promise<void>;
  addOffer: (offer: OfferItem) => Promise<void>;
  updateOffer: (id: string, updated: Partial<OfferItem>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, weightKg: number, weightLabel: string, cutting: CuttingMethod, packaging: PackagingType, fatLevel?: FatLevel, notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItem: (cartItemId: string, weightKg: number, weightLabel: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  orders: Order[];
  placeOrder: (customerInfo: { customerName: string; customerPhone: string; address: string; landmark?: string; deliveryType: 'delivery' | 'pickup'; deliveryDate: string; deliveryTimeSlot: string; notes?: string; }) => Order;
  lastOrder: Order | null;
  isOrderSuccessOpen: boolean;
  setIsOrderSuccessOpen: (open: boolean) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateOrder: (orderId: string, updated: Partial<Order>) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  clearAllOrders: () => Promise<void>;
  clearCancelledOrders: () => Promise<void>;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (productId: string, updated: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<void>;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  persistenceMode: 'firestore' | 'loading' | 'error';
  setOnNewOrderCallback: (cb: ((count: number) => void) | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Store state (comes from Firestore) ---
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [heroVideos, setHeroVideos] = useState<HeroVideo[]>(HERO_VIDEOS);
  const [galleryVideos, setGalleryVideos] = useState<ButcherVideo[]>(BUTCHER_SHOWCASE_VIDEOS);
  const [offers, setOffers] = useState<OfferItem[]>(TODAY_OFFERS);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [persistenceMode, setPersistenceMode] = useState<'firestore' | 'loading' | 'error'>('loading');

  // --- Local UI state ---
  const [activeCategory, setActiveCategory] = useState<MeatCategory>('all');
  const [meatAgeFilter, setMeatAgeFilter] = useState<'all' | 'small' | 'large' | 'medium'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    sessionStorage.getItem('saada_admin_authed') === 'true'
  );
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('saada_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('saada_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const prevOrderCountRef = useRef<number>(-1);
  const onNewOrderRef = useRef<((count: number) => void) | null>(null);

  // Play notification sound for new orders
  const playNewOrderSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, start: number, dur: number, vol = 0.4) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(vol, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.start(start);
        osc.stop(start + dur);
      };
      const now = ctx.currentTime;
      playTone(880, now, 0.18, 0.35);
      playTone(1100, now + 0.2, 0.18, 0.35);
      playTone(1320, now + 0.4, 0.35, 0.5);
      setTimeout(() => ctx.close(), 1200);
    } catch (e) { /* Web Audio not supported */ }
  };

  // --- Helpers ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(prev => (prev === msg ? null : prev)), 3500);
  };

  /** Write the full store document to Firestore */
  const persistToFirestore = async (data: {
    products?: Product[];
    storeSettings?: StoreSettings;
    heroVideos?: HeroVideo[];
    galleryVideos?: ButcherVideo[];
    offers?: OfferItem[];
    orders?: Order[];
    reviews?: Review[];
  }) => {
    const storeDocRef = doc(db, 'store_state', 'main');
    await setDoc(storeDocRef, data, { merge: true });
  };

  // --- Firestore real-time listener (onSnapshot) ---
  useEffect(() => {
    const storeDocRef = doc(db, 'store_state', 'main');

    const unsubscribe = onSnapshot(
      storeDocRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          // First time: seed Firestore with initial data
          const initialData = {
            products: INITIAL_PRODUCTS,
            storeSettings: DEFAULT_SETTINGS,
            heroVideos: HERO_VIDEOS,
            galleryVideos: BUTCHER_SHOWCASE_VIDEOS,
            offers: TODAY_OFFERS,
            orders: [],
            reviews: [],
          };
          setDoc(storeDocRef, initialData).catch(console.error);
          setPersistenceMode('firestore');
          return;
        }

        const data = snapshot.data();
        if (Array.isArray(data.products)) setProducts(data.products);
        if (data.storeSettings) setStoreSettings(prev => ({ ...DEFAULT_SETTINGS, ...prev, ...data.storeSettings }));
        if (Array.isArray(data.heroVideos)) setHeroVideos(data.heroVideos);
        if (Array.isArray(data.galleryVideos)) setGalleryVideos(data.galleryVideos);
        if (Array.isArray(data.offers)) setOffers(data.offers);
        if (Array.isArray(data.reviews)) setReviews(data.reviews);

        if (Array.isArray(data.orders)) {
          setOrders(prev => {
            const newOrders: Order[] = data.orders;
            if (prevOrderCountRef.current === -1) {
              // First snapshot — set baseline, don't notify
              prevOrderCountRef.current = newOrders.length;
            } else if (newOrders.length > prevOrderCountRef.current) {
              const newCount = newOrders.length - prevOrderCountRef.current;
              prevOrderCountRef.current = newOrders.length;
              // Always play sound + notify callback
              playNewOrderSound();
              if (onNewOrderRef.current) onNewOrderRef.current(newCount);
              setTimeout(() => showToast(`🔔 طلب جديد وصل! (${newCount} طلب)`), 0);
            } else {
              prevOrderCountRef.current = newOrders.length;
            }
            return newOrders;
          });
        }

        setPersistenceMode('firestore');
      },
      (error) => {
        console.error('Firestore onSnapshot error:', error);
        setPersistenceMode('error');
      }
    );

    return () => unsubscribe();
  }, []);

  // Persist cart & wishlist locally (not in Firestore — per-user data)
  useEffect(() => { localStorage.setItem('saada_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('saada_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  // --- Admin Auth ---
  const loginAdmin = (pin: string): boolean => {
    if (pin === storeSettings.adminPin) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('saada_admin_authed', 'true');
      showToast('أهلاً بك يا صاحب السعادة! تم تسجيل دخول الإدارة بنجاح 🔐');
      return true;
    }
    showToast('رمز الدخول غير صحيح، يرجى المحاولة مرة أخرى ❌');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
    sessionStorage.removeItem('saada_admin_authed');
    showToast('تم تسجيل الخروج من لوحة الإدارة');
  };

  // --- Store Settings ---
  const updateStoreSettings = async (settings: Partial<StoreSettings>) => {
    const updated = { ...storeSettings, ...settings };
    await persistToFirestore({ storeSettings: updated });
    showToast('تم حفظ إعدادات المحل والجزارة بنجاح ✨');
  };

  // --- Products ---
  const addProduct = async (product: Product) => {
    const updated = [product, ...products.filter(p => p.id !== product.id)];
    await persistToFirestore({ products: updated });
    showToast(`تمت إضافة المنتج الجديد "${product.name}"`);
  };

  const updateProduct = async (productId: string, updated: Partial<Product>) => {
    const updatedList = products.map(p => p.id === productId ? { ...p, ...updated } : p);
    await persistToFirestore({ products: updatedList });
    showToast('تم حفظ التعديلات بنجاح');
  };

  const deleteProduct = async (productId: string) => {
    const updatedList = products.filter(p => p.id !== productId);
    await persistToFirestore({ products: updatedList });
    showToast('تم حذف المنتج بنجاح');
  };

  // --- Hero Videos ---
  const addHeroVideo = async (video: HeroVideo) => {
    const updated = [video, ...heroVideos.filter(v => v.id !== video.id)];
    await persistToFirestore({ heroVideos: updated });
    showToast('تمت إضافة فيديو الواجهة الجديد');
  };

  const updateHeroVideo = async (id: string, updated: Partial<HeroVideo>) => {
    const updatedList = heroVideos.map(v => v.id === id ? { ...v, ...updated } : v);
    await persistToFirestore({ heroVideos: updatedList });
    showToast('تم تعديل فيديو الواجهة');
  };

  const deleteHeroVideo = async (id: string) => {
    const updatedList = heroVideos.filter(v => v.id !== id);
    await persistToFirestore({ heroVideos: updatedList });
    showToast('تم حذف فيديو الواجهة');
  };

  // --- Gallery Videos ---
  const addGalleryVideo = async (video: ButcherVideo) => {
    const updated = [video, ...galleryVideos.filter(v => v.id !== video.id)];
    await persistToFirestore({ galleryVideos: updated });
    showToast('تمت إضافة فيديو للمعرض');
  };

  const updateGalleryVideo = async (id: string, updated: Partial<ButcherVideo>) => {
    const updatedList = galleryVideos.map(v => v.id === id ? { ...v, ...updated } : v);
    await persistToFirestore({ galleryVideos: updatedList });
    showToast('تم تعديل فيديو المعرض');
  };

  const deleteGalleryVideo = async (id: string) => {
    const updatedList = galleryVideos.filter(v => v.id !== id);
    await persistToFirestore({ galleryVideos: updatedList });
    showToast('تم حذف الفيديو من المعرض');
  };

  // --- Offers ---
  const addOffer = async (offer: OfferItem) => {
    const updated = [offer, ...offers.filter(o => o.id !== offer.id)];
    await persistToFirestore({ offers: updated });
    showToast('تمت إضافة العرض الجديد');
  };

  const updateOffer = async (id: string, updated: Partial<OfferItem>) => {
    const updatedList = offers.map(o => o.id === id ? { ...o, ...updated } : o);
    await persistToFirestore({ offers: updatedList });
    showToast('تم تعديل العرض بنجاح');
  };

  const deleteOffer = async (id: string) => {
    const updatedList = offers.filter(o => o.id !== id);
    await persistToFirestore({ offers: updatedList });
    showToast('تم حذف العرض');
  };

  // --- Orders ---
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const updatedList = orders.map(o => o.id === orderId ? { ...o, status } : o);
    await persistToFirestore({ orders: updatedList });
    showToast(`تم تحديث حالة الطلب ${orderId} إلى "${status}"`);
  };

  const updateOrder = async (orderId: string, updated: Partial<Order>) => {
    const updatedList = orders.map(o => o.id === orderId ? { ...o, ...updated } : o);
    await persistToFirestore({ orders: updatedList });
    showToast(`تم تعديل تفاصيل الطلب ${orderId}`);
  };

  const deleteOrder = async (orderId: string) => {
    const updatedList = orders.filter(o => o.id !== orderId);
    await persistToFirestore({ orders: updatedList });
    showToast(`تم حذف الطلب ${orderId} بنجاح 🗑️`);
  };

  const clearAllOrders = async () => {
    await persistToFirestore({ orders: [] });
    showToast('تم مسح جميع الاوردرات بنجاح 🗑️');
  };

  const clearCancelledOrders = async () => {
    const updatedList = orders.filter(o => o.status !== 'cancelled');
    await persistToFirestore({ orders: updatedList });
    showToast('تم مسح جميع الاوردرات الملغية 🗑️');
  };

  const placeOrder = (customerInfo: {
    customerName: string; customerPhone: string; address: string;
    landmark?: string; deliveryType: 'delivery' | 'pickup';
    deliveryDate: string; deliveryTimeSlot: string; notes?: string;
  }): Order => {
    const orderId = `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    let itemsText = cart.map((item, idx) =>
      `*${idx + 1}. ${item.product.name}*\n` +
      ` - الوزن: ${item.selectedWeightLabel}\n` +
      ` - التقطيع: ${item.selectedCutting}\n` +
      ` - التغليف: ${item.selectedPackaging}\n` +
      (item.selectedFatLevel ? ` - نسبة الدهن: ${item.selectedFatLevel}\n` : '') +
      ` - السعر: ${item.calculatedPrice} ج.م`
    ).join('\n\n');

    const whatsappMessage =
      `السلام عليكم ورحمة الله وبركاته 🥩\n` +
      `أرغب في تأكيد الطلب من موقع *جزارة صاحب السعادة*\n\n` +
      `*رقم الطلب:* ${orderId}\n\n` +
      `*الاسم:* ${customerInfo.customerName}\n` +
      `*الهاتف:* ${customerInfo.customerPhone}\n` +
      `*العنوان:* ${customerInfo.address}\n` +
      (customerInfo.landmark ? `*أقرب علامة مميزة:* ${customerInfo.landmark}\n` : '') +
      `*طريقة الاستلام:* ${customerInfo.deliveryType === 'delivery' ? 'توصيل للمنزل' : 'استلام من المحل'}\n` +
      `*موعد التسليم:* ${customerInfo.deliveryDate} - ${customerInfo.deliveryTimeSlot}\n\n` +
      `*تفاصيل المنتجات:*\n${itemsText}\n\n` +
      `*إجمالي المنتجات:* ${cartSubtotal} ج.م\n` +
      `*رسوم التوصيل:* ${customerInfo.deliveryType === 'delivery' ? `${deliveryFee} ج.م` : 'مجاناً'}\n` +
      `*الإجمالي الكلي:* ${customerInfo.deliveryType === 'delivery' ? cartTotal : cartSubtotal} ج.م\n` +
      (customerInfo.notes ? `\n*ملاحظات إضافية:* ${customerInfo.notes}\n` : '') +
      `\nشكراً لكم ودمتم بسعادة! ✨`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      customerName: customerInfo.customerName,
      customerPhone: customerInfo.customerPhone,
      address: customerInfo.address,
      landmark: customerInfo.landmark,
      deliveryType: customerInfo.deliveryType,
      deliveryDate: customerInfo.deliveryDate,
      deliveryTimeSlot: customerInfo.deliveryTimeSlot,
      notes: customerInfo.notes,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: customerInfo.deliveryType === 'delivery' ? deliveryFee : 0,
      discount: 0,
      total: customerInfo.deliveryType === 'delivery' ? cartTotal : cartSubtotal,
      status: 'pending',
      whatsappLink: `https://wa.me/201124795553?text=${encodeURIComponent(whatsappMessage)}`,
    };

    const updatedOrders = [newOrder, ...orders];
    persistToFirestore({ orders: updatedOrders }).catch(console.error);

    setLastOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);
    return newOrder;
  };

  // --- Reviews ---
  const addReview = async (review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = { ...review, id: `rev-${Date.now()}`, date: 'الآن' };
    const updatedList = [newRev, ...reviews];
    await persistToFirestore({ reviews: updatedList });
    showToast('شكراً لتقييمك لجزارة صاحب السعادة! ❤️');
  };

  // --- Cart ---
  const addToCart = (product: Product, weightKg: number, weightLabel: string, cutting: CuttingMethod, packaging: PackagingType, fatLevel?: FatLevel, notes?: string) => {
    const itemKey = `${product.id}-${weightKg}-${cutting}-${packaging}-${fatLevel || 'def'}`;
    const calculatedPrice = Math.round(product.pricePerKg * weightKg);
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newWeight = updated[existingIndex].selectedWeightKg + weightKg;
        updated[existingIndex] = { ...updated[existingIndex], selectedWeightKg: newWeight, selectedWeightLabel: `${newWeight} كيلو`, calculatedPrice: Math.round(product.pricePerKg * newWeight) };
        return updated;
      }
      return [...prev, { id: itemKey, product, selectedWeightKg: weightKg, selectedWeightLabel: weightLabel, selectedCutting: cutting, selectedPackaging: packaging, selectedFatLevel: fatLevel, itemNotes: notes, calculatedPrice }];
    });
    showToast(`تمت إضافة "${product.name}" (${weightLabel}) إلى السلة بنجاح ✨`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => setCart(prev => prev.filter(item => item.id !== cartItemId));
  const updateCartItem = (cartItemId: string, weightKg: number, weightLabel: string) => {
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, selectedWeightKg: weightKg, selectedWeightLabel: weightLabel, calculatedPrice: Math.round(item.product.pricePerKg * weightKg) } : item));
  };
  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.calculatedPrice, 0);
  const deliveryFee = cartSubtotal >= (storeSettings.freeDeliveryThreshold || 1000) || cart.length === 0 ? 0 : (storeSettings.deliveryFee || 30);
  const cartTotal = cartSubtotal + deliveryFee;

  // --- Wishlist ---
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) { showToast('تمت إزالة المنتج من القائمة المفضلة'); return prev.filter(id => id !== productId); }
      showToast('تمت إضافة المنتج إلى قائمة المفضلة ❤️');
      return [...prev, productId];
    });
  };

  // --- Compare ---
  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      if (prev.some(p => p.id === product.id)) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 4) { showToast('يمكنك مقارنة 4 منتجات كحد أقصى في المرة الواحدة'); return prev; }
      setIsCompareOpen(true);
      return [...prev, product];
    });
  };
  const clearCompare = () => setCompareList([]);

  const setOnNewOrderCallback = (cb: ((count: number) => void) | null) => { onNewOrderRef.current = cb; };


  return (
    <AppContext.Provider value={{
      products, activeCategory, setActiveCategory, meatAgeFilter, setMeatAgeFilter,
      searchQuery, setSearchQuery, heroVideos, galleryVideos, offers, storeSettings,
      updateStoreSettings, addHeroVideo, updateHeroVideo, deleteHeroVideo,
      addGalleryVideo, updateGalleryVideo, deleteGalleryVideo,
      addOffer, updateOffer, deleteOffer,
      cart, addToCart, removeFromCart, updateCartItem, clearCart,
      cartSubtotal, deliveryFee, cartTotal, isCartOpen, setIsCartOpen,
      wishlist, toggleWishlist, compareList, toggleCompare, clearCompare,
      isCompareOpen, setIsCompareOpen, isCheckoutOpen, setIsCheckoutOpen,
      orders, placeOrder, lastOrder, isOrderSuccessOpen, setIsOrderSuccessOpen,
      updateOrderStatus, updateOrder, deleteOrder, clearAllOrders, clearCancelledOrders,
      isAdminOpen, setIsAdminOpen, isAdminAuthenticated, loginAdmin, logoutAdmin,
      addProduct, updateProduct, deleteProduct,
      reviews, addReview, selectedProduct, setSelectedProduct,
      toastMessage, showToast, persistenceMode, setOnNewOrderCallback,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
