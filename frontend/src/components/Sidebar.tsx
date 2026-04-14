import React from 'react';
import '../styles/sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
}

function Sidebar({ isOpen, setIsOpen, activeModule, setActiveModule }: SidebarProps) {
  const modules = [
    { id: 'overview', label: '📊 Dashboard Overview', icon: '📊' },
    { id: 'study', label: '📚 Study Tracker', icon: '📚' },
    { id: 'professional', label: '💼 Professional', icon: '💼' },
    { id: 'expense', label: '�� Expenses', icon: '💰' },
    { id: 'health', label: '❤️ Health & Fitness', icon: '❤️' },
    { id: 'islamic', label: '🕌 Islamic', icon: '🕌' },
    { id: 'business', label: '💻 Business', icon: '💻' },
    { id: 'tasks', label: '✅ Tasks', icon: '✅' },
    { id: 'goals', label: '🏆 Goals', icon: '🏆' },
    { id: 'network', label: '🤝 Network', icon: '🤝' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>Menu</h2>
        <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
      </div>
      <nav className="sidebar-nav">
        {modules.map((module) => (
          <button
            key={module.id}
            className={`nav-item ${activeModule === module.id ? 'active' : ''}`}
            onClick={() => {
              setActiveModule(module.id);
              setIsOpen(false);
            }}
          >
            <span className="nav-icon">{module.icon}</span>
            <span className="nav-label">{module.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
