
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { fetchChatHistory, fetchDocument } from '../path/to/your/functions';


const ChatHistory = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const docIdFromUrl = searchParams.get('doc_id');

 useEffect(() => {
  fetchChatHistory();
  fetchDocument();
}, [fetchChatHistory, fetchDocument]);


  useEffect(() => {
    if (docIdFromUrl && documents.length > 0) {
      const doc = documents.find(d => d.doc_id === docIdFromUrl);
      if (doc) {
        handleDocumentSelect(doc);
      }
    }
  }, [docIdFromUrl, documents]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/documents/');
      setDocuments(response.data);
    } catch (err) {
      setError('Failed to fetch documents');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentSelect = async (doc) => {
    setSelectedDoc(doc);
    setLoading(true);
    try {
      const response = await axios.get(`/chat-history?doc_id=${doc.doc_id}`);
      setChatHistory(response.data.chat_history || []);
    } catch (err) {
      setError('Failed to fetch chat history');
      console.error('Chat history error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedDoc) {
    return (
      <div className="min-h-screen bg-cream-beige flex items-center justify-center">
        <div className="text-2xl text-charcoal">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-beige">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="mb-6 text-charcoal hover:text-deep-brown transition-colors duration-300"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-deep-brown mb-4">
              Chat History
            </h1>
            <p className="text-xl text-charcoal">
              View your previous conversations
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Document List */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-semibold text-deep-brown mb-4">Documents</h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.doc_id}
                    onClick={() => handleDocumentSelect(doc)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors duration-300 border ${
                      selectedDoc?.doc_id === doc.doc_id
                        ? 'bg-golden-yellow border-amber'
                        : 'bg-white border-warm-grey hover:bg-light-tan'
                    }`}
                  >
                    <h3 className="font-semibold text-deep-brown truncate">
                      {doc.filename}
                    </h3>
                    <p className="text-sm text-charcoal">
                      ID: {doc.doc_id.substring(0, 8)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat History */}
            <div className="lg:col-span-2">
              {selectedDoc ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-deep-brown">
                      {selectedDoc.filename}
                    </h2>
                    <button
                      onClick={() => navigate(`/chat/${selectedDoc.doc_id}`)}
                      className="bg-golden-yellow hover:bg-amber text-deep-brown font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                      Continue Chat
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="text-charcoal">Loading chat history...</div>
                    </div>
                  ) : chatHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">💬</div>
                      <p className="text-xl text-charcoal mb-4">No chat history yet</p>
                      <button
                        onClick={() => navigate(`/chat/${selectedDoc.doc_id}`)}
                        className="bg-golden-yellow hover:bg-amber text-deep-brown font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                      >
                        Start Chatting
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {chatHistory.map((chat, index) => (
                        <div key={index} className="space-y-2">
                          <div className="bg-amber bg-opacity-20 p-4 rounded-lg border-l-4 border-golden-yellow">
                            <div className="text-sm text-soft-brown mb-1">You asked:</div>
                            <div className="text-deep-brown">{chat.query}</div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border-l-4 border-warm-grey">
                            <div className="text-sm text-soft-brown mb-1">Assistant:</div>
                            <div className="text-charcoal whitespace-pre-wrap">{chat.answer}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-xl text-charcoal">
                    Select a document to view its chat history
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
