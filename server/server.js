import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './db.js';
import { DEFAULT_STORE_DATA } from '../src/data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Upload directories
const uploadsDir = path.join(__dirname, '../public/uploads');
const videosDir = path.join(uploadsDir, 'videos');
const imagesDir = path.join(uploadsDir, 'images');

[uploadsDir, videosDir, imagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve uploaded static files directly under /uploads
app.use('/uploads', express.static(uploadsDir));

// Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, videosDir);
    } else {
      cb(null, imagesDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || (file.mimetype.startsWith('video/') ? '.mp4' : '.jpg');
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 300 * 1024 * 1024 } // 300MB limit for videos
});

// Seed default data if empty
function initializeDefaults() {
  const getSetting = db.prepare('SELECT value FROM store_settings WHERE key = ?');
  const insertSetting = db.prepare('INSERT OR REPLACE INTO store_settings (key, value) VALUES (?, ?)');

  if (!getSetting.get('hero')) {
    insertSetting.run('hero', JSON.stringify(DEFAULT_STORE_DATA.hero));
  }
  if (!getSetting.get('about')) {
    insertSetting.run('about', JSON.stringify(DEFAULT_STORE_DATA.about));
  }
  if (!getSetting.get('contact')) {
    insertSetting.run('contact', JSON.stringify(DEFAULT_STORE_DATA.contact));
  }
  if (!getSetting.get('shipping')) {
    insertSetting.run('shipping', JSON.stringify(DEFAULT_STORE_DATA.shipping));
  }
  if (!getSetting.get('coupons')) {
    insertSetting.run('coupons', JSON.stringify(DEFAULT_STORE_DATA.coupons));
  }
  if (!getSetting.get('theme')) {
    insertSetting.run('theme', JSON.stringify(DEFAULT_STORE_DATA.theme));
  }
  if (!getSetting.get('packaging')) {
    insertSetting.run('packaging', JSON.stringify(DEFAULT_STORE_DATA.packaging));
  }
  if (!getSetting.get('payment')) {
    insertSetting.run('payment', JSON.stringify(DEFAULT_STORE_DATA.payment));
  }

  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (productCount === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, titleEn, titleAr, category, price, minQuantity, unitEn, unitAr,
        image, descriptionEn, descriptionAr, ingredientsEn, ingredientsAr,
        inStock, featured, customOptions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of DEFAULT_STORE_DATA.products) {
      insertProduct.run(
        p.id, p.titleEn, p.titleAr, p.category, p.price, p.minQuantity, p.unitEn, p.unitAr,
        p.image, p.descriptionEn, p.descriptionAr, p.ingredientsEn, p.ingredientsAr,
        p.inStock ? 1 : 0, p.featured ? 1 : 0, JSON.stringify(p.customOptions || [])
      );
    }
  }
}

initializeDefaults();

// ================= API ROUTES =================

// 1. Get full store data
app.get('/api/store-data', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  try {
    const rows = db.prepare('SELECT key, value FROM store_settings').all();
    const settings = {};
    rows.forEach(r => {
      try { settings[r.key] = JSON.parse(r.value); } catch { settings[r.key] = r.value; }
    });

    const products = db.prepare('SELECT * FROM products ORDER BY rowid ASC').all().map(p => ({
      ...p,
      inStock: Boolean(p.inStock),
      featured: Boolean(p.featured),
      customOptions: p.customOptions ? JSON.parse(p.customOptions) : []
    }));

    res.json({
      theme: settings.theme || DEFAULT_STORE_DATA.theme,
      hero: settings.hero || DEFAULT_STORE_DATA.hero,
      about: settings.about || DEFAULT_STORE_DATA.about,
      packaging: settings.packaging || DEFAULT_STORE_DATA.packaging,
      payment: settings.payment || DEFAULT_STORE_DATA.payment,
      contact: settings.contact || DEFAULT_STORE_DATA.contact,
      shipping: settings.shipping || DEFAULT_STORE_DATA.shipping,
      coupons: settings.coupons || DEFAULT_STORE_DATA.coupons,
      products
    });
  } catch (error) {
    console.error('Error fetching store data:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Update store data (Hero, Contact, Shipping, Coupons, Products, Theme, Packaging, Payment)
app.post('/api/store-data', (req, res) => {
  try {
    const { hero, about, contact, shipping, coupons, theme, packaging, payment, products } = req.body;
    const upsertSetting = db.prepare('INSERT OR REPLACE INTO store_settings (key, value) VALUES (?, ?)');

    const transaction = db.transaction(() => {
      if (theme) upsertSetting.run('theme', JSON.stringify(theme));
      if (hero) upsertSetting.run('hero', JSON.stringify(hero));
      if (about) upsertSetting.run('about', JSON.stringify(about));
      if (packaging) upsertSetting.run('packaging', JSON.stringify(packaging));
      if (payment) upsertSetting.run('payment', JSON.stringify(payment));
      if (contact) upsertSetting.run('contact', JSON.stringify(contact));
      if (shipping) upsertSetting.run('shipping', JSON.stringify(shipping));
      if (coupons) upsertSetting.run('coupons', JSON.stringify(coupons));

      if (Array.isArray(products)) {
        db.prepare('DELETE FROM products').run();
        const insertProduct = db.prepare(`
          INSERT INTO products (
            id, titleEn, titleAr, category, price, minQuantity, unitEn, unitAr,
            image, descriptionEn, descriptionAr, ingredientsEn, ingredientsAr,
            inStock, featured, customOptions
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const p of products) {
          insertProduct.run(
            p.id, p.titleEn, p.titleAr, p.category, p.price, p.minQuantity, p.unitEn, p.unitAr,
            p.image, p.descriptionEn, p.descriptionAr, p.ingredientsEn, p.ingredientsAr,
            p.inStock ? 1 : 0, p.featured ? 1 : 0, JSON.stringify(p.customOptions || [])
          );
        }
      }
    });

    transaction();
    res.json({ success: true, message: 'Settings saved to SQLite' });
  } catch (error) {
    console.error('Error updating store data:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Video Upload Endpoint
app.post('/api/upload-video', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const videoUrl = `/uploads/videos/${req.file.filename}`;

    // Automatically update the hero video setting in SQLite
    const getHero = db.prepare('SELECT value FROM store_settings WHERE key = ?').get('hero');
    let hero = DEFAULT_STORE_DATA.hero;
    if (getHero && getHero.value) {
      try { hero = JSON.parse(getHero.value); } catch {}
    }

    hero.videoUrl = videoUrl;
    db.prepare('INSERT OR REPLACE INTO store_settings (key, value) VALUES (?, ?)').run('hero', JSON.stringify(hero));

    res.json({ success: true, videoUrl, hero });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Image Upload Endpoint
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    const imageUrl = `/uploads/images/${req.file.filename}`;
    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Orders Endpoints
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all().map(o => ({
      ...o,
      shippingAddress: o.shippingAddress ? JSON.parse(o.shippingAddress) : {},
      items: o.items ? JSON.parse(o.items) : []
    }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const o = req.body;
    const newOrderId = o.id || `GDB-${Math.floor(10000 + Math.random() * 90000)}`;
    const date = o.date || new Date().toISOString();

    db.prepare(`
      INSERT INTO orders (
        id, date, customerName, phone, email, shippingAddress, shippingMethod,
        shippingFee, discount, subtotal, total, status, paymentMethod, notes, items
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newOrderId, date, o.customerName, o.phone, o.email,
      JSON.stringify(o.shippingAddress || {}),
      o.shippingMethod, o.shippingFee || 0, o.discount || 0,
      o.subtotal || 0, o.total || 0, o.status || 'pending',
      o.paymentMethod || 'Card', o.notes || '',
      JSON.stringify(o.items || [])
    );

    res.json({ success: true, order: { ...o, id: newOrderId, date } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Custom Orders Endpoints
app.get('/api/custom-orders', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM custom_orders ORDER BY createdAt DESC').all();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/custom-orders', (req, res) => {
  try {
    const o = req.body;
    const id = o.id || `CUSTOM-${Math.floor(10000 + Math.random() * 90000)}`;
    const date = o.date || new Date().toISOString();

    db.prepare(`
      INSERT INTO custom_orders (id, date, customerName, customerPhone, customerEmail, notes, image, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, date, o.customerName, o.customerPhone, o.customerEmail, o.notes || '', o.image || '', o.status || 'pending');

    res.json({ success: true, customOrder: { ...o, id, date } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/custom-orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE custom_orders SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/custom-orders/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM custom_orders WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Reset to factory defaults
app.post('/api/reset-defaults', (req, res) => {
  try {
    const upsertSetting = db.prepare('INSERT OR REPLACE INTO store_settings (key, value) VALUES (?, ?)');
    upsertSetting.run('theme', JSON.stringify(DEFAULT_STORE_DATA.theme));
    upsertSetting.run('hero', JSON.stringify(DEFAULT_STORE_DATA.hero));
    upsertSetting.run('about', JSON.stringify(DEFAULT_STORE_DATA.about));
    upsertSetting.run('packaging', JSON.stringify(DEFAULT_STORE_DATA.packaging));
    upsertSetting.run('payment', JSON.stringify(DEFAULT_STORE_DATA.payment));
    upsertSetting.run('contact', JSON.stringify(DEFAULT_STORE_DATA.contact));
    upsertSetting.run('shipping', JSON.stringify(DEFAULT_STORE_DATA.shipping));
    upsertSetting.run('coupons', JSON.stringify(DEFAULT_STORE_DATA.coupons));

    db.prepare('DELETE FROM products').run();
    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, titleEn, titleAr, category, price, minQuantity, unitEn, unitAr,
        image, descriptionEn, descriptionAr, ingredientsEn, ingredientsAr,
        inStock, featured, customOptions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of DEFAULT_STORE_DATA.products) {
      insertProduct.run(
        p.id, p.titleEn, p.titleAr, p.category, p.price, p.minQuantity, p.unitEn, p.unitAr,
        p.image, p.descriptionEn, p.descriptionAr, p.ingredientsEn, p.ingredientsAr,
        p.inStock ? 1 : 0, p.featured ? 1 : 0, JSON.stringify(p.customOptions || [])
      );
    }

    res.json({ success: true, message: 'Defaults restored' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend build in production
const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(distDir, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

