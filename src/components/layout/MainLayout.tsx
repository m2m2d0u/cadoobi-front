import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="pl-64">
        <TopBar />
        <main className="pt-24 pb-12 px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
