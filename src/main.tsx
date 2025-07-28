// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' // GARANTA QUE ESTA É A ÚNICA IMPORTAÇÃO DE CSS
import { RouterProvider } from 'react-router-dom'
import { router } from './routes.tsx'
import { AuthProvider } from './features/auth/AuthProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)