
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UploadDocument from './components/UploadDocument';
import ListDocuments from './components/ListDocuments';
import ChatHistory from './components/ChatHistory';
import ChatSpace from './components/ChatSpace';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadDocument />} />
          <Route path="/documents" element={<ListDocuments />} />
          <Route path="/chat-history" element={<ChatHistory />} />
          <Route path="/chat/:docId" element={<ChatSpace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
