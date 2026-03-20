import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from "./context/AuthContext";
import { TasksProvider } from "./context/TareasContext";


const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <AuthProvider>
    <TasksProvider>
      <App />
    </TasksProvider>
  </AuthProvider>
);