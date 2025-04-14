import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PagePreview from './components/PagePreview';
import './styles.css';

// Simple router to handle our minimal routes
const Router = () => {
  // Get the current path
  const path = window.location.pathname;
  
  // Parse preview route: /preview/:pageId
  const previewMatch = path.match(/^\/preview\/([^\/]+)$/);
  if (previewMatch) {
    const pageId = previewMatch[1];
    return <PagePreview pageId={pageId} />;
  }
  
  // Default route - render the main app
  return <App />;
};

// Create root and render
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Router />
    </React.StrictMode>
  );
} 