
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setMessage('');
      setError('');
    } else {
      setError('Please select a PDF file only');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if there's an error in the response (duplicate file)
      if (response.data.error) {
        setError(`${response.data.error} Document ID: ${response.data.doc_id}`);
        // Navigate to chat with existing document ID
        setTimeout(() => {
          navigate(`/chat/${response.data.doc_id}`);
        }, 3000);
      } else if (response.data.doc_id) {
        // Successful upload
        setMessage(`Upload successful! Document ID: ${response.data.doc_id}. ${response.data.status || ''} Redirecting to chat...`);
        setTimeout(() => {
          navigate(`/chat/${response.data.doc_id}`);
        }, 3000);
      } else {
        setError('Upload completed but no document ID received');
      }
    } catch (err) {
      console.error('Upload error:', err);
      if (err.response?.data?.error) {
        setError(`Upload failed: ${err.response.data.error}`);
      } else if (err.response?.status === 500) {
        setError('Server error. Please check if the backend is running.');
      } else if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please ensure the backend is running on port 8000.');
      } else {
        setError('Upload failed. Please check your connection and try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setMessage('');
      setError('');
    } else {
      setError('Please drop a PDF file only');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <button
              onClick={() => navigate('/')}
              className="mb-8 inline-flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-white/60 rounded-xl transition-all duration-300 font-medium shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-6xl font-bold text-gray-800 mb-6 tracking-tight">
              Upload Document
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Upload your PDF document to start an intelligent conversation and analysis with our AI system
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200/50 backdrop-blur-sm">
            <div className="mb-10">
              <label className="block text-gray-800 text-2xl font-semibold mb-8">
                Select Your PDF Document
              </label>
              
              {/* Drop Zone */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center hover:border-blue-400 hover:bg-blue-50/40 transition-all duration-300 cursor-pointer group"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="text-8xl mb-8 group-hover:scale-110 transition-transform duration-300">
                    📄
                  </div>
                  <p className="text-gray-700 text-2xl mb-4 font-medium">
                    Click to select a PDF file
                  </p>
                  <p className="text-gray-500 text-lg">
                    or drag and drop your document here
                  </p>
                  <div className="mt-6 text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-lg">
                    Supported format: PDF (Max 10MB)
                  </div>
                </label>
              </div>
              
              {/* File Info */}
              {file && (
                <div className="mt-8 p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                  <div className="flex items-center">
                    <div className="text-4xl mr-6">✅</div>
                    <div>
                      <p className="text-emerald-800 font-semibold text-xl">
                        {file.name}
                      </p>
                      <p className="text-emerald-600 mt-2 text-lg">
                        Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            {message && (
              <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center">
                <svg className="w-7 h-7 mr-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="font-medium text-lg">{message}</div>
              </div>
            )}

            {error && (
              <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-800 rounded-2xl flex items-start">
                <svg className="w-7 h-7 mr-4 mt-0.5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="font-medium text-lg">{error}</div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-5 px-10 rounded-2xl transition-all duration-300 text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:shadow-none flex items-center justify-center"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-4 h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Document...
                </>
              ) : (
                <>
                  <svg className="w-7 h-7 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Document
                </>
              )}
            </button>

            {/* Additional Info */}
            <div className="mt-10 p-8 bg-gray-50 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">What happens next?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">🔍</div>
                  <div>
                    <p className="font-medium text-gray-700 text-lg">Analysis</p>
                    <p className="text-gray-500 mt-1">Document is processed and indexed for intelligent search</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-3xl mr-4">🤖</div>
                  <div>
                    <p className="font-medium text-gray-700 text-lg">AI Ready</p>
                    <p className="text-gray-500 mt-1">AI becomes ready to answer questions about your document</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-3xl mr-4">💬</div>
                  <div>
                    <p className="font-medium text-gray-700 text-lg">Chat</p>
                    <p className="text-gray-500 mt-1">Start intelligent conversations with your document</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
