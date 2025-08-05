
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

      if (response.data.error) {
        setError(`Document already exists, refer ID: ${response.data.doc_id}`);
      } else {
        setMessage('Upload successful! Redirecting to chat...');
        setTimeout(() => {
          navigate(`/chat/${response.data.doc_id}`);
        }, 2000);
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-beige">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="mb-6 text-charcoal hover:text-deep-brown transition-colors duration-300"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-deep-brown mb-4">
              Upload Document
            </h1>
            <p className="text-xl text-charcoal">
              Upload a PDF document to start analyzing and chatting
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border border-warm-grey">
            <div className="mb-6">
              <label className="block text-deep-brown text-lg font-semibold mb-4">
                Select Document
              </label>
              <div className="border-2 border-dashed border-warm-grey rounded-lg p-8 text-center">
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
                  <div className="text-6xl mb-4">📎</div>
                  <p className="text-charcoal text-lg mb-2">
                    Click to select a PDF file
                  </p>
                  <p className="text-soft-brown">
                    or drag and drop your file here
                  </p>
                </label>
              </div>
              
              {file && (
                <div className="mt-4 p-4 bg-light-tan rounded-lg">
                  <p className="text-deep-brown">
                    <strong>Selected:</strong> {file.name}
                  </p>
                  <p className="text-charcoal">
                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            {message && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-golden-yellow hover:bg-amber disabled:bg-warm-grey disabled:cursor-not-allowed text-deep-brown font-semibold py-4 px-6 rounded-lg transition-colors duration-300 text-lg"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
