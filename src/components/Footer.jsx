import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-4 mt-auto" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>
      <Container>
        <Row className="align-items-center">
          <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">&copy; {currentYear} My Portfolio. All rights reserved.</p>
          </Col>
          <Col md={4} className="text-center mb-3 mb-md-0">
            <Link to="/" className="text-white text-decoration-none mx-2">Home</Link>
            <Link to="/projects" className="text-white text-decoration-none mx-2">Projects</Link>
            <Link to="/about" className="text-white text-decoration-none mx-2">About</Link>
            <Link to="/contact" className="text-white text-decoration-none mx-2">Contact</Link>
          </Col>
          <Col md={4} className="text-center text-md-end">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2 fs-5">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2 fs-5">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2 fs-5">
              <FaTwitter />
            </a>
            <a href="mailto:contact@example.com" className="text-white mx-2 fs-5">
              <FaEnvelope />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;   