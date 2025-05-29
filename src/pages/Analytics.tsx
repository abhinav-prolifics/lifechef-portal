import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Download, Filter, ArrowUpRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { analyticsReports, adherenceHistory, patients } from '../data/mockData';

const Analytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  
  // Calculate adherence change (up or down)
  const calculateAdherenceChange = () => {
    if (adherenceHistory.length < 2) return 0;
    
    const current = adherenceHistory[adherenceHistory.length - 1].average;
    const previous = adherenceHistory[adherenceHistory.length - 2].average;
    
    return current - previous;
  };
  
  const adherenceChange = calculateAdherenceChange();
  
  // Get adherence data based on timeframe
  const getAdherenceData = () => {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    return adherenceHistory.slice(-days);
  };

  // Prepare data for patient condition distribution
  const conditionsData = (() => {
    const conditionCount: Record<string, number> = {};
    
    patients.forEach(patient => {
      patient.conditions.forEach(condition => {
        conditionCount[condition] = (conditionCount[condition] || 0) + 1;
      });
    });
    
    return Object.entries(conditionCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  })();

  // Prepare data for adherence distribution
  const adherenceDistribution = [
    { name: 'High (85%+)', value: patients.filter(p => p.adherenceRate >= 85).length },
    { name: 'Medium (70-84%)', value: patients.filter(p => p.adherenceRate >= 70 && p.adherenceRate < 85).length },
    { name: 'Low (<70%)', value: patients.filter(p => p.adherenceRate < 70).length },
  ];

  // Colors for charts
  const COLORS = ['#10b981', '#60a5fa', '#f97316', '#8b5cf6', '#ec4899'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics & Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Insights and performance metrics for your patients
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setTimeframe('7d')}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md ${
                timeframe === '7d' 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 z-10' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('30d')}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                timeframe === '30d' 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 z-10' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-300'
              }`}
            >
              30 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('90d')}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md ${
                timeframe === '90d' 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 z-10' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              90 Days
            </button>
          </div>
          <Button 
            variant="outline" 
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-none shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-emerald-800">Average Adherence</p>
              <p className="text-3xl font-bold text-emerald-900 mt-2">
                {adherenceHistory[adherenceHistory.length - 1]?.average || 0}%
              </p>
            </div>
            <div className={`flex items-center ${
              adherenceChange > 0 ? 'text-green-600' : adherenceChange < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {adherenceChange > 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : adherenceChange < 0 ? (
                <TrendingDown className="h-5 w-5" />
              ) : (
                <Minus className="h-5 w-5" />
              )}
              <span className="ml-1 text-sm font-medium">
                {Math.abs(adherenceChange)}%
              </span>
            </div>
          </div>
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getAdherenceData().slice(-7)}>
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Patients</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {patients.length}
              </p>
            </div>
            <div className="text-blue-600">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm">
              <span className="text-blue-800">Active Care Plans</span>
              <span className="font-medium text-blue-900">
                {analyticsReports[0]?.data.patientCount || 0}
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-none shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-orange-800">Biometric Improvements</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {analyticsReports[1]?.data.weightLossAverage || 0}
                <span className="text-lg">lbs</span>
              </p>
            </div>
            <div className="text-orange-600">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm">
              <span className="text-orange-800">Avg. Weight Loss</span>
              <span className="font-medium text-orange-900">
                Last 90 Days
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-purple-800">HbA1c Reduction</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {analyticsReports[2]?.data.hba1cReduction || 0}
                <span className="text-lg">%</span>
              </p>
            </div>
            <div className="text-purple-600">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm">
              <span className="text-purple-800">Diabetic Patients</span>
              <span className="font-medium text-purple-900">
                {analyticsReports[2]?.data.diabeticPatients || 0}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Adherence Chart */}
      <Card title="Patient Adherence Trend" subtitle={`Last ${timeframe === '7d' ? '7' : timeframe === '30d' ? '30' : '90'} days`}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={getAdherenceData()}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis 
                domain={[60, 100]} 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Adherence']}
                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
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
                dataKey="average" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: '#047857', strokeWidth: 2 }}
                name="Adherence Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Conditions Distribution */}
        <Card title="Patient Conditions" subtitle="Distribution of medical conditions">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={conditionsData.slice(0, 5)}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} patients`, 'Count']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#10b981">
                  {conditionsData.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Adherence Distribution */}
        <Card title="Adherence Distribution" subtitle="Patient adherence levels">
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={adherenceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {adherenceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      index === 0 ? '#10b981' : // High - green
                      index === 1 ? '#f97316' : // Medium - orange
                      '#ef4444'                  // Low - red
                    } />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} patients`, 'Count']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card 
        title="Generated Reports" 
        subtitle="Recent analytics reports"
      >
        <div className="space-y-4">
          {analyticsReports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                  Download
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-1">{report.description}</p>
              <p className="text-xs text-gray-500 mt-3">
                Generated: {new Date(report.generatedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;