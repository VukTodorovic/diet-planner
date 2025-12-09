import React from 'react';
import { Utensils } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Utensils className="logo-icon" size={24} />
            <span>DietPlanner</span>
          </div>
        </div>
      </header>
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <div className="container">
          &copy; {new Date().getFullYear()} DietPlanner. Built for you.
        </div>
      </footer>
    </div>
  );
};
