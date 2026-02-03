/*
 * © 2025 Sharon Aicler (saichler@gmail.com)
 *
 * Layer 8 Ecosystem is licensed under the Apache License, Version 2.0.
 * You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package main

import (
	"github.com/saichler/l8erp/go/erp/common"
	"github.com/saichler/l8erp/go/types/fin"
	"github.com/saichler/l8erp/go/types/hcm"
	"github.com/saichler/l8erp/go/types/scm"
	"strconv"

	"github.com/saichler/l8bus/go/overlay/health"
	"github.com/saichler/l8bus/go/overlay/vnic"
	"github.com/saichler/l8types/go/ifs"
	"github.com/saichler/l8utils/go/utils/ipsegment"
	"github.com/saichler/l8web/go/web/server"
)

func main() {
	startWebServer(2773, "/data/probler")
}

func startWebServer(port int, cert string) {
	serverConfig := &server.RestServerConfig{
		Host:           ipsegment.MachineIP,
		Port:           port,
		Authentication: true,
		CertName:       cert,
		Prefix:         common.PREFIX,
	}
	svr, err := server.NewRestServer(serverConfig)
	if err != nil {
		panic(err)
	}

	nic1 := createVnic(common.ERP_VNET)
	//nic2 := createVnic(common.LOGS_VNET)

	hs, ok := nic1.Resources().Services().ServiceHandler(health.ServiceName, 0)
	if ok {
		ws := hs.WebService()
		svr.RegisterWebService(ws, nic1)
	}

	//Activate the webpoints service
	sla := ifs.NewServiceLevelAgreement(&server.WebService{}, ifs.WebService, 0, false, nil)
	sla.SetArgs(svr)
	nic1.Resources().Services().Activate(sla, nic1)

	nic1.Resources().Logger().Info("Web Server Started!")

	svr.Start()
}

func createVnic(vnet uint32) ifs.IVNic {
	resources := common.CreateResources("web-" + strconv.Itoa(int(vnet)))
	resources.SysConfig().VnetPort = vnet

	registerTypes(resources)

	nic := vnic.NewVirtualNetworkInterface(resources, nil)
	nic.Resources().SysConfig().KeepAliveIntervalSeconds = 60
	nic.Start()
	nic.WaitForConnection()

	return nic
}

func registerTypes(resources ifs.IResources) {
	// Core HR
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Employee{}, "EmployeeId")
	resources.Registry().Register(&hcm.EmployeeList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Position{}, "PositionId")
	resources.Registry().Register(&hcm.PositionList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Job{}, "JobId")
	resources.Registry().Register(&hcm.JobList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.JobFamily{}, "JobFamilyId")
	resources.Registry().Register(&hcm.JobFamilyList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Organization{}, "OrganizationId")
	resources.Registry().Register(&hcm.OrganizationList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Department{}, "DepartmentId")
	resources.Registry().Register(&hcm.DepartmentList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.EmployeeDocument{}, "DocumentId")
	resources.Registry().Register(&hcm.EmployeeDocumentList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.ComplianceRecord{}, "RecordId")
	resources.Registry().Register(&hcm.ComplianceRecordList{})

	// Payroll
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.PayStructure{}, "PayStructureId")
	resources.Registry().Register(&hcm.PayStructureList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.PayComponent{}, "ComponentId")
	resources.Registry().Register(&hcm.PayComponentList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.PayrollRun{}, "PayrollRunId")
	resources.Registry().Register(&hcm.PayrollRunList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Payslip{}, "PayslipId")
	resources.Registry().Register(&hcm.PayslipList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.TaxWithholding{}, "WithholdingId")
	resources.Registry().Register(&hcm.TaxWithholdingList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.DirectDeposit{}, "DirectDepositId")
	resources.Registry().Register(&hcm.DirectDepositList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Garnishment{}, "GarnishmentId")
	resources.Registry().Register(&hcm.GarnishmentList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.YearEndDocument{}, "DocumentId")
	resources.Registry().Register(&hcm.YearEndDocumentList{})

	// Benefits
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.BenefitPlan{}, "PlanId")
	resources.Registry().Register(&hcm.BenefitPlanList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.BenefitEnrollment{}, "EnrollmentId")
	resources.Registry().Register(&hcm.BenefitEnrollmentList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Carrier{}, "CarrierId")
	resources.Registry().Register(&hcm.CarrierList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Dependent{}, "DependentId")
	resources.Registry().Register(&hcm.DependentList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.LifeEvent{}, "LifeEventId")
	resources.Registry().Register(&hcm.LifeEventList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.COBRAEvent{}, "CobraEventId")
	resources.Registry().Register(&hcm.COBRAEventList{})

	// Time & Attendance
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Timesheet{}, "TimesheetId")
	resources.Registry().Register(&hcm.TimesheetList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.LeaveRequest{}, "RequestId")
	resources.Registry().Register(&hcm.LeaveRequestList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.LeaveBalance{}, "BalanceId")
	resources.Registry().Register(&hcm.LeaveBalanceList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.LeavePolicy{}, "PolicyId")
	resources.Registry().Register(&hcm.LeavePolicyList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Shift{}, "ShiftId")
	resources.Registry().Register(&hcm.ShiftList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Schedule{}, "ScheduleId")
	resources.Registry().Register(&hcm.ScheduleList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Holiday{}, "HolidayId")
	resources.Registry().Register(&hcm.HolidayList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Absence{}, "AbsenceId")
	resources.Registry().Register(&hcm.AbsenceList{})

	// Talent
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.PerformanceReview{}, "ReviewId")
	resources.Registry().Register(&hcm.PerformanceReviewList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Goal{}, "GoalId")
	resources.Registry().Register(&hcm.GoalList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Feedback{}, "FeedbackId")
	resources.Registry().Register(&hcm.FeedbackList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.CareerPath{}, "CareerPathId")
	resources.Registry().Register(&hcm.CareerPathList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.SuccessionPlan{}, "PlanId")
	resources.Registry().Register(&hcm.SuccessionPlanList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.JobRequisition{}, "RequisitionId")
	resources.Registry().Register(&hcm.JobRequisitionList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Applicant{}, "ApplicantId")
	resources.Registry().Register(&hcm.ApplicantList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Application{}, "ApplicationId")
	resources.Registry().Register(&hcm.ApplicationList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.OnboardingTask{}, "TaskId")
	resources.Registry().Register(&hcm.OnboardingTaskList{})

	// Learning
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Course{}, "CourseId")
	resources.Registry().Register(&hcm.CourseList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.CourseSession{}, "SessionId")
	resources.Registry().Register(&hcm.CourseSessionList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.CourseEnrollment{}, "EnrollmentId")
	resources.Registry().Register(&hcm.CourseEnrollmentList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Certification{}, "CertificationId")
	resources.Registry().Register(&hcm.CertificationList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.EmployeeCertification{}, "EmployeeCertificationId")
	resources.Registry().Register(&hcm.EmployeeCertificationList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.Skill{}, "SkillId")
	resources.Registry().Register(&hcm.SkillList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.EmployeeSkill{}, "EmployeeSkillId")
	resources.Registry().Register(&hcm.EmployeeSkillList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.TrainingRecord{}, "RecordId")
	resources.Registry().Register(&hcm.TrainingRecordList{})

	// Compensation
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.SalaryGrade{}, "GradeId")
	resources.Registry().Register(&hcm.SalaryGradeList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.SalaryStructure{}, "StructureId")
	resources.Registry().Register(&hcm.SalaryStructureList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.EmployeeCompensation{}, "CompensationId")
	resources.Registry().Register(&hcm.EmployeeCompensationList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.MeritIncrease{}, "IncreaseId")
	resources.Registry().Register(&hcm.MeritIncreaseList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.MeritCycle{}, "CycleId")
	resources.Registry().Register(&hcm.MeritCycleList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.BonusPlan{}, "PlanId")
	resources.Registry().Register(&hcm.BonusPlanList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.BonusPayment{}, "PaymentId")
	resources.Registry().Register(&hcm.BonusPaymentList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.EquityGrant{}, "GrantId")
	resources.Registry().Register(&hcm.EquityGrantList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.CompensationStatement{}, "StatementId")
	resources.Registry().Register(&hcm.CompensationStatementList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&hcm.MarketBenchmark{}, "BenchmarkId")
	resources.Registry().Register(&hcm.MarketBenchmarkList{})

	registerFinTypes(resources)
	registerScmTypes(resources)
}

func registerFinTypes(resources ifs.IResources) {
	// General Ledger
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.Account{}, "AccountId")
	resources.Registry().Register(&fin.AccountList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.JournalEntry{}, "JournalEntryId")
	resources.Registry().Register(&fin.JournalEntryList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.JournalEntryLine{}, "LineId")
	resources.Registry().Register(&fin.JournalEntryLineList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.FiscalYear{}, "FiscalYearId")
	resources.Registry().Register(&fin.FiscalYearList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.FiscalPeriod{}, "FiscalPeriodId")
	resources.Registry().Register(&fin.FiscalPeriodList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.Currency{}, "CurrencyId")
	resources.Registry().Register(&fin.CurrencyList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.ExchangeRate{}, "ExchangeRateId")
	resources.Registry().Register(&fin.ExchangeRateList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.AccountBalance{}, "BalanceId")
	resources.Registry().Register(&fin.AccountBalanceList{})

	// Accounts Payable
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.Vendor{}, "VendorId")
	resources.Registry().Register(&fin.VendorList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.VendorContact{}, "ContactId")
	resources.Registry().Register(&fin.VendorContactList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.PurchaseInvoice{}, "InvoiceId")
	resources.Registry().Register(&fin.PurchaseInvoiceList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.PurchaseInvoiceLine{}, "LineId")
	resources.Registry().Register(&fin.PurchaseInvoiceLineList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.PaymentSchedule{}, "ScheduleId")
	resources.Registry().Register(&fin.PaymentScheduleList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.VendorPayment{}, "PaymentId")
	resources.Registry().Register(&fin.VendorPaymentList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.PaymentAllocation{}, "AllocationId")
	resources.Registry().Register(&fin.PaymentAllocationList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.VendorStatement{}, "StatementId")
	resources.Registry().Register(&fin.VendorStatementList{})

	// Accounts Receivable
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.Customer{}, "CustomerId")
	resources.Registry().Register(&fin.CustomerList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.CustomerContact{}, "ContactId")
	resources.Registry().Register(&fin.CustomerContactList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.SalesInvoice{}, "InvoiceId")
	resources.Registry().Register(&fin.SalesInvoiceList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.SalesInvoiceLine{}, "LineId")
	resources.Registry().Register(&fin.SalesInvoiceLineList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.CustomerPayment{}, "PaymentId")
	resources.Registry().Register(&fin.CustomerPaymentList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.PaymentApplication{}, "ApplicationId")
	resources.Registry().Register(&fin.PaymentApplicationList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.CreditMemo{}, "CreditMemoId")
	resources.Registry().Register(&fin.CreditMemoList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.DunningLetter{}, "LetterId")
	resources.Registry().Register(&fin.DunningLetterList{})

	// Cash Management
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.BankAccount{}, "BankAccountId")
	resources.Registry().Register(&fin.BankAccountList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.BankTransaction{}, "TransactionId")
	resources.Registry().Register(&fin.BankTransactionList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.BankReconciliation{}, "ReconciliationId")
	resources.Registry().Register(&fin.BankReconciliationList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.CashForecast{}, "ForecastId")
	resources.Registry().Register(&fin.CashForecastList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.FundTransfer{}, "TransferId")
	resources.Registry().Register(&fin.FundTransferList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.PettyCash{}, "PettyCashId")
	resources.Registry().Register(&fin.PettyCashList{})

	// Fixed Assets
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.Asset{}, "AssetId")
	resources.Registry().Register(&fin.AssetList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.AssetCategory{}, "CategoryId")
	resources.Registry().Register(&fin.AssetCategoryList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.DepreciationSchedule{}, "ScheduleId")
	resources.Registry().Register(&fin.DepreciationScheduleList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.AssetDisposal{}, "DisposalId")
	resources.Registry().Register(&fin.AssetDisposalList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.AssetTransfer{}, "TransferId")
	resources.Registry().Register(&fin.AssetTransferList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.AssetMaintenance{}, "MaintenanceId")
	resources.Registry().Register(&fin.AssetMaintenanceList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.AssetRevaluation{}, "RevaluationId")
	resources.Registry().Register(&fin.AssetRevaluationList{})

	// Budgeting
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.Budget{}, "BudgetId")
	resources.Registry().Register(&fin.BudgetList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.BudgetLine{}, "LineId")
	resources.Registry().Register(&fin.BudgetLineList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.BudgetTransfer{}, "TransferId")
	resources.Registry().Register(&fin.BudgetTransferList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.BudgetScenario{}, "ScenarioId")
	resources.Registry().Register(&fin.BudgetScenarioList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.CapitalExpenditure{}, "CapexId")
	resources.Registry().Register(&fin.CapitalExpenditureList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.Forecast{}, "ForecastId")
	resources.Registry().Register(&fin.ForecastList{})

	// Tax
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.TaxCode{}, "TaxCodeId")
	resources.Registry().Register(&fin.TaxCodeList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.TaxJurisdiction{}, "JurisdictionId")
	resources.Registry().Register(&fin.TaxJurisdictionList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.TaxRule{}, "RuleId")
	resources.Registry().Register(&fin.TaxRuleList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.TaxReturn{}, "ReturnId")
	resources.Registry().Register(&fin.TaxReturnList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.TaxExemption{}, "ExemptionId")
	resources.Registry().Register(&fin.TaxExemptionList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&fin.WithholdingTaxConfig{}, "ConfigId")
	resources.Registry().Register(&fin.WithholdingTaxConfigList{})
}

func registerScmTypes(resources ifs.IResources) {
	// Procurement
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmPurchaseRequisition{}, "RequisitionId")
	resources.Registry().Register(&scm.ScmPurchaseRequisitionList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmRequisitionLine{}, "LineId")
	resources.Registry().Register(&scm.ScmRequisitionLineList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmRequestForQuotation{}, "RfqId")
	resources.Registry().Register(&scm.ScmRequestForQuotationList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmPurchaseOrder{}, "PurchaseOrderId")
	resources.Registry().Register(&scm.ScmPurchaseOrderList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmPurchaseOrderLine{}, "LineId")
	resources.Registry().Register(&scm.ScmPurchaseOrderLineList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmBlanketOrder{}, "BlanketOrderId")
	resources.Registry().Register(&scm.ScmBlanketOrderList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmSupplierScorecard{}, "ScorecardId")
	resources.Registry().Register(&scm.ScmSupplierScorecardList{})

	// Inventory Management
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmItem{}, "ItemId")
	resources.Registry().Register(&scm.ScmItemList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmItemCategory{}, "CategoryId")
	resources.Registry().Register(&scm.ScmItemCategoryList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmStockMovement{}, "MovementId")
	resources.Registry().Register(&scm.ScmStockMovementList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmLotNumber{}, "LotId")
	resources.Registry().Register(&scm.ScmLotNumberList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmSerialNumber{}, "SerialId")
	resources.Registry().Register(&scm.ScmSerialNumberList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmCycleCount{}, "CycleCountId")
	resources.Registry().Register(&scm.ScmCycleCountList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmReorderPoint{}, "ReorderPointId")
	resources.Registry().Register(&scm.ScmReorderPointList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmInventoryValuation{}, "ValuationId")
	resources.Registry().Register(&scm.ScmInventoryValuationList{})

	// Warehouse Management
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmWarehouse{}, "WarehouseId")
	resources.Registry().Register(&scm.ScmWarehouseList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmBin{}, "BinId")
	resources.Registry().Register(&scm.ScmBinList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmReceivingOrder{}, "ReceivingOrderId")
	resources.Registry().Register(&scm.ScmReceivingOrderList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmPutawayTask{}, "TaskId")
	resources.Registry().Register(&scm.ScmPutawayTaskList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmPickTask{}, "TaskId")
	resources.Registry().Register(&scm.ScmPickTaskList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmPackTask{}, "TaskId")
	resources.Registry().Register(&scm.ScmPackTaskList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmShipTask{}, "TaskId")
	resources.Registry().Register(&scm.ScmShipTaskList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmWavePlan{}, "WavePlanId")
	resources.Registry().Register(&scm.ScmWavePlanList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmDockSchedule{}, "ScheduleId")
	resources.Registry().Register(&scm.ScmDockScheduleList{})

	// Logistics and Transportation
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmCarrier{}, "CarrierId")
	resources.Registry().Register(&scm.ScmCarrierList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmFreightRate{}, "RateId")
	resources.Registry().Register(&scm.ScmFreightRateList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmShipment{}, "ShipmentId")
	resources.Registry().Register(&scm.ScmShipmentList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmRoute{}, "RouteId")
	resources.Registry().Register(&scm.ScmRouteList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmLoadPlan{}, "LoadPlanId")
	resources.Registry().Register(&scm.ScmLoadPlanList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmDeliveryProof{}, "ProofId")
	resources.Registry().Register(&scm.ScmDeliveryProofList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmFreightAudit{}, "AuditId")
	resources.Registry().Register(&scm.ScmFreightAuditList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmReturnAuthorization{}, "RmaId")
	resources.Registry().Register(&scm.ScmReturnAuthorizationList{})

	// Demand Planning
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmDemandForecast{}, "ForecastId")
	resources.Registry().Register(&scm.ScmDemandForecastList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmForecastModel{}, "ModelId")
	resources.Registry().Register(&scm.ScmForecastModelList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmDemandPlan{}, "PlanId")
	resources.Registry().Register(&scm.ScmDemandPlanList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmPromotionalPlan{}, "PlanId")
	resources.Registry().Register(&scm.ScmPromotionalPlanList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmNewProductPlan{}, "PlanId")
	resources.Registry().Register(&scm.ScmNewProductPlanList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmForecastAccuracy{}, "AccuracyId")
	resources.Registry().Register(&scm.ScmForecastAccuracyList{})

	// Supply Planning
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmMaterialRequirement{}, "RequirementId")
	resources.Registry().Register(&scm.ScmMaterialRequirementList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmDistributionRequirement{}, "RequirementId")
	resources.Registry().Register(&scm.ScmDistributionRequirementList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmSupplyPlan{}, "PlanId")
	resources.Registry().Register(&scm.ScmSupplyPlanList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmSupplierCollaboration{}, "CollaborationId")
	resources.Registry().Register(&scm.ScmSupplierCollaborationList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmSafetyStock{}, "SafetyStockId")
	resources.Registry().Register(&scm.ScmSafetyStockList{})
	resources.Introspector().Decorators().AddPrimaryKeyDecorator(&scm.ScmLeadTime{}, "LeadTimeId")
	resources.Registry().Register(&scm.ScmLeadTimeList{})
}
