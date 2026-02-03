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
 * Layer8MNav - Hierarchical Navigation System
 * Provides desktop-parity navigation: Module -> Sub-Module -> Service -> Data
 */
(function() {
    'use strict';

    // Navigation stack for back button support
    let navStack = [];

    // Current active service table instance
    let activeTable = null;

    // Current navigation state
    let currentState = {
        level: 'home',
        module: null,
        subModule: null,
        service: null
    };

    window.Layer8MNav = {
        /**
         * Show home screen with ERP module cards
         */
        showHome() {
            navStack = [];
            currentState = { level: 'home', module: null, subModule: null, service: null };

            const statsEl = document.getElementById('nav-stats');
            if (statsEl) statsEl.style.display = 'grid';

            const content = document.getElementById('nav-content');
            if (!content) return;

            let html = '<div class="nav-section-title">ERP Modules</div>';
            html += '<div class="nav-card-grid">';

            LAYER8M_NAV_CONFIG.modules.forEach(module => {
                const isImplemented = !!LAYER8M_NAV_CONFIG[module.key];
                const cardClass = isImplemented ? 'nav-card' : 'nav-card coming-soon';

                html += `
                    <div class="${cardClass}" ${isImplemented ? `onclick="Layer8MNav.navigateToModule('${module.key}')"` : ''}>
                        <span class="nav-card-icon">${LAYER8M_NAV_CONFIG.getIcon(module.icon)}</span>
                        <span class="nav-card-label">${Layer8MUtils.escapeHtml(module.label)}</span>
                        ${!isImplemented ? '<span class="nav-card-badge">Coming Soon</span>' : ''}
                    </div>
                `;
            });

            html += '</div>';
            content.innerHTML = html;
        },

        /**
         * Navigate to a module's sub-modules
         */
        navigateToModule(moduleKey) {
            navStack.push({ ...currentState });
            currentState = { level: 'module', module: moduleKey, subModule: null, service: null };

            const statsEl = document.getElementById('nav-stats');
            if (statsEl) statsEl.style.display = 'none';

            const content = document.getElementById('nav-content');
            if (!content) return;

            const moduleConfig = LAYER8M_NAV_CONFIG[moduleKey];
            if (!moduleConfig || !moduleConfig.subModules) {
                this.showComingSoon(moduleKey);
                return;
            }

            const moduleInfo = LAYER8M_NAV_CONFIG.modules.find(m => m.key === moduleKey);
            const moduleLabel = moduleInfo ? moduleInfo.label : moduleKey;

            let html = `
                <div class="nav-header">
                    <button class="nav-back-btn" onclick="Layer8MNav.navigateBack()">
                        ${LAYER8M_NAV_CONFIG.getIcon('back')}
                    </button>
                    <div class="nav-title">
                        <h1>${Layer8MUtils.escapeHtml(moduleLabel)}</h1>
                        <p>Select a sub-module</p>
                    </div>
                </div>
            `;

            html += '<div class="nav-card-grid">';

            moduleConfig.subModules.forEach(subModule => {
                html += `
                    <div class="nav-card" onclick="Layer8MNav.navigateToSubModule('${moduleKey}', '${subModule.key}')">
                        <span class="nav-card-icon">${LAYER8M_NAV_CONFIG.getIcon(subModule.icon)}</span>
                        <span class="nav-card-label">${Layer8MUtils.escapeHtml(subModule.label)}</span>
                    </div>
                `;
            });

            html += '</div>';
            content.innerHTML = html;
        },

        /**
         * Navigate to a sub-module's services
         */
        navigateToSubModule(moduleKey, subModuleKey) {
            navStack.push({ ...currentState });
            currentState = { level: 'submodule', module: moduleKey, subModule: subModuleKey, service: null };

            const content = document.getElementById('nav-content');
            if (!content) return;

            const moduleConfig = LAYER8M_NAV_CONFIG[moduleKey];
            if (!moduleConfig || !moduleConfig.services || !moduleConfig.services[subModuleKey]) {
                this.showComingSoon(subModuleKey);
                return;
            }

            const subModuleInfo = moduleConfig.subModules.find(sm => sm.key === subModuleKey);
            const subModuleLabel = subModuleInfo ? subModuleInfo.label : subModuleKey;
            const services = moduleConfig.services[subModuleKey];

            let html = `
                <div class="nav-header">
                    <button class="nav-back-btn" onclick="Layer8MNav.navigateBack()">
                        ${LAYER8M_NAV_CONFIG.getIcon('back')}
                    </button>
                    <div class="nav-title">
                        <h1>${Layer8MUtils.escapeHtml(subModuleLabel)}</h1>
                        <p>Select a service</p>
                    </div>
                </div>
            `;

            html += '<div class="nav-card-grid">';

            services.forEach(service => {
                html += `
                    <div class="nav-card" onclick="Layer8MNav.navigateToService('${moduleKey}', '${subModuleKey}', '${service.key}')">
                        <span class="nav-card-icon">${LAYER8M_NAV_CONFIG.getIcon(service.icon)}</span>
                        <span class="nav-card-label">${Layer8MUtils.escapeHtml(service.label)}</span>
                    </div>
                `;
            });

            html += '</div>';
            content.innerHTML = html;
        },

        /**
         * Navigate to service data list
         */
        navigateToService(moduleKey, subModuleKey, serviceKey) {
            navStack.push({ ...currentState });
            currentState = { level: 'service', module: moduleKey, subModule: subModuleKey, service: serviceKey };

            const content = document.getElementById('nav-content');
            if (!content) return;

            const moduleConfig = LAYER8M_NAV_CONFIG[moduleKey];
            if (!moduleConfig || !moduleConfig.services || !moduleConfig.services[subModuleKey]) {
                this.showComingSoon(serviceKey);
                return;
            }

            const services = moduleConfig.services[subModuleKey];
            const serviceConfig = services.find(s => s.key === serviceKey);

            if (!serviceConfig) {
                this.showComingSoon(serviceKey);
                return;
            }

            // Render the data list view
            let html = `
                <div class="data-list-header">
                    <button class="data-list-back-btn" onclick="Layer8MNav.navigateBack()">
                        ${LAYER8M_NAV_CONFIG.getIcon('back')}
                    </button>
                    <div class="data-list-title">
                        <h1>${Layer8MUtils.escapeHtml(serviceConfig.label)}</h1>
                        <p>Tap a record to view details</p>
                    </div>
                </div>
                <div id="service-table-container"></div>
            `;

            content.innerHTML = html;

            // Load the service data
            this._loadServiceData(serviceConfig);
        },

        /**
         * Navigate back in the stack
         */
        navigateBack() {
            if (navStack.length === 0) {
                this.showHome();
                return;
            }

            const prev = navStack.pop();
            currentState = prev;

            // Render the previous view directly without calling navigation functions
            // (navigation functions push to the stack, which we don't want when going back)
            switch (prev.level) {
                case 'home':
                    this._renderHome();
                    break;
                case 'module':
                    this._renderModule(prev.module);
                    break;
                case 'submodule':
                    this._renderSubModule(prev.module, prev.subModule);
                    break;
                case 'service':
                    this._renderService(prev.module, prev.subModule, prev.service);
                    break;
            }
        },

        /**
         * Render home view (without modifying navigation stack)
         */
        _renderHome() {
            const statsEl = document.getElementById('nav-stats');
            if (statsEl) statsEl.style.display = 'grid';

            const content = document.getElementById('nav-content');
            if (!content) return;

            let html = '<div class="nav-section-title">ERP Modules</div>';
            html += '<div class="nav-card-grid">';

            LAYER8M_NAV_CONFIG.modules.forEach(module => {
                const isImplemented = !!LAYER8M_NAV_CONFIG[module.key];
                const cardClass = isImplemented ? 'nav-card' : 'nav-card coming-soon';

                html += `
                    <div class="${cardClass}" ${isImplemented ? `onclick="Layer8MNav.navigateToModule('${module.key}')"` : ''}>
                        <span class="nav-card-icon">${LAYER8M_NAV_CONFIG.getIcon(module.icon)}</span>
                        <span class="nav-card-label">${Layer8MUtils.escapeHtml(module.label)}</span>
                        ${!isImplemented ? '<span class="nav-card-badge">Coming Soon</span>' : ''}
                    </div>
                `;
            });

            html += '</div>';
            content.innerHTML = html;
        },

        /**
         * Render module view (without modifying navigation stack)
         */
        _renderModule(moduleKey) {
            const statsEl = document.getElementById('nav-stats');
            if (statsEl) statsEl.style.display = 'none';

            const content = document.getElementById('nav-content');
            if (!content) return;

            const moduleConfig = LAYER8M_NAV_CONFIG[moduleKey];
            if (!moduleConfig || !moduleConfig.subModules) {
                this.showComingSoon(moduleKey);
                return;
            }

            const moduleInfo = LAYER8M_NAV_CONFIG.modules.find(m => m.key === moduleKey);
            const moduleLabel = moduleInfo ? moduleInfo.label : moduleKey;

            let html = `
                <div class="nav-header">
                    <button class="nav-back-btn" onclick="Layer8MNav.navigateBack()">
                        ${LAYER8M_NAV_CONFIG.getIcon('back')}
                    </button>
                    <div class="nav-title">
                        <h1>${Layer8MUtils.escapeHtml(moduleLabel)}</h1>
                        <p>Select a sub-module</p>
                    </div>
                </div>
            `;

            html += '<div class="nav-card-grid">';

            moduleConfig.subModules.forEach(subModule => {
                html += `
                    <div class="nav-card" onclick="Layer8MNav.navigateToSubModule('${moduleKey}', '${subModule.key}')">
                        <span class="nav-card-icon">${LAYER8M_NAV_CONFIG.getIcon(subModule.icon)}</span>
                        <span class="nav-card-label">${Layer8MUtils.escapeHtml(subModule.label)}</span>
                    </div>
                `;
            });

            html += '</div>';
            content.innerHTML = html;
        },

        /**
         * Render sub-module view (without modifying navigation stack)
         */
        _renderSubModule(moduleKey, subModuleKey) {
            const content = document.getElementById('nav-content');
            if (!content) return;

            const moduleConfig = LAYER8M_NAV_CONFIG[moduleKey];
            if (!moduleConfig || !moduleConfig.services || !moduleConfig.services[subModuleKey]) {
                this.showComingSoon(subModuleKey);
                return;
            }

            const subModuleInfo = moduleConfig.subModules.find(sm => sm.key === subModuleKey);
            const subModuleLabel = subModuleInfo ? subModuleInfo.label : subModuleKey;
            const services = moduleConfig.services[subModuleKey];

            let html = `
                <div class="nav-header">
                    <button class="nav-back-btn" onclick="Layer8MNav.navigateBack()">
                        ${LAYER8M_NAV_CONFIG.getIcon('back')}
                    </button>
                    <div class="nav-title">
                        <h1>${Layer8MUtils.escapeHtml(subModuleLabel)}</h1>
                        <p>Select a service</p>
                    </div>
                </div>
            `;

            html += '<div class="nav-card-grid">';

            services.forEach(service => {
                html += `
                    <div class="nav-card" onclick="Layer8MNav.navigateToService('${moduleKey}', '${subModuleKey}', '${service.key}')">
                        <span class="nav-card-icon">${LAYER8M_NAV_CONFIG.getIcon(service.icon)}</span>
                        <span class="nav-card-label">${Layer8MUtils.escapeHtml(service.label)}</span>
                    </div>
                `;
            });

            html += '</div>';
            content.innerHTML = html;
        },

        /**
         * Render service view (without modifying navigation stack)
         */
        _renderService(moduleKey, subModuleKey, serviceKey) {
            const content = document.getElementById('nav-content');
            if (!content) return;

            const moduleConfig = LAYER8M_NAV_CONFIG[moduleKey];
            if (!moduleConfig || !moduleConfig.services || !moduleConfig.services[subModuleKey]) {
                this.showComingSoon(serviceKey);
                return;
            }

            const services = moduleConfig.services[subModuleKey];
            const serviceConfig = services.find(s => s.key === serviceKey);

            if (!serviceConfig) {
                this.showComingSoon(serviceKey);
                return;
            }

            let html = `
                <div class="data-list-header">
                    <button class="data-list-back-btn" onclick="Layer8MNav.navigateBack()">
                        ${LAYER8M_NAV_CONFIG.getIcon('back')}
                    </button>
                    <div class="data-list-title">
                        <h1>${Layer8MUtils.escapeHtml(serviceConfig.label)}</h1>
                        <p>Tap a record to view details</p>
                    </div>
                </div>
                <div id="service-table-container"></div>
            `;

            content.innerHTML = html;
            this._loadServiceData(serviceConfig);
        },

        /**
         * Show coming soon placeholder
         */
        showComingSoon(key) {
            const content = document.getElementById('nav-content');
            if (!content) return;

            content.innerHTML = `
                <div class="nav-header">
                    <button class="nav-back-btn" onclick="Layer8MNav.navigateBack()">
                        ${LAYER8M_NAV_CONFIG.getIcon('back')}
                    </button>
                    <div class="nav-title">
                        <h1>${Layer8MUtils.escapeHtml(key)}</h1>
                    </div>
                </div>
                <div class="nav-empty-state">
                    <div class="nav-empty-state-icon">🚧</div>
                    <h3>Coming Soon</h3>
                    <p>This module is under development</p>
                </div>
            `;
        },

        /**
         * Load service data into table
         */
        _loadServiceData(serviceConfig) {
            const container = document.getElementById('service-table-container');
            if (!container) return;

            // Get form definition for this service
            const formDef = this._getServiceFormDef(serviceConfig);
            const columns = this._getServiceColumns(serviceConfig);
            const transformData = this._getServiceTransformData(serviceConfig);

            // Build table config
            const tableConfig = {
                endpoint: Layer8MConfig.resolveEndpoint(serviceConfig.endpoint),
                modelName: serviceConfig.model,
                columns: columns,
                rowsPerPage: 15,
                getItemId: (item) => item[serviceConfig.idField] || item.id
            };

            // Add transform if available
            if (transformData) {
                tableConfig.transformData = transformData;
            }

            // Add CRUD callbacks only for non-readOnly services
            if (!serviceConfig.readOnly) {
                tableConfig.statusField = 'status';
                tableConfig.addButtonText = `Add ${serviceConfig.label.replace(/s$/, '')}`;
                tableConfig.onAdd = () => this._openServiceForm(serviceConfig, formDef, null);
                tableConfig.onEdit = (id, item) => this._openServiceForm(serviceConfig, formDef, item);
                tableConfig.onDelete = (id, item) => this._deleteServiceRecord(serviceConfig, id, item);
                tableConfig.onRowClick = (item, id) => this._showRecordDetails(serviceConfig, formDef, item);
            }

            activeTable = new Layer8MEditTable('service-table-container', tableConfig);
        },

        /**
         * Show record details modal (read-only)
         * Desktop Equivalent: hcm-crud.js _showDetailsModal()
         * IMPORTANT: Uses same form as edit, then disables all fields (matches desktop exactly)
         */
        async _showRecordDetails(serviceConfig, formDef, item) {
            // Show loading state first
            Layer8MPopup.show({
                title: `${serviceConfig.label.replace(/s$/, '')} Details`,
                content: '<div style="text-align:center;padding:40px;color:#718096;">Loading...</div>',
                size: 'large',
                showFooter: false
            });

            // Fetch fresh data from server (matches desktop behavior)
            const recordId = item[serviceConfig.idField];
            const freshRecord = await this._fetchRecord(serviceConfig, recordId);
            Layer8MPopup.close();

            if (!freshRecord) {
                Layer8MUtils.showError('Record not found');
                return;
            }

            // Generate SAME form as edit (no readonly flag) - matches desktop hcm-crud.js:105
            const content = Layer8MForms.renderForm(formDef, freshRecord);

            Layer8MPopup.show({
                title: `${serviceConfig.label.replace(/s$/, '')} Details`,
                content: content,
                size: 'large',
                showFooter: true,
                saveButtonText: 'Edit',
                showCancelButton: true,
                cancelButtonText: 'Close',
                onShow: (popup) => {
                    // Initialize form fields (date pickers, reference pickers)
                    Layer8MForms.initFormFields(popup.body);
                    // Disable all form inputs - matches desktop hcm-crud.js:123-125
                    popup.body.querySelectorAll('input, select, textarea').forEach(el => {
                        el.disabled = true;
                    });
                },
                onSave: (popup) => {
                    Layer8MPopup.close();
                    this._openServiceForm(serviceConfig, formDef, freshRecord);
                }
            });
        },

        /** Fetch a single record by ID - Desktop Equivalent: erp-forms.js fetchRecord() */
        async _fetchRecord(serviceConfig, id) {
            const query = `select * from ${serviceConfig.model} where ${serviceConfig.idField}=${id}`;
            try {
                const response = await Layer8MAuth.get(`${Layer8MConfig.resolveEndpoint(serviceConfig.endpoint)}?body=${encodeURIComponent(JSON.stringify({ text: query }))}`);
                return (response && response.list && response.list.length > 0) ? response.list[0] : null;
            } catch (error) {
                console.error('Failed to fetch record:', error);
                return null;
            }
        },

        /**
         * Open form for add/edit
         * Desktop Equivalent: erp-forms.js openAddForm() and openEditForm()
         */
        async _openServiceForm(serviceConfig, formDef, item) {
            const isEdit = !!item;
            const title = isEdit ? `Edit ${serviceConfig.label.replace(/s$/, '')}` : `Add ${serviceConfig.label.replace(/s$/, '')}`;

            // For edit mode, fetch fresh data from server (matches desktop behavior)
            let recordData = item || {};
            if (isEdit && item[serviceConfig.idField]) {
                // Show loading popup
                Layer8MPopup.show({
                    title: title,
                    content: '<div style="text-align:center;padding:40px;color:#718096;">Loading...</div>',
                    size: 'large',
                    showFooter: false
                });

                const freshRecord = await this._fetchRecord(serviceConfig, item[serviceConfig.idField]);
                Layer8MPopup.close();

                if (!freshRecord) {
                    Layer8MUtils.showError('Record not found');
                    return;
                }
                recordData = freshRecord;
            }

            const content = Layer8MForms.renderForm(formDef, recordData);

            Layer8MPopup.show({
                title: title,
                content: content,
                size: 'large',
                saveButtonText: isEdit ? 'Update' : 'Create',
                onSave: async (popup) => {
                    const body = popup.body;
                    const errors = Layer8MForms.validateForm(body);

                    if (errors.length > 0) {
                        Layer8MForms.showErrors(body, errors);
                        return;
                    }

                    const data = Layer8MForms.getFormData(body);

                    if (isEdit) {
                        data[serviceConfig.idField] = recordData[serviceConfig.idField];
                    }

                    try {
                        if (isEdit) {
                            await Layer8MAuth.put(Layer8MConfig.resolveEndpoint(serviceConfig.endpoint), data);
                            Layer8MUtils.showSuccess(`${serviceConfig.label.replace(/s$/, '')} updated`);
                        } else {
                            await Layer8MAuth.post(Layer8MConfig.resolveEndpoint(serviceConfig.endpoint), data);
                            Layer8MUtils.showSuccess(`${serviceConfig.label.replace(/s$/, '')} created`);
                        }

                        Layer8MPopup.close();
                        if (activeTable) activeTable.refresh();
                    } catch (error) {
                        Layer8MUtils.showError(`Failed to save ${serviceConfig.label.replace(/s$/, '').toLowerCase()}`);
                    }
                }
            });
        },

        /**
         * Delete service record
         * Desktop Equivalent: erp-forms.js deleteRecord()
         */
        async _deleteServiceRecord(serviceConfig, id, item) {
            const name = this._getRecordDisplayName(item);
            const confirmed = await Layer8MConfirm.confirmDelete(name);

            if (confirmed) {
                try {
                    // Build L8Query for delete scope
                    const primaryKey = serviceConfig.idField;
                    const query = {
                        text: `select * from ${serviceConfig.model} where ${primaryKey}=${id}`
                    };
                    await Layer8MAuth.delete(Layer8MConfig.resolveEndpoint(serviceConfig.endpoint), query);
                    Layer8MUtils.showSuccess(`${serviceConfig.label.replace(/s$/, '')} deleted`);
                    if (activeTable) activeTable.refresh();
                } catch (error) {
                    Layer8MUtils.showError(`Failed to delete ${serviceConfig.label.replace(/s$/, '').toLowerCase()}`);
                }
            }
        },

        /**
         * Get display name for a record
         */
        _getRecordDisplayName(item) {
            // Try common name fields
            if (item.name) return item.name;
            if (item.lastName && item.firstName) return `${item.lastName}, ${item.firstName}`;
            if (item.title) return item.title;
            if (item.code) return item.code;
            if (item.description) return item.description.substring(0, 50);
            return 'this record';
        },

        /**
         * Get columns for a service from registered mobile module registries
         */
        _getServiceColumns(serviceConfig) {
            if (serviceConfig.model) {
                // Try all registered mobile module registries
                const registries = [window.MobileHCM, window.MobileFIN, window.MobileSCM, window.MobileSYS];
                for (const reg of registries) {
                    if (reg && reg.getColumns) {
                        const columns = reg.getColumns(serviceConfig.model);
                        if (columns) return columns;
                    }
                }
            }

            // Fallback to defaults
            return [
                { key: serviceConfig.idField, label: 'ID', sortKey: serviceConfig.idField },
                { key: 'name', label: 'Name', sortKey: 'name' },
                { key: 'status', label: 'Status', sortKey: 'status', render: (item) => Layer8MRenderers.renderBoolean(item.status) }
            ];
        },

        /**
         * Get form definition for a service from registered mobile module registries
         */
        /**
         * Get transform data function for a service from registered registries
         */
        _getServiceTransformData(serviceConfig) {
            if (serviceConfig.model) {
                const registries = [window.MobileHCM, window.MobileFIN, window.MobileSCM, window.MobileSYS];
                for (const reg of registries) {
                    if (reg && reg.getTransformData) {
                        const transform = reg.getTransformData(serviceConfig.model);
                        if (transform) return transform;
                    }
                }
            }
            return null;
        },

        _getServiceFormDef(serviceConfig) {
            if (serviceConfig.model) {
                // Try all registered mobile module registries
                const registries = [window.MobileHCM, window.MobileFIN, window.MobileSCM, window.MobileSYS];
                for (const reg of registries) {
                    if (reg && reg.getFormDef) {
                        const formDef = reg.getFormDef(serviceConfig.model);
                        if (formDef) return formDef;
                    }
                }
            }

            // Fallback to generic form
            return {
                title: serviceConfig.label,
                sections: [
                    {
                        title: 'Basic Information',
                        fields: [
                            { key: 'name', label: 'Name', type: 'text', required: true },
                            { key: 'description', label: 'Description', type: 'textarea' },
                            { key: 'status', label: 'Status', type: 'select', options: { 1: 'Active', 0: 'Inactive' } }
                        ]
                    }
                ]
            };
        },

        /**
         * Get current navigation state
         */
        getCurrentState() {
            return { ...currentState };
        },

        /**
         * Check if we're at home level
         */
        isHome() {
            return currentState.level === 'home';
        }
    };

})();
