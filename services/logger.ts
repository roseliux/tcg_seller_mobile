const isDev = __DEV__;

// Manual override for testing production behavior
// Set to false to test production logging (no logs)
// Set to true to force logging even in production
const FORCE_LOGGING = false;

const shouldLog = isDev || FORCE_LOGGING

// Test to verify logger is loaded with correct settings
// console.log('🔧 Logger initialized - shouldLog:', shouldLog, '__DEV__:', isDev);

export const logger = {
  log: (...args: any[]) => {
    if (shouldLog) console.log(...args);
  },
  info: (...args: any[]) => {
    if (shouldLog) console.info(...args);
  },
  warn: (...args: any[]) => {
    if (shouldLog) console.warn(...args);
  },
  error: (...args: any[]) => {
    if (shouldLog) console.error(...args);
  },
};