import { ArrowLeft, MessageCircle, Paperclip, Search, Send, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { conversations, messages, patients, users } from '../data/mockData';
import { Message } from '../types';

const Messages: React.FC = () => {
  const { state } = useAuth();
  const currentUser = state.user;
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true;
    
    // Find the other participant
    const otherParticipantId = conv.participants.find(id => id !== currentUser?.id);
    if (!otherParticipantId) return false;
    
    // Check if it's a patient or user
    const patient = patients.find(p => p.id === otherParticipantId);
    const user = users.find(u => u.id === otherParticipantId);
    
    const name = patient?.name || user?.name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get active conversation
  const activeConversation = activeConversationId 
    ? conversations.find(c => c.id === activeConversationId)
    : null;

  // Get conversation messages
  const conversationMessages = activeConversation
    ? messages.filter(msg => 
        activeConversation.participants.includes(msg.senderId) && 
        activeConversation.participants.includes(msg.recipientId)
      ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];

  // Get participant details
  const getParticipantDetails = (id: string): { name: string; avatar?: string; type: 'patient' | 'team' } => {
    const patient = patients.find(p => p.id === id);
    if (patient) {
      return { name: patient.name, avatar: patient.avatar, type: 'patient' };
    }
    
    const user = users.find(u => u.id === id);
    if (user) {
      return { name: user.name, avatar: user.avatar, type: 'team' };
    }
    
    return { name: 'Unknown', type: 'team' };
  };

  // Get conversation partner
  const getConversationPartner = (conversation: typeof conversations[0]) => {
    const partnerId = conversation.participants.find(id => id !== currentUser?.id);
    return partnerId ? getParticipantDetails(partnerId) : null;
  };

  // Format time
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation || !currentUser) return;
    
    // Get the recipient ID (the other participant)
    const recipientId = activeConversation.participants.find(id => id !== currentUser.id);
    if (!recipientId) return;
    
    // Create a new message
    const newMessageObj: Message = {
      id: `msg${messages.length + 1}`,
      senderId: currentUser.id,
      recipientId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    // Add to messages (in a real app, this would be an API call)
    messages.push(newMessageObj);
    
    // Update the conversation's last message
    const conversation = conversations.find(c => c.id === activeConversationId);
    if (conversation) {
      conversation.lastMessage = newMessageObj;
      conversation.unreadCount = 0; // Reset unread count for this conversation
    }
    
    // Clear the input
    setNewMessage('');
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  // Select first conversation if none is selected
  useEffect(() => {
    if (filteredConversations.length > 0 && !activeConversationId) {
      setActiveConversationId(filteredConversations[0].id);
    }
  }, [filteredConversations, activeConversationId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">
          Secure communication with patients and team members
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex h-[calc(100vh-12rem)]">
          {/* Conversation List */}
          <div className="w-full max-w-xs border-r border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-5 w-5 text-gray-400" />}
                fullWidth
              />
            </div>
            
            <div className="overflow-y-auto flex-1">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations found
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const partner = getConversationPartner(conversation);
                  if (!partner) return null;
                  
                  return (
                    <button
                      key={conversation.id}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        activeConversationId === conversation.id ? 'bg-emerald-50' : ''
                      }`}
                      onClick={() => setActiveConversationId(conversation.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar
                            src={partner.avatar}
                            alt={partner.name}
                            size="md"
                          />
                          <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-1 ring-white ${
                            partner.type === 'patient' ? 'bg-emerald-400' : 'bg-blue-400'
                          }`}></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {partner.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatConversationTime(conversation.lastMessage.timestamp)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500 text-white text-xs">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            
            <div className="p-3 border-t border-gray-200">
              <Button
                variant="secondary"
                fullWidth
                leftIcon={<User className="h-5 w-5" />}
              >
                New Message
              </Button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="lg:hidden">
                      <ArrowLeft 
                        className="h-5 w-5 text-gray-500 cursor-pointer" 
                        onClick={() => setActiveConversationId(null)}
                      />
                    </div>
                    <div className="relative">
                      {activeConversation && (
                        <>
                          {(() => {
                            const partner = getConversationPartner(activeConversation);
                            if (!partner) return null;
                            
                            return (
                              <>
                                <Avatar
                                  src={partner.avatar}
                                  alt={partner.name}
                                  size="md"
                                />
                                <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-1 ring-white ${
                                  partner.type === 'patient' ? 'bg-emerald-400' : 'bg-blue-400'
                                }`}></span>
                              </>
                            );
                          })()}
                        </>
                      )}
                    </div>
                    <div>
                      {activeConversation && (
                        <>
                          {(() => {
                            const partner = getConversationPartner(activeConversation);
                            if (!partner) return null;
                            
                            return (
                              <>
                                <p className="text-sm font-medium text-gray-900">
                                  {partner.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {partner.type === 'patient' ? 'Patient' : 'Care Team'}
                                </p>
                              </>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    {conversationMessages.map((msg) => {
                      const isCurrentUser = msg.senderId === currentUser?.id;
                      const sender = isCurrentUser 
                        ? currentUser 
                        : patients.find(p => p.id === msg.senderId) || users.find(u => u.id === msg.senderId);
                      
                      return (
                        <div 
                          key={msg.id} 
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="flex max-w-xs lg:max-w-md">
                            {!isCurrentUser && (
                              <div className="flex-shrink-0 mr-3 self-end">
                                <Avatar
                                  src={sender?.avatar}
                                  alt={sender?.name || 'Unknown'}
                                  size="sm"
                                />
                              </div>
                            )}
                            <div>
                              <div 
                                className={`rounded-lg px-4 py-2 ${
                                  isCurrentUser 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-white text-gray-800 border border-gray-200'
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatMessageTime(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Message Input */}
                <div className="p-3 border-t border-gray-200">
                  <form 
                    className="flex items-center space-x-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                  >
                    <button
                      type="button"
                      className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-full border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      className="rounded-full p-2"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No conversation selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;