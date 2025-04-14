// Shared layout component for the dashboard
function renderLayout(currentPage) {
  const sidebarElement = document.createElement('aside');
  sidebarElement.className = 'fixed inset-y-0 left-0 z-10 w-64 overflow-y-auto bg-white border-r border-gray-200 pt-5 pb-4 transform transition-transform duration-300 ease-in-out';
  sidebarElement.id = 'sidebar';

  // Menu items configuration
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>', href: 'dashboard.html' },
    { id: 'pages', label: 'Pages', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path></svg>', href: 'pages.html' },
    { id: 'domains', label: 'Domains', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd" /></svg>', href: 'domains.html' },
    { id: 'templates', label: 'Templates', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>', href: 'templates.html' },
    { id: 'feature-demo', label: 'Feature Demo', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clip-rule="evenodd" /></svg>', href: 'feature-demo.html' },
    { id: 'team', label: 'Team Settings', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z"></path></svg>', href: 'team-settings.html' },
    { id: 'team-users', label: 'Team Members', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>', href: 'team-users.html' },
    { id: 'billing', label: 'Billing', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>', href: 'billing.html' },
  ];

  // Create the sidebar content
  sidebarElement.innerHTML = `
    <div class="flex items-center justify-between px-4">
      <div class="flex items-center cursor-pointer" id="logo-home">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
        </svg>
        <span class="ml-2 text-xl font-bold text-gray-900">LaunchPage</span>
      </div>
      <button id="mobile-menu-button" class="md:hidden rounded-md p-2 inline-flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
    <div class="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
      <nav class="flex-1 px-2 space-y-1">
        ${menuItems.map(item => `
          <a href="${item.href}" class="nav-link-item ${item.id === currentPage ? 'nav-link-active' : 'nav-link'}">
            ${item.icon}
            ${item.label}
          </a>
        `).join('')}
      </nav>
      <div class="px-2 space-y-1 pt-6 pb-2">
        <button id="logout-button" class="nav-link text-red-700 hover:bg-red-50 hover:text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm3 4a1 1 0 011-1h2a1 1 0 010 2H7a1 1 0 01-1-1zm0 3a1 1 0 100 2h7a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  `;

  // Create the mobile menu button event listener
  setTimeout(() => {
    // Logo click handler
    const logoHome = document.getElementById('logo-home');
    if (logoHome) {
      logoHome.addEventListener('click', function() {
        console.log('Logo clicked, navigating to dashboard');
        window.location.href = 'dashboard.html';
      });
    }
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
      mobileMenuButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        
        // Toggle the sidebar
        if (sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          sidebar.style.transform = 'translateX(-100%)';
        } else {
          sidebar.classList.add('open');
          sidebar.style.transform = 'translateX(0)';
        }
        
        // Also adjust main content when sidebar is toggled on mobile
        const mainContent = document.getElementById('main-content');
        if (mainContent && window.innerWidth < 768) {
          if (sidebar.classList.contains('open')) {
            mainContent.style.marginLeft = '16rem';
          } else {
            mainContent.style.marginLeft = '0';
          }
        }
      });
    }
    
    // Add logout button event listener
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        try {
          console.log('Logout button clicked');
          // Use the mock API logout function
          if (window.mockAPI && window.mockAPI.logout) {
            await window.mockAPI.logout();
          } else {
            // Fallback to the standard logout function
            logout();
          }
          
          // Redirect to login page
          window.location.href = 'login.html';
        } catch (error) {
          console.error('Logout failed:', error);
        }
      });
    }
    
    // Remove the event listeners for navigation links since we're using direct href now
    // Instead, just add a class to highlight the active link
    const navLinks = document.querySelectorAll('.nav-link-item');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === window.location.pathname.split('/').pop()) {
        link.classList.add('nav-link-active');
        link.classList.remove('nav-link');
      }
    });
  }, 100);

  return sidebarElement;
}

// Function to create main content area
function createMainContent() {
  const mainElement = document.createElement('main');
  mainElement.className = 'py-6 px-4 sm:px-6 md:px-8 transition-all duration-300';
  mainElement.id = 'main-content';
  return mainElement;
}

// Helper function to create a header component
function createHeader(title, actions = '') {
  const headerElement = document.createElement('div');
  headerElement.className = 'mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between';
  headerElement.innerHTML = `
    <div>
      <h1 class="text-2xl font-bold text-gray-900">${title}</h1>
    </div>
    <div class="mt-3 sm:mt-0">
      ${actions}
    </div>
  `;
  return headerElement;
}

// Add user info in the header area
function createUserInfo() {
  const userElement = document.createElement('div');
  userElement.className = 'fixed top-0 right-0 p-4 z-20';
  userElement.innerHTML = `
    <div class="flex items-center space-x-4">
      <div class="hidden sm:flex flex-col items-end">
        <span class="text-sm font-medium text-gray-900" id="user-name">Loading...</span>
        <span class="text-xs text-gray-500" id="user-email">Loading...</span>
      </div>
      <div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium" id="user-avatar">
        ?
      </div>
    </div>
  `;
  return userElement;
}

// Helper function for logout
function logout() {
  // Remove token from localStorage
  localStorage.removeItem('token');
  
  // Create a flag to prevent automatic login
  localStorage.setItem('manual_logout', 'true');
  
  // Redirect to login page
  window.location.href = 'login.html';
}

// Mock user data for demonstration purposes
function getMockUserData() {
  return {
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'admin',
    plan: 'Pro'
  };
}

// Function to check if user is authenticated
async function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    // No token, we should redirect to login
    window.location.href = 'login.html';
    return null;
  }

  try {
    // Try to get user data using the token
    const res = await fetch('http://localhost:3001/api/me', {
      headers: { 
        'Authorization': 'Bearer ' + token 
      }
    });
    
    if (!res.ok) {
      // Token is invalid, redirect to login
      console.error('Invalid token');
      window.location.href = 'login.html';
      return null;
    }
    
    // Return the user data
    return await res.json();
  } catch (error) {
    console.error('Auth check failed:', error);
    // For demo, fallback to mock data if fetch fails
    return getMockUserData();
  }
}

// Function to setup authentication and layout
async function setupDashboard(currentPage, pageTitle, renderPageContent) {
  // Debug logs for navigation
  console.log('Current page:', currentPage);
  console.log('Current URL:', window.location.href);
  console.log('Base URL:', window.location.origin);
  
  // Remove any existing loading indicator 
  const existingLoader = document.getElementById('loading');
  if (existingLoader) {
    existingLoader.remove();
  }

  const body = document.body;
  body.className = 'bg-gray-50 font-sans';
  body.innerHTML = '';

  // Create a wrapper for the layout
  const wrapper = document.createElement('div');
  wrapper.className = 'min-h-screen flex flex-col';
  body.appendChild(wrapper);

  // Add sidebar
  const sidebar = renderLayout(currentPage);
  wrapper.appendChild(sidebar);

  // Add user info
  const userInfo = createUserInfo();
  wrapper.appendChild(userInfo);

  // Create main content area
  const main = createMainContent();
  wrapper.appendChild(main);

  // Add header to main content
  const header = createHeader(pageTitle);
  main.appendChild(header);

  // Create content container
  const content = document.createElement('div');
  content.id = 'content';
  main.appendChild(content);

  // Check authentication - this will always succeed in our demo
  const user = await checkAuth();
  
  // Update user info in the UI
  setTimeout(() => {
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const userAvatarElement = document.getElementById('user-avatar');
    
    if (userNameElement && user.name) {
      userNameElement.textContent = user.name;
    }
    
    if (userEmailElement && user.email) {
      userEmailElement.textContent = user.email;
    }
    
    if (userAvatarElement && user.email) {
      userAvatarElement.textContent = user.email.charAt(0).toUpperCase();
    }
  }, 0);
  
  // If we have a page render function, render the page content
  if (renderPageContent) {
    renderPageContent(content, user);
  }

  return { user, content };
} 