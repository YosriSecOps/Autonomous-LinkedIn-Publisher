// src/utils/imageConstraints.js
// Combines a base image idea with per-profile character & background constraints
// so every generated image for a profile looks visually consistent.

const STYLE_SUFFIX =
  'Maintain the exact same character design, dress, and styling as in all previous images. ' +
  'Professional LinkedIn post illustration style, high quality, photorealistic.';

/**
 * Build a fully-constrained image prompt.
 *
 * @param {string} basePrompt — the raw image idea produced during content generation
 * @param {object} profile    — profile row (needs character_description, background_setting)
 * @returns {string} enhanced prompt ready for the image-generation tool
 */
export function buildImagePrompt(basePrompt, profile = {}) {
  const parts = [basePrompt.trim()];

  const character = profile.character_description?.trim();
  const background = profile.background_setting?.trim();

  if (character) {
    parts.push(
      `The main character: ${character}.`,
      "The character's eyes, nose, and mouth must be clearly visible with natural facial expressions."
    );
  }

  if (background) {
    parts.push(`Background setting: ${background}.`);
  }

  parts.push(STYLE_SUFFIX);

  return parts.join(' ');
}
