import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Review, MeatCategory, CuttingMethod, PackagingType, FatLevel, HeroVideo, ButcherVideo, OfferItem, StoreSettings } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_REVIEWS } from '../data/reviews';
import { HERO_VIDEOS, BUTCHER_SHOWCASE_VIDEOS } from '../data/videos';
import { TODAY_OFFERS } from '../data/offers';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

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

  // Real-time Controls
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
  
  // Dynamic Content (Videos, Offers, Settings)
  heroVideos: HeroVideo[];
  galleryVideos: ButcherVideo[];
  offers: OfferItem[];
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  addHeroVideo: (video: HeroVideo) => void;
  updateHeroVideo: (id: string, updated: Partial<HeroVideo>) => void;
  deleteHeroVideo: (id: string) => void;
  addGalleryVideo: (video: ButcherVideo) => void;
  updateGalleryVideo: (id: string, updated: Partial<ButcherVideo>) => void;
  deleteGalleryVideo: (id: string) => void;
  addOffer: (offer: OfferItem) => void;
  updateOffer: (id: string, updated: Partial<OfferItem>) => void;
  deleteOffer: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product, 
    weightKg: number, 
    weightLabel: string, 
    cutting: CuttingMethod, 
    packaging: PackagingType, 
    fatLevel?: FatLevel, 
    notes?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItem: (cartItemId: string, weightKg: number, weightLabel: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Compare
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;

  // Checkout & Orders
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  orders: Order[];
  placeOrder: (customerInfo: {
    customerName: string;
    customerPhone: string;
    address: string;
    landmark?: string;
    deliveryType: 'delivery' | 'pickup';
    deliveryDate: string;
    deliveryTimeSlot: string;
    notes?: string;
  }) => Order;
  lastOrder: Order | null;
  isOrderSuccessOpen: boolean;
  setIsOrderSuccessOpen: (open: boolean) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrder: (orderId: string, updated: Partial<Order>) => void;
  deleteOrder: (orderId: string) => void;
  clearAllOrders: () => void;
  clearCancelledOrders: () => void;

  // Admin Auth & Controls
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updated: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;

  // Selected Product Modal
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;

  // Toast Notification
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Backend persistence status (firestore = shared for all visitors)
  persistenceMode: 'unknown' | 'firestore' | 'file' | 'memory' | 'unconfigured';

  // New Order Notification callback registration (for admin sound alerts)
  setOnNewOrderCallback: (cb: ((count: number) => void) | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [heroVideos, setHeroVideos] = useState<HeroVideo[]>(HERO_VIDEOS);
  const [galleryVideos, setGalleryVideos] = useState<ButcherVideo[]>(BUTCHER_SHOWCASE_VIDEOS);
  const [offers, setOffers] = useState<OfferItem[]>(TODAY_OFFERS);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('saada_admin_authed') === 'true';
  });

  const [activeCategory, setActiveCategory] = useState<MeatCategory>('all');
  const [meatAgeFilter, setMeatAgeFilter] = useState<'all' | 'small' | 'large' | 'medium'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
  const [persistenceMode, setPersistenceMode] = useState<'unknown' | 'firestore' | 'file' | 'memory' | 'unconfigured'>('unknown');

  const SAVE_ERROR_MSG = 'فشل الحفظ — التعديلات لن تظهر للزوار. تحقق من إعداد Firebase Firestore.';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const mutateStore = async (
    optimisticUpdate: () => void,
    request: () => Promise<Response>,
    successMessage: string,
    errorMessage = SAVE_ERROR_MSG
  ) => {
    optimisticUpdate();
    try {
      const res = await request();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast(successMessage);
      await fetchStoreData();
    } catch (e) {
      console.error(e);
      showToast(errorMessage);
      await fetchStoreData();
    }
  };

  // Ref to track previous order count for new order notifications
  // -1 = not yet initialized (first fetch should set baseline without triggering sound)
  const prevOrderCountRef = React.useRef<number>(-1);
  // Callback ref so the SSE handler always reads current state
  const onNewOrderRef = React.useRef<((count: number) => void) | null>(null);

  // Fetch shared store data from backend API
  const fetchStoreData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/store-data`);
      if (res.ok) {
        const data = await res.json();
        // Only update each field if it exists and is a valid array/object
        if (Array.isArray(data.products)) setProducts(data.products);
        if (data.storeSettings && typeof data.storeSettings === 'object') setStoreSettings(data.storeSettings);
        if (Array.isArray(data.heroVideos)) setHeroVideos(data.heroVideos);
        if (Array.isArray(data.galleryVideos)) setGalleryVideos(data.galleryVideos);
        if (Array.isArray(data.offers)) setOffers(data.offers);
        if (Array.isArray(data.orders)) {
          setOrders(prev => {
            if (prevOrderCountRef.current === -1) {
              // First fetch: set baseline count, don't notify
              prevOrderCountRef.current = data.orders.length;
            } else if (data.orders.length > prevOrderCountRef.current) {
              // Subsequent fetches: new orders detected!
              const newCount = data.orders.length - prevOrderCountRef.current;
              if (onNewOrderRef.current) onNewOrderRef.current(newCount);
              prevOrderCountRef.current = data.orders.length;
            } else {
              prevOrderCountRef.current = data.orders.length;
            }
            return data.orders;
          });
        }
        if (Array.isArray(data.reviews)) setReviews(data.reviews);
      }
    } catch (e) {
      console.warn('Could not sync with backend store API:', e);
    }
  };

  const checkBackendHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      if (res.ok) {
        const data = await res.json();
        if (data.persistence) setPersistenceMode(data.persistence);
      }
    } catch {
      setPersistenceMode('unknown');
    }
  };

  useEffect(() => {
    fetchStoreData();
    checkBackendHealth();

    let eventSource: EventSource | null = null;
    const connectSSE = () => {
      try {
        eventSource = new EventSource(`${API_BASE}/api/events`);
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            // Only update each field if it exists and is a valid array/object
            if (Array.isArray(data.products)) setProducts(data.products);
            if (data.storeSettings && typeof data.storeSettings === 'object') setStoreSettings(data.storeSettings);
            if (Array.isArray(data.heroVideos)) setHeroVideos(data.heroVideos);
            if (Array.isArray(data.galleryVideos)) setGalleryVideos(data.galleryVideos);
            if (Array.isArray(data.offers)) setOffers(data.offers);
            if (Array.isArray(data.orders)) {
              setOrders(prev => {
                if (prevOrderCountRef.current === -1) {
                  // First SSE event: set baseline count, don't notify
                  prevOrderCountRef.current = data.orders.length;
                } else if (data.orders.length > prevOrderCountRef.current) {
                  // Subsequent SSE events: new orders detected!
                  const newCount = data.orders.length - prevOrderCountRef.current;
                  if (onNewOrderRef.current) onNewOrderRef.current(newCount);
                  prevOrderCountRef.current = data.orders.length;
                } else {
                  prevOrderCountRef.current = data.orders.length;
                }
                return data.orders;
              });
            }
            if (Array.isArray(data.reviews)) setReviews(data.reviews);
          } catch (err) {
            console.error('Failed to parse SSE data:', err);
          }
        };
        eventSource.onerror = () => {
          // On error, close and reconnect after 5s
          eventSource?.close();
          setTimeout(connectSSE, 5000);
        };
      } catch (err) {
        console.warn('SSE not supported or connection error:', err);
      }
    };
    connectSSE();

    const interval = setInterval(fetchStoreData, 5000);
    window.addEventListener('focus', fetchStoreData);
    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(interval);
      window.removeEventListener('focus', fetchStoreData);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('saada_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('saada_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

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

  const updateStoreSettings = async (settings: Partial<StoreSettings>) => {
    await mutateStore(
      () => setStoreSettings((prev) => ({ ...prev, ...settings })),
      () => fetch(`${API_BASE}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      }),
      'تم حفظ إعدادات المحل والجزارة بنجاح ✨'
    );
  };

  const addHeroVideo = async (video: HeroVideo) => {
    await mutateStore(
      () => setHeroVideos((prev) => [video, ...prev]),
      () => fetch(`${API_BASE}/api/videos/hero`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video }),
      }),
      'تمت إضافة فيديو الواجهة الجديد'
    );
  };

  const updateHeroVideo = async (id: string, updated: Partial<HeroVideo>) => {
    await mutateStore(
      () => setHeroVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...updated } : v))),
      () => fetch(`${API_BASE}/api/videos/hero/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updated }),
      }),
      'تم تعديل فيديو الواجهة'
    );
  };

  const deleteHeroVideo = async (id: string) => {
    await mutateStore(
      () => setHeroVideos((prev) => prev.filter((v) => v.id !== id)),
      () => fetch(`${API_BASE}/api/videos/hero/${id}`, { method: 'DELETE' }),
      'تم حذف فيديو الواجهة'
    );
  };

  const addGalleryVideo = async (video: ButcherVideo) => {
    await mutateStore(
      () => setGalleryVideos((prev) => [video, ...prev]),
      () => fetch(`${API_BASE}/api/videos/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video }),
      }),
      'تمت إضافة فيديو للمعرض'
    );
  };

  const updateGalleryVideo = async (id: string, updated: Partial<ButcherVideo>) => {
    await mutateStore(
      () => setGalleryVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...updated } : v))),
      () => fetch(`${API_BASE}/api/videos/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updated }),
      }),
      'تم تعديل فيديو المعرض'
    );
  };

  const deleteGalleryVideo = async (id: string) => {
    await mutateStore(
      () => setGalleryVideos((prev) => prev.filter((v) => v.id !== id)),
      () => fetch(`${API_BASE}/api/videos/gallery/${id}`, { method: 'DELETE' }),
      'تم حذف الفيديو من المعرض'
    );
  };

  const addOffer = async (offer: OfferItem) => {
    await mutateStore(
      () => setOffers((prev) => [offer, ...prev]),
      () => fetch(`${API_BASE}/api/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer }),
      }),
      'تمت إضافة العرض الجديد'
    );
  };

  const updateOffer = async (id: string, updated: Partial<OfferItem>) => {
    await mutateStore(
      () => setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...updated } : o))),
      () => fetch(`${API_BASE}/api/offers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updated }),
      }),
      'تم تعديل العرض بنجاح'
    );
  };

  const deleteOffer = async (id: string) => {
    await mutateStore(
      () => setOffers((prev) => prev.filter((o) => o.id !== id)),
      () => fetch(`${API_BASE}/api/offers/${id}`, { method: 'DELETE' }),
      'تم حذف العرض'
    );
  };

  const updateOrder = async (orderId: string, updated: Partial<Order>) => {
    await mutateStore(
      () => setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, ...updated } : ord))),
      () => fetch(`${API_BASE}/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updated }),
      }),
      `تم تعديل تفاصيل الطلب ${orderId}`
    );
  };

  const deleteOrder = async (orderId: string) => {
    await mutateStore(
      () => setOrders((prev) => prev.filter((ord) => ord.id !== orderId)),
      () => fetch(`${API_BASE}/api/orders/${encodeURIComponent(orderId)}`, { method: 'DELETE' }),
      `تم حذف الطلب ${orderId} بنجاح 🗑️`
    );
  };

  const clearAllOrders = async () => {
    await mutateStore(
      () => setOrders([]),
      () => fetch(`${API_BASE}/api/orders/all`, { method: 'DELETE' }),
      'تم مسح جميع الاوردرات بنجاح 🗑️'
    );
  };

  const clearCancelledOrders = async () => {
    await mutateStore(
      () => setOrders((prev) => prev.filter((ord) => ord.status !== 'cancelled')),
      () => fetch(`${API_BASE}/api/orders/cancelled`, { method: 'DELETE' }),
      'تم مسح جميع الاوردرات الملغية 🗑️'
    );
  };

  const addToCart = (
    product: Product,
    weightKg: number,
    weightLabel: string,
    cutting: CuttingMethod,
    packaging: PackagingType,
    fatLevel?: FatLevel,
    notes?: string
  ) => {
    const itemKey = `${product.id}-${weightKg}-${cutting}-${packaging}-${fatLevel || 'def'}`;
    const calculatedPrice = Math.round(product.pricePerKg * weightKg);

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newWeight = updated[existingIndex].selectedWeightKg + weightKg;
        updated[existingIndex] = {
          ...updated[existingIndex],
          selectedWeightKg: newWeight,
          selectedWeightLabel: `${newWeight} كيلو`,
          calculatedPrice: Math.round(product.pricePerKg * newWeight)
        };
        return updated;
      }

      return [
        ...prev,
        {
          id: itemKey,
          product,
          selectedWeightKg: weightKg,
          selectedWeightLabel: weightLabel,
          selectedCutting: cutting,
          selectedPackaging: packaging,
          selectedFatLevel: fatLevel,
          itemNotes: notes,
          calculatedPrice
        }
      ];
    });

    showToast(`تمت إضافة "${product.name}" (${weightLabel}) إلى السلة بنجاح ✨`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartItem = (cartItemId: string, weightKg: number, weightLabel: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            selectedWeightKg: weightKg,
            selectedWeightLabel: weightLabel,
            calculatedPrice: Math.round(item.product.pricePerKg * weightKg)
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.calculatedPrice, 0);
  const deliveryFee = cartSubtotal >= 1000 || cart.length === 0 ? 0 : 30;
  const cartTotal = cartSubtotal + deliveryFee;

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('تمت إزالة المنتج من القائمة المفضلة');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('تمت إضافة المنتج إلى قائمة المفضلة ❤️');
        return [...prev, productId];
      }
    });
  };

  const toggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        showToast('يمكنك مقارنة 4 منتجات كحد أقصى في المرة الواحدة');
        return prev;
      }
      setIsCompareOpen(true);
      return [...prev, product];
    });
  };

  const clearCompare = () => setCompareList([]);

  const placeOrder = (customerInfo: {
    customerName: string;
    customerPhone: string;
    address: string;
    landmark?: string;
    deliveryType: 'delivery' | 'pickup';
    deliveryDate: string;
    deliveryTimeSlot: string;
    notes?: string;
  }): Order => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderId = `#ORD-${randomDigits}`;

    // Format Arabic WhatsApp message
    let itemsText = cart
      .map(
        (item, idx) =>
          `*${idx + 1}. ${item.product.name}*\n` +
          ` - الوزن: ${item.selectedWeightLabel}\n` +
          ` - التقطيع: ${item.selectedCutting}\n` +
          ` - التغليف: ${item.selectedPackaging}\n` +
          (item.selectedFatLevel ? ` - نسبة الدهن: ${item.selectedFatLevel}\n` : '') +
          ` - السعر: ${item.calculatedPrice} ج.م`
      )
      .join('\n\n');

    const whatsappMessage =
      `السلام عليكم ورحمة الله وبركاته 🥩\n` +
      `أرغب في تأكيد الطلب من موقع *جزارة صاحب السعادة*\n\n` +
      `====================\n` +
      `*رقم الطلب:* ${orderId}\n` +
      `====================\n\n` +
      `*الاسم:* ${customerInfo.customerName}\n` +
      `*الهاتف:* ${customerInfo.customerPhone}\n` +
      `*العنوان:* ${customerInfo.address}\n` +
      (customerInfo.landmark ? `*أقرب علامة مميزة:* ${customerInfo.landmark}\n` : '') +
      `*طريقة الاستلام:* ${customerInfo.deliveryType === 'delivery' ? 'توصيل للمنزل' : 'استلام من المحل'}\n` +
      `*موعد التسليم:* ${customerInfo.deliveryDate} - ${customerInfo.deliveryTimeSlot}\n\n` +
      `====================\n` +
      `*تفاصيل المنتجات:*\n` +
      `${itemsText}\n\n` +
      `====================\n` +
      `*إجمالي المنتجات:* ${cartSubtotal} ج.م\n` +
      `*رسوم التوصيل:* ${customerInfo.deliveryType === 'delivery' ? `${deliveryFee} ج.م` : 'مجاناً'}\n` +
      `*الإجمالي الكلي:* ${customerInfo.deliveryType === 'delivery' ? cartTotal : cartSubtotal} ج.م\n` +
      `====================\n` +
      (customerInfo.notes ? `*ملاحظات إضافية:* ${customerInfo.notes}\n` : '') +
      `\nشكراً لكم ودمتم بسعادة! ✨`;

    const encodedMsg = encodeURIComponent(whatsappMessage);
    const whatsappLink = `https://wa.me/201124795553?text=${encodedMsg}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
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
      whatsappLink
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);

    // Sync order to backend
    fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrder }),
    }).catch(console.error);

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await mutateStore(
      () => setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
      ),
      () => fetch(`${API_BASE}/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }),
      `تم تحديث حالة الطلب ${orderId} إلى "${status}"`
    );
  };

  const addProduct = async (product: Product) => {
    await mutateStore(
      () => setProducts((prev) => [product, ...prev]),
      () => fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      }),
      `تمت إضافة المنتج الجديد "${product.name}"`
    );
  };

  const updateProduct = async (productId: string, updated: Partial<Product>) => {
    await mutateStore(
      () => setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, ...updated } : p))
      ),
      () => fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updated }),
      }),
      'تم حفظ التعديلات بنجاح'
    );
  };

  const deleteProduct = async (productId: string) => {
    await mutateStore(
      () => setProducts((prev) => prev.filter((p) => p.id !== productId)),
      () => fetch(`${API_BASE}/api/products/${productId}`, { method: 'DELETE' }),
      'تم حذف المنتج بنجاح'
    );
  };

  const addReview = async (review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'الآن'
    };
    await mutateStore(
      () => setReviews((prev) => [newRev, ...prev]),
      () => fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review: newRev }),
      }),
      'شكراً لتفكيرك وتقييمك لجزارة صاحب السعادة! ❤️'
    );
  };

  const setOnNewOrderCallback = (cb: ((count: number) => void) | null) => {
    onNewOrderRef.current = cb;
  };

  return (
    <AppContext.Provider
      value={{
        products,
        activeCategory,
        setActiveCategory,
        meatAgeFilter,
        setMeatAgeFilter,
        searchQuery,
        setSearchQuery,
        heroVideos,
        galleryVideos,
        offers,
        storeSettings,
        updateStoreSettings,
        addHeroVideo,
        updateHeroVideo,
        deleteHeroVideo,
        addGalleryVideo,
        updateGalleryVideo,
        deleteGalleryVideo,
        addOffer,
        updateOffer,
        deleteOffer,
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        compareList,
        toggleCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orders,
        placeOrder,
        lastOrder,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        updateOrderStatus,
        updateOrder,
        deleteOrder,
        clearAllOrders,
        clearCancelledOrders,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        reviews,
        addReview,
        selectedProduct,
        setSelectedProduct,
        toastMessage,
        showToast,
        persistenceMode,
        setOnNewOrderCallback
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
