import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { dashboardAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MainDashboard from '../components/Dashboard/MainDashboard';
import '../styles/dashboard.css';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getOverview();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchDashboard();
  };

  if (loading && !dashboardData) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />
      <div className="main-content">
        <Navbar 
          user={user}
          onLogout={handleLogout}
          onRefresh={handleRefresh}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="content-area">
          {activeModule === 'overview' && dashboardData && (
            <MainDashboard data={dashboardData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
