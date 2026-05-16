import React, { useState, useCallback } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const CustomNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  // 1. Static Callback Hooks to minimize re-renders inside Nav containers
  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    setExpanded(false);
  }, [logout, navigate]);

  const handleLinkClick = useCallback(() => {
    setExpanded(false);
  }, []);

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar
        bg="transparent"
        expand="lg"
        variant="dark"
        expanded={expanded}
        onToggle={setExpanded} // Optimized setter mapping shorthand
        className="py-3"
      >
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={handleLinkClick} className="fw-bold fs-3">
            Portfolio
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Added container gaps for better responsive performance over individual item margins */}
            <Nav className="ms-auto d-flex align-items-lg-center gap-2 gap-lg-3">
              <Nav.Link as={Link} to="/" onClick={handleLinkClick}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/projects" onClick={handleLinkClick}>
                Projects
              </Nav.Link>
              <Nav.Link as={Link} to="/about" onClick={handleLinkClick}>
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" onClick={handleLinkClick}>
                Contact
              </Nav.Link>
              
              {user ? (
                <>
                  <Nav.Link as={Link} to="/admin/dashboard" onClick={handleLinkClick}>
                    Dashboard
                  </Nav.Link>
                  <Button
                    variant="outline-light"
                    onClick={handleLogout}
                    className="py-1 px-3"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Nav.Link as={Link} to="/admin/login" onClick={handleLinkClick}>
                  Admin
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </motion.div>
  );
};

export default CustomNavbar;