import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './lib/msalConfig';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

msalInstance.initialize().then(() => {
  msalInstance.handleRedirectPromise().then((response) => {
    if (response) {
      console.log('Login successful:', response);
    }
    createRoot(rootElement).render(
      <StrictMode>
        <MsalProvider instance={msalInstance}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </MsalProvider>
      </StrictMode>
    );
  }).catch((error) => {
    console.error('Redirect error:', error);
    createRoot(rootElement).render(
      <StrictMode>
        <MsalProvider instance={msalInstance}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </MsalProvider>
      </StrictMode>
    );
  });
}).catch((error) => {
  console.error('MSAL initialization error:', error);
  createRoot(rootElement).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MsalProvider>
    </StrictMode>
  );
});
