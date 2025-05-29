import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../ui/Card';
import { adherenceHistory } from '../../data/mockData';

const AdherenceChart: React.FC = () => {
  // Process data for the chart
  const data = adherenceHistory.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    adherence: item.average,
  }));

  // Take only the last 14 days
  const recentData = data.slice(-14);

  return (
    <Card title="Patient Adherence Trend" subtitle="Last 14 days">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={recentData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.split(' ')[1]}
            />
            <YAxis 
              domain={[60, 100]} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Adherence']}
              labelFormatter={(label) => `Date: ${label}`}
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
              dataKey="adherence" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: '#047857', strokeWidth: 2 }}
              name="Adherence Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AdherenceChart;