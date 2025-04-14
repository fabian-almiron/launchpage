import React, { useState, useEffect } from 'react';
import DomainManager from './components/DomainManager';
import PageManager from './components/PageManager';

const App = () => {
  const [activeTab, setActiveTab] = useState('pages');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // For simplicity, we'll just set a mock user here
      // In a real app, you'd verify the token with your API
      setUser({
        email: 'user@example.com',
        role: 'admin'
      });
    }
    setLoading(false);
  }, []);

  // Check for URL hash on load and when it changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['pages', 'domains', 'settings'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Check on initial load
    handleHashChange();

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Clean up
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab changes
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  const renderContent = () => {
    if (loading) {
      return <div className="p-6 text-center">Loading...</div>;
    }

    if (!user) {
      return (
        <div className="p-6 bg-white rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Please Log In</h2>
          <p className="text-gray-600 mb-4">You need to log in to access this application.</p>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              // Mock login - in a real app, you'd have a login form
              localStorage.setItem('token', 'mock-token');
              setUser({
                email: 'user@example.com',
                role: 'admin'
              });
            }}
          >
            Log In
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'domains':
        return <DomainManager />;
      case 'pages':
        return <PageManager />;
      case 'settings':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
            <p className="text-gray-600">Account and team settings.</p>
            {/* Settings content would go here */}
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">LaunchPage</h1>
              </div>
              {user && (
                <nav className="ml-6 flex space-x-8">
                  <button
                    onClick={() => setActiveTab('pages')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      activeTab === 'pages'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Pages
                  </button>
                  <button
                    onClick={() => setActiveTab('domains')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      activeTab === 'domains'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Domains
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      activeTab === 'settings'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Settings
                  </button>
                </nav>
              )}
            </div>
            {user && (
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">{user.email}</span>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  onClick={() => {
                    localStorage.removeItem('token');
                    setUser(null);
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {activeTab === 'pages' && user && (
            <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200 flex justify-between items-center">
              <div>
                <h3 className="text-blue-800 font-medium">Host Landing Pages on Custom Domains</h3>
                <p className="text-blue-600 text-sm">Connect your pages to custom domains for a professional look and feel.</p>
              </div>
              <button
                onClick={() => setActiveTab('domains')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Manage Domains
              </button>
            </div>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App; 