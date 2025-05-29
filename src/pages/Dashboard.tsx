import React from 'react';
import { useAuth } from '../context/AuthContext';
import PatientsSummary from '../components/dashboard/PatientsSummary';
import AlertsWidget from '../components/dashboard/AlertsWidget';
import AdherenceChart from '../components/dashboard/AdherenceChart';
import RecentCarePlans from '../components/dashboard/RecentCarePlans';
import RecentMessages from '../components/dashboard/RecentMessages';

const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const user = state.user;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Patient Summary Widget */}
        <PatientsSummary />
        
        {/* Alerts Widget */}
        <AlertsWidget />
      </div>

      {/* Adherence Chart */}
      <AdherenceChart />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Care Plans */}
        <RecentCarePlans />
        
        {/* Recent Messages */}
        <RecentMessages />
      </div>
    </div>
  );
};

export default Dashboard;