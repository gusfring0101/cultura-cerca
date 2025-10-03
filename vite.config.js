import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // evita fallos por referencias a process.env en libs
    'process.env': {}
  }
})






