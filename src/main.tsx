import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { PlayerProvider } from './context/PlayerContext'
import { GameProvider } from './context/GameContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <GameProvider>
          <App />
          <ToastContainer position="top-right" theme="dark" />
        </GameProvider>
      </PlayerProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
