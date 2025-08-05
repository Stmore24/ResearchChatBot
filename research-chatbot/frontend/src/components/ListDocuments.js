
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-beige flex items-center justify-center">
        <div className="text-2xl text-charcoal">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-beige">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="mb-6 text-charcoal hover:text-deep-brown transition-colors duration-300"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-deep-brown mb-4">
              Document Library
            </h1>
            <p className="text-xl text-charcoal">
              All your uploaded documents
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {documents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-xl text-charcoal mb-6">No documents uploaded yet</p>
              <button
                onClick={() => navigate('/upload')}
                className="bg-golden-yellow hover:bg-amber text-deep-brown font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Upload Your First Document
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {documents.map((doc) => (
                <div
                  key={doc.doc_id}
                  className="bg-white rounded-lg shadow-lg p-6 border border-warm-grey hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-deep-brown mb-2">
                        {doc.filename}
                      </h3>
                      <p className="text-charcoal mb-1">
                        <strong>Document ID:</strong> {doc.doc_id}
                      </p>
                      <p className="text-soft-brown">
                        <strong>Uploaded:</strong> {doc.upload_date}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => navigate(`/chat/${doc.doc_id}`)}
                        className="bg-golden-yellow hover:bg-amber text-deep-brown font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                      >
                        Chat
                      </button>
                      <button
                        onClick={() => navigate(`/chat-history?doc_id=${doc.doc_id}`)}
                        className="bg-light-tan hover:bg-warm-grey text-deep-brown font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                      >
                        History
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListDocuments;
