export type MeatCategory = 
  | 'all' 
  | 'buffalo' 
  | 'kandouz' 
  | 'special-cuts' 
  | 'liver-offals' 
  | 'mombar-kawaree' 
  | 'minced-processed' 
  | 'family-boxes';

export type CuttingMethod = 
  | 'whole' 
  | 'cubes' 
  | 'slices' 
  | 'steak' 
  | 'shawarma' 
  | 'minced' 
  | 'kofta' 
  | 'bbq' 
  | 'custom';

export type FatLevel = 'low' | 'medium' | 'high' | 'not-applicable';

export type PackagingType = 'regular' | 'vacuum' | 'gift' | 'family-ice';

export interface Product {
  id: string;
  name: string;
  englishName: string;
  category: MeatCategory;
  meatType: 'buffalo' | 'kandouz';
  pricePerKg: number;
  originalPricePerKg?: number;
  isOffer?: boolean;
  discountPercent?: number;
  isBestSeller?: boolean;
  isFreshToday?: boolean;
  description: string;
  image: string;
  gallery?: string[];
  fatLevelOptions?: FatLevel[];
  recommendedCooking: string[];
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  shelfLife: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  meatAge?: 'small' | 'large' | 'medium';
  customBadge?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedWeightKg: number;
  selectedWeightLabel: string;
  selectedCutting: CuttingMethod;
  selectedPackaging: PackagingType;
  selectedFatLevel?: FatLevel;
  itemNotes?: string;
  calculatedPrice: number;
}

export interface OfferItem {
  id: string;
  title: string;
  description: string;
  discountText: string;
  originalPrice: number;
  offerPrice: number;
  weightLabel: string;
  endsAtTimestamp: number;
  productId: string;
  image: string;
  badge: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  address: string;
  landmark?: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryDate: string;
  deliveryTimeSlot: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
  whatsappLink: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  location: string;
}

export interface ButcherVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  category: string;
}

export interface HeroVideo {
  id: string;
  title: string;
  url: string;
  poster: string;
}

export interface StoreSettings {
  phone1: string;
  phone2: string;
  whatsappPhone: string;
  address: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  workingHours: string;
  gmapsLink: string;
  adminPin: string;

  // Real-time Controls
  todaySlaughterNote?: string;
  todaySlaughterType?: string;
  todaySlaughterStatus?: boolean;
  todaySlaughterTime?: string;
  isStoreOpen?: boolean;
  storeClosedNotice?: string;
  globalOfferCountdownHours?: number;
  announcementBarText?: string;
  announcementBarActive?: boolean;
}
