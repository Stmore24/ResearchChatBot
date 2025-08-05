
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
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
      setError('');
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
      const response = await axios.post('/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if there's an error in the response (duplicate file)
      if (response.data.error) {
        setError(`${response.data.error} Document ID: ${response.data.doc_id}`);
        // Still navigate to chat even if document exists
        setTimeout(() => {
          navigate(`/chat/${response.data.doc_id}`);
        }, 2000);
      } else {
        // Successful upload
        setMessage('Upload successful! Document processed and ready for chat. Redirecting...');
        setTimeout(() => {
          navigate(`/chat/${response.data.doc_id}`);
        }, 2000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      if (err.response && err.response.data) {
        setError(`Upload failed: ${err.response.data.error || 'Unknown error'}`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <button
              onClick={() => navigate('/')}
              className="mb-6 inline-flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-lg transition-all duration-200 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-5xl font-bold text-slate-800 mb-4 tracking-tight">
              Upload Document
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Upload your PDF document to start an intelligent conversation and analysis
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200/50 backdrop-blur-sm">
            <div className="mb-8">
              <label className="block text-slate-800 text-xl font-semibold mb-6">
                Select Your Document
              </label>
              
              {/* Drop Zone */}
              <div 
                className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 cursor-pointer group"
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
                  <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    📄
                  </div>
                  <p className="text-slate-700 text-xl mb-3 font-medium">
                    Click to select a PDF file
                  </p>
                  <p className="text-slate-500 text-lg">
                    or drag and drop your document here
                  </p>
                  <div className="mt-4 text-sm text-slate-400">
                    Supported format: PDF (Max 10MB)
                  </div>
                </label>
              </div>
              
              {/* File Info */}
              {file && (
                <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">✓</div>
                    <div>
                      <p className="text-emerald-800 font-semibold text-lg">
                        {file.name}
                      </p>
                      <p className="text-emerald-600 mt-1">
                        Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            {message && (
              <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center">
                <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="font-medium">{message}</div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-800 rounded-xl flex items-start">
                <svg className="w-6 h-6 mr-3 mt-0.5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="font-medium">{error}</div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none flex items-center justify-center"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Document...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Document
                </>
              )}
            </button>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-slate-50 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">What happens next?</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">🔍</div>
                  <div>
                    <p className="font-medium text-slate-700">Analysis</p>
                    <p className="text-sm text-slate-500">Document is processed and indexed</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-2xl mr-3">🤖</div>
                  <div>
                    <p className="font-medium text-slate-700">AI Ready</p>
                    <p className="text-sm text-slate-500">AI becomes ready to answer questions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-2xl mr-3">💬</div>
                  <div>
                    <p className="font-medium text-slate-700">Chat</p>
                    <p className="text-sm text-slate-500">Start intelligent conversations</p>
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
