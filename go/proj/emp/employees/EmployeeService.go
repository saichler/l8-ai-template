package employees

import (
	"github.com/saichler/l8-ai-template/go/types/example"
	"github.com/saichler/l8services/go/services/base"
	"github.com/saichler/l8types/go/ifs"
	"github.com/saichler/l8types/go/types/l8api"
	"github.com/saichler/l8types/go/types/l8web"
	"github.com/saichler/l8utils/go/utils/web"
)

func ActivateEmployees(vnic ifs.IVNic) {
	// Logical service name used by other services to reference this service
	serviceName := "Employee"

	// Service area enables vertical scaling (e.g., multiple isolated caches in the same process)
	serviceArea := byte(0)

	sla := ifs.NewServiceLevelAgreement(
		&base.BaseService{},      // Layer 8 base service implementation
		serviceName, serviceArea, // Logical service identity
		true, // Stateful service (in-memory cache)
		nil,  // Optional callback for validation or pre-processing
	)

	// Define the Prime Object and its collection
	sla.SetServiceItem(&example.Employee{})
	sla.SetServiceItemList(&example.EmployeeList{})

	// Define the primary key that uniquely identifies the Prime Object
	sla.SetPrimaryKeys("EmployeeId")

	// Select the concurrency model
	sla.SetTransactional(true) // Transactional vs best-effort concurrency

	// Disable replication; all instances maintain identical state
	sla.SetReplication(false)

	// Define the Web API surface for this service
	ws := web.New(serviceName, serviceArea, 0)

	// CRUD-style endpoints mapped to Prime Object semantics
	ws.AddEndpoint(&example.Employee{}, ifs.POST, &l8web.L8Empty{})
	ws.AddEndpoint(&example.EmployeeList{}, ifs.POST, &l8web.L8Empty{})
	ws.AddEndpoint(&example.Employee{}, ifs.PUT, &l8web.L8Empty{})
	ws.AddEndpoint(&example.Employee{}, ifs.PATCH, &l8web.L8Empty{})
	ws.AddEndpoint(&l8api.L8Query{}, ifs.DELETE, &l8web.L8Empty{})
	ws.AddEndpoint(&l8api.L8Query{}, ifs.GET, &example.EmployeeList{})

	sla.SetWebService(ws)

	// Activate the service within the virtual network context
	vnic.Resources().Services().Activate(sla, vnic)
}
