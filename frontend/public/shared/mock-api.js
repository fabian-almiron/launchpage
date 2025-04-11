// Mock API service for demonstration purposes
(function(window) {
  // Mock data storage
  const mockDB = {
    user: {
      id: 'user-123',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'admin',
      plan: 'Pro'
    },
    pages: [
      { id: 'page-1', title: 'Landing Page', content: '<h1>Welcome to our landing page</h1>', updatedAt: Date.now() - 24 * 60 * 60 * 1000 },
      { id: 'page-2', title: 'About Us', content: '<h1>About our company</h1>', updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000 },
      { id: 'page-3', title: 'Services', content: '<h1>Our services</h1>', updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000 }
    ],
    templates: [
      { id: 'tpl-1', name: 'Business', category: 'professional', thumbnail: '/assets/template-business.jpg' },
      { id: 'tpl-2', name: 'Portfolio', category: 'creative', thumbnail: '/assets/template-portfolio.jpg' },
      { id: 'tpl-3', name: 'E-commerce', category: 'shop', thumbnail: '/assets/template-shop.jpg' }
    ],
    team: {
      id: 'team-1',
      name: 'Demo Team',
      members: [
        { id: 'user-123', name: 'Demo User', email: 'demo@example.com', role: 'admin' },
        { id: 'user-456', name: 'Jane Smith', email: 'jane@example.com', role: 'editor' },
        { id: 'user-789', name: 'Bob Johnson', email: 'bob@example.com', role: 'viewer' }
      ]
    }
  };

  // Helper to simulate API delay
  function delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Auto-login function - sets a valid token in localStorage
  function autoLogin() {
    const token = 'mock-jwt-token';
    localStorage.setItem('token', token);
    console.log('Mock API: Auto-login completed, token set');
    return token;
  }

  // Intercept fetch requests to localhost:3001
  const originalFetch = window.fetch;
  window.fetch = function(url, options = {}) {
    // Only intercept localhost:3001 API requests
    if (typeof url === 'string' && url.includes('localhost:3001/api')) {
      return handleMockRequest(url, options);
    }
    // Pass through all other requests to the original fetch
    return originalFetch.apply(this, arguments);
  };

  // Handle mock API requests
  async function handleMockRequest(url, options = {}) {
    await delay();
    
    // Check for valid token in protected routes
    const token = options.headers?.Authorization?.replace('Bearer ', '') || 
                  localStorage.getItem('token');
                  
    if (!token && !url.includes('/api/login')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Handle different API endpoints
    try {
      // Check if it's a single page request like /api/pages/page-123
      const singlePageMatch = url.match(/\/api\/pages\/(page-\d+)/);
      const pageId = singlePageMatch ? singlePageMatch[1] : null;
      
      if (url.includes('/api/pages')) {
        if (options.method === 'GET') {
          if (pageId) {
            // Handle GET for a single page
            const page = mockDB.pages.find(p => p.id === pageId);
            if (page) {
              return new Response(
                JSON.stringify(page),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
              );
            } else {
              return new Response(
                JSON.stringify({ error: 'Page not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
              );
            }
          } else {
            // Handle GET for all pages
            return new Response(
              JSON.stringify(mockDB.pages),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          }
        } else if (options.method === 'POST') {
          // Create a new page
          const pageData = JSON.parse(options.body);
          const newPage = {
            id: 'page-' + Date.now(),
            updatedAt: Date.now(),
            ...pageData
          };
          mockDB.pages.unshift(newPage);
          return new Response(
            JSON.stringify(newPage),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
          );
        } else if (options.method === 'PUT' && pageId) {
          // Update an existing page
          const pageData = JSON.parse(options.body);
          const pageIndex = mockDB.pages.findIndex(p => p.id === pageId);
          
          if (pageIndex !== -1) {
            // Update the page
            mockDB.pages[pageIndex] = {
              ...mockDB.pages[pageIndex],
              ...pageData,
              updatedAt: Date.now()
            };
            
            return new Response(
              JSON.stringify(mockDB.pages[pageIndex]),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          } else {
            return new Response(
              JSON.stringify({ error: 'Page not found' }),
              { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
          }
        } else if (options.method === 'DELETE' && pageId) {
          // Delete a page
          const pageIndex = mockDB.pages.findIndex(p => p.id === pageId);
          
          if (pageIndex !== -1) {
            // Remove the page from the array
            mockDB.pages.splice(pageIndex, 1);
            
            return new Response(
              JSON.stringify({ success: true, message: 'Page deleted' }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          } else {
            return new Response(
              JSON.stringify({ error: 'Page not found' }),
              { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
          }
        }
      } else if (url.includes('/api/me') || url.includes('/api/protected')) {
        return new Response(
          JSON.stringify(mockDB.user),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (url.includes('/api/login')) {
        const loginData = JSON.parse(options.body);
        if (loginData.email && loginData.password) {
          const token = autoLogin();
          return new Response(
            JSON.stringify({ token, user: mockDB.user }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    } catch (error) {
      console.error('Mock API error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Default response for unhandled routes
    return new Response(
      JSON.stringify({ error: 'Not implemented' }),
      { status: 501, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Mock API endpoints
  const mockAPI = {
    // Authentication
    login: async (email, password) => {
      await delay();
      if (email && password) {
        autoLogin();
        return { success: true, user: mockDB.user };
      }
      throw new Error('Invalid credentials');
    },
    
    logout: async () => {
      await delay();
      localStorage.removeItem('token');
      return { success: true };
    },
    
    // User info
    getCurrentUser: async () => {
      await delay();
      return { ...mockDB.user };
    },
    
    // Pages
    getPages: async () => {
      await delay();
      return [...mockDB.pages];
    },
    
    createPage: async (pageData) => {
      await delay();
      const newPage = {
        id: 'page-' + Date.now(),
        updatedAt: Date.now(),
        ...pageData
      };
      mockDB.pages.unshift(newPage);
      return newPage;
    },
    
    // Templates
    getTemplates: async () => {
      await delay();
      return [...mockDB.templates];
    },
    
    // Team
    getTeamMembers: async () => {
      await delay();
      return [...mockDB.team.members];
    },
    
    inviteTeamMember: async (email, role) => {
      await delay();
      const newMember = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email,
        role: role || 'viewer'
      };
      mockDB.team.members.push(newMember);
      return newMember;
    }
  };

  // Expose the mock API to the window
  window.mockAPI = mockAPI;
  
  // Auto-login on page load to ensure token exists
  autoLogin();
})(window); 