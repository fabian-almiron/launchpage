import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const DomainManager = () => {
  const [domains, setDomains] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDomain, setNewDomain] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [successMessage, setSuccessMessage] = useState('');
  const [preselectedPageInfo, setPreselectedPageInfo] = useState(null);

  // Fetch domains and pages on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [domainsResponse, pagesResponse] = await Promise.all([
          axios.get(`${API_URL}/domains`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }),
          axios.get(`${API_URL}/pages`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        setDomains(domainsResponse.data);
        setPages(pagesResponse.data);
        
        // Check if there's a preselected pageId from the preview
        const preselectedPageId = localStorage.getItem('connectDomainPageId');
        if (preselectedPageId) {
          const page = pagesResponse.data.find(p => p.id === preselectedPageId);
          if (page) {
            setSelectedPage(preselectedPageId);
            setPreselectedPageInfo(page);
            // Clear the stored ID after using it
            localStorage.removeItem('connectDomainPageId');
          }
        }
        
        setError(null);
      } catch (err) {
        setError('Error fetching data. Please try again.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submission to connect a new domain
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newDomain || !selectedPage) {
      setError('Please enter a domain and select a page.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/domains/connect`,
        {
          domain: newDomain,
          pageId: selectedPage,
          recordType
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Add the new domain to the list
      setDomains([response.data, ...domains]);
      
      // Reset form
      setNewDomain('');
      setSelectedPage('');
      setRecordType('A');
      setPreselectedPageInfo(null);
      
      // Show success message
      setSuccessMessage(response.data.message || 'Domain connected successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error connecting domain. Please try again.');
      console.error('Connect domain error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle domain verification
  const handleVerify = async (domainId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/domains/${domainId}/verify`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update the domain in the list
      setDomains(domains.map(domain => 
        domain.id === domainId ? response.data : domain
      ));
      
      // Show success message
      setSuccessMessage(response.data.message || 'Domain verification check completed.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error verifying domain. Please try again.');
      console.error('Verify domain error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle domain deletion
  const handleDelete = async (domainId) => {
    if (!window.confirm('Are you sure you want to disconnect this domain?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/domains/${domainId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Remove the domain from the list
      setDomains(domains.filter(domain => domain.id !== domainId));
      
      // Show success message
      setSuccessMessage('Domain disconnected successfully.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error disconnecting domain. Please try again.');
      console.error('Delete domain error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get status badge based on domain status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">Pending</span>;
      case 'verified':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Verified</span>;
      case 'live':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Live</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Domain Management</h2>

      {/* Connect Domain Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {preselectedPageInfo 
            ? `Connect Domain to "${preselectedPageInfo.title}"` 
            : 'Connect New Domain'}
        </h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="domain">
              Domain Name
            </label>
            <input
              type="text"
              id="domain"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="page">
              Select Page
            </label>
            {preselectedPageInfo ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={preselectedPageInfo.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700"
                  disabled
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPage('');
                    setPreselectedPageInfo(null);
                  }}
                  className="text-red-600 hover:text-red-800 p-2"
                  title="Change page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <select
                id="page"
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a page</option>
                {pages.map(page => (
                  <option key={page.id} value={page.id}>
                    {page.title}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="recordType">
              DNS Record Type
            </label>
            <select
              id="recordType"
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="A">A Record</option>
              <option value="CNAME">CNAME Record</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {recordType === 'A' 
                ? 'A Record: Points directly to an IP address (better for root domains)'
                : 'CNAME Record: Points to another domain (better for subdomains)'}
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Connect Domain'}
          </button>
        </form>
      </div>

      {/* Domain List */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Your Domains</h3>
        
        {loading && domains.length === 0 ? (
          <p className="text-gray-500">Loading domains...</p>
        ) : domains.length === 0 ? (
          <p className="text-gray-500">No domains connected yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Domain</th>
                  <th className="py-2 px-4 border-b text-left">Connected Page</th>
                  <th className="py-2 px-4 border-b text-left">Record Type</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {domains.map(domain => (
                  <tr key={domain.id}>
                    <td className="py-2 px-4 border-b">
                      <a 
                        href={`https://${domain.domain}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {domain.domain}
                      </a>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {domain.page ? domain.page.title : 'Unknown Page'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {domain.recordType}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {getStatusBadge(domain.status)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {domain.status === 'pending' && (
                        <button
                          onClick={() => handleVerify(domain.id)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                          disabled={loading}
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(domain.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={loading}
                      >
                        Disconnect
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

export default DomainManager; 