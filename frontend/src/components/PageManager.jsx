import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const PageManager = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch pages on component mount
  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/pages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setPages(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching pages. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      setError('Please enter both title and content.');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/pages`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setPages([response.data, ...pages]);
      setTitle('');
      setContent('');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating page. Please try again.');
      console.error('Create page error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Page Management</h2>
      
      {/* Create Page Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Page</h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Page Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter page title"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="content">
              Page Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="Enter page content (HTML supported)"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Page'}
          </button>
        </form>
      </div>

      {/* Page List */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Your Pages</h3>
        
        {loading && pages.length === 0 ? (
          <p className="text-gray-500">Loading pages...</p>
        ) : pages.length === 0 ? (
          <p className="text-gray-500">No pages created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Title</th>
                  <th className="py-2 px-4 border-b text-left">Created</th>
                  <th className="py-2 px-4 border-b text-left">Domains</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map(page => (
                  <tr key={page.id}>
                    <td className="py-2 px-4 border-b font-medium">{page.title}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(page.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {page.domains && page.domains.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {page.domains.map(domain => (
                            <li key={domain.id} className="text-blue-600">
                              {domain.domain}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">No domains connected</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        onClick={() => window.open(`/preview/${page.id}`, '_blank')}
                      >
                        Preview
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          // Set active tab to domains in parent component
                          // In a real app, you'd use context or state management
                          window.location.hash = 'domains';
                        }}
                      >
                        Connect Domain
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageManager; 