import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
});

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Local state for form inputs
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(false);
  const [morningTime, setMorningTime] = useState('10:00');
  const [afternoonTime, setAfternoonTime] = useState('14:00');
  const [nightTime, setNightTime] = useState('20:00');
  const [facebookToken, setFacebookToken] = useState('');
  const [facebookPageId, setFacebookPageId] = useState('');
  const [rssSources, setRssSources] = useState([]);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');

  useEffect(() => {
    fetchConfig();
    fetchHistory();
  }, []);

  const fetchConfig = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true }); // Redirect to login/auth if no token
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/admin/config`, authHeader());
      const data = res.data;
      setConfig(data);
      setIsAutomationEnabled(data.isAutomationEnabled || false);
      setMorningTime(data.morningTime || '10:00');
      setAfternoonTime(data.afternoonTime || '14:00');
      setNightTime(data.nightTime || '20:00');
      setFacebookToken(data.facebookToken || '');
      setFacebookPageId(data.facebookPageId || '');
      setRssSources(data.rssSources || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching config:', error);
      if (error.response) {
        console.log('[DEBUG] Server Error Data:', error.response.data);
      }
      if (error.response && error.response.status === 401) {
        setMessage('Session Expired. Please Login Again.');
        setTimeout(() => navigate('/', { replace: true }), 2000);
      } else if (error.response && error.response.status === 403) {
        setMessage(`Access Denied: ${error.response.data.message || 'Please Upgrade to Pro or Login as Admin'}`);
      } else {
        setMessage('Failed to load configuration. Please verify your connection.');
      }
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/creations`);
      // Only show automated posts in history
      const data = res.data.data.filter(item => item.type === 'automated_post').slice(0, 5);
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    setMessage('');
    try {
      const updatedConfig = {
        isAutomationEnabled,
        morningTime,
        afternoonTime,
        nightTime,
        facebookToken,
        facebookPageId,
        rssSources
      };
      await axios.put(`${API_BASE_URL}/admin/update`, updatedConfig, authHeader());
      setMessage('Settings Updated Successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving config:', error);
      if (error.response && error.response.status === 403) {
        setMessage('Access Denied: Please Upgrade to Pro or Login as Admin.');
      } else {
        setMessage('Failed to save configuration.');
      }
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const triggerManualFetch = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/trigger-manual`, {}, authHeader());
      setMessage(res.data.message);
      fetchHistory(); // Refresh history
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error triggering fetch:', error);
      if (error.response && error.response.status === 403) {
        setMessage('Access Denied: Please Upgrade to Pro or Login as Admin.');
      } else {
        setMessage('Failed to trigger manual fetch.');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const addRssSource = () => {
    if (newSourceName && newSourceUrl) {
      setRssSources([...rssSources, { name: newSourceName, url: newSourceUrl, isActive: true }]);
      setNewSourceName('');
      setNewSourceUrl('');
    }
  };

  const removeRssSource = (index) => {
    const updated = [...rssSources];
    updated.splice(index, 1);
    setRssSources(updated);
  };

  const toggleRssSource = (index) => {
    const updated = [...rssSources];
    updated[index].isActive = !updated[index].isActive;
    setRssSources(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-48 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header / Nav */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Neural Command Center</h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">Manage your automated news pipelines and integrations</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/home')} 
              className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mr-2"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Newsroom
            </button>
            <button 
              onClick={triggerManualFetch}
              className="flex-1 sm:flex-none justify-center bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Post Now
            </button>
            <button 
              onClick={saveConfig}
              disabled={saving}
              className="flex-1 sm:flex-none justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </header>

        {/* Status Toast */}
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-xl text-sm font-medium border shadow-sm ${
              message.includes('Failed') 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-green-50 border-green-200 text-green-800'
            }`}
          >
            {message}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Core Settings */}
          <div className="flex flex-col gap-8 md:col-span-1 lg:col-span-1">
            
            {/* Automation Status Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <h2 className="text-lg font-bold mb-6 text-slate-900">Automation Status</h2>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-slate-800">Master Switch</h3>
                  <p className="text-slate-500 text-xs mt-1">Global toggle for background posting</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full ${isAutomationEnabled ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {isAutomationEnabled ? 'Active' : 'Paused'}
                  </span>
                  <button 
                    onClick={() => setIsAutomationEnabled(!isAutomationEnabled)}
                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isAutomationEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 shadow-sm ${isAutomationEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Daily Execution Slots (IST)</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-[11px] text-slate-500 font-bold uppercase">🌅 Morning</p>
                    <input 
                      type="time" 
                      value={morningTime}
                      onChange={(e) => setMorningTime(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-[11px] text-slate-500 font-bold uppercase">🚀 Afternoon</p>
                    <input 
                      type="time" 
                      value={afternoonTime}
                      onChange={(e) => setAfternoonTime(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-[11px] text-slate-500 font-bold uppercase">🌙 Night</p>
                    <input 
                      type="time" 
                      value={nightTime}
                      onChange={(e) => setNightTime(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Posting History Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">Recent Posts</h2>
                <Link to="/vault" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">View Vault</Link>
              </div>
              
              <div className="space-y-4">
                {history.length === 0 ? (
                  <p className="text-slate-400 text-xs italic py-4 text-center">No automated posts recorded yet.</p>
                ) : (
                  history.map((post, idx) => (
                    <div key={idx} className="flex gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {post.image ? <img src={post.image} className="w-full h-full object-cover" alt="" /> : <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{post.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{new Date(post.createdAt).toLocaleDateString()} • {post.category}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: RSS Sources */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 md:col-span-1 lg:col-span-2 flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900">RSS Data Sources</h2>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                {rssSources.length} Active
              </span>
            </div>
            
            <div className="flex-grow space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
              {rssSources.map((source, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="overflow-hidden mr-4">
                    <h4 className="text-slate-900 text-sm font-bold truncate">{source.name}</h4>
                    <p className="text-slate-500 text-xs truncate mt-1">{source.url}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => toggleRssSource(idx)}
                      className={`text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded-full transition-colors ${
                        source.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                    >
                      {source.isActive ? 'ACTIVE' : 'PAUSED'}
                    </button>
                    <button 
                      onClick={() => removeRssSource(idx)}
                      className="text-slate-400 hover:text-red-500 p-2 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-3">Add New Source</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Source Name"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="sm:w-1/3 bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                />
                <input 
                  type="url" 
                  placeholder="RSS URL"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  className="sm:w-1/2 flex-grow bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                />
                <button onClick={addRssSource} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold text-sm">Add</button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Facebook Page ID</h3>
                <input 
                  type="text" 
                  value={facebookPageId}
                  onChange={(e) => setFacebookPageId(e.target.value)}
                  placeholder="Paste Page ID"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Meta Access Token</h3>
                <input 
                  type="password" 
                  value={facebookToken}
                  onChange={(e) => setFacebookToken(e.target.value)}
                  placeholder="Meta Access Token"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
