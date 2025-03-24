// js/utils.js
/**
 * Utility functions for linear regression explainer
 */

/**
 * Format numbers to a specified number of decimal places
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted number as string
 */
function formatNumber(value, decimals = 2) {
    return value.toFixed(decimals);
}

/**
 * Clamp a value between a minimum and maximum
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} - The clamped value
 */
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

/**
 * Generate a random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random number in the range
 */
function randomInRange(min, max) {
    return min + Math.random() * (max - min);
}