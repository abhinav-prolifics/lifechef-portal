import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Plus, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { carePlans, patients } from '../data/mockData';
import { CarePlan } from '../types';

const CarePlans: React.FC = () => {
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get('patient');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<CarePlan['status'] | 'all'>('all');
  const [filterPatientId, setFilterPatientId] = useState<string | 'all'>(patientIdFromUrl || 'all');

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
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
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
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
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
                    <p className="text-sm text-gray-500 mt-1">
                      <Link 
                        to={`/patients/${plan.patientId}`}
                        className="hover:text-emerald-600"
                      >
                        {getPatientName(plan.patientId)}
                      </Link>
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(plan.status)}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {plan.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
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
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Last Updated</p>
                      <p className="font-medium">{formatDate(plan.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-gray-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Goal Completion</p>
                      <p className="font-medium">
                        {plan.goals.filter(g => g.status === 'achieved').length}/{plan.goals.length} Goals ({getGoalCompletionRate(plan)}%)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <Link 
                    to={`/care-plans/${plan.id}`}
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
    </div>
  );
};

export default CarePlans;