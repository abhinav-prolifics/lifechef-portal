import { MessageSquare } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { conversations, patients, users } from '../../data/mockData';
import Avatar from '../ui/Avatar';
import Card from '../ui/Card';

const RecentMessages: React.FC = () => {
  // Sort conversations by last message timestamp
  const sortedConversations = [...conversations].sort((a, b) => 
    new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
  );

  const getParticipantDetails = (id: string): { name: string; avatar?: string; isPatient: boolean } => {
    const patient = patients.find(p => p.id === id);
    if (patient) {
      return { name: patient.name, avatar: patient.avatar, isPatient: true };
    }
    
    const user = users.find(u => u.id === id);
    if (user) {
      return { name: user.name, avatar: user.avatar, isPatient: false };
    }
    
    return { name: 'Unknown', isPatient: false };
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card 
      title="Recent Conversations" 
      subtitle="Messages from patients and team members"
      action={<Link to="/messages\" className="text-sm text-emerald-600 hover:text-emerald-800">View All</Link>}
    >
      <div className="divide-y divide-gray-200">
        {sortedConversations.slice(0, 5).map((conversation) => {
          // Find the participant who isn't the current user (simplified since we don't have actual auth here)
          const otherParticipantId = conversation.participants.find(id => id.startsWith('p')) || conversation.participants[0];
          const participant = getParticipantDetails(otherParticipantId);
          
          return (
            <div key={conversation.id} className="py-3 flex items-center space-x-3">
              <Avatar 
                src={participant.avatar} 
                alt={participant.name} 
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between">
                  <Link 
                    to="/messages" 
                    className="text-sm font-medium text-gray-900 truncate"
                  >
                    {participant.name}
                  </Link>
                  <span className="text-xs text-gray-500">
                    {formatTime(conversation.lastMessage.timestamp)}
                  </span>
                </div>
                 <div className="flex justify-between">
                  <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage.content}
                </p>
                   {conversation.unreadCount > 0 && (
                <div className="fl">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500 text-white text-xs">
                    {conversation.unreadCount}
                  </span>
                </div>
              )}
                </div>
              </div>
            </div>
          );
        })}
        
        {sortedConversations.length === 0 && (
          <div className="py-6 text-center text-gray-500 flex flex-col items-center">
            <MessageSquare className="h-10 w-10 text-gray-400 mb-2" />
            <p>No conversations yet</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentMessages;