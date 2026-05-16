import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminLogin } from '../services/api';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If the user is ALREADY logged in, automatically push them straight to the dashboard
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await adminLogin({ email, password });
      
      if (response?.data) {
        // Save token and data directly to Context state
        login(response.data.token, response.data.user);
        
        // Push navigation directly down the rendering stack
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-100"
        style={{ maxWidth: '450px' }}
      >
        <Card className="glass-card">
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Admin Login</h2>
            
            {error && <Alert variant="danger" className="text-center py-2">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="adminEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-transparent text-white border-light"
                  disabled={loading}
                />
              </Form.Group>
              
              <Form.Group className="mb-4" controlId="adminPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-transparent text-white border-light"
                  disabled={loading}
                />
              </Form.Group>
              
              <Button type="submit" className="btn-gradient w-100 py-2" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default AdminLogin;