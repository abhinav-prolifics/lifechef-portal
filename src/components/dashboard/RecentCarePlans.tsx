import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { carePlans, patients } from '../../data/mockData';
import { CarePlan } from '../../types';

const RecentCarePlans: React.FC = () => {
  // Sort care plans by last updated date (newest first)
  const sortedCarePlans = [...carePlans].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card 
      title="Recent Care Plans" 
      subtitle="Latest updates and modifications"
      action={<Link to="/care-plans\" className="text-sm text-emerald-600 hover:text-emerald-800">View All</Link>}
    >
      <div className="divide-y divide-gray-200">
        {sortedCarePlans.slice(0, 5).map((plan) => (
          <div key={plan.id} className="py-3">
            <div className="flex justify-between items-start">
              <div>
                <Link 
                  to={`/care-plans/${plan.id}`}
                  className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
                >
                  {plan.title}
                </Link>
                <p className="text-xs text-gray-500 mt-1">
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
            
            <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>Created: {formatDate(plan.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>Updated: {formatDate(plan.updatedAt)}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                <span>
                  {plan.goals.filter(g => g.status === 'achieved').length}/{plan.goals.length} Goals
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentCarePlans;