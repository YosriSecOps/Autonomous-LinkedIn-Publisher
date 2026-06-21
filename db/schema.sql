CREATE TABLE IF NOT EXISTS Profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_chat_id TEXT UNIQUE,
    name TEXT,
    theme TEXT,
    tone TEXT,
    character_description TEXT,
    background_setting TEXT,
    linkedin_email TEXT,
    linkedin_password TEXT,
    posting_schedule TEXT DEFAULT '0 9 * * 1-5',
    onboarding_state TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Post_History (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL REFERENCES Profiles(id),
    topic TEXT NOT NULL,
    post_text TEXT NOT NULL,
    image_prompt TEXT,
    image_path TEXT,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft','approved','rejected','published')),
    linkedin_post_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME
);

CREATE TABLE IF NOT EXISTS Pending_Requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL REFERENCES Profiles(id),
    source_content TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','processing','completed','failed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
