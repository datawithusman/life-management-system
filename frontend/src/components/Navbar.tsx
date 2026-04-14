import React from 'react';
import '../styles/navbar.css';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  onRefresh: () => void;
  onToggleSidebar: () => void;
}

function Navbar({ user, onLogout, onRefresh, onToggleSidebar }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="hamburger-btn" onClick={onToggleSidebar}>
          ☰
        </button>
        <h1 className="navbar-title">🎯 Life Management System</h1>
      </div>
      <div className="navbar-right">
        <button className="refresh-btn" onClick={onRefresh} title="Refresh">
          🔄
        </button>
        <div className="user-menu">
          <span className="user-name">{user?.fullName || user?.username}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
