import React from 'react';
import ReactDOM from 'react-dom/client';
import { FluentProvider } from '@fluentui/react-components';
import { azureLightTheme } from '@azure-storybook/themes';
import App from './shell/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FluentProvider theme={azureLightTheme}>
      <App />
    </FluentProvider>
  </React.StrictMode>,
);
