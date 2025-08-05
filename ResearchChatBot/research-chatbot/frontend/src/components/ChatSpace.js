
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ChatSpace = () => {
  const { docId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocument();
    fetchChatHistory();
  }, [docId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchDocument = async () => {
    try {
      const response = await axios.get('/documents/');
      const doc = response.data.find(d => d.doc_id === docId);
      setDocument(doc);
    } catch (err) {
      setError('Failed to fetch document information');
      console.error('Document fetch error:', err);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`/chat-history?doc_id=${docId}`);
      const history = response.data.chat_history || [];
      const formattedMessages = history.flatMap((chat, index) => [
        {
          id: `q-${index}`,
          text: chat.query,
          isUser: true,
          timestamp: new Date()
        },
        {
          id: `a-${index}`,
          text: chat.answer,
          isUser: false,
          timestamp: new Date()
        }
      ]);
      setMessages(formattedMessages);
    } catch (err) {
      console.error('Chat history fetch error:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/chat/', {
        doc_id: docId,
        question: inputMessage
      });

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        text: response.data.answer || response.data.error || 'Sorry, I could not process your request.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: 'Sorry, there was an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-cream-beige flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-warm-grey p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-charcoal hover:text-deep-brown transition-colors duration-300"
            >
              ← Dashboard
            </button>
            <div>
              <h1 className="text-2xl font-bold text-deep-brown">
                {document?.filename || 'Chat'}
              </h1>
              <p className="text-sm text-charcoal">Document ID: {docId}</p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/chat-history?doc_id=${docId}`)}
            className="bg-light-tan hover:bg-warm-grey text-deep-brown font-medium py-2 px-4 rounded-lg transition-colors duration-300"
          >
            View History
          </button>
        </div>
      </div>

      {error && (
        <div className="container mx-auto px-4 py-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-xl text-charcoal mb-2">
                  Start your conversation!
                </p>
                <p className="text-soft-brown">
                  Ask any question about your document
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                      message.isUser
                        ? 'bg-golden-yellow text-deep-brown'
                        : 'bg-white text-charcoal border border-warm-grey'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    <div
                      className={`text-xs mt-2 ${
                        message.isUser ? 'text-deep-brown opacity-70' : 'text-soft-brown'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-charcoal border border-warm-grey px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-charcoal"></div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-warm-grey">
            <div className="flex space-x-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about your document..."
                className="flex-1 resize-none rounded-lg border border-warm-grey px-4 py-3 focus:outline-none focus:ring-2 focus:ring-golden-yellow focus:border-transparent"
                rows="2"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || loading}
                className="bg-golden-yellow hover:bg-amber disabled:bg-warm-grey disabled:cursor-not-allowed text-deep-brown font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSpace;
