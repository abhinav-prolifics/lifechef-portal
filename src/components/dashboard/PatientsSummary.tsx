import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Card from '../ui/Card';
import { patients } from '../../data/mockData';

const PatientsSummary: React.FC = () => {
  // Calculate patient statistics
  const totalPatients = patients.length;
  const highAdherenceCount = patients.filter(p => p.adherenceRate >= 85).length;
  const mediumAdherenceCount = patients.filter(p => p.adherenceRate >= 70 && p.adherenceRate < 85).length;
  const lowAdherenceCount = patients.filter(p => p.adherenceRate < 70).length;
  
  const averageAdherence = Math.round(
    patients.reduce((sum, patient) => sum + patient.adherenceRate, 0) / totalPatients
  );

  // Patients with alerts
  const patientsWithAlerts = patients.filter(p => p.alerts && p.alerts.length > 0).length;

  const stats = [
    {
      id: 1,
      name: 'Total Patients',
      value: totalPatients,
      icon: <Clock className="h-6 w-6 text-emerald-500" />,
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 2,
      name: 'High Adherence',
      value: highAdherenceCount,
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      color: 'bg-green-100 text-green-800',
    },
    {
      id: 3,
      name: 'Medium Adherence',
      value: mediumAdherenceCount,
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      id: 4,
      name: 'Low Adherence',
      value: lowAdherenceCount,
      icon: <AlertCircle className="h-6 w-6 text-red-500" />,
      color: 'bg-red-100 text-red-800',
    },
  ];

  return (
    <Card 
      title="Patients Overview" 
      subtitle={`Average adherence rate: ${averageAdherence}%`}
      action={<Link to="/patients\" className="text-sm text-emerald-600 hover:text-emerald-800">View All</Link>}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            className={`${stat.color} px-4 py-5 rounded-lg text-center`}
          >
            <div className="flex justify-center mb-2">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm mt-1">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-900">Patients Requiring Attention</p>
            <p className="text-sm text-gray-500">{patientsWithAlerts} patients with alerts</p>
          </div>
          <Link 
            to="/patients" 
            className="text-sm font-medium text-emerald-600 hover:text-emerald-800"
          >
            View
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PatientsSummary;