import { AlertTriangle, Filter, Search, SortAsc, SortDesc } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddCarePlanModal from "../components/patients/addCarePlanModal";
import AddPatientModal from "../components/patients/AddPatientModal";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { patients } from "../data/mockData";
import { Patient } from "../types";

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] =
    useState<keyof Pick<Patient, "name" | "adherenceRate">>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterCondition, setFilterCondition] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [showCarePlanModal, setShowCarePlanModal] = useState(false);

  // Get unique conditions from all patients
  const allConditions = Array.from(
    new Set(patients.flatMap((patient) => patient.conditions))
  );

  // Filter and sort patients
  const filteredPatients = patients
    .filter((patient) => {
      // Apply search filter
      const matchesSearch = patient.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Apply condition filter if selected
      const matchesCondition = filterCondition
        ? patient.conditions.includes(filterCondition)
        : true;

      return matchesSearch && matchesCondition;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortDirection === "asc"
          ? a.adherenceRate - b.adherenceRate
          : b.adherenceRate - a.adherenceRate;
      }
    });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getAdherenceBadge = (rate: number) => {
    if (rate >= 85) {
      return <Badge variant="success">{rate}%</Badge>;
    } else if (rate >= 70) {
      return <Badge variant="warning">{rate}%</Badge>;
    } else {
      return <Badge variant="danger">{rate}%</Badge>;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddPatient = (patientData:any) => {
    // In a real app, this would make an API call
    console.log("Adding new patient:", patientData);
    // For demo purposes, we could add to the mock data
    const newPatient: Patient = {
      id: `p${patients.length + 1}`,
      ...patientData,
      adherenceRate: 100,
      lastActivity: new Date().toISOString(),
      alerts: [],
      biometrics: [],
      careTeam: [],
      avatar:
        "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300",
    };
    patients.push(newPatient);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and monitor your patients
        </p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="w-full sm:w-1/2">
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5 text-gray-400" />}
              fullWidth
            />
          </div>
          <div className="w-full sm:w-1/2 flex gap-2">
            <div className="relative flex-1">
              <select
                className="appearance-none block w-full pl-3 pr-10 py-2 text-base  border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md bg-white"
                value={filterCondition || ""}
                onChange={(e) => setFilterCondition(e.target.value || null)}
              >
                <option value="">All Conditions</option>
                {allConditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-4  flex items-center px-2 text-gray-500">
                <Filter className="h-4 w-4" />
              </div>
            </div>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(true)}>
              Add Patient
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    onClick={() => toggleSort("name")}
                    className="group flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Patient</span>
                    {sortField === "name" ? (
                      sortDirection === "asc" ? (
                        <SortAsc className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <SortDesc className="h-4 w-4 text-emerald-500" />
                      )
                    ) : (
                      <SortAsc className="h-4 w-4 text-gray-300 group-hover:text-gray-400" />
                    )}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Conditions
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    onClick={() => toggleSort("adherenceRate")}
                    className="group flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Adherence</span>
                    {sortField === "adherenceRate" ? (
                      sortDirection === "asc" ? (
                        <SortAsc className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <SortDesc className="h-4 w-4 text-emerald-500" />
                      )
                    ) : (
                      <SortAsc className="h-4 w-4 text-gray-300 group-hover:text-gray-400" />
                    )}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Activity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Alerts
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No patients found matching your search criteria
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Avatar
                            src={patient.avatar}
                            alt={patient.name}
                            size="md"
                          />
                        </div>
                        <div className="ml-4">
                          <Link
                            to={`/patients/${patient.id}`}
                            className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
                          >
                            {patient.name}
                          </Link>
                          <div className="text-sm text-gray-500">
                            {patient.age} years • {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {patient.conditions.map((condition) => (
                          <Badge
                            key={condition}
                            variant="default"
                            className="mr-1 mb-1"
                          >
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getAdherenceBadge(patient.adherenceRate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(patient.lastActivity).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.alerts.length > 0 ? (
                        <div className="flex items-center">
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              patient.alerts.some((a) => a.severity === "high")
                                ? "text-red-500"
                                : patient.alerts.some(
                                    (a) => a.severity === "medium"
                                  )
                                ? "text-yellow-500"
                                : "text-blue-500"
                            }`}
                          />
                          <span className="ml-1 text-sm text-gray-700">
                            {patient.alerts.length} alert
                            {patient.alerts.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No alerts</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        to={`/patients/${patient.id}`}
                        className="text-emerald-600 hover:text-emerald-900 mr-4"
                      >
                        View
                      </Link>
                      {(patient.id!=="p1" && patient.id!=="p4")?<Link
                        to={`/care-plans?patient=${patient.id}`}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        Care Plan
                      </Link>:
                      <button  className="text-emerald-600 hover:text-emerald-900" onClick={()=>setShowCarePlanModal(true)}>Add PLan</button>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
<AddCarePlanModal showModal={showCarePlanModal} onClose={()=>{setShowCarePlanModal(false)}} ></AddCarePlanModal>
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddPatient}
      />
    </div>
  );
};

export default Patients;
