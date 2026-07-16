import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// ✅ Register Service Worker for PWA Support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });

  // Listen for messages from Service Worker
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data.type === 'SYNC_COMPLETE') {
      console.log('📱 Data synced successfully');
    }
  });
}
