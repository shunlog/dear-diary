import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false,
allow: [
        // search up for workspace root
        // searchForWorkspaceRoot(process.cwd()),
        // your custom rules
        '/home/awh/Downloads/journal',
      ],
    }
  },
})
