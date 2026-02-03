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
 * Layer8MForms Field Renderers
 * Desktop Equivalent: shared/erp-forms.js (field generation part)
 *
 * Contains all field rendering functions.
 * Core form handling is in mobile-forms.js
 */
(function() {
    'use strict';

    /**
     * Determine the appropriate zero-value label for a date field
     * Desktop Equivalent: erp-forms.js getDateZeroLabel()
     * @param {string} fieldKey - The field key (e.g., 'endDate', 'effectiveDate')
     * @returns {string} - 'N/A' for end/expiration dates, 'Current' for others
     */
    function getDateZeroLabel(fieldKey) {
        const lowerKey = (fieldKey || '').toLowerCase();
        // Fields that represent "no end" or "no expiration" should show "N/A"
        if (lowerKey.includes('end') || lowerKey.includes('expir') || lowerKey.includes('termination')) {
            return 'N/A';
        }
        // Other date fields (effective, start, etc.) show "Current"
        return 'Current';
    }

    window.Layer8MFormFields = {
        renderTextField(config, value, readonly) {
            const inputType = config.type || 'text';
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';
            const placeholder = config.placeholder || '';

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <input type="${inputType}"
                           name="${config.key}"
                           value="${Layer8MUtils.escapeAttr(value || '')}"
                           placeholder="${Layer8MUtils.escapeAttr(placeholder)}"
                           class="mobile-form-input"
                           ${requiredAttr}
                           ${readonlyAttr}>
                </div>
            `;
        },

        renderNumberField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';
            const min = config.min !== undefined ? `min="${config.min}"` : '';
            const max = config.max !== undefined ? `max="${config.max}"` : '';
            const step = config.step !== undefined ? `step="${config.step}"` : '';

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <input type="number"
                           name="${config.key}"
                           value="${value || ''}"
                           class="mobile-form-input"
                           ${min} ${max} ${step}
                           ${requiredAttr}
                           ${readonlyAttr}>
                </div>
            `;
        },

        renderTextareaField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';
            const rows = config.rows || 3;

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <textarea name="${config.key}"
                              class="mobile-form-textarea"
                              rows="${rows}"
                              ${requiredAttr}
                              ${readonlyAttr}>${Layer8MUtils.escapeHtml(value || '')}</textarea>
                </div>
            `;
        },

        renderDateField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';
            const zeroLabel = getDateZeroLabel(config.key);

            // Handle zero/null/undefined values - show "Current" or "N/A" (matches desktop)
            const isZeroOrMissing = value === 0 || value === null || value === undefined;

            // Convert timestamp to date string
            let dateValue = '';
            let displayValue = '';
            let isZeroAttr = '';

            if (isZeroOrMissing) {
                // For zero values, we use a text display but store that it's a zero value
                displayValue = zeroLabel;
                isZeroAttr = 'data-is-zero="true"';
            } else if (value) {
                const date = new Date(value * 1000);
                dateValue = date.toISOString().split('T')[0];
                displayValue = dateValue;
            }

            // Use text input for readonly to show "Current"/"N/A", date input for editing
            if (readonly || isZeroOrMissing) {
                return `
                    <div class="mobile-form-field">
                        <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                        <input type="${readonly ? 'text' : 'date'}"
                               name="${config.key}"
                               value="${Layer8MUtils.escapeAttr(displayValue)}"
                               data-zero-label="${Layer8MUtils.escapeAttr(zeroLabel)}"
                               ${isZeroAttr}
                               class="mobile-form-input"
                               ${requiredAttr}
                               ${readonly ? 'readonly disabled' : ''}>
                    </div>
                `;
            }

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <input type="date"
                           name="${config.key}"
                           value="${dateValue}"
                           data-zero-label="${Layer8MUtils.escapeAttr(zeroLabel)}"
                           class="mobile-form-input"
                           ${requiredAttr}
                           ${readonlyAttr}>
                </div>
            `;
        },

        renderSelectField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const disabledAttr = readonly ? 'disabled' : '';
            const options = config.options || {};

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <select name="${config.key}"
                            class="mobile-form-select"
                            ${requiredAttr}
                            ${disabledAttr}>
                        <option value="">Select...</option>
                        ${Object.entries(options).map(([optValue, optLabel]) => `
                            <option value="${Layer8MUtils.escapeAttr(optValue)}" ${String(value) === String(optValue) ? 'selected' : ''}>
                                ${Layer8MUtils.escapeHtml(optLabel)}
                            </option>
                        `).join('')}
                    </select>
                </div>
            `;
        },

        renderCheckboxField(config, value, readonly) {
            const disabledAttr = readonly ? 'disabled' : '';
            const checkedAttr = value ? 'checked' : '';

            return `
                <div class="mobile-form-field mobile-form-field-checkbox">
                    <label class="mobile-form-checkbox-label">
                        <input type="checkbox"
                               name="${config.key}"
                               value="1"
                               class="mobile-form-checkbox"
                               ${checkedAttr}
                               ${disabledAttr}>
                        <span class="mobile-form-checkbox-text">${Layer8MUtils.escapeHtml(config.label)}</span>
                    </label>
                </div>
            `;
        },

        renderCurrencyField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';
            const displayValue = value ? (value / 100).toFixed(2) : '';

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <div class="mobile-form-input-group">
                        <span class="mobile-form-input-prefix">$</span>
                        <input type="number"
                               name="${config.key}"
                               value="${displayValue}"
                               step="0.01"
                               min="0"
                               class="mobile-form-input with-prefix"
                               data-format="currency"
                               ${requiredAttr}
                               ${readonlyAttr}>
                    </div>
                </div>
            `;
        },

        renderPercentageField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';
            const displayValue = value ? (value * 100).toFixed(2) : '';

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <div class="mobile-form-input-group">
                        <input type="number"
                               name="${config.key}"
                               value="${displayValue}"
                               step="0.01"
                               min="0"
                               max="100"
                               class="mobile-form-input with-suffix"
                               data-format="percentage"
                               ${requiredAttr}
                               ${readonlyAttr}>
                        <span class="mobile-form-input-suffix">%</span>
                    </div>
                </div>
            `;
        },

        renderPhoneField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <input type="tel"
                           name="${config.key}"
                           value="${Layer8MUtils.escapeAttr(value || '')}"
                           placeholder="(555) 555-5555"
                           class="mobile-form-input"
                           data-format="phone"
                           ${requiredAttr}
                           ${readonlyAttr}>
                </div>
            `;
        },

        renderSSNField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';
            const displayValue = readonly && value ? Layer8MUtils.formatSSN(value) : (value || '');

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <input type="${readonly ? 'text' : 'password'}"
                           name="${config.key}"
                           value="${Layer8MUtils.escapeAttr(displayValue)}"
                           placeholder="XXX-XX-XXXX"
                           class="mobile-form-input"
                           data-format="ssn"
                           maxlength="11"
                           ${requiredAttr}
                           ${readonlyAttr}>
                </div>
            `;
        },

        renderUrlField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <input type="url"
                           name="${config.key}"
                           value="${Layer8MUtils.escapeAttr(value || '')}"
                           placeholder="https://..."
                           class="mobile-form-input"
                           data-format="url"
                           ${requiredAttr}
                           ${readonlyAttr}>
                </div>
            `;
        },

        renderRatingField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';
            const min = config.min || 1;
            const max = config.max || 5;

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <input type="number"
                           name="${config.key}"
                           value="${value || ''}"
                           min="${min}"
                           max="${max}"
                           class="mobile-form-input"
                           data-format="rating"
                           ${requiredAttr}
                           ${readonlyAttr}>
                </div>
            `;
        },

        renderHoursField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';
            let displayValue = '';
            if (value) {
                const hours = Math.floor(value / 60);
                const mins = value % 60;
                displayValue = `${hours}:${mins.toString().padStart(2, '0')}`;
            }

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <input type="text"
                           name="${config.key}"
                           value="${Layer8MUtils.escapeAttr(displayValue)}"
                           placeholder="HH:MM"
                           class="mobile-form-input"
                           data-format="hours"
                           ${requiredAttr}
                           ${readonlyAttr}>
                </div>
            `;
        },

        renderEinField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <input type="text"
                           name="${config.key}"
                           value="${Layer8MUtils.escapeAttr(value || '')}"
                           placeholder="XX-XXXXXXX"
                           class="mobile-form-input"
                           data-format="ein"
                           maxlength="10"
                           ${requiredAttr}
                           ${readonlyAttr}>
                </div>
            `;
        },

        renderRoutingNumberField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <input type="text"
                           name="${config.key}"
                           value="${Layer8MUtils.escapeAttr(value || '')}"
                           placeholder="9-digit routing number"
                           class="mobile-form-input"
                           data-format="routingNumber"
                           maxlength="9"
                           ${requiredAttr}
                           ${readonlyAttr}>
                </div>
            `;
        },

        renderColorCodeField(config, value, readonly) {
            const requiredAttr = config.required ? 'required' : '';
            const readonlyAttr = readonly ? 'readonly' : '';
            const colorValue = value || '#000000';

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <div class="mobile-form-input-group">
                        <input type="color"
                               name="${config.key}"
                               value="${Layer8MUtils.escapeAttr(colorValue)}"
                               class="mobile-form-color-input"
                               data-format="colorCode"
                               ${requiredAttr}
                               ${readonlyAttr}>
                        <input type="text"
                               value="${Layer8MUtils.escapeAttr(colorValue)}"
                               class="mobile-form-input color-text-input"
                               placeholder="#RRGGBB"
                               maxlength="7"
                               ${readonlyAttr}>
                    </div>
                </div>
            `;
        },

        /**
         * Render reference field - MATCHES DESKTOP erp-forms.js EXACTLY
         */
        renderReferenceField(config, value, readonly) {
            const refId = value?.id || value || '';
            let displayValue = value?.display || '';

            // Build reference config from Layer8MReferenceRegistry
            let refConfig = config.referenceConfig || {};
            if (config.lookupModel && window.Layer8MReferenceRegistry) {
                const registryConfig = Layer8MReferenceRegistry.get(config.lookupModel);
                if (registryConfig) {
                    refConfig = {
                        modelName: config.lookupModel,
                        idColumn: registryConfig.idColumn,
                        displayColumn: registryConfig.displayColumn,
                        selectColumns: registryConfig.selectColumns,
                        displayLabel: registryConfig.displayLabel,
                        ...config.referenceConfig,
                        title: config.referenceConfig?.title || `Select ${config.label}`
                    };
                }
            }

            const serializableConfig = {
                modelName: refConfig.modelName || config.lookupModel,
                idColumn: refConfig.idColumn,
                displayColumn: refConfig.displayColumn,
                selectColumns: refConfig.selectColumns,
                baseWhereClause: refConfig.baseWhereClause,
                title: refConfig.title,
                displayLabel: refConfig.displayLabel,
                placeholder: refConfig.placeholder
            };

            if (refId && !displayValue) {
                displayValue = `ID: ${refId}`;
            }

            const requiredAttr = config.required ? 'required' : '';

            if (readonly) {
                return `
                    <div class="mobile-form-field">
                        <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}</label>
                        <input type="text"
                               name="${config.key}"
                               value="${Layer8MUtils.escapeAttr(displayValue || 'N/A')}"
                               data-ref-id="${Layer8MUtils.escapeAttr(String(refId))}"
                               class="mobile-form-input reference-input"
                               readonly
                               disabled>
                    </div>
                `;
            }

            return `
                <div class="mobile-form-field">
                    <label class="mobile-form-label">${Layer8MUtils.escapeHtml(config.label)}${config.required ? ' *' : ''}</label>
                    <input type="text"
                           id="field-${config.key}"
                           name="${config.key}"
                           value="${Layer8MUtils.escapeAttr(displayValue)}"
                           data-ref-id="${Layer8MUtils.escapeAttr(String(refId))}"
                           data-ref-config='${Layer8MUtils.escapeAttr(JSON.stringify(serializableConfig))}'
                           data-field-key="${Layer8MUtils.escapeAttr(config.key)}"
                           data-lookup-model="${Layer8MUtils.escapeAttr(config.lookupModel || refConfig.modelName || '')}"
                           class="mobile-form-input reference-input"
                           ${requiredAttr}
                           readonly
                           placeholder="Click to select...">
                </div>
            `;
        }
    };

})();
