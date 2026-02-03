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
 * Mobile Reference Registry
 * Central configuration for all reference/lookup fields.
 * Desktop Equivalent: shared/reference-registry.js
 *
 * This must match the desktop Layer8DReferenceRegistry EXACTLY.
 */
(function() {
    'use strict';

    window.Layer8MReferenceRegistry = {
        // ========================================
        // Core HR Models
        // ========================================
        Employee: {
            idColumn: 'employeeId',
            displayColumn: 'lastName',
            selectColumns: ['employeeId', 'lastName', 'firstName'],
            displayFormat: function(item) {
                return item.lastName + ', ' + item.firstName;
            },
            displayLabel: 'Name'
        },
        Organization: {
            idColumn: 'organizationId',
            displayColumn: 'name'
        },
        Department: {
            idColumn: 'departmentId',
            displayColumn: 'name'
        },
        Position: {
            idColumn: 'positionId',
            displayColumn: 'title'
        },
        Job: {
            idColumn: 'jobId',
            displayColumn: 'title'
        },
        JobFamily: {
            idColumn: 'jobFamilyId',
            displayColumn: 'name'
        },
        EmployeeDocument: {
            idColumn: 'documentId',
            displayColumn: 'name'
        },
        ComplianceRecord: {
            idColumn: 'recordId',
            displayColumn: 'recordId'
        },

        // ========================================
        // Time & Attendance Models
        // ========================================
        Timesheet: {
            idColumn: 'timesheetId',
            displayColumn: 'timesheetId'
        },
        LeaveRequest: {
            idColumn: 'requestId',
            displayColumn: 'requestId'
        },
        LeaveBalance: {
            idColumn: 'balanceId',
            displayColumn: 'balanceId'
        },
        LeavePolicy: {
            idColumn: 'policyId',
            displayColumn: 'name'
        },
        Shift: {
            idColumn: 'shiftId',
            displayColumn: 'name'
        },
        Schedule: {
            idColumn: 'scheduleId',
            displayColumn: 'scheduleId'
        },
        Holiday: {
            idColumn: 'holidayId',
            displayColumn: 'name'
        },
        Absence: {
            idColumn: 'absenceId',
            displayColumn: 'absenceId'
        },

        // ========================================
        // Benefits Models
        // ========================================
        BenefitPlan: {
            idColumn: 'planId',
            displayColumn: 'name'
        },
        BenefitEnrollment: {
            idColumn: 'enrollmentId',
            displayColumn: 'enrollmentId'
        },
        Carrier: {
            idColumn: 'carrierId',
            displayColumn: 'name'
        },
        Dependent: {
            idColumn: 'dependentId',
            displayColumn: 'firstName',
            selectColumns: ['dependentId', 'firstName', 'lastName'],
            displayFormat: function(item) {
                return item.lastName + ', ' + item.firstName;
            },
            displayLabel: 'Name'
        },
        LifeEvent: {
            idColumn: 'eventId',
            displayColumn: 'eventType'
        },
        COBRAEvent: {
            idColumn: 'cobraEventId',
            displayColumn: 'cobraEventId'
        },

        // ========================================
        // Talent Management Models
        // ========================================
        PerformanceReview: {
            idColumn: 'reviewId',
            displayColumn: 'reviewId'
        },
        Goal: {
            idColumn: 'goalId',
            displayColumn: 'title'
        },
        Feedback: {
            idColumn: 'feedbackId',
            displayColumn: 'feedbackId'
        },
        CareerPath: {
            idColumn: 'careerPathId',
            displayColumn: 'name'
        },
        SuccessionPlan: {
            idColumn: 'planId',
            displayColumn: 'planId'
        },
        JobRequisition: {
            idColumn: 'requisitionId',
            displayColumn: 'title'
        },
        Applicant: {
            idColumn: 'applicantId',
            displayColumn: 'lastName',
            selectColumns: ['applicantId', 'lastName', 'firstName'],
            displayFormat: function(item) {
                return item.lastName + ', ' + item.firstName;
            },
            displayLabel: 'Name'
        },
        Application: {
            idColumn: 'applicationId',
            displayColumn: 'applicationId'
        },
        OnboardingTask: {
            idColumn: 'taskId',
            displayColumn: 'name'
        },

        // ========================================
        // Learning Models
        // ========================================
        Course: {
            idColumn: 'courseId',
            displayColumn: 'title'
        },
        CourseSession: {
            idColumn: 'sessionId',
            displayColumn: 'sessionId'
        },
        CourseEnrollment: {
            idColumn: 'enrollmentId',
            displayColumn: 'enrollmentId'
        },
        Certification: {
            idColumn: 'certificationId',
            displayColumn: 'name'
        },
        EmployeeCertification: {
            idColumn: 'employeeCertificationId',
            displayColumn: 'employeeCertificationId'
        },
        Skill: {
            idColumn: 'skillId',
            displayColumn: 'name'
        },
        EmployeeSkill: {
            idColumn: 'employeeSkillId',
            displayColumn: 'employeeSkillId'
        },
        TrainingRecord: {
            idColumn: 'recordId',
            displayColumn: 'trainingName'
        },

        // ========================================
        // Compensation Models
        // ========================================
        SalaryStructure: {
            idColumn: 'structureId',
            displayColumn: 'name'
        },
        SalaryGrade: {
            idColumn: 'gradeId',
            displayColumn: 'name'
        },
        EmployeeCompensation: {
            idColumn: 'compensationId',
            displayColumn: 'compensationId'
        },
        MeritIncrease: {
            idColumn: 'increaseId',
            displayColumn: 'increaseId'
        },
        MeritCycle: {
            idColumn: 'cycleId',
            displayColumn: 'name'
        },
        BonusPlan: {
            idColumn: 'planId',
            displayColumn: 'name'
        },
        BonusPayment: {
            idColumn: 'paymentId',
            displayColumn: 'paymentId'
        },
        EquityGrant: {
            idColumn: 'grantId',
            displayColumn: 'grantNumber'
        },
        CompensationStatement: {
            idColumn: 'statementId',
            displayColumn: 'statementId'
        },
        MarketBenchmark: {
            idColumn: 'benchmarkId',
            displayColumn: 'jobTitle'
        },

        // ========================================
        // Payroll Models
        // ========================================
        PayStructure: {
            idColumn: 'structureId',
            displayColumn: 'name'
        },
        PayComponent: {
            idColumn: 'componentId',
            displayColumn: 'name'
        },
        PayrollRun: {
            idColumn: 'payrollRunId',
            displayColumn: 'payrollRunId'
        },
        Payslip: {
            idColumn: 'payslipId',
            displayColumn: 'payslipId'
        },
        TaxWithholding: {
            idColumn: 'withholdingId',
            displayColumn: 'withholdingId'
        },
        DirectDeposit: {
            idColumn: 'depositId',
            displayColumn: 'depositId'
        },
        Garnishment: {
            idColumn: 'garnishmentId',
            displayColumn: 'garnishmentId'
        },
        YearEndDocument: {
            idColumn: 'documentId',
            displayColumn: 'documentType'
        },

        // ========================================
        // SCM - Procurement Models
        // ========================================
        ScmPurchaseRequisition: {
            idColumn: 'requisitionId',
            displayColumn: 'requisitionNumber',
            selectColumns: ['requisitionId', 'requisitionNumber'],
            displayLabel: 'Requisition'
        },
        ScmRequisitionLine: {
            idColumn: 'lineId',
            displayColumn: 'lineId'
        },
        ScmRequestForQuotation: {
            idColumn: 'rfqId',
            displayColumn: 'rfqNumber',
            selectColumns: ['rfqId', 'rfqNumber'],
            displayLabel: 'RFQ'
        },
        ScmPurchaseOrder: {
            idColumn: 'purchaseOrderId',
            displayColumn: 'orderNumber',
            selectColumns: ['purchaseOrderId', 'orderNumber'],
            displayLabel: 'Purchase Order'
        },
        ScmPurchaseOrderLine: {
            idColumn: 'lineId',
            displayColumn: 'lineId'
        },
        ScmBlanketOrder: {
            idColumn: 'blanketOrderId',
            displayColumn: 'orderNumber',
            selectColumns: ['blanketOrderId', 'orderNumber'],
            displayLabel: 'Blanket Order'
        },
        ScmSupplierScorecard: {
            idColumn: 'scorecardId',
            displayColumn: 'scorecardId'
        },

        // ========================================
        // SCM - Inventory Models
        // ========================================
        ScmItem: {
            idColumn: 'itemId',
            displayColumn: 'name',
            selectColumns: ['itemId', 'itemNumber', 'name'],
            displayFormat: function(item) {
                return item.itemNumber + ' - ' + item.name;
            },
            displayLabel: 'Item'
        },
        ScmItemCategory: {
            idColumn: 'categoryId',
            displayColumn: 'categoryName'
        },
        ScmStockMovement: {
            idColumn: 'movementId',
            displayColumn: 'movementId'
        },
        ScmLotNumber: {
            idColumn: 'lotId',
            displayColumn: 'lotNumber'
        },
        ScmSerialNumber: {
            idColumn: 'serialId',
            displayColumn: 'serialNumber'
        },
        ScmCycleCount: {
            idColumn: 'cycleCountId',
            displayColumn: 'cycleCountId'
        },
        ScmReorderPoint: {
            idColumn: 'reorderPointId',
            displayColumn: 'reorderPointId'
        },
        ScmInventoryValuation: {
            idColumn: 'valuationId',
            displayColumn: 'valuationId'
        },

        // ========================================
        // SCM - Warehouse Management Models
        // ========================================
        ScmWarehouse: {
            idColumn: 'warehouseId',
            displayColumn: 'name',
            selectColumns: ['warehouseId', 'warehouseCode', 'name'],
            displayFormat: function(item) {
                return item.warehouseCode + ' - ' + item.name;
            },
            displayLabel: 'Warehouse'
        },
        ScmBin: {
            idColumn: 'binId',
            displayColumn: 'binCode'
        },
        ScmReceivingOrder: {
            idColumn: 'receivingOrderId',
            displayColumn: 'orderNumber'
        },
        ScmPutawayTask: {
            idColumn: 'taskId',
            displayColumn: 'taskId'
        },
        ScmPickTask: {
            idColumn: 'taskId',
            displayColumn: 'taskId'
        },
        ScmPackTask: {
            idColumn: 'taskId',
            displayColumn: 'taskId'
        },
        ScmShipTask: {
            idColumn: 'taskId',
            displayColumn: 'taskId'
        },
        ScmWavePlan: {
            idColumn: 'wavePlanId',
            displayColumn: 'waveName'
        },
        ScmDockSchedule: {
            idColumn: 'scheduleId',
            displayColumn: 'scheduleId'
        },

        // ========================================
        // SCM - Logistics Models
        // ========================================
        ScmCarrier: {
            idColumn: 'carrierId',
            displayColumn: 'name',
            selectColumns: ['carrierId', 'carrierCode', 'name'],
            displayFormat: function(item) {
                return item.carrierCode + ' - ' + item.name;
            },
            displayLabel: 'Carrier'
        },
        ScmFreightRate: {
            idColumn: 'rateId',
            displayColumn: 'rateId'
        },
        ScmShipment: {
            idColumn: 'shipmentId',
            displayColumn: 'shipmentNumber',
            selectColumns: ['shipmentId', 'shipmentNumber'],
            displayLabel: 'Shipment'
        },
        ScmRoute: {
            idColumn: 'routeId',
            displayColumn: 'routeName'
        },
        ScmLoadPlan: {
            idColumn: 'loadPlanId',
            displayColumn: 'planName'
        },
        ScmDeliveryProof: {
            idColumn: 'proofId',
            displayColumn: 'proofId'
        },
        ScmFreightAudit: {
            idColumn: 'auditId',
            displayColumn: 'auditId'
        },
        ScmReturnAuthorization: {
            idColumn: 'rmaId',
            displayColumn: 'rmaNumber',
            selectColumns: ['rmaId', 'rmaNumber'],
            displayLabel: 'RMA'
        },

        // ========================================
        // SCM - Demand Planning Models
        // ========================================
        ScmDemandForecast: {
            idColumn: 'forecastId',
            displayColumn: 'forecastName',
            selectColumns: ['forecastId', 'forecastName'],
            displayLabel: 'Forecast'
        },
        ScmForecastModel: {
            idColumn: 'modelId',
            displayColumn: 'modelName'
        },
        ScmDemandPlan: {
            idColumn: 'planId',
            displayColumn: 'planName'
        },
        ScmPromotionalPlan: {
            idColumn: 'planId',
            displayColumn: 'planName'
        },
        ScmNewProductPlan: {
            idColumn: 'planId',
            displayColumn: 'productName'
        },
        ScmForecastAccuracy: {
            idColumn: 'accuracyId',
            displayColumn: 'accuracyId'
        },

        // ========================================
        // SCM - Supply Planning Models
        // ========================================
        ScmMaterialRequirement: {
            idColumn: 'requirementId',
            displayColumn: 'requirementId'
        },
        ScmDistributionRequirement: {
            idColumn: 'requirementId',
            displayColumn: 'requirementId'
        },
        ScmSupplyPlan: {
            idColumn: 'planId',
            displayColumn: 'planName',
            selectColumns: ['planId', 'planName'],
            displayLabel: 'Supply Plan'
        },
        ScmSupplierCollaboration: {
            idColumn: 'collaborationId',
            displayColumn: 'collaborationId'
        },
        ScmSafetyStock: {
            idColumn: 'safetyStockId',
            displayColumn: 'safetyStockId'
        },
        ScmLeadTime: {
            idColumn: 'leadTimeId',
            displayColumn: 'leadTimeId'
        }

        // ========================================
        // Future: Financial, Manufacturing models
        // ========================================
    };

    /**
     * Get configuration for a model
     * @param {string} modelName - The model name (e.g., 'Employee')
     * @returns {Object|null} Configuration object or null
     */
    Layer8MReferenceRegistry.get = function(modelName) {
        return this[modelName] || null;
    };

    /**
     * Check if a model is registered
     * @param {string} modelName - The model name
     * @returns {boolean} True if model exists
     */
    Layer8MReferenceRegistry.has = function(modelName) {
        return this.hasOwnProperty(modelName) && typeof this[modelName] === 'object';
    };

    /**
     * Get all registered model names
     * @returns {string[]} Array of model names
     */
    Layer8MReferenceRegistry.getModelNames = function() {
        return Object.keys(this).filter(key => typeof this[key] === 'object');
    };

})();
