import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle2, Edit, Trash2, PlusCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { carePlans, patients, users } from '../data/mockData';
import Avatar from '../components/ui/Avatar';

const CarePlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const carePlan = carePlans.find(plan => plan.id === id);
  
  if (!carePlan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Care Plan not found</h2>
        <p className="mt-2 text-gray-600">The care plan you're looking for doesn't exist or has been removed.</p>
        <Link to="/care-plans" className="mt-4 inline-block text-emerald-600 hover:text-emerald-800">
          ← Return to care plans
        </Link>
      </div>
    );
  }

  const patient = patients.find(p => p.id === carePlan.patientId);
  const creator = users.find(u => u.id === carePlan.createdBy);

  const getStatusBadge = (status: typeof carePlan.status) => {
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

  const getGoalStatusBadge = (status: 'achieved' | 'in_progress' | 'pending') => {
    switch (status) {
      case 'achieved':
        return <Badge variant="success">Achieved</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'pending':
        return <Badge variant="default">Pending</Badge>;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/care-plans" className="text-emerald-600 hover:text-emerald-800 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{carePlan.title}</h1>
            <p className="text-sm text-gray-500">
              Care Plan ID: {carePlan.id} • Last updated: {formatDate(carePlan.updatedAt)}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            leftIcon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Overview Card */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Care Plan Overview</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-1">{getStatusBadge(carePlan.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Patient</p>
                <div className="mt-1 flex items-center">
                  {patient && (
                    <>
                      <Avatar 
                        src={patient.avatar} 
                        alt={patient.name} 
                        size="sm" 
                      />
                      <Link 
                        to={`/patients/${patient.id}`}
                        className="ml-2 text-emerald-600 hover:text-emerald-800"
                      >
                        {patient.name}
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created By</p>
                <div className="mt-1 flex items-center">
                  {creator && (
                    <>
                      <Avatar 
                        src={creator.avatar} 
                        alt={creator.name} 
                        size="sm" 
                      />
                      <span className="ml-2">{creator.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p>{formatDate(carePlan.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Date</p>
                  <p>{formatDate(carePlan.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">End Date</p>
                  <p>{formatDate(carePlan.endDate)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700">{carePlan.description}</p>
          </div>
        </div>
      </Card>

      {/* Goals Card */}
      <Card 
        title="Goals" 
        subtitle="Treatment goals and objectives"
        action={
          <Button 
            variant="secondary" 
            size="sm"
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Add Goal
          </Button>
        }
      >
        <div className="space-y-4">
          {carePlan.goals.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No goals have been added to this care plan
            </div>
          ) : (
            carePlan.goals.map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-gray-900">{goal.description}</h4>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Target: {formatDate(goal.targetDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getGoalStatusBadge(goal.status)}
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Meal Plans Card */}
      <Card 
        title="Meal Plans" 
        subtitle="Personalized nutrition recommendations"
        action={
          <Button 
            variant="secondary" 
            size="sm"
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Add Meal Plan
          </Button>
        }
      >
        <div className="space-y-6">
          {carePlan.meals.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No meal plans have been added to this care plan
            </div>
          ) : (
            carePlan.meals.map((mealPlan) => (
              <div key={mealPlan.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-medium text-gray-900">{mealPlan.name}</h4>
                    <Badge variant="info">{mealPlan.schedule === 'daily' ? 'Daily' : 'Weekly'}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{mealPlan.description}</p>
                </div>
                
                <div className="p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Meals</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mealPlan.meals.map((meal) => (
                      <div key={meal.id} className="flex border border-gray-200 rounded-lg overflow-hidden">
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
                            <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 rounded px-2 py-0.5">
                              {meal.nutritionalInfo.calories} cal
                            </span>
                            <span className="inline-flex items-center text-xs bg-green-50 text-green-700 rounded px-2 py-0.5">
                              {meal.nutritionalInfo.protein}g protein
                            </span>
                            <span className="inline-flex items-center text-xs bg-yellow-50 text-yellow-700 rounded px-2 py-0.5">
                              {meal.nutritionalInfo.carbs}g carbs
                            </span>
                            <span className="inline-flex items-center text-xs bg-red-50 text-red-700 rounded px-2 py-0.5">
                              {meal.nutritionalInfo.fat}g fat
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default CarePlanDetail;