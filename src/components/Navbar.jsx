import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const CustomNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar bg="transparent" expand="lg" variant="dark" className="py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">
            Portfolio
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="mx-2">Home</Nav.Link>
              <Nav.Link as={Link} to="/projects" className="mx-2">Projects</Nav.Link>
              <Nav.Link as={Link} to="/about" className="mx-2">About</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="mx-2">Contact</Nav.Link>
              {user ? (
                <>
                  <Nav.Link as={Link} to="/admin/dashboard" className="mx-2">Dashboard</Nav.Link>
                  <Button variant="outline-light" onClick={handleLogout} className="ms-2">
                    Logout
                  </Button>
                </>
              ) : (
                <Nav.Link as={Link} to="/admin/login" className="mx-2">Admin</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </motion.div>
  );
};

export default CustomNavbar;