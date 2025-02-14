import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { LikedVideosProvider } from './contexts/LikedVideosContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LikedVideosProvider>
      <App />
    </LikedVideosProvider>
  </React.StrictMode>,
)
