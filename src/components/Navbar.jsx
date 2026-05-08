import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const CustomNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false); // close menu after logout
  };

  const handleLinkClick = () => {
    setExpanded(false); // close the mobile menu
  };

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
        onToggle={(expanded) => setExpanded(expanded)}
        className="py-3"
      >
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={handleLinkClick} className="fw-bold fs-3">
            Portfolio
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" onClick={handleLinkClick} className="mx-2">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/projects" onClick={handleLinkClick} className="mx-2">
                Projects
              </Nav.Link>
              <Nav.Link as={Link} to="/about" onClick={handleLinkClick} className="mx-2">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" onClick={handleLinkClick} className="mx-2">
                Contact
              </Nav.Link>
              {user ? (
                <>
                  <Nav.Link as={Link} to="/admin/dashboard" onClick={handleLinkClick} className="mx-2">
                    Dashboard
                  </Nav.Link>
                  <Button
                    variant="outline-light"
                    onClick={handleLogout}
                    className="ms-2"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Nav.Link as={Link} to="/admin/login" onClick={handleLinkClick} className="mx-2">
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