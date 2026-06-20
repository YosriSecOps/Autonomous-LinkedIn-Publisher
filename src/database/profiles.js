import db from './connection.js';

export function getActiveProfiles() {
    const stmt = db.prepare('SELECT * FROM Profiles WHERE is_active = 1 AND linkedin_email IS NOT NULL');
    return stmt.all();
}

export function getProfileById(id) {
    const stmt = db.prepare('SELECT * FROM Profiles WHERE id = ?');
    return stmt.get(id);
}

export function getProfileByChatId(chatId) {
    const stmt = db.prepare('SELECT * FROM Profiles WHERE telegram_chat_id = ?');
    return stmt.get(chatId);
}

export function createProfile(data) {
    const stmt = db.prepare(`
        INSERT INTO Profiles (
            telegram_chat_id, name, theme, tone, character_description, 
            background_setting, linkedin_email, linkedin_password, onboarding_state
        ) VALUES (
            @telegram_chat_id, @name, @theme, @tone, @character_description, 
            @background_setting, @linkedin_email, @linkedin_password, @onboarding_state
        )
    `);
    const info = stmt.run(data);
    return info.lastInsertRowid;
}

export function upsertProfileByChatId(chatId, defaults = {}) {
    let profile = getProfileByChatId(chatId);
    if (!profile) {
        const insertData = {
            telegram_chat_id: chatId,
            name: defaults.name || null,
            theme: defaults.theme || null,
            tone: defaults.tone || null,
            character_description: defaults.character_description || null,
            background_setting: defaults.background_setting || null,
            linkedin_email: defaults.linkedin_email || null,
            linkedin_password: defaults.linkedin_password || null,
            onboarding_state: defaults.onboarding_state || 'new'
        };
        const newId = createProfile(insertData);
        profile = getProfileById(newId);
    }
    return profile;
}

export function updateProfileField(chatId, field, value) {
    // Basic protection against SQL injection by explicitly checking allowed fields
    const allowedFields = [
        'name', 'theme', 'tone', 'character_description', 
        'background_setting', 'linkedin_email', 'linkedin_password', 
        'onboarding_state', 'is_active'
    ];
    
    if (!allowedFields.includes(field)) {
        throw new Error(`Invalid field: ${field}`);
    }

    const stmt = db.prepare(`UPDATE Profiles SET ${field} = ? WHERE telegram_chat_id = ?`);
    stmt.run(value, chatId);
    return true;
}
