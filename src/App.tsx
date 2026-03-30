import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Merchants } from './pages/Merchants';
import { Operators } from './pages/Operators';
import { GiftCards } from './pages/GiftCards';
import { Users } from './pages/Users';
import { Roles } from './pages/Roles';
import { Permissions } from './pages/Permissions';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/merchants" element={<Merchants />} />
          <Route path="/operators" element={<Operators />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/users" element={<Users />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
        <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
      </div>
      <h2 className="text-2xl font-bold text-primary font-headline mb-2">{title}</h2>
      <p className="text-on-surface-variant max-w-md">This module is currently under development for the Cadoobi platform. Check back soon for updates.</p>
    </div>
  );
}

export default App;
