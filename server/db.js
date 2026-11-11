import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'gateaux.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance
db.pragma('journal_mode = WAL');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS store_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    titleEn TEXT,
    titleAr TEXT,
    category TEXT,
    price REAL,
    minQuantity INTEGER,
    unitEn TEXT,
    unitAr TEXT,
    image TEXT,
    descriptionEn TEXT,
    descriptionAr TEXT,
    ingredientsEn TEXT,
    ingredientsAr TEXT,
    inStock INTEGER,
    featured INTEGER,
    customOptions TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    date TEXT,
    customerName TEXT,
    phone TEXT,
    email TEXT,
    shippingAddress TEXT,
    shippingMethod TEXT,
    shippingFee REAL,
    discount REAL,
    subtotal REAL,
    total REAL,
    status TEXT,
    paymentMethod TEXT,
    notes TEXT,
    items TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS custom_orders (
    id TEXT PRIMARY KEY,
    date TEXT,
    customerName TEXT,
    customerPhone TEXT,
    customerEmail TEXT,
    notes TEXT,
    image TEXT,
    status TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;

