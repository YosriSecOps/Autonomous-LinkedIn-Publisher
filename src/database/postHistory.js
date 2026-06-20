// ============================================================================
// Post_History — Data Access Layer
// ============================================================================
// Provides helpers for managing the lifecycle of LinkedIn post drafts:
// creation, status transitions, and querying.
// ============================================================================

import db from './connection.js';

// ---------------------------------------------------------------------------
// Prepared statements (compiled once, reused on every call)
// ---------------------------------------------------------------------------
const stmtRecentTopics = db.prepare(`
    SELECT topic
    FROM   Post_History
    WHERE  profile_id = ?
    ORDER  BY created_at DESC
    LIMIT  ?
`);

const stmtInsertDraft = db.prepare(`
    INSERT INTO Post_History (profile_id, topic, post_text, image_prompt, image_path, status)
    VALUES (?, ?, ?, ?, ?, 'draft')
`);

const stmtUpdateStatus = db.prepare(`
    UPDATE Post_History
    SET    status = ?
    WHERE  id = ?
`);

const stmtMarkPublished = db.prepare(`
    UPDATE Post_History
    SET    status            = 'published',
           linkedin_post_url = ?,
           published_at      = CURRENT_TIMESTAMP
    WHERE  id = ?
`);

const stmtGetById = db.prepare('SELECT * FROM Post_History WHERE id = ?');

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Retrieve the most recent topics for a given profile.
 * Useful for avoiding duplicate or repetitive content generation.
 *
 * @param {number} profileId  The profile to query.
 * @param {number} [limit=20] Maximum number of topics to return.
 * @returns {string[]} Array of topic strings, newest first.
 */
export function getRecentTopics(profileId, limit = 20) {
    const rows = stmtRecentTopics.all(profileId, limit);
    return rows.map((r) => r.topic);
}

/**
 * Insert a new post draft and return its ID.
 *
 * @param {number} profileId   Owning profile ID.
 * @param {string} topic       The topic / headline.
 * @param {string} postText    Full post body text.
 * @param {string|null} imagePrompt  Prompt used to generate the image.
 * @param {string|null} imagePath    Local path to the generated image.
 * @returns {number} The newly inserted row ID.
 */
export function insertDraft(profileId, topic, postText, imagePrompt = null, imagePath = null) {
    const info = stmtInsertDraft.run(profileId, topic, postText, imagePrompt, imagePath);
    return info.lastInsertRowid;
}

/**
 * Transition a post to a new status.
 *
 * @param {number} postId  Post primary key.
 * @param {string} status  One of: draft, approved, rejected, published.
 */
export function updateStatus(postId, status) {
    stmtUpdateStatus.run(status, postId);
}

/**
 * Mark a post as published, recording the LinkedIn URL and timestamp.
 *
 * @param {number} postId  Post primary key.
 * @param {string} url     The live LinkedIn post URL.
 */
export function markPublished(postId, url) {
    stmtMarkPublished.run(url, postId);
}

/**
 * Fetch a single post by its primary key.
 *
 * @param {number} postId  Post primary key.
 * @returns {object|undefined} The post row, or undefined if not found.
 */
export function getPostById(postId) {
    return stmtGetById.get(postId);
}
