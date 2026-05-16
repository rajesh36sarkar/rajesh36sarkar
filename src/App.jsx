import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Structural Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThreeBackground from './components/ThreeBackground';
import LoadingSpinner from './components/LoadingSpinner';
import AdminRoute from './components/AdminRoute';

// Page Views
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// API Services
import { getSiteInfo, getProjects } from './services/api';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Warm up the API caching layers or check network connectivity safely on system boot
    const initializeApplication = async () => {
      try {
        await Promise.all([getSiteInfo(), getProjects()]);
      } catch (error) {
        console.error('Telemetry validation or connection failed on initialization:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeApplication();
    return () => { isMounted = false; };
  }, []);

  // Show a uniform full-page spinner while checking layout network configurations
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <AuthProvider>
        {/* Background 3D canvas positioned securely beneath presentation layers */}
        
        
        {/* Persistent App Header Layer */}
        <Navbar />
        
        {/* Semantic main content wrapper to enforce layout stability */}
        <main className="main-content flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Strict access control guard protecting the administration dashboard */}
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Routes>
        </main>
        
        {/* Persistent App Footer Layer */}
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;