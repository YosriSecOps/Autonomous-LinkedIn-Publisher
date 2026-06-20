// ============================================================================
// Database Connection — Singleton
// ============================================================================
// Creates (or opens) the SQLite database, enables WAL mode for concurrent
// reads, and bootstraps the schema on first run.  The single `db` instance
// is exported as the default and shared across the application.
// ============================================================================

import Database from 'better-sqlite3';
import fs       from 'node:fs';
import path     from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Resolve __dirname equivalent for ES modules
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Project root is two levels up from src/database/
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

// ---------------------------------------------------------------------------
// Resolve database file path
// ---------------------------------------------------------------------------
// DB_PATH can be set via environment variable.  When the value is a relative
// path it is resolved against the project root so the .db file always lands
// in a predictable location regardless of the working directory.
// ---------------------------------------------------------------------------
const rawDbPath = process.env.DB_PATH || './memory.db';
const DB_PATH   = path.isAbsolute(rawDbPath)
    ? rawDbPath
    : path.resolve(PROJECT_ROOT, rawDbPath);

// Ensure the parent directory exists (e.g. when DB_PATH = "./data/app.db")
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// ---------------------------------------------------------------------------
// Create the database instance
// ---------------------------------------------------------------------------
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Enable foreign key enforcement (off by default in SQLite)
db.pragma('foreign_keys = ON');

// ---------------------------------------------------------------------------
// Bootstrap schema
// ---------------------------------------------------------------------------
// Read the DDL file and execute it.  Every statement uses IF NOT EXISTS so
// this is safe to run on every startup.
// ---------------------------------------------------------------------------
const schemaPath = path.resolve(PROJECT_ROOT, 'db', 'schema.sql');

if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schemaSql);
}

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
// Close the database cleanly when the process receives a termination signal
// to avoid WAL checkpoint issues.
// ---------------------------------------------------------------------------
function shutdown() {
    try {
        db.close();
    } catch {
        // Database may already be closed — ignore.
    }
    process.exit(0);
}

process.on('SIGINT',  shutdown);
process.on('SIGTERM', shutdown);

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export default db;
