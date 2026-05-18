import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <footer className="py-4 mt-auto glass-footer">
      <Container>
        <Row className="align-items-center">

          {/* Copyright */}
          <Col
            md={4}
            className="text-center text-md-start mb-3 mb-md-0"
          >
            <p className="mb-0 text-white-50 small">
              &copy; {CURRENT_YEAR} Rajesh Sarkar. All rights reserved.
            </p>
          </Col>

          {/* Navigation */}
          <Col
            md={4}
            className="text-center mb-3 mb-md-0"
          >
            <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">

              <Link
                to="/"
                className="text-white text-decoration-none small footer-link"
              >
                Home
              </Link>

              <Link
                to="/projects"
                className="text-white text-decoration-none small footer-link"
              >
                Projects
              </Link>

              <Link
                to="/about"
                className="text-white text-decoration-none small footer-link"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="text-white text-decoration-none small footer-link"
              >
                Contact
              </Link>

              {/* Admin Link */}
              {user ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="text-white text-decoration-none small footer-link"
                  >
                    Dashboard
                  </Link>

                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={handleLogout}
                    className="py-0 px-2"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  className="text-white text-decoration-none small footer-link"
                >
                  Admin
                </Link>
              )}

            </div>
          </Col>

          {/* Social Icons */}
          <Col
            md={4}
            className="text-center text-md-end"
          >
            <div className="d-flex justify-content-center justify-content-md-end align-items-center gap-3 fs-5">

              <a
                href="https://github.com/rajesh36sarkar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white social-footer-icon"
                aria-label="GitHub Profile"
              >
                <FaGithub />
              </a>

              <a
                href="https://linkedin.com/in/rajesh36sarkar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white social-footer-icon"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://twitter.com/rajesh36sarkar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white social-footer-icon"
                aria-label="Twitter Profile"
              >
                <FaTwitter />
              </a>

            </div>
          </Col>

        </Row>
      </Container>
    </footer>
  );
};

export default Footer;