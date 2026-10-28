
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

// Normalize malformed double-hash URLs (e.g. #/virtual-qabulxona#ariza -> #/virtual-qabulxona?tab=ariza)
// before HashRouter initializes, so shared links on Telegram/browsers never hit 404.
if (typeof window !== 'undefined' && window.location.hash) {
  const rawHash = window.location.hash;
  if (rawHash.startsWith('#/') && rawHash.indexOf('#', 2) !== -1) {
    const secondHashIdx = rawHash.indexOf('#', 2);
    const baseRoute = rawHash.slice(0, secondHashIdx);
    const subHash = rawHash.slice(secondHashIdx + 1);
    if (baseRoute === '#/virtual-qabulxona' && (subHash === 'ariza' || subHash === 'murojaat')) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#/virtual-qabulxona/${subHash}`);
    } else if (baseRoute === '#/' && subHash === 'contact') {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#/?section=contact`);
    } else {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${baseRoute}?tab=${encodeURIComponent(subHash)}`);
    }
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
