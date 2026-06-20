/**
 * LinkedIn DOM Selectors
 * =======================
 * Centralized selector definitions for LinkedIn's web interface.
 * These target the 2025-2026 LinkedIn UI. Selectors are ordered by
 * preference: aria-labels & data attributes > semantic roles > class names.
 *
 * ⚠️  LinkedIn updates its DOM frequently. If automation breaks, check
 *     these selectors first. Use the browser DevTools to verify them.
 */

export const SELECTORS = {
  // ---------------------------------------------------------------------------
  // Login Page  (https://www.linkedin.com/login)
  // ---------------------------------------------------------------------------
  loginEmail: '#username', // Email / phone input
  loginPassword: '#password', // Password input
  loginSubmit: 'button[type="submit"]', // "Sign in" button

  // ---------------------------------------------------------------------------
  // Feed Page – Start a Post
  // ---------------------------------------------------------------------------
  // The "Start a post" trigger button on the feed. Multiple selectors for
  // resilience: LinkedIn sometimes changes the class but keeps the role/aria.
  startPostButton: [
    'button.share-box-feed-entry__trigger',
    'button[aria-label="Create a post"]',
    'button.artdeco-button--tertiary.share-box-feed-entry__trigger',
  ].join(', '),

  // ---------------------------------------------------------------------------
  // Post Creation Modal
  // ---------------------------------------------------------------------------

  // The rich-text editor inside the post creation modal.
  // LinkedIn uses Quill.js; the editor div carries a ql-editor class.
  postTextArea: [
    'div.ql-editor[data-placeholder="What do you want to talk about?"]',
    'div.ql-editor[role="textbox"]',
    'div[role="textbox"][contenteditable="true"]',
  ].join(', '),

  // "Add media" button (image / video / document) inside the modal toolbar
  addImageButton: [
    'button[aria-label="Add media"]',
    'button[aria-label="Add a photo"]',
    'button[aria-label="Add media, image"]',
    'button.image-sharing-detour-button',
  ].join(', '),

  // Hidden file input that appears after clicking "Add media".
  // We set files on this programmatically via Playwright's setInputFiles.
  imageFileInput: [
    'input[type="file"][accept^="image"]',
    'input[type="file"][accept*="image/"]',
    'input.image-sharing-detour-input',
  ].join(', '),

  // The image preview/thumbnail that confirms a successful upload
  imagePreview: [
    'div.image-sharing-detour-container img',
    'div.sharing-shared-image img',
    'img[data-test-sharing-image]',
  ].join(', '),

  // "Post" / submit button at the bottom-right of the modal
  postSubmitButton: [
    'button.share-actions__primary-action',
    'button[aria-label="Post"]',
    'button.share-actions__primary-action.artdeco-button--primary',
  ].join(', '),

  // ---------------------------------------------------------------------------
  // Post Success Verification
  // ---------------------------------------------------------------------------
  // Container for an individual post in the feed – used to verify publishing
  feedPostContainer: 'div.feed-shared-update-v2',

  // ---------------------------------------------------------------------------
  // Navigation / URLs
  // ---------------------------------------------------------------------------
  feedUrl: 'https://www.linkedin.com/feed/',
  loginUrl: 'https://www.linkedin.com/login',

  // ---------------------------------------------------------------------------
  // Session Check
  // ---------------------------------------------------------------------------
  // The global navigation bar – its presence means the user is logged in
  navBar: [
    'nav.global-nav',
    'nav[role="navigation"]',
    '#global-nav',
  ].join(', '),
};
