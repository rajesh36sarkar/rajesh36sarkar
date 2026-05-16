import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// 1. Instantiate the static date variable OUTSIDE the component scope so it runs exactly once
const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    // Moved custom styling properties into standard class tokens or your stylesheet
    <footer className="py-4 mt-auto glass-footer">
      <Container>
        <Row className="align-items-center">
          {/* Copyright Information String */}
          <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0 text-white-50 small">
              &copy; {CURRENT_YEAR} Rajesh Sarkar. All rights reserved.
            </p>
          </Col>
          
          {/* Central Application Navigation Routes */}
          <Col md={4} className="text-center mb-3 mb-md-0">
            <div className="d-flex justify-content-center align-items-center gap-3">
              <Link to="/" className="text-white text-decoration-none small footer-link">Home</Link>
              <Link to="/projects" className="text-white text-decoration-none small footer-link">Projects</Link>
              <Link to="/about" className="text-white text-decoration-none small footer-link">About</Link>
              <Link to="/contact" className="text-white text-decoration-none small footer-link">Contact</Link>
            </div>
          </Col>
          
          {/* External Profile Anchor Elements */}
          <Col md={4} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end align-items-center gap-3 fs-5">
              <a href="https://github.com/rajesh36sarkar" target="_blank" rel="noopener noreferrer" className="text-white social-footer-icon" aria-label="GitHub Profile">
                <FaGithub />
              </a>
              <a href="https://linkedin.com/in/rajesh36sarkar" target="_blank" rel="noopener noreferrer" className="text-white social-footer-icon" aria-label="LinkedIn Profile">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com/rajesh36sarkar" target="_blank" rel="noopener noreferrer" className="text-white social-footer-icon" aria-label="Twitter Profile">
                <FaTwitter />
              </a>
              <a href="mailto:rajesh36.sarkar@gmail.com" className="text-white social-footer-icon" aria-label="Email Address Direct Route">
                <FaEnvelope />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;