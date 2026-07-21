import { OfferItem } from '../types';

export const TODAY_OFFERS: OfferItem[] = [
  {
    id: 'off-1',
    title: 'عرض الموزة والافتتاح الكندوز',
    description: '1 كيلو موزة كندوز بلدي + 1/2 كيلو كبدة بلدي طازجة بسعر حصري اليوم من صاحب السعادة!',
    discountText: 'خصم 15% لفترة محدودة',
    originalPrice: 640,
    offerPrice: 545,
    weightLabel: '1.5 كيلو مشكل',
    endsAtTimestamp: Date.now() + 18 * 3600 * 1000, // 18 hours from now
    productId: 'prod-moza-kandouz',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    badge: 'عرض الأكثر مبيعاً 🔥'
  },
  {
    id: 'off-2',
    title: 'عرض المفروم والكفتة البلدي',
    description: '1 كيلو مفروم بلدي طازج حسب اختيار الدهن + 1 كيلو كفتة الحاتي المتبلة ببهارات صاحب السعادة',
    discountText: 'وفر 70 جنيه فوراً',
    originalPrice: 800,
    offerPrice: 730,
    weightLabel: '2 كيلو مفروم وكفتة',
    endsAtTimestamp: Date.now() + 12 * 3600 * 1000,
    productId: 'prod-mafroom-baladi',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
    badge: 'عرض الشواء العائلي 🥩'
  },
  {
    id: 'off-3',
    title: 'عروض المومبار والكوارع ناصعة البيض',
    description: '1 كيلو مومبار بلدي مغسول بالليمون + زوج كوارع خلفي كبير مقطع ومجهز للطهي',
    discountText: 'خصم 18%',
    originalPrice: 490,
    offerPrice: 399,
    weightLabel: 'وجبة الطواجن الملوكي',
    endsAtTimestamp: Date.now() + 24 * 3600 * 1000,
    productId: 'prod-mombar-baladi',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    badge: 'عرض النظافة المميزة ✨'
  }
];
