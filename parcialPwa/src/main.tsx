import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './Login.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<App />} />
      </Routes>

    </BrowserRouter>
  </StrictMode>
)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registrado:", registration);
      })
      .catch((error) => {
        console.log("Error registrando Service Worker:", error);
      });
  });
}
