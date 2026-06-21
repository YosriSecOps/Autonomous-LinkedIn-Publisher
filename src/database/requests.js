import db from './connection.js';

export function insertRequest(profileId, sourceContent) {
    const stmt = db.prepare(`
        INSERT INTO Pending_Requests (profile_id, source_content, status)
        VALUES (@profileId, @sourceContent, 'waiting_image_choice')
    `);
    const info = stmt.run({ profileId, sourceContent });
    return info.lastInsertRowid;
}

export function setImageChoice(requestId, includeImage) {
    const stmt = db.prepare(`UPDATE Pending_Requests SET include_image = ?, status = 'pending' WHERE id = ?`);
    stmt.run(includeImage ? 1 : 0, requestId);
    return true;
}

export function getPendingRequests() {
    // Only get requests that are fully ready (user already chose image preference)
    const stmt = db.prepare(`
        SELECT r.*, p.telegram_chat_id, p.theme, p.tone, p.character_description, p.background_setting 
        FROM Pending_Requests r
        JOIN Profiles p ON r.profile_id = p.id
        WHERE r.status = 'pending'
        ORDER BY r.created_at ASC
    `);
    return stmt.all();
}

export function updateRequestStatus(requestId, status) {
    const stmt = db.prepare(`UPDATE Pending_Requests SET status = ? WHERE id = ?`);
    stmt.run(status, requestId);
    return true;
}
