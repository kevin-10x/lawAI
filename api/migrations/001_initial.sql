DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS consultations;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  is_active INTEGER NOT NULL DEFAULT 1,
  is_verified INTEGER NOT NULL DEFAULT 0,
  company TEXT,
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  file_type TEXT,
  doc_type TEXT NOT NULL DEFAULT 'other',
  status TEXT NOT NULL DEFAULT 'pending',
  ai_analysis TEXT,
  risk_score INTEGER,
  risk_report TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  lawyer_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  practice_area TEXT,
  mode TEXT NOT NULL DEFAULT 'video',
  status TEXT NOT NULL DEFAULT 'scheduled',
  scheduled_date TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  fee REAL NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (client_id) REFERENCES users(id),
  FOREIGN KEY (lawyer_id) REFERENCES users(id)
);

CREATE TABLE cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  lawyer_id INTEGER,
  title TEXT NOT NULL,
  case_number TEXT UNIQUE,
  case_type TEXT NOT NULL DEFAULT 'other',
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  jurisdiction TEXT,
  court TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (client_id) REFERENCES users(id),
  FOREIGN KEY (lawyer_id) REFERENCES users(id)
);

CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  method TEXT NOT NULL DEFAULT 'mpesa',
  status TEXT NOT NULL DEFAULT 'pending',
  reference TEXT UNIQUE,
  description TEXT,
  phone_number TEXT,
  mpesa_code TEXT,
  is_subscription INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
