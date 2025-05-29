import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Bell, MessageCircle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { alerts, patients } from '../../data/mockData';
import { Alert } from '../../types';

const AlertsWidget: React.FC = () => {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'abnormal_reading':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'missed_meal':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'low_adherence':
        return <Bell className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return <Badge variant="danger">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="info">Low</Badge>;
      default:
        return null;
    }
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  // Sort alerts by timestamp (newest first) and unread status
  const sortedAlerts = [...alerts].sort((a, b) => {
    // First sort by read status
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    // Then sort by timestamp
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <Card 
      title="Recent Alerts" 
      subtitle="Patient alerts requiring attention"
      action={<Link to="/patients\" className="text-sm text-emerald-600 hover:text-emerald-800">View All</Link>}
    >
      <div className="divide-y divide-gray-200">
        {sortedAlerts.slice(0, 5).map((alert) => (
          <div 
            key={alert.id} 
            className={`py-3 flex items-start space-x-3 ${!alert.isRead ? 'bg-emerald-50' : ''}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getAlertIcon(alert.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between items-center mb-1">
                <Link 
                  to={`/patients/${alert.patientId}`}
                  className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
                >
                  {getPatientName(alert.patientId)}
                </Link>
                {getSeverityBadge(alert.severity)}
              </div>
              <p className="text-sm text-gray-800">{alert.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        
        {sortedAlerts.length === 0 && (
          <div className="py-6 text-center text-gray-500">
            No alerts to display
          </div>
        )}
      </div>
    </Card>
  );
};

export default AlertsWidget;