import React, { useState, useCallback } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CustomNavbar = () => {
  const [expanded, setExpanded] = useState(false);

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
        onToggle={setExpanded}
        className="py-3"
      >
        <Container>

          {/* Modern Animated Logo */}
          <motion.div
            whileHover={{
              scale: 1.08,
              y: -2,
            }}
            whileTap={{ scale: 0.96 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 15,
            }}
          >
            <Navbar.Brand
              as={Link}
              to="/"
              onClick={handleLinkClick}
              className="fw-bold fs-3 modern-logo"
            >
              <motion.span
                className="logo-first"
                animate={{
                  backgroundPosition: [
                    '0% 50%',
                    '100% 50%',
                    '0% 50%',
                  ],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                Rajesh
              </motion.span>

              {' '}

              <motion.span
                className="logo-last"
                animate={{
                  backgroundPosition: [
                    '100% 50%',
                    '0% 50%',
                    '100% 50%',
                  ],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                Sarkar
              </motion.span>
            </Navbar.Brand>
          </motion.div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-lg-center gap-2 gap-lg-3">

              <Nav.Link
                as={Link}
                to="/"
                onClick={handleLinkClick}
              >
                Home
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/projects"
                onClick={handleLinkClick}
              >
                Projects
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/about"
                onClick={handleLinkClick}
              >
                About
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/contact"
                onClick={handleLinkClick}
              >
                Contact
              </Nav.Link>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </motion.div>
  );
};

export default CustomNavbar;