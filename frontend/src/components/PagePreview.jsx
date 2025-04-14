import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const PagePreview = ({ pageId }) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!pageId) return;
      
      try {
        setLoading(true);
        const [pageResponse, domainsResponse] = await Promise.all([
          axios.get(`${API_URL}/pages/${pageId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }),
          axios.get(`${API_URL}/domains?pageId=${pageId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);
        
        setPage(pageResponse.data);
        setDomains(domainsResponse.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load page data.');
        console.error('Page preview error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPageData();
  }, [pageId]);

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (error || !page) {
    return (
      <div className="text-center p-10 text-red-600">
        {error || 'Page not found.'}
      </div>
    );
  }

  return (
    <div>
      {/* Preview Info Bar */}
      <div className="bg-gray-900 text-white p-4 fixed top-0 left-0 right-0 z-50 flex justify-between items-center">
        <div>
          <span className="font-bold">Previewing:</span> {page.title}
        </div>
        <div className="flex items-center">
          {domains.length > 0 ? (
            <div className="mr-4">
              <span className="text-gray-400 mr-2">Available at:</span>
              <select className="bg-gray-800 text-white p-1 rounded border border-gray-700">
                {domains.map(domain => (
                  <option key={domain.id} value={domain.domain}>
                    {domain.domain} ({domain.status})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mr-4 text-gray-400">
              No domains connected
            </div>
          )}
          <button 
            onClick={() => window.close()}
            className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            Close Preview
          </button>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="mt-16">
        <div 
          dangerouslySetInnerHTML={{ __html: page.content }} 
          className="page-content"
        />
      </div>
    </div>
  );
};

export default PagePreview; 