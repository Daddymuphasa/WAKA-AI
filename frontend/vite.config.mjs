import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log("Loading minimal config...");

export default defineConfig({
  plugins: [react()],
})
