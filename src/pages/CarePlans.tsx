import { Calendar, CheckCircle2, Clock, Filter, Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useSearchParams  } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { allMealPlans, carePlans, patients } from '../data/mockData';
import { CarePlan, Goal } from '../types';



const CarePlans: React.FC = () => {
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get('patient');
  const hasPatientParam = searchParams.has('patient');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<CarePlan['status'] | 'all'>('all');
  const [filterPatientId, setFilterPatientId] = useState<string | 'all'>(patientIdFromUrl || 'all');
  const [showForm, setShowForm] = useState(false);
  const [carePlan, setCarePlan] = useState({
    name: '',
    plan:'',
    startDate: '',
    endDate: '',
    description: '',
    goals: [{ goal: '', targetDate: '' }],
    meals: [''],
  });

  const [expandedPlans, setExpandedPlans] = useState<string[]>([]);
  const [selectedMealPlans, setSelectedMealPlans] = useState<string[]>([]);
  


  // Use patient ID from URL if provided
  React.useEffect(() => {
    if (patientIdFromUrl) {
      setFilterPatientId(patientIdFromUrl);
    }
  }, [patientIdFromUrl]);

  // Filter and sort care plans
  const filteredCarePlans = carePlans
    .filter((plan) => {
      // Apply search filter
      const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          plan.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply status filter
      const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
      
      // Apply patient filter
      const matchesPatient = filterPatientId === 'all' || plan.patientId === filterPatientId;
      
      return matchesSearch && matchesStatus && matchesPatient;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  const getStatusBadge = (status: CarePlan['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'completed':
        return <Badge variant="info">Completed</Badge>;
      case 'draft':
        return <Badge variant="default">Draft</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setCarePlan({ ...carePlan, [name]: value });
    };

    const handleGoalChange = (
      index: number,
      field: keyof Goal,
      value: string
    ) => {
      const updatedGoals = [...carePlan.goals];
      updatedGoals[index] = {
        ...updatedGoals[index],
        [field]: value,
      };
      setCarePlan({ ...carePlan, goals: updatedGoals });
    };

//   const handleMealChange = (index: number, value: string) => {
//   const updatedMeals = [...carePlan.meals];
//   updatedMeals[index] = value;
//   setCarePlan({ ...carePlan, meals: updatedMeals });
// };

const toggleMealPlan = (id: string) => {
    setExpandedPlans((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedMealPlans((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };



  const addGoal = () => {
    setCarePlan({ ...carePlan, goals: [...carePlan.goals, { goal: '', targetDate: '' }] });
  };

  const removeGoal = (indexToRemove: number) => {
  setCarePlan((prev) => ({
    ...prev,
    goals: prev.goals.filter((_, i) => i !== indexToRemove),
  }));
};

// const removeMeal = (indexToRemove: number) => {
//   setCarePlan((prev) => ({
//     ...prev,
//     meals: prev.meals.filter((_, i) => i !== indexToRemove),
//   }));
// };

  const handleAddMealPlan = () => {
    setCarePlan({ ...carePlan, meals: [...carePlan.meals, ''] });
  };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // alert('Care plan added!');

  // ✅ Reset the form by setting it back to the initial shape
  setCarePlan({
    name: '',
    plan: '',
    startDate: '',
    endDate: '',
    description: '',
    goals: [{ goal: '', targetDate: '' }],
    meals: [''],
  });

  // ✅ Optionally close the modal
  setShowForm(false);
};



  const getGoalCompletionRate = (plan: CarePlan) => {
    if (plan.goals.length === 0) return 0;
    
    const completedGoals = plan.goals.filter(g => g.status === 'achieved').length;
    return Math.round((completedGoals / plan.goals.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Care Plans</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage personalized care plans for your patients
          </p>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowForm(true)}
        >
          New Care Plan
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="w-full sm:w-1/2">
            <Input
              placeholder="Search care plans..."
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as CarePlan['status'] | 'all')}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <Filter className="h-4 w-4" />
              </div>
            </div>
            <div className="relative flex-1">
              <select
                className="appearance-none block w-full pl-3 pr-10 py-2 text-base  border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md bg-white"
                value={filterPatientId}
                onChange={(e) => setFilterPatientId(e.target.value)}
              >
                <option value="all">All Patients</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <Filter className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredCarePlans.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              No care plans found matching your search criteria
            </div>
          ) : (
            filteredCarePlans.map((plan) => (
              <div 
                key={plan.id} 
                className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link 
                      to={`/care-plans/${plan.id}`}
                      className="text-lg font-medium text-emerald-700 hover:text-emerald-900"
                    >
                      {plan.title}
                    </Link>
                    {hasPatientParam && (
                      <p className="text-sm text-gray-500 mt-1">
                        <Link 
                          to={`/patients/${plan.patientId}`}
                          className="hover:text-emerald-600"
                        >
                          {getPatientName(plan.patientId)}
                        </Link>
                      </p>
                    )}
                  </div>
                  <div>
                    {getStatusBadge(plan.status)}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {plan.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  {hasPatientParam && (
                    <>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="font-medium">{formatDate(plan.startDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">End Date</p>
                          <p className="font-medium">{formatDate(plan.endDate)}</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Last Updated</p>
                      <p className="font-medium">{formatDate(plan.updatedAt)}</p>
                    </div>
                  </div>

                  {hasPatientParam && (
                    <div className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Goal Completion</p>
                        <p className="font-medium">
                          {plan.goals.filter((g) => g.status === 'achieved').length}/
                          {plan.goals.length} Goals ({getGoalCompletionRate(plan)}%)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <Link 
                    to={`/care-plans/${plan.id}`}
                    state={{ fromPatientParam: hasPatientParam }}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-800"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
        {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full h-[90vh] shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">Create Care Plan</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-500 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Plan Name */}
              <Input
                label="Plan Name"
                name="plan"
                placeholder="Enter plan name"
                value={carePlan.plan}
                onChange={handleChange}
                
                fullWidth
              />

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter care plan description"
                  value={carePlan.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Goals */}
              <div>
                <h4 className="text-xl font-semibold mt-6 mb-2">Goals</h4>
                {carePlan.goals.map((goal, index) => (
                  <div key={index} className="flex gap-4 items-end mb-2">
                    <Input
                      label="Goal Name"
                      value={goal.goal}
                      onChange={(e) => handleGoalChange(index, 'goal', e.target.value)}
                      fullWidth
                    />
                    <button
                      type="button"
                      onClick={() => removeGoal(index)}
                      className="text-red-500 text-xl font-bold px-2 hover:text-red-700"
                      title="Remove Goal"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <Button type="button" variant="primary" onClick={addGoal}>
                  + Add Goal
                </Button>
              </div>

              {/* Meal Plan Section */}
             <div>
              <h4 className="text-xl font-semibold mt-6 mb-2">Meals</h4>

              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                {allMealPlans.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No meal plans available
                  </div>
                ) : (
                  allMealPlans.map((mealPlan) => (
                    <div
                      key={mealPlan.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="flex justify-between items-center p-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{mealPlan.name}</h4>
                          <p className="text-sm text-gray-600">{mealPlan.description}</p>
                          <Badge variant="info" className="mt-1">{mealPlan.schedule}</Badge>
                        </div>

                        <div className="flex gap-2 items-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            type="button"
                            onClick={() => toggleMealPlan(mealPlan.id)}
                          >
                            {expandedPlans.includes(mealPlan.id) ? "Hide Meals" : "Show Meals"}
                          </Button>
                          <Button
                            size="sm"
                            type="button"
                            variant={selectedMealPlans.includes(mealPlan.id) ? "danger" : "secondary"}
                            onClick={() => toggleSelect(mealPlan.id)}
                          >
                            {selectedMealPlans.includes(mealPlan.id) ? "Remove" : "Select"}
                          </Button>
                        </div>
                      </div>

                      {expandedPlans.includes(mealPlan.id) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
                          {mealPlan.meals.map((meal) => (
                            <div
                              key={meal.id}
                              className="flex border border-gray-200 rounded-lg overflow-hidden"
                            >
                              {meal.image && (
                                <div className="w-24 h-24 flex-shrink-0">
                                  <img
                                    src={meal.image}
                                    alt={meal.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="p-3 flex-1">
                                <h6 className="font-medium text-gray-900">{meal.name}</h6>
                                <p className="text-xs text-gray-600 mt-1">{meal.description}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className="inline-flex text-xs bg-blue-50 text-blue-700 rounded px-2 py-0.5">
                                    {meal.nutritionalInfo?.calories} cal
                                  </span>
                                  <span className="inline-flex text-xs bg-green-50 text-green-700 rounded px-2 py-0.5">
                                    {meal.nutritionalInfo?.protein}g protein
                                  </span>
                                  <span className="inline-flex text-xs bg-yellow-50 text-yellow-700 rounded px-2 py-0.5">
                                    {meal.nutritionalInfo?.carbs}g carbs
                                  </span>
                                  <span className="inline-flex text-xs bg-red-50 text-red-700 rounded px-2 py-0.5">
                                    {meal.nutritionalInfo?.fat}g fat
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
      {/* <div className="mt-4">
        <Button variant="secondary" size="sm" onClick={() => console.log(selectedMealPlans)}>
          + Add Meal Plan
        </Button>
      </div> */}
    </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Create Care Plan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};



export default CarePlans;