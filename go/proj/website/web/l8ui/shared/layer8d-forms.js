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
 * ERP Shared Form Handler
 * Generic form generation and handling for all ERP modules
 */
(function() {
    'use strict';

    const { escapeHtml, escapeAttr, formatDateForInput, parseDateToTimestamp } = Layer8DUtils;

    /**
     * Determine the appropriate zero-value label for a date field
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

    // ========================================
    // FORM GENERATION
    // ========================================

    function generateFormHtml(formDef, data = {}) {
        const sections = formDef.sections;
        let html = '<form id="layer8d-edit-form">';

        // Tabs header
        html += '<div class="probler-popup-tabs">';
        sections.forEach((section, idx) => {
            const activeClass = idx === 0 ? ' active' : '';
            html += `<div class="probler-popup-tab${activeClass}" data-tab="tab-${idx}">${escapeHtml(section.title)}</div>`;
        });
        html += '</div>';

        // Tab content
        html += '<div class="probler-popup-tab-content">';
        sections.forEach((section, idx) => {
            const activeClass = idx === 0 ? ' active' : '';
            html += `<div class="probler-popup-tab-pane${activeClass}" data-pane="tab-${idx}">`;
            html += '<div class="detail-grid"><div class="detail-section detail-full-width">';

            const fields = section.fields;
            for (let i = 0; i < fields.length; i += 2) {
                const field1 = fields[i];
                const field2 = fields[i + 1];

                if (field2) {
                    html += '<div class="form-row">';
                    html += generateFieldHtml(field1, data[field1.key]);
                    html += generateFieldHtml(field2, data[field2.key]);
                    html += '</div>';
                } else {
                    html += generateFieldHtml(field1, data[field1.key]);
                }
            }

            html += '</div></div></div>';
        });
        html += '</div></form>';

        return html;
    }

    // Formatted field types that use Layer8DInputFormatter
    const FORMATTED_TYPES = ['ssn', 'phone', 'currency', 'percentage', 'routingNumber', 'ein', 'email', 'url', 'colorCode', 'rating', 'hours'];

    function generateFieldHtml(field, value) {
        const required = field.required ? 'required' : '';
        const requiredMark = field.required ? ' <span style="color: var(--layer8d-error);">*</span>' : '';

        let inputHtml = '';

        switch (field.type) {
            case 'text':
                inputHtml = `<input type="text" id="field-${field.key}" name="${field.key}" value="${escapeAttr(value || '')}" ${required}>`;
                break;

            case 'number':
                inputHtml = `<input type="number" id="field-${field.key}" name="${field.key}" value="${escapeAttr(value || '')}" ${required}>`;
                break;

            // Formatted input types
            case 'ssn':
            case 'phone':
            case 'currency':
            case 'percentage':
            case 'routingNumber':
            case 'ein':
            case 'email':
            case 'url':
            case 'colorCode':
            case 'rating':
            case 'hours':
                inputHtml = generateFormattedInput(field, value);
                break;

            case 'date':
                const zeroLabel = getDateZeroLabel(field.key);
                // Treat missing/undefined/null/0 as "Current" or "N/A"
                const isZeroOrMissing = value === 0 || value === null || value === undefined;
                const dateValue = isZeroOrMissing
                    ? zeroLabel
                    : formatDateForInput(value, { zeroLabel });
                const datePlaceholder = typeof Layer8DUtils !== 'undefined' && Layer8DUtils.getDateInputPlaceholder
                    ? Layer8DUtils.getDateInputPlaceholder()
                    : 'MM/DD/YYYY';
                // Store original value and zero label in data attributes for datepicker
                inputHtml = `<div class="date-input-wrapper">
                    <input type="text" id="field-${field.key}" name="${field.key}" value="${escapeAttr(dateValue)}" ${required} placeholder="${datePlaceholder}" class="date-input" data-zero-label="${escapeAttr(zeroLabel)}" ${isZeroOrMissing ? 'data-is-zero="true"' : ''}>
                    <button type="button" class="date-picker-trigger" data-for="field-${field.key}" title="Open calendar">&#x1F4C5;</button>
                </div>`;
                break;

            case 'textarea':
                inputHtml = `<textarea id="field-${field.key}" name="${field.key}" rows="3" ${required}>${escapeHtml(value || '')}</textarea>`;
                break;

            case 'select':
                inputHtml = generateSelectHtml(field, value);
                break;

            case 'checkbox':
                const checked = value ? 'checked' : '';
                return `
                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" id="field-${field.key}" name="${field.key}" ${checked} style="width: auto;">
                            <span>${escapeHtml(field.label)}</span>
                        </label>
                    </div>
                `;

            case 'lookup':
                inputHtml = `<input type="text" id="field-${field.key}" name="${field.key}" value="${escapeAttr(value || '')}" ${required} placeholder="Enter ${field.lookupModel} ID">`;
                break;

            case 'reference':
                // Reference picker field - displays name but stores ID
                // When editing, value is just the ID - show it until picker loads display value
                const refId = value?.id || value || '';
                const displayValue = value?.display || (refId ? `ID: ${refId}` : '');

                // Build reference config - check registry first if lookupModel specified
                let refConfig = field.referenceConfig || {};
                if (field.lookupModel && typeof Layer8DReferenceRegistry !== 'undefined') {
                    const registryConfig = Layer8DReferenceRegistry[field.lookupModel];
                    if (registryConfig) {
                        // Merge: registry provides base, field.referenceConfig provides overrides
                        refConfig = {
                            modelName: field.lookupModel,
                            idColumn: registryConfig.idColumn,
                            displayColumn: registryConfig.displayColumn,
                            selectColumns: registryConfig.selectColumns,
                            displayLabel: registryConfig.displayLabel,
                            // Apply any field-specific overrides
                            ...field.referenceConfig,
                            // Default title from label if not specified
                            title: field.referenceConfig?.title || `Select ${field.label}`
                        };
                    }
                }

                // Store serializable config (without functions - displayFormat handled in attachReferencePickers)
                const serializableConfig = {
                    modelName: refConfig.modelName,
                    idColumn: refConfig.idColumn,
                    displayColumn: refConfig.displayColumn,
                    selectColumns: refConfig.selectColumns,
                    baseWhereClause: refConfig.baseWhereClause,
                    title: refConfig.title,
                    displayLabel: refConfig.displayLabel,
                    placeholder: refConfig.placeholder
                };
                inputHtml = `<input type="text" id="field-${field.key}" name="${field.key}"
                    value="${escapeAttr(displayValue)}"
                    data-ref-id="${escapeAttr(String(refId))}"
                    data-ref-config='${escapeAttr(JSON.stringify(serializableConfig))}'
                    data-field-key="${escapeAttr(field.key)}"
                    data-lookup-model="${escapeAttr(field.lookupModel || refConfig.modelName || '')}"
                    class="reference-input"
                    ${required}
                    readonly
                    placeholder="Click to select...">`;
                break;

            default:
                inputHtml = `<input type="text" id="field-${field.key}" name="${field.key}" value="${escapeAttr(value || '')}" ${required}>`;
        }

        return `
            <div class="form-group">
                <label for="field-${field.key}">${escapeHtml(field.label)}${requiredMark}</label>
                ${inputHtml}
            </div>
        `;
    }

    function generateSelectHtml(field, selectedValue) {
        let html = `<select id="field-${field.key}" name="${field.key}" ${field.required ? 'required' : ''}>`;
        html += '<option value="">-- Select --</option>';

        for (const [val, label] of Object.entries(field.options)) {
            const selected = String(selectedValue) === String(val) ? 'selected' : '';
            html += `<option value="${escapeAttr(val)}" ${selected}>${escapeHtml(label)}</option>`;
        }

        html += '</select>';
        return html;
    }

    /**
     * Generate HTML for formatted input fields (SSN, phone, currency, etc.)
     * @param {Object} field - Field definition
     * @param {*} value - Current value
     * @returns {string} - HTML string
     */
    function generateFormattedInput(field, value) {
        const type = field.type;
        const required = field.required ? 'required' : '';

        // Build data attributes for formatter options
        let dataAttrs = `data-format="${escapeAttr(type)}"`;

        // Add type-specific options
        if (field.min !== undefined) {
            dataAttrs += ` data-format-min="${escapeAttr(String(field.min))}"`;
        }
        if (field.max !== undefined) {
            dataAttrs += ` data-format-max="${escapeAttr(String(field.max))}"`;
        }
        if (field.decimals !== undefined) {
            dataAttrs += ` data-format-decimals="${escapeAttr(String(field.decimals))}"`;
        }
        if (field.symbol !== undefined) {
            dataAttrs += ` data-format-symbol="${escapeAttr(field.symbol)}"`;
        }

        // Format the display value using Layer8DInputFormatter if available
        let displayValue = '';
        if (value !== null && value !== undefined && value !== '') {
            if (typeof Layer8DInputFormatter !== 'undefined' && Layer8DInputFormatter.getType) {
                const typeConfig = Layer8DInputFormatter.getType(type);
                if (typeConfig && typeConfig.format) {
                    displayValue = typeConfig.format(value, field);
                } else {
                    displayValue = value;
                }
            } else {
                displayValue = value;
            }
        }

        // Store raw value in data attribute
        const rawValue = value !== null && value !== undefined ? value : '';

        return `<div class="formatted-input-wrapper" data-formatter="${escapeAttr(type)}">
            <input type="text"
                id="field-${field.key}"
                name="${field.key}"
                value="${escapeAttr(String(displayValue))}"
                data-raw-value="${escapeAttr(String(rawValue))}"
                ${dataAttrs}
                ${required}
                class="formatted-input formatted-input-${escapeAttr(type)}">
        </div>`;
    }

    // ========================================
    // FORM DATA HANDLING
    // ========================================

    function collectFormData(formDef) {
        const form = document.getElementById('layer8d-edit-form');
        if (!form) return null;

        const data = {};

        formDef.sections.forEach(section => {
            section.fields.forEach(field => {
                const element = form.elements[field.key];
                if (!element) return;

                let value;
                switch (field.type) {
                    case 'checkbox':
                        value = element.checked;
                        break;
                    case 'number':
                        value = element.value ? parseFloat(element.value) : null;
                        break;
                    case 'date':
                        // Check for special "Current" or "N/A" values which represent 0
                        const dateVal = (element.value || '').trim().toLowerCase();
                        if (dateVal === 'current' || dateVal === 'n/a' || element.dataset.isZero === 'true') {
                            value = 0;
                        } else if (dateVal === '') {
                            value = null;
                        } else {
                            value = parseDateToTimestamp(element.value);
                            // If parsing failed but we have a value, it might be an unrecognized format
                            // Keep null to avoid sending invalid data
                        }
                        break;
                    case 'select':
                        // Try to parse as number, otherwise keep as string
                        if (element.value) {
                            const numVal = parseInt(element.value, 10);
                            value = isNaN(numVal) ? element.value : numVal;
                        } else {
                            value = null;
                        }
                        break;
                    case 'reference':
                        // Reference picker - get the stored ID
                        const refId = element.dataset.refId;
                        if (refId) {
                            const numRefId = parseInt(refId, 10);
                            value = isNaN(numRefId) ? refId : numRefId;
                        } else {
                            value = null;
                        }
                        break;

                    // Formatted input types - get raw value via Layer8DInputFormatter
                    case 'ssn':
                    case 'phone':
                    case 'routingNumber':
                    case 'ein':
                    case 'email':
                    case 'url':
                    case 'colorCode':
                        // String types - get raw value from data attribute or parser
                        if (typeof Layer8DInputFormatter !== 'undefined') {
                            value = Layer8DInputFormatter.getValue(element);
                        } else {
                            value = element.dataset.rawValue || element.value || null;
                        }
                        break;

                    case 'currency':
                        // Currency stored in cents (integer)
                        if (typeof Layer8DInputFormatter !== 'undefined') {
                            const cents = Layer8DInputFormatter.getValue(element);
                            value = cents !== null && cents !== '' ? parseInt(cents, 10) : null;
                        } else if (element.dataset.rawValue) {
                            value = parseInt(element.dataset.rawValue, 10);
                            if (isNaN(value)) value = null;
                        } else {
                            value = null;
                        }
                        break;

                    case 'percentage':
                        // Percentage stored as decimal number
                        if (typeof Layer8DInputFormatter !== 'undefined') {
                            const pct = Layer8DInputFormatter.getValue(element);
                            value = pct !== null && pct !== '' ? parseFloat(pct) : null;
                        } else if (element.dataset.rawValue) {
                            value = parseFloat(element.dataset.rawValue);
                            if (isNaN(value)) value = null;
                        } else {
                            value = null;
                        }
                        break;

                    case 'rating':
                        // Rating stored as integer 1-5
                        if (typeof Layer8DInputFormatter !== 'undefined') {
                            const rating = Layer8DInputFormatter.getValue(element);
                            value = rating !== null && rating !== '' ? parseInt(rating, 10) : null;
                        } else {
                            value = element.value ? parseInt(element.value, 10) : null;
                            if (isNaN(value)) value = null;
                        }
                        break;

                    case 'hours':
                        // Hours stored as minutes (integer)
                        if (typeof Layer8DInputFormatter !== 'undefined') {
                            const minutes = Layer8DInputFormatter.getValue(element);
                            value = minutes !== null && minutes !== '' ? parseInt(minutes, 10) : null;
                        } else {
                            value = element.value || null;
                        }
                        break;

                    default:
                        value = element.value || null;
                }

                if (value !== null && value !== '') {
                    data[field.key] = value;
                }
            });
        });

        return data;
    }

    function validateFormData(formDef, data) {
        const errors = [];

        formDef.sections.forEach(section => {
            section.fields.forEach(field => {
                if (field.required) {
                    const value = data[field.key];
                    if (value === null || value === undefined || value === '') {
                        errors.push({ field: field.key, message: `${field.label} is required` });
                    }
                }
            });
        });

        return errors;
    }

    // ========================================
    // CRUD OPERATIONS
    // ========================================

    async function fetchRecord(endpoint, primaryKey, id, modelName) {
        const query = encodeURIComponent(JSON.stringify({
            text: `select * from ${modelName} where ${primaryKey}=${id}`
        }));

        const response = await fetch(`${endpoint}?body=${query}`, {
            method: 'GET',
            headers: typeof getAuthHeaders === 'function' ? getAuthHeaders() : {}
        });

        if (!response.ok) throw new Error('Failed to fetch record');

        const result = await response.json();
        return result.list && result.list.length > 0 ? result.list[0] : null;
    }

    async function saveRecord(endpoint, data, isEdit = false) {
        const method = isEdit ? 'PUT' : 'POST';

        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(typeof getAuthHeaders === 'function' ? getAuthHeaders() : {})
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to save record');
        }
        return await response.json();
    }

    async function deleteRecord(endpoint, id, primaryKey, modelName) {
        const query = {
            text: `select * from ${modelName} where ${primaryKey}=${id}`
        };

        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(typeof getAuthHeaders === 'function' ? getAuthHeaders() : {})
            },
            body: JSON.stringify(query)
        });

        if (!response.ok) throw new Error('Failed to delete record');
        return true;
    }

    // ========================================
    // DATE PICKER INTEGRATION
    // ========================================

    /**
     * Attach date pickers to all date inputs in a container
     * @param {HTMLElement} container
     */
    function attachDatePickers(container) {
        if (typeof Layer8DDatePicker === 'undefined') return;

        // Find all date inputs
        const dateInputs = container.querySelectorAll('input.date-input');
        dateInputs.forEach(input => {
            Layer8DDatePicker.attach(input);
        });

        // Setup trigger buttons
        const triggers = container.querySelectorAll('.date-picker-trigger');
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const inputId = trigger.dataset.for;
                const input = container.querySelector(`#${inputId}`);
                if (input) {
                    Layer8DDatePicker.open(input);
                }
            });
        });

        // Attach input formatters
        attachInputFormatters(container);

        // Also attach reference pickers
        attachReferencePickers(container);
    }

    /**
     * Attach input formatters to all formatted inputs in a container
     * @param {HTMLElement} container
     */
    function attachInputFormatters(container) {
        if (typeof Layer8DInputFormatter === 'undefined') return;

        // Use the auto-attach function which looks for data-format attributes
        Layer8DInputFormatter.attachAll(container);
    }

    // ========================================
    // REFERENCE PICKER INTEGRATION
    // ========================================

    /**
     * Find field definition from form definition by key
     */
    function findFieldDef(formDef, fieldKey) {
        if (!formDef || !formDef.sections) return null;
        for (const section of formDef.sections) {
            for (const field of section.fields) {
                if (field.key === fieldKey) {
                    return field;
                }
            }
        }
        return null;
    }

    /**
     * Look up endpoint for a model from module configs (HCM, FIN, etc.)
     */
    function getEndpointForModel(modelName) {
        // Search all registered module namespaces dynamically
        const namespaces = typeof Layer8DServiceRegistry !== 'undefined'
            ? Layer8DServiceRegistry.getRegisteredModules()
            : [];
        for (const ns of namespaces) {
            const mod = window[ns];
            if (!mod || !mod.modules) continue;
            for (const moduleKey in mod.modules) {
                const module = mod.modules[moduleKey];
                if (module.services) {
                    for (const service of module.services) {
                        if (service.model === modelName) {
                            return Layer8DConfig.resolveEndpoint(service.endpoint);
                        }
                    }
                }
            }
        }
        return null;
    }

    /**
     * Fetch display value for a reference field by ID
     */
    async function fetchReferenceDisplayValue(config, idValue) {
        if (!config.endpoint || !idValue) {
            return null;
        }

        // Build query: select <columns> from <model> where <idColumn>=<idValue>
        const columns = config.selectColumns || [config.idColumn, config.displayColumn];
        const query = `select ${columns.join(',')} from ${config.modelName} where ${config.idColumn}=${idValue}`;

        try {
            const body = encodeURIComponent(JSON.stringify({ text: query }));
            const response = await fetch(config.endpoint + '?body=' + body, {
                method: 'GET',
                headers: typeof getAuthHeaders === 'function'
                    ? getAuthHeaders()
                    : { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            const items = data.list || [];

            if (items.length > 0) {
                const item = items[0];
                // Get display value using displayFormat if available, otherwise use displayColumn
                const displayValue = config.displayFormat
                    ? config.displayFormat(item)
                    : item[config.displayColumn];
                return { displayValue, item };
            }
            return null;
        } catch (error) {
            console.error('Error fetching reference display value:', error);
            return null;
        }
    }

    /**
     * Attach reference pickers to all reference inputs in a container
     * @param {HTMLElement} container
     */
    function attachReferencePickers(container) {
        if (typeof Layer8DReferencePicker === 'undefined') {
            return;
        }

        // Find all reference inputs
        const refInputs = container.querySelectorAll('input.reference-input');
        refInputs.forEach(async input => {
            // Get config from data attribute
            let config = {};
            try {
                config = JSON.parse(input.dataset.refConfig || '{}');
            } catch (e) {
                console.warn('Invalid reference config for', input.name);
                return;
            }

            // Skip if no config
            if (!config.modelName || !config.idColumn || !config.displayColumn) {
                console.warn('Reference input missing required config:', input.name);
                return;
            }

            // Look up endpoint from HCM.modules if not specified
            if (!config.endpoint) {
                config.endpoint = getEndpointForModel(config.modelName);
                if (!config.endpoint) {
                    return;
                }
            }

            // Get displayFormat and selectColumns from registry (functions can't be serialized to data attr)
            const lookupModel = input.dataset.lookupModel || config.modelName;
            if (lookupModel && typeof Layer8DReferenceRegistry !== 'undefined') {
                const registryConfig = Layer8DReferenceRegistry[lookupModel];
                if (registryConfig) {
                    // Get displayFormat function from registry
                    if (registryConfig.displayFormat && !config.displayFormat) {
                        config.displayFormat = registryConfig.displayFormat;
                    }
                    // Get selectColumns from registry if not already set
                    if (registryConfig.selectColumns && !config.selectColumns) {
                        config.selectColumns = registryConfig.selectColumns;
                    }
                }
            }

            // Also try to get from original field definition (for inline referenceConfig)
            const fieldKey = input.dataset.fieldKey || input.name;
            if (currentFormContext && currentFormContext.formDef) {
                const fieldDef = findFieldDef(currentFormContext.formDef, fieldKey);
                if (fieldDef && fieldDef.referenceConfig) {
                    if (fieldDef.referenceConfig.displayFormat) {
                        config.displayFormat = fieldDef.referenceConfig.displayFormat;
                    }
                    if (fieldDef.referenceConfig.selectColumns) {
                        config.selectColumns = fieldDef.referenceConfig.selectColumns;
                    }
                }
            }

            // Attach the picker
            Layer8DReferencePicker.attach(input, config);

            // If the input has an existing ID value, fetch and display the actual value
            const refId = input.dataset.refId;
            if (refId && refId !== '' && refId !== 'undefined') {
                const result = await fetchReferenceDisplayValue(config, refId);
                if (result) {
                    input.value = result.displayValue;
                    // Store the item data for later use
                    if (result.item) {
                        input.dataset.refItem = JSON.stringify(result.item);
                    }
                }
            }
        });
    }

    // ========================================
    // MODAL HELPERS
    // ========================================

    // Store current form context for save handler
    let currentFormContext = null;

    function openAddForm(serviceConfig, formDef, onSuccess) {
        if (typeof Layer8DPopup === 'undefined') {
            Layer8DNotification.error('Form component not available');
            return;
        }

        const title = `Add ${formDef.title}`;
        const content = generateFormHtml(formDef, {});

        currentFormContext = {
            formDef: formDef,
            serviceConfig: serviceConfig,
            isEdit: false,
            recordId: null,
            onSuccess: onSuccess
        };

        Layer8DPopup.show({
            title: title,
            content: content,
            size: 'large',
            showFooter: true,
            saveButtonText: 'Save',
            cancelButtonText: 'Cancel',
            onSave: handleFormSave,
            onShow: attachDatePickers
        });
    }

    async function openEditForm(serviceConfig, formDef, recordId, onSuccess) {
        if (typeof Layer8DPopup === 'undefined') {
            Layer8DNotification.error('Form component not available');
            return;
        }

        // Show loading state
        Layer8DPopup.show({
            title: `Edit ${formDef.title}`,
            content: '<div style="text-align: center; padding: 40px; color: #718096;">Loading...</div>',
            size: 'large',
            showFooter: false
        });

        try {
            const record = await fetchRecord(
                serviceConfig.endpoint,
                serviceConfig.primaryKey,
                recordId,
                serviceConfig.modelName
            );

            if (!record) {
                Layer8DPopup.close();
                Layer8DNotification.error('Record not found');
                return;
            }

            const content = generateFormHtml(formDef, record);

            currentFormContext = {
                formDef: formDef,
                serviceConfig: serviceConfig,
                isEdit: true,
                recordId: recordId,
                onSuccess: onSuccess
            };

            // Re-show with footer
            Layer8DPopup.close();
            Layer8DPopup.show({
                title: `Edit ${formDef.title}`,
                content: content,
                size: 'large',
                showFooter: true,
                saveButtonText: 'Save',
                cancelButtonText: 'Cancel',
                onSave: handleFormSave,
                onShow: attachDatePickers
            });

        } catch (error) {
            Layer8DPopup.close();
            Layer8DNotification.error('Error loading record', [error.message]);
        }
    }

    async function handleFormSave() {
        if (!currentFormContext) return;

        const { formDef, serviceConfig, isEdit, recordId, onSuccess } = currentFormContext;

        const data = collectFormData(formDef);
        const errors = validateFormData(formDef, data);

        if (errors.length > 0) {
            Layer8DNotification.error('Validation failed', errors.map(e => e.message));
            return;
        }

        // Include primary key for update
        if (isEdit && recordId) {
            data[serviceConfig.primaryKey] = recordId;
        }

        try {
            await saveRecord(serviceConfig.endpoint, data, isEdit);
            Layer8DPopup.close();
            currentFormContext = null;
            if (onSuccess) onSuccess();
        } catch (error) {
            Layer8DNotification.error('Error saving', [error.message]);
        }
    }

    function openViewForm(serviceConfig, formDef, data) {
        if (typeof Layer8DPopup === 'undefined') {
            Layer8DNotification.error('View component not available');
            return;
        }

        const title = `${formDef.title} Details`;
        const content = generateFormHtml(formDef, data);

        // Set form context so reference pickers can access field definitions
        currentFormContext = {
            formDef: formDef,
            serviceConfig: serviceConfig,
            isEdit: false,
            recordId: null,
            onSuccess: null
        };

        Layer8DPopup.show({
            title: title,
            content: content,
            size: 'large',
            showFooter: false,
            onShow: (body) => {
                // Attach date pickers and reference pickers to fetch display values
                attachDatePickers(body);
                // Disable all fields for view mode
                body.querySelectorAll('input, select, textarea').forEach(el => {
                    el.disabled = true;
                });
            }
        });
    }

    function confirmDelete(serviceConfig, recordId, onSuccess) {
        if (typeof Layer8DPopup === 'undefined') {
            if (confirm('Are you sure you want to delete this record?')) {
                deleteRecord(serviceConfig.endpoint, recordId, serviceConfig.primaryKey, serviceConfig.modelName)
                    .then(() => { if (onSuccess) onSuccess(); })
                    .catch(error => { Layer8DNotification.error('Error deleting', [error.message]); });
            }
            return;
        }

        Layer8DPopup.show({
            title: 'Confirm Delete',
            content: `
                <div class="delete-message">
                    <p>Are you sure you want to delete this record?</p>
                    <p style="color: var(--layer8d-error); font-weight: 600;">This action cannot be undone.</p>
                </div>
            `,
            size: 'small',
            showFooter: true,
            saveButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            onSave: async () => {
                try {
                    await deleteRecord(serviceConfig.endpoint, recordId, serviceConfig.primaryKey, serviceConfig.modelName);
                    Layer8DPopup.close();
                    if (onSuccess) onSuccess();
                } catch (error) {
                    Layer8DNotification.error('Error deleting', [error.message]);
                }
            }
        });
    }

    // ========================================
    // FORM CONTEXT
    // ========================================

    /**
     * Set the current form context (used by reference pickers to access displayFormat)
     */
    function setFormContext(formDef, serviceConfig) {
        currentFormContext = {
            formDef: formDef,
            serviceConfig: serviceConfig || null,
            isEdit: false,
            recordId: null,
            onSuccess: null
        };
    }

    // ========================================
    // EXPORT
    // ========================================

    window.Layer8DForms = {
        generateFormHtml,
        generateFieldHtml,
        generateSelectHtml,
        generateFormattedInput,
        collectFormData,
        validateFormData,
        fetchRecord,
        saveRecord,
        deleteRecord,
        openAddForm,
        openEditForm,
        openViewForm,
        confirmDelete,
        attachDatePickers,
        attachInputFormatters,
        attachReferencePickers,
        setFormContext
    };

})();
