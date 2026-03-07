import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@azure-storybook': resolve(__dirname, '../AzureStorybook/src'),
    },
  },
});
