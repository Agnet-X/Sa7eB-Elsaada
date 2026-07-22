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

// MongoDB Atlas Integration
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'butchery_saada';
const COLLECTION_NAME = 'store_state';
let mongoClient: MongoClient | null = null;

async function getMongoClient() {
  if (!MONGODB_URI) return null;
  if (!mongoClient) {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
  }
  return mongoClient;
}

// Fetch storeData (loads from MongoDB if active, otherwise falls back to local memory/file)
async function getStoreData(): Promise<StoreData> {
  if (MONGODB_URI) {
    try {
      const client = await getMongoClient();
      if (client) {
        const db = client.db(DB_NAME);
        const col = db.collection(COLLECTION_NAME);
        const doc = await col.findOne({ _id: 'main' as any });
        if (doc) {
          // Merge with default values in case structure changed
          return {
            products: doc.products || INITIAL_PRODUCTS,
            storeSettings: { ...DEFAULT_SETTINGS, ...(doc.storeSettings || {}) },
            heroVideos: doc.heroVideos || HERO_VIDEOS,
            galleryVideos: doc.galleryVideos || BUTCHER_SHOWCASE_VIDEOS,
            offers: doc.offers || TODAY_OFFERS,
            orders: doc.orders || [],
            reviews: doc.reviews || INITIAL_REVIEWS,
          };
        }
      }
    } catch (err) {
      console.error('Error fetching store data from MongoDB:', err);
    }
  }
  return storeData;
}

// Save storeData (saves to MongoDB if active, otherwise saves to local file)
async function persistStoreData(data: StoreData) {
  storeData = data; // Update in-memory cache
  if (MONGODB_URI) {
    try {
      const client = await getMongoClient();
      if (client) {
        const db = client.db(DB_NAME);
        const col = db.collection(COLLECTION_NAME);
        await col.updateOne(
          { _id: 'main' as any },
          { $set: data },
          { upsert: true }
        );
        broadcastData();
        return;
      }
    } catch (err) {
      console.error('Error saving store data to MongoDB:', err);
    }
  }

  // Fallback to local file persistence
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    broadcastData();
  } catch (err) {
    console.error('Error saving store data locally:', err);
  }
}

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

let storeData = loadStoreData();

// Init database values if MongoDB is connected
if (MONGODB_URI) {
  getStoreData().then(data => {
    storeData = data;
  }).catch(console.error);
}

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

  // Normalize req.url so routes match whether Vercel passes /api/store-data or /store-data
  app.use((req, res, next) => {
    if (!req.url.startsWith('/api')) {
      req.url = '/api' + req.url;
    }
    next();
  });

  // Real-time SSE endpoint
  app.get('/api/events', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // Send current state immediately upon connection
    const currentData = await getStoreData();
    res.write(`data: ${JSON.stringify(currentData)}\n\n`);

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

  app.get('/api/health', (_req, res) => {
    const persistence = MONGODB_URI
      ? 'mongodb'
      : process.env.VERCEL
        ? 'memory'
        : 'file';
    res.json({ ok: true, persistence });
  });

  // API Routes with No-Cache Headers
  app.get('/api/store-data', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const currentData = await getStoreData();
    res.json(currentData);
  });

  app.post('/api/settings', async (req, res) => {
    const { settings } = req.body;
    if (settings) {
      const currentData = await getStoreData();
      currentData.storeSettings = { ...currentData.storeSettings, ...settings };
      await persistStoreData(currentData);
    }
    res.json({ success: true, storeSettings: storeData.storeSettings });
  });

  // Products
  app.post('/api/products', async (req, res) => {
    const { product } = req.body;
    if (product) {
      const currentData = await getStoreData();
      currentData.products = [product, ...currentData.products.filter(p => p.id !== product.id)];
      await persistStoreData(currentData);
    }
    res.json({ success: true, products: storeData.products });
  });

  app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { updated } = req.body;
    const currentData = await getStoreData();
    currentData.products = currentData.products.map(p => p.id === id ? { ...p, ...updated } : p);
    await persistStoreData(currentData);
    res.json({ success: true, products: storeData.products });
  });

  app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const currentData = await getStoreData();
    currentData.products = currentData.products.filter(p => p.id !== id);
    await persistStoreData(currentData);
    res.json({ success: true, products: storeData.products });
  });

  // Offers
  app.post('/api/offers', async (req, res) => {
    const { offer } = req.body;
    if (offer) {
      const currentData = await getStoreData();
      currentData.offers = [offer, ...currentData.offers.filter(o => o.id !== offer.id)];
      await persistStoreData(currentData);
    }
    res.json({ success: true, offers: storeData.offers });
  });

  app.put('/api/offers/:id', async (req, res) => {
    const { id } = req.params;
    const { updated } = req.body;
    const currentData = await getStoreData();
    currentData.offers = currentData.offers.map(o => o.id === id ? { ...o, ...updated } : o);
    await persistStoreData(currentData);
    res.json({ success: true, offers: storeData.offers });
  });

  app.delete('/api/offers/:id', async (req, res) => {
    const { id } = req.params;
    const currentData = await getStoreData();
    currentData.offers = currentData.offers.filter(o => o.id !== id);
    await persistStoreData(currentData);
    res.json({ success: true, offers: storeData.offers });
  });

  // Hero Videos
  app.post('/api/videos/hero', async (req, res) => {
    const { video } = req.body;
    if (video) {
      const currentData = await getStoreData();
      currentData.heroVideos = [video, ...currentData.heroVideos.filter(v => v.id !== video.id)];
      await persistStoreData(currentData);
    }
    res.json({ success: true, heroVideos: storeData.heroVideos });
  });

  app.put('/api/videos/hero/:id', async (req, res) => {
    const { id } = req.params;
    const { updated } = req.body;
    const currentData = await getStoreData();
    currentData.heroVideos = currentData.heroVideos.map(v => v.id === id ? { ...v, ...updated } : v);
    await persistStoreData(currentData);
    res.json({ success: true, heroVideos: storeData.heroVideos });
  });

  app.delete('/api/videos/hero/:id', async (req, res) => {
    const { id } = req.params;
    const currentData = await getStoreData();
    currentData.heroVideos = currentData.heroVideos.filter(v => v.id !== id);
    await persistStoreData(currentData);
    res.json({ success: true, heroVideos: storeData.heroVideos });
  });

  // Gallery Videos
  app.post('/api/videos/gallery', async (req, res) => {
    const { video } = req.body;
    if (video) {
      const currentData = await getStoreData();
      currentData.galleryVideos = [video, ...currentData.galleryVideos.filter(v => v.id !== video.id)];
      await persistStoreData(currentData);
    }
    res.json({ success: true, galleryVideos: storeData.galleryVideos });
  });

  app.put('/api/videos/gallery/:id', async (req, res) => {
    const { id } = req.params;
    const { updated } = req.body;
    const currentData = await getStoreData();
    currentData.galleryVideos = currentData.galleryVideos.map(v => v.id === id ? { ...v, ...updated } : v);
    await persistStoreData(currentData);
    res.json({ success: true, galleryVideos: storeData.galleryVideos });
  });

  app.delete('/api/videos/gallery/:id', async (req, res) => {
    const { id } = req.params;
    const currentData = await getStoreData();
    currentData.galleryVideos = currentData.galleryVideos.filter(v => v.id !== id);
    await persistStoreData(currentData);
    res.json({ success: true, galleryVideos: storeData.galleryVideos });
  });

  // Orders
  app.post('/api/orders', async (req, res) => {
    const { order } = req.body;
    if (order) {
      const currentData = await getStoreData();
      currentData.orders = [order, ...currentData.orders.filter(o => o.id !== order.id)];
      await persistStoreData(currentData);
    }
    res.json({ success: true, orders: storeData.orders });
  });

  app.put('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status, updated } = req.body;
    const currentData = await getStoreData();
    currentData.orders = currentData.orders.map(o => {
      if (o.id === id) {
        return { ...o, ...(status ? { status } : {}), ...(updated || {}) };
      }
      return o;
    });
    await persistStoreData(currentData);
    res.json({ success: true, orders: storeData.orders });
  });

  app.delete('/api/orders/all', async (req, res) => {
    const currentData = await getStoreData();
    currentData.orders = [];
    await persistStoreData(currentData);
    res.json({ success: true, orders: [] });
  });

  app.delete('/api/orders/cancelled', async (req, res) => {
    const currentData = await getStoreData();
    currentData.orders = currentData.orders.filter(o => o.status !== 'cancelled');
    await persistStoreData(currentData);
    res.json({ success: true, orders: storeData.orders });
  });

  app.delete('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const currentData = await getStoreData();
    currentData.orders = currentData.orders.filter(o => o.id !== id);
    await persistStoreData(currentData);
    res.json({ success: true, orders: storeData.orders });
  });

  // Reviews
  app.post('/api/reviews', async (req, res) => {
    const { review } = req.body;
    if (review) {
      const currentData = await getStoreData();
      currentData.reviews = [review, ...currentData.reviews];
      await persistStoreData(currentData);
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

  // Only start listening if not running on serverless Vercel environment
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }

  return app;
}

const serverPromise = startServer();
export default serverPromise;
