// src/utils/logger.js
// Simple structured console logger — zero external dependencies

const LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Returns the numeric threshold for the current LOG_LEVEL env var.
 * Defaults to 'info' if unset or unrecognised.
 */
function currentThreshold() {
  const envLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();
  return LEVELS[envLevel] ?? LEVELS.info;
}

/**
 * Format a log line:
 *   [2026-06-20T16:45:08.123Z] [INFO] [component] Some message {"extra":"data"}
 */
function formatLine(level, component, message, data) {
  const timestamp = new Date().toISOString();
  const tag = level.toUpperCase().padEnd(5);
  let line = `[${timestamp}] [${tag}] [${component}] ${message}`;
  if (data !== undefined && data !== null) {
    line += ` ${JSON.stringify(data)}`;
  }
  return line;
}

/**
 * Create a logger scoped to a specific component name.
 *
 * @param {string} component — logical module name (e.g. "telegram-bot", "db")
 * @returns {{ debug: Function, info: Function, warn: Function, error: Function }}
 *
 * Usage:
 *   const log = createLogger('my-module');
 *   log.info('Server started', { port: 3000 });
 */
export function createLogger(component) {
  function log(level, message, data) {
    if (LEVELS[level] < currentThreshold()) return;

    const line = formatLine(level, component, message, data);

    switch (level) {
      case 'error':
        console.error(line);
        break;
      case 'warn':
        console.warn(line);
        break;
      case 'debug':
        console.debug(line);
        break;
      default:
        console.log(line);
    }
  }

  return {
    debug: (message, data) => log('debug', message, data),
    info: (message, data) => log('info', message, data),
    warn: (message, data) => log('warn', message, data),
    error: (message, data) => log('error', message, data),
  };
}
