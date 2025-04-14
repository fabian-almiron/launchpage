/**
 * Mock API for development and preview functionality
 * This simulates backend API calls for the preview page
 */

// Mock data store
const mockData = {
  pages: [
    {
      id: 'page1',
      title: 'Homepage',
      content: '<h1>Welcome to Our Website</h1><p>This is a sample homepage created with LaunchPage builder.</p>',
      createdAt: '2023-05-15T12:00:00Z'
    },
    {
      id: 'page2',
      title: 'About Us',
      content: '<h1>About Our Company</h1><p>We are a team of dedicated professionals working to help you build amazing landing pages.</p>',
      createdAt: '2023-05-16T14:30:00Z'
    },
    {
      id: 'page3',
      title: 'Services',
      content: '<h1>Our Services</h1><ul><li>Web Development</li><li>Design</li><li>Marketing</li></ul>',
      createdAt: '2023-05-17T09:45:00Z'
    }
  ],
  domains: [
    {
      id: 'domain1',
      domain: 'example.com',
      pageId: 'page1',
      status: 'live',
      recordType: 'A'
    },
    {
      id: 'domain2',
      domain: 'about.example.com',
      pageId: 'page2',
      status: 'pending',
      recordType: 'CNAME'
    }
  ],
  users: [
    {
      id: 'user1',
      email: 'demo@example.com',
      password: 'demo',
      name: 'Demo User'
    },
    {
      id: 'user2',
      email: 'fabian.e.almiron@gmail.com',
      password: 'password',
      name: 'Fabian Almiron'
    }
  ]
};

// Initialize mockAPI object if it doesn't exist
window.mockAPI = window.mockAPI || {};

// Add mockAPI functions
window.mockAPI.login = async function(email, password) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = mockData.users.find(u => u.email === email);
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }
  
  // Create a mock token and store in localStorage
  const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name
  }));
  
  return { 
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  };
};

// Get all pages
window.mockAPI.getPages = async function() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockData.pages];
};

// Get a specific page by ID
window.mockAPI.getPage = async function(pageId) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const page = mockData.pages.find(p => p.id === pageId);
  if (!page) {
    throw new Error(`Page with ID ${pageId} not found`);
  }
  return { ...page };
};

// Get domains for a specific page
window.mockAPI.getDomainsForPage = async function(pageId) {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockData.domains
    .filter(d => d.pageId === pageId)
    .map(d => ({ ...d }));
};

// Get all domains
window.mockAPI.getAllDomains = async function() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockData.domains];
};

// Connect a new domain to a page
window.mockAPI.connectDomain = async function(domainData) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Validate domain format
  const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
  if (!domainRegex.test(domainData.domain)) {
    throw new Error('Invalid domain format');
  }
  
  // Check if domain already exists
  if (mockData.domains.some(d => d.domain === domainData.domain)) {
    throw new Error('Domain already exists');
  }
  
  // Create new domain
  const newDomain = {
    id: `domain${mockData.domains.length + 1}`,
    domain: domainData.domain,
    pageId: domainData.pageId,
    status: 'pending',
    recordType: domainData.recordType || 'A',
    createdAt: new Date().toISOString()
  };
  
  // Add to mock data
  mockData.domains.push(newDomain);
  
  return { 
    ...newDomain,
    message: 'Domain connection initiated. DNS propagation may take up to 48 hours.'
  };
};

// Verify a domain
window.mockAPI.verifyDomain = async function(domainId) {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const domain = mockData.domains.find(d => d.id === domainId);
  if (!domain) {
    throw new Error('Domain not found');
  }
  
  // Update domain status
  domain.status = 'verified';
  
  return { 
    ...domain,
    message: 'Domain verified successfully! SSL certificate is being generated.'
  };
};

// Disconnect a domain
window.mockAPI.disconnectDomain = async function(domainId) {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const domainIndex = mockData.domains.findIndex(d => d.id === domainId);
  if (domainIndex === -1) {
    throw new Error('Domain not found');
  }
  
  // Remove domain
  mockData.domains.splice(domainIndex, 1);
  
  return { message: 'Domain disconnected successfully' };
};

// Create a new page, used when applying templates
window.mockAPI.createPage = async function(pageData) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create a new page ID
  const newId = 'page' + (mockData.pages.length + 1);
  
  // Create new page object
  const newPage = {
    id: newId,
    title: pageData.title || 'New Page',
    content: pageData.content || '<h1>New Page</h1><p>This is a new page.</p>',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    templateId: pageData.templateId || null
  };
  
  // Add to mock data
  mockData.pages.push(newPage);
  
  return { ...newPage, message: 'Page created successfully' };
}; 