import { ButcherVideo } from '../types';

export const HERO_VIDEOS = [
  {
    id: 'hero-vid-main',
    title: 'الذبح والتقطيع الاحترافي بالطازج',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-preparing-meat-in-a-kitchen-41551-large.mp4',
    poster: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'hero-vid-steak',
    title: 'تجهيز قطعيات الستيك وتشفية اللحم البلدي',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-chef-seasoning-and-preparing-a-meat-steak-43380-large.mp4',
    poster: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'hero-vid-board',
    title: 'التقطيع المباشر أمام الكاميرا',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-raw-meat-on-a-cutting-board-41552-large.mp4',
    poster: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'hero-vid-cooked',
    title: 'طهي وتحضير أشهى المأكولات والمشويات',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-chef-slicing-cooked-meat-41487-large.mp4',
    poster: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80'
  }
];

export const BUTCHER_SHOWCASE_VIDEOS: ButcherVideo[] = [
  {
    id: 'vid-1',
    title: 'معايير التقطيع والتعقيم الفائق',
    description: 'شاهد دورة تعقيم أدوات الجزارة وطريقة الذبح والتشفية البلدي اليومي في جزارة صاحب السعادة.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-preparing-meat-in-a-kitchen-41551-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80',
    duration: '0:45',
    category: 'النظافة والتعقيم'
  },
  {
    id: 'vid-2',
    title: 'تجهيز الستيك والموزة والقطعيات الخاصة',
    description: 'تجهيز وتشفية العرق والستيك والقطعيات الفاخرة بمهارة الجزار البلدي للطهي الفوري.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-chef-seasoning-and-preparing-a-meat-steak-43380-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    duration: '1:15',
    category: 'التقطيع المخصص'
  },
  {
    id: 'vid-3',
    title: 'تجهيز المومبار والكوارع والحلويات',
    description: 'خطوات تنظيف وتقطيع المومبار والكوارع بالليمون والخل تجهيزاً ناصعاً بماء جارٍ للعملاء.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-raw-meat-on-a-cutting-board-41552-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    duration: '1:10',
    category: 'تجهيز المذبح'
  },
  {
    id: 'vid-4',
    title: 'التغليف الآلي المفرغ من الهواء (Vacuum)',
    description: 'طريقة حفظ طزاجة اللحوم عند الشحن والتوصيل للمنازل مع أكياس التبريد لحفظ الطعم والجودة.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-slicing-cooked-meat-41487-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    duration: '0:55',
    category: 'التغليف الفاخر'
  }
];
