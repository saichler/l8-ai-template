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
 * Mobile Navigation Configuration
 * Defines the EXACT navigation hierarchy matching desktop
 */
(function() {
    'use strict';

    window.LAYER8M_NAV_CONFIG = {
        // ERP Modules (Level 1) - matches desktop sidebar order
        modules: [
            { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', hasSubModules: false },
            { key: 'financial', label: 'Financial', icon: 'financial', hasSubModules: true },
            { key: 'hcm', label: 'Human Capital', icon: 'hcm', hasSubModules: true },
            { key: 'scm', label: 'Supply Chain', icon: 'scm', hasSubModules: true },
            { key: 'manufacturing', label: 'Manufacturing', icon: 'manufacturing', hasSubModules: false },
            { key: 'sales', label: 'Sales', icon: 'sales', hasSubModules: false },
            { key: 'crm', label: 'CRM', icon: 'crm', hasSubModules: false },
            { key: 'projects', label: 'Projects', icon: 'projects', hasSubModules: false },
            { key: 'bi', label: 'Analytics', icon: 'bi', hasSubModules: false },
            { key: 'documents', label: 'Documents', icon: 'documents', hasSubModules: false },
            { key: 'ecommerce', label: 'E-Commerce', icon: 'ecommerce', hasSubModules: false },
            { key: 'compliance', label: 'Compliance', icon: 'compliance', hasSubModules: false },
            { key: 'system', label: 'System', icon: 'system', hasSubModules: true }
        ],

        // FIN Sub-Modules (Level 2)
        financial: {
            subModules: [
                { key: 'general-ledger', label: 'General Ledger', icon: 'financial' },
                { key: 'accounts-payable', label: 'Accounts Payable', icon: 'financial' },
                { key: 'accounts-receivable', label: 'Accounts Receivable', icon: 'financial' },
                { key: 'cash-management', label: 'Cash Management', icon: 'financial' },
                { key: 'fixed-assets', label: 'Fixed Assets', icon: 'financial' },
                { key: 'budgeting', label: 'Budgeting', icon: 'financial' },
                { key: 'tax-management', label: 'Tax Management', icon: 'financial' }
            ],

            // Services for each sub-module (Level 3) - EXACT order from desktop fin-config.js
            services: {
                'general-ledger': [
                    { key: 'accounts', label: 'Accounts', icon: 'financial', endpoint: '/40/Account', model: 'Account', idField: 'accountId' },
                    { key: 'journal-entries', label: 'Journal Entries', icon: 'financial', endpoint: '/40/JrnlEntry', model: 'JournalEntry', idField: 'journalEntryId' },
                    { key: 'journal-entry-lines', label: 'Entry Lines', icon: 'financial', endpoint: '/40/JrnlLine', model: 'JournalEntryLine', idField: 'lineId' },
                    { key: 'fiscal-years', label: 'Fiscal Years', icon: 'financial', endpoint: '/40/FiscalYr', model: 'FiscalYear', idField: 'fiscalYearId' },
                    { key: 'fiscal-periods', label: 'Fiscal Periods', icon: 'financial', endpoint: '/40/FiscalPd', model: 'FiscalPeriod', idField: 'fiscalPeriodId' },
                    { key: 'currencies', label: 'Currencies', icon: 'financial', endpoint: '/40/Currency', model: 'Currency', idField: 'currencyId' },
                    { key: 'exchange-rates', label: 'Exchange Rates', icon: 'financial', endpoint: '/40/XchgRate', model: 'ExchangeRate', idField: 'exchangeRateId' },
                    { key: 'account-balances', label: 'Balances', icon: 'financial', endpoint: '/40/AcctBal', model: 'AccountBalance', idField: 'balanceId' }
                ],
                'accounts-payable': [
                    { key: 'vendors', label: 'Vendors', icon: 'financial', endpoint: '/40/Vendor', model: 'Vendor', idField: 'vendorId' },
                    { key: 'vendor-contacts', label: 'Vendor Contacts', icon: 'financial', endpoint: '/40/VndrCont', model: 'VendorContact', idField: 'contactId' },
                    { key: 'purchase-invoices', label: 'Purchase Invoices', icon: 'financial', endpoint: '/40/PurchInv', model: 'PurchaseInvoice', idField: 'invoiceId' },
                    { key: 'purchase-invoice-lines', label: 'Invoice Lines', icon: 'financial', endpoint: '/40/PurchLine', model: 'PurchaseInvoiceLine', idField: 'lineId' },
                    { key: 'payment-schedules', label: 'Payment Schedules', icon: 'financial', endpoint: '/40/PmtSched', model: 'PaymentSchedule', idField: 'scheduleId' },
                    { key: 'vendor-payments', label: 'Vendor Payments', icon: 'financial', endpoint: '/40/VndrPmt', model: 'VendorPayment', idField: 'paymentId' },
                    { key: 'payment-allocations', label: 'Payment Allocations', icon: 'financial', endpoint: '/40/PmtAlloc', model: 'PaymentAllocation', idField: 'allocationId' },
                    { key: 'vendor-statements', label: 'Vendor Statements', icon: 'financial', endpoint: '/40/VndrStmt', model: 'VendorStatement', idField: 'statementId' }
                ],
                'accounts-receivable': [
                    { key: 'customers', label: 'Customers', icon: 'financial', endpoint: '/40/Customer', model: 'Customer', idField: 'customerId' },
                    { key: 'customer-contacts', label: 'Customer Contacts', icon: 'financial', endpoint: '/40/CustCont', model: 'CustomerContact', idField: 'contactId' },
                    { key: 'sales-invoices', label: 'Sales Invoices', icon: 'financial', endpoint: '/40/SalesInv', model: 'SalesInvoice', idField: 'invoiceId' },
                    { key: 'sales-invoice-lines', label: 'Invoice Lines', icon: 'financial', endpoint: '/40/SalesLine', model: 'SalesInvoiceLine', idField: 'lineId' },
                    { key: 'customer-payments', label: 'Customer Payments', icon: 'financial', endpoint: '/40/CustPmt', model: 'CustomerPayment', idField: 'paymentId' },
                    { key: 'payment-applications', label: 'Payment Apps', icon: 'financial', endpoint: '/40/PmtApp', model: 'PaymentApplication', idField: 'applicationId' },
                    { key: 'credit-memos', label: 'Credit Memos', icon: 'financial', endpoint: '/40/CrdtMemo', model: 'CreditMemo', idField: 'creditMemoId' },
                    { key: 'dunning-letters', label: 'Dunning Letters', icon: 'financial', endpoint: '/40/DunLtr', model: 'DunningLetter', idField: 'letterId' }
                ],
                'cash-management': [
                    { key: 'bank-accounts', label: 'Bank Accounts', icon: 'financial', endpoint: '/40/BankAcct', model: 'BankAccount', idField: 'bankAccountId' },
                    { key: 'bank-transactions', label: 'Transactions', icon: 'financial', endpoint: '/40/BankTxn', model: 'BankTransaction', idField: 'transactionId' },
                    { key: 'bank-reconciliations', label: 'Reconciliations', icon: 'financial', endpoint: '/40/BankRec', model: 'BankReconciliation', idField: 'reconciliationId' },
                    { key: 'cash-forecasts', label: 'Cash Forecasts', icon: 'financial', endpoint: '/40/CashFcst', model: 'CashForecast', idField: 'forecastId' },
                    { key: 'fund-transfers', label: 'Fund Transfers', icon: 'financial', endpoint: '/40/FundXfer', model: 'FundTransfer', idField: 'transferId' },
                    { key: 'petty-cash', label: 'Petty Cash', icon: 'financial', endpoint: '/40/PettyCash', model: 'PettyCash', idField: 'pettyCashId' }
                ],
                'fixed-assets': [
                    { key: 'assets', label: 'Assets', icon: 'financial', endpoint: '/40/Asset', model: 'Asset', idField: 'assetId' },
                    { key: 'asset-categories', label: 'Categories', icon: 'financial', endpoint: '/40/AstCat', model: 'AssetCategory', idField: 'categoryId' },
                    { key: 'depreciation-schedules', label: 'Depreciation', icon: 'financial', endpoint: '/40/DeprSched', model: 'DepreciationSchedule', idField: 'scheduleId' },
                    { key: 'asset-disposals', label: 'Disposals', icon: 'financial', endpoint: '/40/AstDisp', model: 'AssetDisposal', idField: 'disposalId' },
                    { key: 'asset-transfers', label: 'Transfers', icon: 'financial', endpoint: '/40/AstXfer', model: 'AssetTransfer', idField: 'transferId' },
                    { key: 'asset-maintenance', label: 'Maintenance', icon: 'financial', endpoint: '/40/AstMaint', model: 'AssetMaintenance', idField: 'maintenanceId' },
                    { key: 'asset-revaluations', label: 'Revaluations', icon: 'financial', endpoint: '/40/AstReval', model: 'AssetRevaluation', idField: 'revaluationId' }
                ],
                'budgeting': [
                    { key: 'budgets', label: 'Budgets', icon: 'financial', endpoint: '/40/Budget', model: 'Budget', idField: 'budgetId' },
                    { key: 'budget-lines', label: 'Budget Lines', icon: 'financial', endpoint: '/40/BdgtLine', model: 'BudgetLine', idField: 'lineId' },
                    { key: 'budget-transfers', label: 'Budget Transfers', icon: 'financial', endpoint: '/40/BdgtXfer', model: 'BudgetTransfer', idField: 'transferId' },
                    { key: 'budget-scenarios', label: 'Scenarios', icon: 'financial', endpoint: '/40/BdgtScen', model: 'BudgetScenario', idField: 'scenarioId' },
                    { key: 'capital-expenditures', label: 'Capital Expenditures', icon: 'financial', endpoint: '/40/CapEx', model: 'CapitalExpenditure', idField: 'capexId' },
                    { key: 'forecasts', label: 'Forecasts', icon: 'financial', endpoint: '/40/Forecast', model: 'Forecast', idField: 'forecastId' }
                ],
                'tax-management': [
                    { key: 'tax-codes', label: 'Tax Codes', icon: 'financial', endpoint: '/40/TaxCode', model: 'TaxCode', idField: 'taxCodeId' },
                    { key: 'tax-jurisdictions', label: 'Jurisdictions', icon: 'financial', endpoint: '/40/TaxJuris', model: 'TaxJurisdiction', idField: 'jurisdictionId' },
                    { key: 'tax-rules', label: 'Tax Rules', icon: 'financial', endpoint: '/40/TaxRule', model: 'TaxRule', idField: 'ruleId' },
                    { key: 'tax-returns', label: 'Tax Returns', icon: 'financial', endpoint: '/40/TaxRtn', model: 'TaxReturn', idField: 'returnId' },
                    { key: 'tax-exemptions', label: 'Exemptions', icon: 'financial', endpoint: '/40/TaxExmpt', model: 'TaxExemption', idField: 'exemptionId' },
                    { key: 'withholding-tax-configs', label: 'Withholding Configs', icon: 'financial', endpoint: '/40/WhtTxCfg', model: 'WithholdingTaxConfig', idField: 'configId' }
                ]
            }
        },

        // HCM Sub-Modules (Level 2)
        hcm: {
            subModules: [
                { key: 'core-hr', label: 'Core HR', icon: 'employees' },
                { key: 'payroll', label: 'Payroll', icon: 'financial' },
                { key: 'benefits', label: 'Benefits', icon: 'benefits' },
                { key: 'time', label: 'Time', icon: 'time' },
                { key: 'talent', label: 'Talent', icon: 'talent' },
                { key: 'learning', label: 'Learning', icon: 'learning' },
                { key: 'compensation', label: 'Compensation', icon: 'compensation' }
            ],

            // Services for each sub-module (Level 3) - EXACT order from desktop hcm-config.js
            services: {
                'core-hr': [
                    { key: 'employees', label: 'Employees', icon: 'employees', endpoint: '/30/Employee', model: 'Employee', idField: 'employeeId' },
                    { key: 'positions', label: 'Positions', icon: 'positions', endpoint: '/30/Position', model: 'Position', idField: 'positionId' },
                    { key: 'jobs', label: 'Jobs', icon: 'jobs', endpoint: '/30/Job', model: 'Job', idField: 'jobId' },
                    { key: 'job-families', label: 'Job Families', icon: 'job-families', endpoint: '/30/JobFamily', model: 'JobFamily', idField: 'jobFamilyId' },
                    { key: 'organizations', label: 'Organizations', icon: 'organizations', endpoint: '/30/Org', model: 'Organization', idField: 'organizationId' },
                    { key: 'departments', label: 'Departments', icon: 'departments', endpoint: '/30/Dept', model: 'Department', idField: 'departmentId' },
                    { key: 'documents', label: 'Documents', icon: 'documents', endpoint: '/30/EmpDoc', model: 'EmployeeDocument', idField: 'documentId' },
                    { key: 'compliance', label: 'Compliance', icon: 'compliance', endpoint: '/30/CompRec', model: 'ComplianceRecord', idField: 'recordId' }
                ],
                'payroll': [
                    { key: 'pay-structures', label: 'Pay Structures', icon: 'pay-structures', endpoint: '/30/PayStruct', model: 'PayStructure', idField: 'payStructureId' },
                    { key: 'pay-components', label: 'Pay Components', icon: 'pay-components', endpoint: '/30/PayComp', model: 'PayComponent', idField: 'payComponentId' },
                    { key: 'payroll-runs', label: 'Payroll Runs', icon: 'payroll-runs', endpoint: '/30/PayRun', model: 'PayrollRun', idField: 'payrollRunId' },
                    { key: 'payslips', label: 'Payslips', icon: 'payslips', endpoint: '/30/Payslip', model: 'Payslip', idField: 'payslipId' },
                    { key: 'tax-withholdings', label: 'Tax Withholdings', icon: 'tax-withholdings', endpoint: '/30/TaxWith', model: 'TaxWithholding', idField: 'taxWithholdingId' },
                    { key: 'direct-deposits', label: 'Direct Deposits', icon: 'direct-deposits', endpoint: '/30/DirDep', model: 'DirectDeposit', idField: 'directDepositId' },
                    { key: 'garnishments', label: 'Garnishments', icon: 'garnishments', endpoint: '/30/Garnish', model: 'Garnishment', idField: 'garnishmentId' },
                    { key: 'year-end-docs', label: 'Year-End Docs', icon: 'year-end-docs', endpoint: '/30/YrEndDoc', model: 'YearEndDocument', idField: 'documentId' }
                ],
                'benefits': [
                    { key: 'benefit-plans', label: 'Benefit Plans', icon: 'benefit-plans', endpoint: '/30/BenPlan', model: 'BenefitPlan', idField: 'benefitPlanId' },
                    { key: 'enrollments', label: 'Enrollments', icon: 'enrollments', endpoint: '/30/BenEnrol', model: 'BenefitEnrollment', idField: 'enrollmentId' },
                    { key: 'carriers', label: 'Carriers', icon: 'carriers', endpoint: '/30/Carrier', model: 'Carrier', idField: 'carrierId' },
                    { key: 'dependents', label: 'Dependents', icon: 'dependents', endpoint: '/30/Dependent', model: 'Dependent', idField: 'dependentId' },
                    { key: 'life-events', label: 'Life Events', icon: 'life-events', endpoint: '/30/LifeEvent', model: 'LifeEvent', idField: 'lifeEventId' },
                    { key: 'cobra-events', label: 'COBRA Events', icon: 'cobra-events', endpoint: '/30/COBRAEvt', model: 'COBRAEvent', idField: 'cobraEventId' }
                ],
                'time': [
                    { key: 'timesheets', label: 'Timesheets', icon: 'timesheets', endpoint: '/30/Timesheet', model: 'Timesheet', idField: 'timesheetId' },
                    { key: 'leave-requests', label: 'Leave Requests', icon: 'leave-requests', endpoint: '/30/LeaveReq', model: 'LeaveRequest', idField: 'leaveRequestId' },
                    { key: 'leave-balances', label: 'Leave Balances', icon: 'leave-balances', endpoint: '/30/LeaveBal', model: 'LeaveBalance', idField: 'leaveBalanceId' },
                    { key: 'leave-policies', label: 'Leave Policies', icon: 'leave-policies', endpoint: '/30/LeavePol', model: 'LeavePolicy', idField: 'leavePolicyId' },
                    { key: 'shifts', label: 'Shifts', icon: 'shifts', endpoint: '/30/Shift', model: 'Shift', idField: 'shiftId' },
                    { key: 'schedules', label: 'Schedules', icon: 'schedules', endpoint: '/30/Schedule', model: 'Schedule', idField: 'scheduleId' },
                    { key: 'holidays', label: 'Holidays', icon: 'holidays', endpoint: '/30/Holiday', model: 'Holiday', idField: 'holidayId' },
                    { key: 'absences', label: 'Absences', icon: 'absences', endpoint: '/30/Absence', model: 'Absence', idField: 'absenceId' }
                ],
                'talent': [
                    { key: 'reviews', label: 'Reviews', icon: 'reviews', endpoint: '/30/PerfRevw', model: 'PerformanceReview', idField: 'reviewId' },
                    { key: 'goals', label: 'Goals', icon: 'goals', endpoint: '/30/Goal', model: 'Goal', idField: 'goalId' },
                    { key: 'feedback', label: 'Feedback', icon: 'feedback', endpoint: '/30/Feedback', model: 'Feedback', idField: 'feedbackId' },
                    { key: 'career-paths', label: 'Career Paths', icon: 'career-paths', endpoint: '/30/CarPath', model: 'CareerPath', idField: 'careerPathId' },
                    { key: 'succession', label: 'Succession Plans', icon: 'succession', endpoint: '/30/SuccPlan', model: 'SuccessionPlan', idField: 'successionPlanId' },
                    { key: 'requisitions', label: 'Requisitions', icon: 'requisitions', endpoint: '/30/JobReq', model: 'JobRequisition', idField: 'requisitionId' },
                    { key: 'applicants', label: 'Applicants', icon: 'applicants', endpoint: '/30/Applicant', model: 'Applicant', idField: 'applicantId' },
                    { key: 'applications', label: 'Applications', icon: 'applications', endpoint: '/30/Applctn', model: 'Application', idField: 'applicationId' },
                    { key: 'onboarding', label: 'Onboarding', icon: 'onboarding', endpoint: '/30/OnbrdTsk', model: 'OnboardingTask', idField: 'taskId' }
                ],
                'learning': [
                    { key: 'courses', label: 'Courses', icon: 'courses', endpoint: '/30/Course', model: 'Course', idField: 'courseId' },
                    { key: 'sessions', label: 'Sessions', icon: 'sessions', endpoint: '/30/CrsSess', model: 'CourseSession', idField: 'sessionId' },
                    { key: 'course-enrollments', label: 'Enrollments', icon: 'enrollments', endpoint: '/30/CrsEnrol', model: 'CourseEnrollment', idField: 'enrollmentId' },
                    { key: 'certifications', label: 'Certifications', icon: 'certifications', endpoint: '/30/Cert', model: 'Certification', idField: 'certificationId' },
                    { key: 'emp-certifications', label: 'Emp. Certs', icon: 'emp-certifications', endpoint: '/30/EmpCert', model: 'EmployeeCertification', idField: 'empCertificationId' },
                    { key: 'skills', label: 'Skills', icon: 'skills', endpoint: '/30/Skill', model: 'Skill', idField: 'skillId' },
                    { key: 'emp-skills', label: 'Emp. Skills', icon: 'emp-skills', endpoint: '/30/EmpSkill', model: 'EmployeeSkill', idField: 'empSkillId' },
                    { key: 'training-records', label: 'Training Records', icon: 'training-records', endpoint: '/30/TrnRec', model: 'TrainingRecord', idField: 'recordId' }
                ],
                'compensation': [
                    { key: 'salary-grades', label: 'Salary Grades', icon: 'salary-grades', endpoint: '/30/SalGrade', model: 'SalaryGrade', idField: 'salaryGradeId' },
                    { key: 'salary-structures', label: 'Salary Structures', icon: 'salary-structures', endpoint: '/30/SalStrct', model: 'SalaryStructure', idField: 'salaryStructureId' },
                    { key: 'emp-compensation', label: 'Emp. Compensation', icon: 'emp-compensation', endpoint: '/30/EmpComp', model: 'EmployeeCompensation', idField: 'empCompensationId' },
                    { key: 'merit-increases', label: 'Merit Increases', icon: 'merit-increases', endpoint: '/30/MeritInc', model: 'MeritIncrease', idField: 'meritIncreaseId' },
                    { key: 'merit-cycles', label: 'Merit Cycles', icon: 'merit-cycles', endpoint: '/30/MrtCycle', model: 'MeritCycle', idField: 'meritCycleId' },
                    { key: 'bonus-plans', label: 'Bonus Plans', icon: 'bonus-plans', endpoint: '/30/BonusPlan', model: 'BonusPlan', idField: 'bonusPlanId' },
                    { key: 'bonus-payments', label: 'Bonus Payments', icon: 'bonus-payments', endpoint: '/30/BonusPay', model: 'BonusPayment', idField: 'bonusPaymentId' },
                    { key: 'equity-grants', label: 'Equity Grants', icon: 'equity-grants', endpoint: '/30/EqGrant', model: 'EquityGrant', idField: 'equityGrantId' },
                    { key: 'comp-statements', label: 'Comp. Statements', icon: 'comp-statements', endpoint: '/30/CompStmt', model: 'CompensationStatement', idField: 'statementId' },
                    { key: 'market-benchmarks', label: 'Market Benchmarks', icon: 'market-benchmarks', endpoint: '/30/MktBench', model: 'MarketBenchmark', idField: 'benchmarkId' }
                ]
            }
        },

        // SCM Sub-Modules (Level 2)
        scm: {
            subModules: [
                { key: 'procurement', label: 'Procurement', icon: 'procurement' },
                { key: 'inventory', label: 'Inventory', icon: 'inventory' },
                { key: 'warehouse', label: 'Warehouse', icon: 'warehouse' },
                { key: 'logistics', label: 'Logistics', icon: 'logistics' },
                { key: 'demand-planning', label: 'Demand Planning', icon: 'demand-planning' },
                { key: 'supply-planning', label: 'Supply Planning', icon: 'supply-planning' }
            ],

            // Services for each sub-module (Level 3) - EXACT order from desktop scm-config.js
            services: {
                'procurement': [
                    { key: 'purchase-requisitions', label: 'Requisitions', icon: 'procurement', endpoint: '/50/PurchReq', model: 'ScmPurchaseRequisition', idField: 'requisitionId' },
                    { key: 'requisition-lines', label: 'Req. Lines', icon: 'procurement', endpoint: '/50/ReqLine', model: 'ScmRequisitionLine', idField: 'lineId' },
                    { key: 'rfqs', label: 'RFQs', icon: 'procurement', endpoint: '/50/RFQ', model: 'ScmRequestForQuotation', idField: 'rfqId' },
                    { key: 'purchase-orders', label: 'Purchase Orders', icon: 'procurement', endpoint: '/50/PurchOrder', model: 'ScmPurchaseOrder', idField: 'purchaseOrderId' },
                    { key: 'po-lines', label: 'PO Lines', icon: 'procurement', endpoint: '/50/POLine', model: 'ScmPurchaseOrderLine', idField: 'lineId' },
                    { key: 'blanket-orders', label: 'Blanket Orders', icon: 'procurement', endpoint: '/50/BlnktOrder', model: 'ScmBlanketOrder', idField: 'blanketOrderId' },
                    { key: 'supplier-scorecards', label: 'Scorecards', icon: 'procurement', endpoint: '/50/SupplrCard', model: 'ScmSupplierScorecard', idField: 'scorecardId' }
                ],
                'inventory': [
                    { key: 'items', label: 'Items', icon: 'inventory', endpoint: '/50/Item', model: 'ScmItem', idField: 'itemId' },
                    { key: 'item-categories', label: 'Categories', icon: 'inventory', endpoint: '/50/ItemCat', model: 'ScmItemCategory', idField: 'categoryId' },
                    { key: 'stock-movements', label: 'Stock Movements', icon: 'inventory', endpoint: '/50/StockMove', model: 'ScmStockMovement', idField: 'movementId' },
                    { key: 'lot-numbers', label: 'Lot Numbers', icon: 'inventory', endpoint: '/50/LotNumber', model: 'ScmLotNumber', idField: 'lotId' },
                    { key: 'serial-numbers', label: 'Serial Numbers', icon: 'inventory', endpoint: '/50/SerialNum', model: 'ScmSerialNumber', idField: 'serialId' },
                    { key: 'cycle-counts', label: 'Cycle Counts', icon: 'inventory', endpoint: '/50/CycleCount', model: 'ScmCycleCount', idField: 'cycleCountId' },
                    { key: 'reorder-points', label: 'Reorder Points', icon: 'inventory', endpoint: '/50/ReorderPt', model: 'ScmReorderPoint', idField: 'reorderPointId' },
                    { key: 'inventory-valuations', label: 'Valuations', icon: 'inventory', endpoint: '/50/InvValue', model: 'ScmInventoryValuation', idField: 'valuationId' }
                ],
                'warehouse': [
                    { key: 'warehouses', label: 'Warehouses', icon: 'warehouse', endpoint: '/50/Warehouse', model: 'ScmWarehouse', idField: 'warehouseId' },
                    { key: 'bins', label: 'Bins', icon: 'warehouse', endpoint: '/50/Bin', model: 'ScmBin', idField: 'binId' },
                    { key: 'receiving-orders', label: 'Receiving', icon: 'warehouse', endpoint: '/50/RecvOrder', model: 'ScmReceivingOrder', idField: 'receivingOrderId' },
                    { key: 'putaway-tasks', label: 'Put Away', icon: 'warehouse', endpoint: '/50/PutAway', model: 'ScmPutawayTask', idField: 'taskId' },
                    { key: 'pick-tasks', label: 'Pick Tasks', icon: 'warehouse', endpoint: '/50/PickTask', model: 'ScmPickTask', idField: 'taskId' },
                    { key: 'pack-tasks', label: 'Pack Tasks', icon: 'warehouse', endpoint: '/50/PackTask', model: 'ScmPackTask', idField: 'taskId' },
                    { key: 'ship-tasks', label: 'Ship Tasks', icon: 'warehouse', endpoint: '/50/ShipTask', model: 'ScmShipTask', idField: 'taskId' },
                    { key: 'wave-plans', label: 'Wave Plans', icon: 'warehouse', endpoint: '/50/WavePlan', model: 'ScmWavePlan', idField: 'wavePlanId' },
                    { key: 'dock-schedules', label: 'Dock Schedules', icon: 'warehouse', endpoint: '/50/DockSched', model: 'ScmDockSchedule', idField: 'scheduleId' }
                ],
                'logistics': [
                    { key: 'carriers', label: 'Carriers', icon: 'logistics', endpoint: '/50/ScmCarrier', model: 'ScmCarrier', idField: 'carrierId' },
                    { key: 'freight-rates', label: 'Freight Rates', icon: 'logistics', endpoint: '/50/FreightRt', model: 'ScmFreightRate', idField: 'rateId' },
                    { key: 'shipments', label: 'Shipments', icon: 'logistics', endpoint: '/50/Shipment', model: 'ScmShipment', idField: 'shipmentId' },
                    { key: 'routes', label: 'Routes', icon: 'logistics', endpoint: '/50/Route', model: 'ScmRoute', idField: 'routeId' },
                    { key: 'load-plans', label: 'Load Plans', icon: 'logistics', endpoint: '/50/LoadPlan', model: 'ScmLoadPlan', idField: 'loadPlanId' },
                    { key: 'delivery-proofs', label: 'Delivery Proofs', icon: 'logistics', endpoint: '/50/DlvryProof', model: 'ScmDeliveryProof', idField: 'proofId' },
                    { key: 'freight-audits', label: 'Freight Audits', icon: 'logistics', endpoint: '/50/FrtAudit', model: 'ScmFreightAudit', idField: 'auditId' },
                    { key: 'return-authorizations', label: 'Returns', icon: 'logistics', endpoint: '/50/ReturnAuth', model: 'ScmReturnAuthorization', idField: 'rmaId' }
                ],
                'demand-planning': [
                    { key: 'demand-forecasts', label: 'Forecasts', icon: 'demand-planning', endpoint: '/50/DmndFcast', model: 'ScmDemandForecast', idField: 'forecastId' },
                    { key: 'forecast-models', label: 'Models', icon: 'demand-planning', endpoint: '/50/FcastModel', model: 'ScmForecastModel', idField: 'modelId' },
                    { key: 'demand-plans', label: 'Demand Plans', icon: 'demand-planning', endpoint: '/50/DemandPlan', model: 'ScmDemandPlan', idField: 'planId' },
                    { key: 'promo-plans', label: 'Promotions', icon: 'demand-planning', endpoint: '/50/PromoPlan', model: 'ScmPromotionalPlan', idField: 'planId' },
                    { key: 'new-product-plans', label: 'New Products', icon: 'demand-planning', endpoint: '/50/NewProdPln', model: 'ScmNewProductPlan', idField: 'planId' },
                    { key: 'forecast-accuracies', label: 'Accuracy', icon: 'demand-planning', endpoint: '/50/FcastAccur', model: 'ScmForecastAccuracy', idField: 'accuracyId' }
                ],
                'supply-planning': [
                    { key: 'material-requirements', label: 'Material Reqs', icon: 'supply-planning', endpoint: '/50/MatReq', model: 'ScmMaterialRequirement', idField: 'requirementId' },
                    { key: 'distribution-requirements', label: 'Distribution Reqs', icon: 'supply-planning', endpoint: '/50/DistReq', model: 'ScmDistributionRequirement', idField: 'requirementId' },
                    { key: 'supply-plans', label: 'Supply Plans', icon: 'supply-planning', endpoint: '/50/SupplyPlan', model: 'ScmSupplyPlan', idField: 'planId' },
                    { key: 'supplier-collaborations', label: 'Collaborations', icon: 'supply-planning', endpoint: '/50/SupCollab', model: 'ScmSupplierCollaboration', idField: 'collaborationId' },
                    { key: 'safety-stocks', label: 'Safety Stock', icon: 'supply-planning', endpoint: '/50/SafeStock', model: 'ScmSafetyStock', idField: 'safetyStockId' },
                    { key: 'lead-times', label: 'Lead Times', icon: 'supply-planning', endpoint: '/50/LeadTime', model: 'ScmLeadTime', idField: 'leadTimeId' }
                ]
            }
        },

        // System Sub-Modules (Level 2)
        system: {
            subModules: [
                { key: 'health', label: 'Health', icon: 'health' },
                { key: 'security', label: 'Security', icon: 'security' }
            ],

            services: {
                'health': [
                    { key: 'health-monitor', label: 'Health Monitor', icon: 'health', endpoint: '/0/Health', model: 'L8Health', idField: 'service', readOnly: true }
                ],
                'security': [
                    { key: 'users', label: 'Users', icon: 'users', endpoint: '/73/users', model: 'L8User', idField: 'userId' },
                    { key: 'roles', label: 'Roles', icon: 'roles', endpoint: '/74/roles', model: 'L8Role', idField: 'roleId' },
                    { key: 'credentials', label: 'Credentials', icon: 'credentials', endpoint: '/75/Creds', model: 'L8Credentials', idField: 'id' }
                ]
            }
        },

        // SVG icons for navigation
        icons: {
            'dashboard': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
            'financial': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
            'hcm': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
            'scm': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
            'manufacturing': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path></svg>',
            'sales': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>',
            'crm': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
            'projects': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
            'bi': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>',
            'documents': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
            'ecommerce': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
            'compliance': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
            'system': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
            'employees': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
            'benefits': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
            'time': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
            'talent': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
            'learning': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
            'compensation': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
            'positions': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
            'jobs': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
            'job-families': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
            'organizations': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path></svg>',
            'departments': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M9 21V8l3-3 3 3v13"></path><path d="M3 21V11h4"></path><path d="M17 21V11h4"></path></svg>',
            'procurement': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>',
            'inventory': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
            'warehouse': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M5 21V7l7-4 7 4v14"></path><path d="M9 21v-6h6v6"></path></svg>',
            'logistics': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
            'demand-planning': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
            'supply-planning': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
            'health': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>',
            'security': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
            'users': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
            'roles': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
            'credentials': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>',
            'back': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>',
            'default': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>'
        },

        // Get icon SVG by key
        getIcon(key) {
            return this.icons[key] || this.icons['default'];
        }
    };

})();
