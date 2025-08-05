
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Upload Documents',
      description: 'Upload and process new documents for analysis',
      icon: '📄',
      onClick: () => navigate('/upload'),
      color: 'bg-golden-yellow hover:bg-amber'
    },
    {
      title: 'New Chat',
      description: 'Start a new conversation with a document',
      icon: '💬',
      onClick: () => navigate('/upload'),
      color: 'bg-amber hover:bg-golden-yellow'
    },
    {
      title: 'List Documents',
      description: 'View all uploaded documents',
      icon: '📋',
      onClick: () => navigate('/documents'),
      color: 'bg-golden-yellow hover:bg-amber'
    },
    {
      title: 'Chat History',
      description: 'View previous conversations',
      icon: '🕐',
      onClick: () => navigate('/chat-history'),
      color: 'bg-amber hover:bg-golden-yellow'
    }
  ];

  return (
    <div className="min-h-screen bg-cream-beige">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-deep-brown mb-4">
            Research Chatbot
          </h1>
          <p className="text-xl text-charcoal">
            AI-powered document analysis and intelligent conversations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={item.onClick}
              className={`${item.color} rounded-lg shadow-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-warm-grey`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-semibold text-deep-brown mb-3">
                  {item.title}
                </h3>
                <p className="text-charcoal text-lg">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
