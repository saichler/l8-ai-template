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
 * ERP Input Formatter - Type Definitions
 * Defines formatting rules for each field type (ssn, phone, currency, etc.)
 */
(function() {
    'use strict';

    const { utils, masks } = Layer8DInputFormatter;

    // ========================================
    // TYPE DEFINITIONS
    // ========================================

    const FORMATTER_TYPES = {

        // ----------------------------------------
        // SSN: XXX-XX-XXXX
        // ----------------------------------------
        ssn: {
            mask: '###-##-####',
            placeholder: '___-__-____',

            format(raw) {
                if (!raw) return '';
                const digits = utils.extractDigits(raw);
                return masks.applyMask(digits, this.mask);
            },

            parse(formatted) {
                return utils.extractDigits(formatted);
            },

            validate(raw) {
                const digits = utils.extractDigits(raw);
                const errors = [];

                if (digits.length === 0) {
                    return { valid: true, errors: [] }; // Empty is valid (required is separate)
                }

                if (digits.length !== 9) {
                    errors.push('SSN must be 9 digits');
                }

                // Check for invalid SSN patterns
                if (digits.length === 9) {
                    const area = digits.substring(0, 3);
                    const group = digits.substring(3, 5);
                    const serial = digits.substring(5, 9);

                    // Area number cannot be 000, 666, or 900-999
                    if (area === '000' || area === '666' || area.startsWith('9')) {
                        errors.push('Invalid SSN area number');
                    }
                    // Group number cannot be 00
                    if (group === '00') {
                        errors.push('Invalid SSN group number');
                    }
                    // Serial number cannot be 0000
                    if (serial === '0000') {
                        errors.push('Invalid SSN serial number');
                    }
                }

                return { valid: errors.length === 0, errors };
            },

            // For display in tables (masked for privacy)
            formatDisplay(value, masked = true) {
                const formatted = this.format(value);
                if (!formatted || !masked) return formatted;
                // Show only last 4 digits: XXX-XX-1234
                return '***-**-' + formatted.slice(-4);
            }
        },

        // ----------------------------------------
        // Phone: (XXX) XXX-XXXX
        // ----------------------------------------
        phone: {
            mask: '(###) ###-####',
            placeholder: '(___) ___-____',

            format(raw) {
                if (!raw) return '';
                const digits = utils.extractDigits(raw);
                return masks.applyMask(digits, this.mask);
            },

            parse(formatted) {
                return utils.extractDigits(formatted);
            },

            validate(raw) {
                const digits = utils.extractDigits(raw);
                const errors = [];

                if (digits.length === 0) {
                    return { valid: true, errors: [] };
                }

                if (digits.length !== 10) {
                    errors.push('Phone number must be 10 digits');
                }

                // Check for invalid area codes (cannot start with 0 or 1)
                if (digits.length >= 3) {
                    const areaCode = digits.substring(0, 3);
                    if (areaCode[0] === '0' || areaCode[0] === '1') {
                        errors.push('Invalid area code');
                    }
                }

                return { valid: errors.length === 0, errors };
            },

            formatDisplay(value) {
                return this.format(value);
            }
        },

        // ----------------------------------------
        // Currency: $X,XXX.XX (stored in cents)
        // ----------------------------------------
        currency: {
            symbol: '$',
            decimals: 2,

            format(cents, options = {}) {
                if (cents === null || cents === undefined || cents === '') return '';
                const { symbol = this.symbol, decimals = this.decimals } = options;

                // Convert cents to dollars
                const dollars = Number(cents) / Math.pow(10, decimals);
                if (isNaN(dollars)) return '';

                // Format with commas and decimals
                const formatted = utils.formatWithCommas(dollars, decimals);
                return symbol + formatted;
            },

            parse(formatted) {
                if (!formatted) return null;
                // Remove all non-numeric except decimal and minus
                const cleaned = formatted.replace(/[^0-9.\-]/g, '');
                const num = parseFloat(cleaned);
                if (isNaN(num)) return null;
                // Convert to cents
                return Math.round(num * Math.pow(10, this.decimals));
            },

            validate(cents, options = {}) {
                const errors = [];

                if (cents === null || cents === undefined || cents === '') {
                    return { valid: true, errors: [] };
                }

                const num = Number(cents);
                if (isNaN(num)) {
                    errors.push('Invalid currency value');
                }

                if (options.min !== undefined && num < options.min) {
                    errors.push(`Amount must be at least ${this.format(options.min)}`);
                }

                if (options.max !== undefined && num > options.max) {
                    errors.push(`Amount cannot exceed ${this.format(options.max)}`);
                }

                return { valid: errors.length === 0, errors };
            },

            formatDisplay(value, currencyCode) {
                return this.format(value, { symbol: currencyCode || this.symbol });
            }
        },

        // ----------------------------------------
        // Percentage: XX.XX%
        // ----------------------------------------
        percentage: {
            decimals: 2,

            format(value, options = {}) {
                if (value === null || value === undefined || value === '') return '';
                const { decimals = this.decimals } = options;

                const num = parseFloat(value);
                if (isNaN(num)) return '';

                return num.toFixed(decimals) + '%';
            },

            parse(formatted) {
                if (!formatted) return null;
                const cleaned = formatted.replace(/[^0-9.\-]/g, '');
                const num = parseFloat(cleaned);
                return isNaN(num) ? null : num;
            },

            validate(value, options = {}) {
                const errors = [];
                const { min = 0, max = 100 } = options;

                if (value === null || value === undefined || value === '') {
                    return { valid: true, errors: [] };
                }

                const num = parseFloat(value);
                if (isNaN(num)) {
                    errors.push('Invalid percentage value');
                    return { valid: false, errors };
                }

                if (num < min) {
                    errors.push(`Percentage must be at least ${min}%`);
                }

                if (num > max) {
                    errors.push(`Percentage cannot exceed ${max}%`);
                }

                return { valid: errors.length === 0, errors };
            },

            formatDisplay(value, decimals) {
                return this.format(value, { decimals: decimals || this.decimals });
            }
        },

        // ----------------------------------------
        // Bank Routing Number: 9 digits with ABA checksum
        // ----------------------------------------
        routingNumber: {
            mask: '#########',

            format(raw) {
                if (!raw) return '';
                return utils.extractDigits(raw).substring(0, 9);
            },

            parse(formatted) {
                return utils.extractDigits(formatted);
            },

            validate(raw) {
                const digits = utils.extractDigits(raw);
                const errors = [];

                if (digits.length === 0) {
                    return { valid: true, errors: [] };
                }

                if (digits.length !== 9) {
                    errors.push('Routing number must be 9 digits');
                    return { valid: false, errors };
                }

                // ABA checksum validation
                // Formula: 3(d1 + d4 + d7) + 7(d2 + d5 + d8) + (d3 + d6 + d9) mod 10 = 0
                const d = digits.split('').map(Number);
                const checksum = (
                    3 * (d[0] + d[3] + d[6]) +
                    7 * (d[1] + d[4] + d[7]) +
                    (d[2] + d[5] + d[8])
                ) % 10;

                if (checksum !== 0) {
                    errors.push('Invalid routing number checksum');
                }

                return { valid: errors.length === 0, errors };
            },

            formatDisplay(value) {
                return this.format(value);
            }
        },

        // ----------------------------------------
        // EIN (Tax ID): XX-XXXXXXX
        // ----------------------------------------
        ein: {
            mask: '##-#######',
            placeholder: '__-_______',

            format(raw) {
                if (!raw) return '';
                const digits = utils.extractDigits(raw);
                return masks.applyMask(digits, this.mask);
            },

            parse(formatted) {
                return utils.extractDigits(formatted);
            },

            validate(raw) {
                const digits = utils.extractDigits(raw);
                const errors = [];

                if (digits.length === 0) {
                    return { valid: true, errors: [] };
                }

                if (digits.length !== 9) {
                    errors.push('EIN must be 9 digits');
                }

                return { valid: errors.length === 0, errors };
            },

            formatDisplay(value) {
                return this.format(value);
            }
        },

        // ----------------------------------------
        // Email
        // ----------------------------------------
        email: {
            format(raw) {
                if (!raw) return '';
                // Lowercase email addresses
                return String(raw).toLowerCase().trim();
            },

            parse(formatted) {
                return formatted ? formatted.toLowerCase().trim() : '';
            },

            validate(value) {
                const errors = [];

                if (!value) {
                    return { valid: true, errors: [] };
                }

                if (!utils.isValidEmail(value)) {
                    errors.push('Invalid email format');
                }

                return { valid: errors.length === 0, errors };
            },

            formatDisplay(value) {
                return this.format(value);
            }
        },

        // ----------------------------------------
        // URL
        // ----------------------------------------
        url: {
            format(raw) {
                if (!raw) return '';
                let url = String(raw).trim();
                // Auto-add https:// if no protocol
                if (url && !url.match(/^https?:\/\//i)) {
                    url = 'https://' + url;
                }
                return url;
            },

            parse(formatted) {
                return formatted ? formatted.trim() : '';
            },

            validate(value) {
                const errors = [];

                if (!value) {
                    return { valid: true, errors: [] };
                }

                if (!utils.isValidUrl(value)) {
                    errors.push('Invalid URL format');
                }

                return { valid: errors.length === 0, errors };
            },

            formatDisplay(value) {
                return this.format(value);
            }
        },

        // ----------------------------------------
        // Color Code (Hex)
        // ----------------------------------------
        colorCode: {
            format(raw) {
                if (!raw) return '';
                let color = String(raw).trim().toUpperCase();
                // Ensure # prefix
                if (color && !color.startsWith('#')) {
                    color = '#' + color;
                }
                return color;
            },

            parse(formatted) {
                if (!formatted) return '';
                return formatted.replace('#', '').toUpperCase();
            },

            validate(value) {
                const errors = [];

                if (!value) {
                    return { valid: true, errors: [] };
                }

                if (!utils.isValidHexColor(value)) {
                    errors.push('Invalid hex color code');
                }

                return { valid: errors.length === 0, errors };
            },

            formatDisplay(value) {
                return this.format(value);
            }
        },

        // ----------------------------------------
        // Rating (1-5)
        // ----------------------------------------
        rating: {
            min: 1,
            max: 5,

            format(raw) {
                if (raw === null || raw === undefined || raw === '') return '';
                const num = parseInt(raw, 10);
                if (isNaN(num)) return '';
                return String(Math.min(Math.max(num, this.min), this.max));
            },

            parse(formatted) {
                const num = parseInt(formatted, 10);
                return isNaN(num) ? null : num;
            },

            validate(value, options = {}) {
                const errors = [];
                const min = options.min || this.min;
                const max = options.max || this.max;

                if (value === null || value === undefined || value === '') {
                    return { valid: true, errors: [] };
                }

                const num = parseInt(value, 10);
                if (isNaN(num)) {
                    errors.push('Invalid rating value');
                    return { valid: false, errors };
                }

                if (num < min || num > max) {
                    errors.push(`Rating must be between ${min} and ${max}`);
                }

                return { valid: errors.length === 0, errors };
            },

            formatDisplay(value) {
                return this.format(value);
            }
        },

        // ----------------------------------------
        // Hours (duration in HH:MM format)
        // ----------------------------------------
        hours: {
            format(raw) {
                if (raw === null || raw === undefined || raw === '') return '';

                // If raw is a number (minutes), convert to HH:MM
                if (typeof raw === 'number' || !isNaN(raw)) {
                    const totalMinutes = parseInt(raw, 10);
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    return `${hours}:${String(minutes).padStart(2, '0')}`;
                }

                // If raw is already HH:MM format
                return raw;
            },

            parse(formatted) {
                if (!formatted) return null;

                // Parse HH:MM to minutes
                const match = formatted.match(/^(\d+):(\d{2})$/);
                if (match) {
                    const hours = parseInt(match[1], 10);
                    const minutes = parseInt(match[2], 10);
                    return hours * 60 + minutes;
                }

                // If just a number, treat as hours
                const num = parseFloat(formatted);
                return isNaN(num) ? null : Math.round(num * 60);
            },

            validate(value) {
                const errors = [];

                if (value === null || value === undefined || value === '') {
                    return { valid: true, errors: [] };
                }

                // Check HH:MM format
                if (typeof value === 'string' && value.includes(':')) {
                    const match = value.match(/^(\d+):(\d{2})$/);
                    if (!match) {
                        errors.push('Invalid time format (use HH:MM)');
                    } else {
                        const minutes = parseInt(match[2], 10);
                        if (minutes > 59) {
                            errors.push('Minutes must be 0-59');
                        }
                    }
                }

                return { valid: errors.length === 0, errors };
            },

            formatDisplay(value) {
                return this.format(value);
            }
        }
    };

    // ========================================
    // TYPE REGISTRY HELPERS
    // ========================================

    /**
     * Get a formatter type definition
     * @param {string} typeName
     * @returns {Object|null}
     */
    function getType(typeName) {
        return FORMATTER_TYPES[typeName] || null;
    }

    /**
     * Check if a formatter type exists
     * @param {string} typeName
     * @returns {boolean}
     */
    function hasType(typeName) {
        return typeName in FORMATTER_TYPES;
    }

    /**
     * Register a custom formatter type
     * @param {string} typeName
     * @param {Object} config
     */
    function registerType(typeName, config) {
        if (FORMATTER_TYPES[typeName]) {
            console.warn(`Overwriting existing formatter type: ${typeName}`);
        }
        FORMATTER_TYPES[typeName] = config;
    }

    /**
     * Get all available type names
     * @returns {string[]}
     */
    function getTypeNames() {
        return Object.keys(FORMATTER_TYPES);
    }

    // ========================================
    // EXPORT
    // ========================================

    Layer8DInputFormatter.types = FORMATTER_TYPES;
    Layer8DInputFormatter.getType = getType;
    Layer8DInputFormatter.hasType = hasType;
    Layer8DInputFormatter.registerType = registerType;
    Layer8DInputFormatter.getTypeNames = getTypeNames;

})();
