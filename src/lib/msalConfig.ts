import { Configuration, LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '',
    authority: import.meta.env.VITE_AZURE_AUTHORITY || 'https://login.microsoftonline.com/common',
    redirectUri: `${window.location.origin}`,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        if (level === LogLevel.Error) {
          console.error('MSAL Error:', message);
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ['User.Read', 'Mail.Read'],
};

export const graphRequest = {
  scopes: ['User.Read', 'Mail.Read'],
};
