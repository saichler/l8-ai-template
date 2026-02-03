/*
© 2025 Sharon Aicler (saichler@gmail.com)

Layer 8 Ecosystem is licensed under the Apache License, Version 2.0.
You may obtain a copy of the License at:

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/**
 * ERP Shared Utilities
 * Common utility functions used across all ERP modules
 */
(function() {
    'use strict';

    // ========================================
    // HTML ESCAPING
    // ========================================

    function escapeHtml(text) {
        if (text === null || text === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    function escapeAttr(text) {
        if (text === null || text === undefined) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // ========================================
    // DATE FORMATTING
    // ========================================

    // Month name abbreviations for dd-mmm-yyyy format
    const MONTH_ABBREVS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    /**
     * Get the configured date format from Layer8DConfig
     * @returns {string}
     */
    function getConfiguredDateFormat() {
        if (typeof Layer8DConfig !== 'undefined' && Layer8DConfig.getDateFormat) {
            return Layer8DConfig.getDateFormat();
        }
        return 'mm/dd/yyyy'; // Default fallback
    }

    /**
     * Pad a number with leading zero if needed
     * @param {number} num
     * @returns {string}
     */
    function padZero(num) {
        return num < 10 ? '0' + num : String(num);
    }

    /**
     * Format a date according to the configured format
     * @param {number} timestamp - Unix timestamp in seconds (0 means "current/n/a")
     * @param {Object} options - Optional settings
     * @param {string} options.zeroLabel - Label to show when timestamp is 0 (default: 'Current')
     * @returns {string}
     */
    function formatDate(timestamp, options = {}) {
        if (timestamp === null || timestamp === undefined) return '-';

        // 0 means "current" or "n/a" depending on context
        if (timestamp === 0) {
            return options.zeroLabel || 'Current';
        }

        const date = new Date(timestamp * 1000);
        const format = getConfiguredDateFormat();
        const day = date.getDate();
        const month = date.getMonth(); // 0-indexed
        const year = date.getFullYear();

        switch (format) {
            case 'dd/mm/yyyy':
                return `${padZero(day)}/${padZero(month + 1)}/${year}`;
            case 'yyyy-mm-dd':
                return `${year}-${padZero(month + 1)}-${padZero(day)}`;
            case 'dd-mmm-yyyy':
                return `${padZero(day)}-${MONTH_ABBREVS[month]}-${year}`;
            case 'mm/dd/yyyy':
            default:
                return `${padZero(month + 1)}/${padZero(day)}/${year}`;
        }
    }

    /**
     * Format a date and time according to the configured format
     * @param {number} timestamp - Unix timestamp in seconds (0 means "current/n/a")
     * @param {Object} options - Optional settings
     * @param {string} options.zeroLabel - Label to show when timestamp is 0 (default: 'Current')
     * @returns {string}
     */
    function formatDateTime(timestamp, options = {}) {
        if (timestamp === null || timestamp === undefined) return '-';

        // 0 means "current" or "n/a" depending on context
        if (timestamp === 0) {
            return options.zeroLabel || 'Current';
        }

        const date = new Date(timestamp * 1000);
        const dateStr = formatDate(timestamp, options);
        const hours = date.getHours();
        const minutes = padZero(date.getMinutes());
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;

        return `${dateStr} ${hours12}:${minutes} ${ampm}`;
    }

    /**
     * Format a timestamp for input field display (using configured format)
     * @param {number} timestamp - Unix timestamp in seconds (0 means "current/n/a")
     * @param {Object} options - Optional settings
     * @param {string} options.zeroLabel - Label to show when timestamp is 0 (default: 'Current')
     * @returns {string}
     */
    function formatDateForInput(timestamp, options = {}) {
        if (timestamp === null || timestamp === undefined) return '';

        // 0 means "current" or "n/a" depending on context
        if (timestamp === 0) {
            return options.zeroLabel || 'Current';
        }

        return formatDate(timestamp, options).replace(/-/g, (m, i) => {
            // Keep the format consistent
            const format = getConfiguredDateFormat();
            if (format === 'yyyy-mm-dd') return '-';
            if (format === 'dd-mmm-yyyy') return '-';
            return '/';
        });
    }

    /**
     * Parse a date string in the configured format to timestamp
     * @param {string} dateString
     * @returns {number|null} Unix timestamp in seconds, or null if invalid
     */
    function parseDateToTimestamp(dateString) {
        if (!dateString) return null;

        const format = getConfiguredDateFormat();
        let day, month, year;

        try {
            switch (format) {
                case 'dd/mm/yyyy': {
                    const parts = dateString.split('/');
                    if (parts.length !== 3) return null;
                    day = parseInt(parts[0], 10);
                    month = parseInt(parts[1], 10) - 1;
                    year = parseInt(parts[2], 10);
                    break;
                }
                case 'yyyy-mm-dd': {
                    const parts = dateString.split('-');
                    if (parts.length !== 3) return null;
                    year = parseInt(parts[0], 10);
                    month = parseInt(parts[1], 10) - 1;
                    day = parseInt(parts[2], 10);
                    break;
                }
                case 'dd-mmm-yyyy': {
                    const parts = dateString.split('-');
                    if (parts.length !== 3) return null;
                    day = parseInt(parts[0], 10);
                    const monthStr = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
                    month = MONTH_ABBREVS.indexOf(monthStr);
                    if (month === -1) return null;
                    year = parseInt(parts[2], 10);
                    break;
                }
                case 'mm/dd/yyyy':
                default: {
                    const parts = dateString.split('/');
                    if (parts.length !== 3) return null;
                    month = parseInt(parts[0], 10) - 1;
                    day = parseInt(parts[1], 10);
                    year = parseInt(parts[2], 10);
                    break;
                }
            }

            if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
            if (month < 0 || month > 11) return null;
            if (day < 1 || day > 31) return null;
            if (year < 1000 || year > 9999) return null;

            const date = new Date(year, month, day);
            // Validate the date is real (e.g., not Feb 31)
            if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
                return null;
            }

            return Math.floor(date.getTime() / 1000);
        } catch (e) {
            return null;
        }
    }

    /**
     * Get the placeholder text for date input based on configured format
     * @returns {string}
     */
    function getDateInputPlaceholder() {
        const format = getConfiguredDateFormat();
        switch (format) {
            case 'dd/mm/yyyy':
                return 'DD/MM/YYYY';
            case 'yyyy-mm-dd':
                return 'YYYY-MM-DD';
            case 'dd-mmm-yyyy':
                return 'DD-Mon-YYYY';
            case 'mm/dd/yyyy':
            default:
                return 'MM/DD/YYYY';
        }
    }

    /**
     * Validate if a date string matches the configured format
     * @param {string} dateString
     * @returns {boolean}
     */
    function isValidDateFormat(dateString) {
        return parseDateToTimestamp(dateString) !== null;
    }

    // ========================================
    // NUMBER FORMATTING
    // ========================================

    function formatMoney(value, currency = 'USD') {
        if (value === null || value === undefined) return '-';

        let amount;
        let currencyCode = currency;

        // Handle Money object { amount: cents, currencyCode: 'USD' }
        if (typeof value === 'object') {
            amount = value.amount !== undefined ? value.amount / 100 : 0;
            currencyCode = value.currencyCode || currency;
        } else {
            // Assume value is in cents
            amount = value / 100;
        }

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode
        }).format(amount);
    }

    function formatNumber(value, decimals = 0) {
        if (value === null || value === undefined) return '-';
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    }

    function formatPercentage(value, decimals = 2) {
        if (value === null || value === undefined) return '-';
        return `${Number(value).toFixed(decimals)}%`;
    }

    // ========================================
    // ENUM UTILITIES
    // ========================================

    /**
     * Find matching enum value from user input (case-insensitive partial match)
     * @param {string} input - User input to match
     * @param {object} enumValues - Object mapping string keys to enum values
     * @returns {*} Matched enum value or null if no match
     */
    function matchEnumValue(input, enumValues) {
        const normalizedInput = (input || '').toLowerCase().trim();
        if (!normalizedInput) return null;

        // Try exact match first
        if (enumValues[normalizedInput] !== undefined) {
            return enumValues[normalizedInput];
        }

        // Try partial match (input is prefix of enum key)
        for (const [key, value] of Object.entries(enumValues)) {
            if (key.startsWith(normalizedInput)) {
                return value;
            }
        }

        return null; // No match found
    }

    // ========================================
    // STRING FORMATTING
    // ========================================

    function formatLabel(key) {
        if (!key) return '';
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/Id$/, ' ID')
            .replace(/_/g, ' ')
            .trim();
    }

    function truncate(text, maxLength = 50) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    // ========================================
    // EXPORT
    // ========================================

    window.Layer8DUtils = {
        // HTML
        escapeHtml,
        escapeAttr,

        // Dates
        formatDate,
        formatDateTime,
        formatDateForInput,
        parseDateToTimestamp,
        getDateInputPlaceholder,
        isValidDateFormat,
        getConfiguredDateFormat,

        // Numbers
        formatMoney,
        formatNumber,
        formatPercentage,

        // Strings
        formatLabel,
        truncate,

        // Enums
        matchEnumValue
    };

})();
