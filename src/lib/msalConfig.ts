import { Configuration, LogLevel, PublicClientApplication } from '@azure/msal-browser';

const getRedirectUri = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://htlwy-nachhilfe.netlify.app';
};

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'a1172ec4-52aa-4816-aa92-c148afff7862',
    authority: import.meta.env.VITE_AZURE_AUTHORITY || 'https://login.microsoftonline.com/6dd5291a-610e-4172-a7b6-9a7dc57e9a2a',
    redirectUri: getRedirectUri(),
    postLogoutRedirectUri: getRedirectUri(),
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
  system: {
    allowRedirectInIframe: false,
    windowHashTimeout: 60000,
    iframeHashTimeout: 60000,
    loadFrameTimeout: 60000,
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        if (level === LogLevel.Error) {
          console.error('MSAL Error:', message);
        } else if (level === LogLevel.Warning) {
          console.warn('MSAL Warning:', message);
        }
      },
      logLevel: LogLevel.Error,
    },
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ['User.Read', 'profile', 'openid'],
};
