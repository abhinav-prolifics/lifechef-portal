import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, Clipboard, MessageCircle, AlertTriangle, Activity, Heart, Scale, Droplet } from 'lucide-react';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { patients, patientDetailData, carePlans } from '../data/mockData';
import { BiometricReading } from '../types';

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const patient = patients.find(p => p.id === id);
  
  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Patient not found</h2>
        <p className="mt-2 text-gray-600">The patient you're looking for doesn't exist or has been removed.</p>
        <Link to="/patients" className="mt-4 inline-block text-emerald-600 hover:text-emerald-800">
          ← Return to patients list
        </Link>
      </div>
    );
  }

  const patientData = patientDetailData[patient.id as keyof typeof patientDetailData];
  const patientCarePlans = carePlans.filter(plan => plan.patientId === patient.id);
  const activePlan = patientCarePlans.find(plan => plan.status === 'active');

  // Format biometric data for charts
  const formatBiometricData = (readings: BiometricReading[]) => {
    return readings.map(reading => ({
      date: new Date(reading.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: reading.type === 'blood_pressure' ? 
        parseInt((reading.value as string).split('/')[0]) : // For BP, just use systolic for the chart
        reading.value,
      isAbnormal: reading.isAbnormal
    }));
  };

  const getAdherenceBadgeColor = (rate: number) => {
    if (rate >= 85) return 'success';
    if (rate >= 70) return 'warning';
    return 'danger';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/patients" className="text-emerald-600 hover:text-emerald-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{patient.name}</h1>
          <p className="text-sm text-gray-500">
            Patient ID: {patient.id} • Last active: {new Date(patient.lastActivity).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Patient Overview */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar src={patient.avatar} alt={patient.name} size="lg" className="w-20 h-20" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Demographics</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {patient.age} years • {patient.gender}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {patient.email}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {patient.phone}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Medical Conditions</h3>
                  <div className="mt-1 space-y-1">
                    {patient.conditions.map(condition => (
                      <Badge key={condition} className="mr-1 mb-1">{condition}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Adherence Rate</h3>
                  <div className="mt-2">
                    <Badge variant={getAdherenceBadgeColor(patient.adherenceRate)} className="text-base px-3 py-1">
                      {patient.adherenceRate}%
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                <Button 
                  variant="secondary" 
                  leftIcon={<Clipboard className="h-4 w-4" />}
                  onClick={() => {}}
                >
                  View Care Plan
                </Button>
                <Button 
                  variant="outline" 
                  leftIcon={<MessageCircle className="h-4 w-4" />}
                  onClick={() => {}}
                >
                  Send Message
                </Button>
                {patient.alerts.length > 0 && (
                  <Button 
                    variant="outline" 
                    leftIcon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    onClick={() => {}}
                  >
                    {patient.alerts.length} Alert{patient.alerts.length !== 1 ? 's' : ''}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Glucose Readings */}
        <Card title="Blood Glucose" subtitle="Last 14 days" className="h-full">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formatBiometricData(patientData.glucoseReadings)}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.split(' ')[1]}
                />
                <YAxis 
                  domain={['dataMin - 10', 'dataMax + 10']} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} mg/dL`, 'Glucose']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, fill: (entry) => entry.isAbnormal ? '#ef4444' : '#10b981' }}
                  activeDot={{ r: 6, stroke: '#047857', strokeWidth: 2 }}
                  name="Glucose Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center">
            <div className="flex items-center">
              <Droplet className="h-5 w-5 text-emerald-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Latest Reading</p>
                <p className="text-sm text-gray-500">
                  {patientData.glucoseReadings[patientData.glucoseReadings.length - 1].value} mg/dL at{' '}
                  {new Date(patientData.glucoseReadings[patientData.glucoseReadings.length - 1].timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Weight Tracking */}
        <Card title="Weight" subtitle="Last 14 days" className="h-full">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formatBiometricData(patientData.weightReadings)}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.split(' ')[1]}
                />
                <YAxis 
                  domain={['dataMin - 5', 'dataMax + 5']} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} lbs`, 'Weight']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: '#0369a1', strokeWidth: 2 }}
                  name="Weight"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center">
            <div className="flex items-center">
              <Scale className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Latest Reading</p>
                <p className="text-sm text-gray-500">
                  {patientData.weightReadings[patientData.weightReadings.length - 1].value} lbs at{' '}
                  {new Date(patientData.weightReadings[patientData.weightReadings.length - 1].timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Blood Pressure */}
        <Card title="Blood Pressure" subtitle="Last 14 days" className="h-full">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formatBiometricData(patientData.bloodPressureReadings)}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.split(' ')[1]}
                />
                <YAxis 
                  domain={['dataMin - 10', 'dataMax + 10']} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} mmHg (systolic)`, 'Blood Pressure']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, fill: (entry) => entry.isAbnormal ? '#ef4444' : '#f97316' }}
                  activeDot={{ r: 6, stroke: '#c2410c', strokeWidth: 2 }}
                  name="Blood Pressure"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-orange-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Latest Reading</p>
                <p className="text-sm text-gray-500">
                  {patientData.bloodPressureReadings[patientData.bloodPressureReadings.length - 1].value} mmHg at{' '}
                  {new Date(patientData.bloodPressureReadings[patientData.bloodPressureReadings.length - 1].timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Heart Rate */}
        <Card title="Heart Rate" subtitle="Last 14 days" className="h-full">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formatBiometricData(patientData.heartRateReadings)}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.split(' ')[1]}
                />
                <YAxis 
                  domain={['dataMin - 5', 'dataMax + 5']} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} bpm`, 'Heart Rate']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ec4899" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, fill: (entry) => entry.isAbnormal ? '#ef4444' : '#ec4899' }}
                  activeDot={{ r: 6, stroke: '#db2777', strokeWidth: 2 }}
                  name="Heart Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center">
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-pink-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Latest Reading</p>
                <p className="text-sm text-gray-500">
                  {patientData.heartRateReadings[patientData.heartRateReadings.length - 1].value} bpm at{' '}
                  {new Date(patientData.heartRateReadings[patientData.heartRateReadings.length - 1].timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Current Care Plan */}
      {activePlan && (
        <Card title="Active Care Plan" subtitle={`Plan period: ${new Date(activePlan.startDate).toLocaleDateString()} - ${new Date(activePlan.endDate).toLocaleDateString()}`}>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{activePlan.title}</h3>
            <p className="text-gray-600 mb-4">{activePlan.description}</p>
            
            <h4 className="font-medium text-gray-900 mb-2">Goals</h4>
            <div className="space-y-3 mb-6">
              {activePlan.goals.map(goal => (
                <div key={goal.id} className="flex items-start">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full mr-3 ${
                    goal.status === 'achieved' ? 'bg-green-500' : 
                    goal.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className="text-gray-800">{goal.description}</p>
                    <p className="text-xs text-gray-500">
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                      {' • '}
                      <span className="font-medium">
                        {goal.status === 'achieved' ? 'Achieved' : 
                         goal.status === 'in_progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link to={`/care-plans/${activePlan.id}`} className="text-emerald-600 hover:text-emerald-800">
                View full care plan details →
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PatientDetail;