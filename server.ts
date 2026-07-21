import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS } from './src/data/products.js';
import { INITIAL_REVIEWS } from './src/data/reviews.js';
import { HERO_VIDEOS, BUTCHER_SHOWCASE_VIDEOS } from './src/data/videos.js';
import { TODAY_OFFERS } from './src/data/offers.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store-data.json');

const DEFAULT_SETTINGS = {
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

interface StoreData {
  products: any[];
  storeSettings: typeof DEFAULT_SETTINGS;
  heroVideos: any[];
  galleryVideos: any[];
  offers: any[];
  orders: any[];
  reviews: any[];
}

let clients: Array<{ id: number; res: express.Response }> = [];

function broadcastData() {
  const payload = `data: ${JSON.stringify(storeData)}\n\n`;
  clients.forEach(c => {
    try {
      c.res.write(payload);
    } catch (err) {
      // client connection closed
    }
  });
}

function loadStoreData(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        products: parsed.products || INITIAL_PRODUCTS,
        storeSettings: { ...DEFAULT_SETTINGS, ...(parsed.storeSettings || {}) },
        heroVideos: parsed.heroVideos || HERO_VIDEOS,
        galleryVideos: parsed.galleryVideos || BUTCHER_SHOWCASE_VIDEOS,
        offers: parsed.offers || TODAY_OFFERS,
        orders: parsed.orders || [],
        reviews: parsed.reviews || INITIAL_REVIEWS,
      };
    }
  } catch (err) {
    console.error('Error loading store data:', err);
  }

  // Default initial data
  const initialData: StoreData = {
    products: INITIAL_PRODUCTS,
    storeSettings: DEFAULT_SETTINGS,
    heroVideos: HERO_VIDEOS,
    galleryVideos: BUTCHER_SHOWCASE_VIDEOS,
    offers: TODAY_OFFERS,
    orders: [], // Empty by default - no static/dummy orders!
    reviews: INITIAL_REVIEWS,
  };

  return initialData;
}

function saveStoreData(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    broadcastData();
  } catch (err) {
    console.error('Error saving store data:', err);
  }
}

let storeData = loadStoreData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // CORS Middleware to allow requests from any origin (very helpful when frontend is on Vercel and backend on Render)
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Real-time SSE endpoint
  app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // Send current state immediately upon connection
    res.write(`data: ${JSON.stringify(storeData)}\n\n`);

    const clientId = Date.now() + Math.random();
    const newClient = { id: clientId, res };
    clients.push(newClient);

    const heartbeat = setInterval(() => {
      try {
        res.write(': heartbeat\n\n');
      } catch (e) {
        clearInterval(heartbeat);
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(heartbeat);
      clients = clients.filter(c => c.id !== clientId);
    });
  });

  // API Routes with No-Cache Headers
  app.get('/api/store-data', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.json(storeData);
  });

  app.post('/api/settings', (req, res) => {
    const { settings } = req.body;
    if (settings) {
      storeData.storeSettings = { ...storeData.storeSettings, ...settings };
      saveStoreData(storeData);
    }
    res.json({ success: true, storeSettings: storeData.storeSettings });
  });

  // Products
  app.post('/api/products', (req, res) => {
    const { product } = req.body;
    if (product) {
      storeData.products = [product, ...storeData.products.filter(p => p.id !== product.id)];
      saveStoreData(storeData);
    }
    res.json({ success: true, products: storeData.products });
  });

  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { updated } = req.body;
    storeData.products = storeData.products.map(p => p.id === id ? { ...p, ...updated } : p);
    saveStoreData(storeData);
    res.json({ success: true, products: storeData.products });
  });

  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    storeData.products = storeData.products.filter(p => p.id !== id);
    saveStoreData(storeData);
    res.json({ success: true, products: storeData.products });
  });

  // Offers
  app.post('/api/offers', (req, res) => {
    const { offer } = req.body;
    if (offer) {
      storeData.offers = [offer, ...storeData.offers.filter(o => o.id !== offer.id)];
      saveStoreData(storeData);
    }
    res.json({ success: true, offers: storeData.offers });
  });

  app.put('/api/offers/:id', (req, res) => {
    const { id } = req.params;
    const { updated } = req.body;
    storeData.offers = storeData.offers.map(o => o.id === id ? { ...o, ...updated } : o);
    saveStoreData(storeData);
    res.json({ success: true, offers: storeData.offers });
  });

  app.delete('/api/offers/:id', (req, res) => {
    const { id } = req.params;
    storeData.offers = storeData.offers.filter(o => o.id !== id);
    saveStoreData(storeData);
    res.json({ success: true, offers: storeData.offers });
  });

  // Hero Videos
  app.post('/api/videos/hero', (req, res) => {
    const { video } = req.body;
    if (video) {
      storeData.heroVideos = [video, ...storeData.heroVideos.filter(v => v.id !== video.id)];
      saveStoreData(storeData);
    }
    res.json({ success: true, heroVideos: storeData.heroVideos });
  });

  app.put('/api/videos/hero/:id', (req, res) => {
    const { id } = req.params;
    const { updated } = req.body;
    storeData.heroVideos = storeData.heroVideos.map(v => v.id === id ? { ...v, ...updated } : v);
    saveStoreData(storeData);
    res.json({ success: true, heroVideos: storeData.heroVideos });
  });

  app.delete('/api/videos/hero/:id', (req, res) => {
    const { id } = req.params;
    storeData.heroVideos = storeData.heroVideos.filter(v => v.id !== id);
    saveStoreData(storeData);
    res.json({ success: true, heroVideos: storeData.heroVideos });
  });

  // Gallery Videos
  app.post('/api/videos/gallery', (req, res) => {
    const { video } = req.body;
    if (video) {
      storeData.galleryVideos = [video, ...storeData.galleryVideos.filter(v => v.id !== video.id)];
      saveStoreData(storeData);
    }
    res.json({ success: true, galleryVideos: storeData.galleryVideos });
  });

  app.put('/api/videos/gallery/:id', (req, res) => {
    const { id } = req.params;
    const { updated } = req.body;
    storeData.galleryVideos = storeData.galleryVideos.map(v => v.id === id ? { ...v, ...updated } : v);
    saveStoreData(storeData);
    res.json({ success: true, galleryVideos: storeData.galleryVideos });
  });

  app.delete('/api/videos/gallery/:id', (req, res) => {
    const { id } = req.params;
    storeData.galleryVideos = storeData.galleryVideos.filter(v => v.id !== id);
    saveStoreData(storeData);
    res.json({ success: true, galleryVideos: storeData.galleryVideos });
  });

  // Orders
  app.post('/api/orders', (req, res) => {
    const { order } = req.body;
    if (order) {
      storeData.orders = [order, ...storeData.orders.filter(o => o.id !== order.id)];
      saveStoreData(storeData);
    }
    res.json({ success: true, orders: storeData.orders });
  });

  app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status, updated } = req.body;
    storeData.orders = storeData.orders.map(o => {
      if (o.id === id) {
        return { ...o, ...(status ? { status } : {}), ...(updated || {}) };
      }
      return o;
    });
    saveStoreData(storeData);
    res.json({ success: true, orders: storeData.orders });
  });

  app.delete('/api/orders/all', (req, res) => {
    storeData.orders = [];
    saveStoreData(storeData);
    res.json({ success: true, orders: [] });
  });

  app.delete('/api/orders/cancelled', (req, res) => {
    storeData.orders = storeData.orders.filter(o => o.status !== 'cancelled');
    saveStoreData(storeData);
    res.json({ success: true, orders: storeData.orders });
  });

  app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    storeData.orders = storeData.orders.filter(o => o.id !== id);
    saveStoreData(storeData);
    res.json({ success: true, orders: storeData.orders });
  });

  // Reviews
  app.post('/api/reviews', (req, res) => {
    const { review } = req.body;
    if (review) {
      storeData.reviews = [review, ...storeData.reviews];
      saveStoreData(storeData);
    }
    res.json({ success: true, reviews: storeData.reviews });
  });

  // Vite Middleware or Production Static Assets
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
