import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaWhatsapp, FaLinkedin, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

// 1. Move Static Data OUTSIDE the component to protect render performance cycles
const CONTACT_METHODS = [
  { icon: <FaPhone size={26} />, title: 'Phone', value: '+91 73639 20402', link: 'tel:+917363920402', color: '#34a853' },
  { icon: <FaWhatsapp size={26} />, title: 'WhatsApp', value: '+91 73639 20402', link: 'https://wa.me/917363920402', color: '#25D366' },
  { icon: <FaLinkedin size={26} />, title: 'LinkedIn', value: 'rajesh36sarkar', link: 'https://www.linkedin.com/in/rajesh36sarkar/', color: '#0077b5' },
];

const API_URL = import.meta.env.VITE_API_URL || 'https://rajesh36sarkar-backend.onrender.com/api';

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    mode: 'onTouched' 
  });
  
  const timeoutRef = useRef(null);

  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/contact`, data);
      if (response.status === 201) {
        setSuccess('✅ Message sent! I will get back to you soon.');
        reset();
      } else {
        setError('⚠️ Unexpected response from server. Please try again.');
      }
    } catch (err) {
      console.error('Contact error:', err);
      setError('❌ Failed to send message. Please try again later or contact me directly via email.');
    } finally {
      setSubmitting(false);

      // Auto-clear notification updates safely using mutable state tracking references
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 6000);
    }
  };

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-5">
          <h1 className="section-title-glow">Get In Touch</h1>
          <p className="lead text-white-50">I'm always excited to collaborate or discuss new opportunities.</p>
        </div>

        <Row>
          {/* Informational Channel Side */}
          <Col lg={5} className="mb-4">
            <div className="glass-card p-4 h-100">
              <h3 className="mb-4">Let's Connect</h3>
              <p className="text-white-50 mb-4">
                Have a project in mind, need a developer, or just want to say hello? Feel free to reach out through any of the channels below.
              </p>
              
              {CONTACT_METHODS.map((method, idx) => (
                <motion.a
                  key={idx}
                  href={method.link}
                  target={method.link.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="contact-method"
                  whileHover={{ x: 5 }}
                  style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', textDecoration: 'none', color: 'white' }}
                >
                  <div className="contact-icon" style={{ backgroundColor: method.color }}>{method.icon}</div>
                  <div className="ms-3">
                    <h6 className="mb-0">{method.title}</h6>
                    <span className="text-white-50 small">{method.value}</span>
                  </div>
                </motion.a>
              ))}
              
              <hr className="my-4" />
              <div className="d-flex align-items-center">
                <FaMapMarkerAlt size={24} className="me-3 text-primary" />
                <div>
                  <h6 className="mb-0">Location</h6>
                  <span className="text-white-50">Kolkata, India (Remote / On-site)</span>
                </div>
              </div>
              <div className="d-flex align-items-center mt-3">
                <FaClock size={24} className="me-3 text-primary" />
                <div>
                  <h6 className="mb-0">Response Time</h6>
                  <span className="text-white-50">Within 24 hours (usually 2-4h)</span>
                </div>
              </div>
            </div>
          </Col>

          {/* Interactive Form Side */}
          <Col lg={7}>
            <motion.div
              className="glass-card p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="mb-4">Send a Message</h3>
              
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Your Name *</Form.Label>
                    <Form.Control 
                      type="text" 
                      {...register('name', { required: 'Name is required' })} 
                      className={`custom-input ${errors.name ? 'is-invalid' : ''}`} 
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control 
                      type="email" 
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                      })} 
                      className={`custom-input ${errors.email ? 'is-invalid' : ''}`} 
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control 
                    type="text" 
                    {...register('subject', { required: 'Subject is required' })} 
                    className={`custom-input ${errors.subject ? 'is-invalid' : ''}`} 
                  />
                  {errors.subject && <div className="invalid-feedback">{errors.subject.message}</div>}
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Message *</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={7} 
                    {...register('message', { required: 'Message body cannot be empty' })} 
                    className={`custom-input ${errors.message ? 'is-invalid' : ''}`} 
                  />
                  {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
                </Form.Group>
                
                <Button type="submit" className="btn-primary-glow w-100" disabled={submitting}>
                  {submitting ? (
                    <>Sending <span className="spinner-border spinner-border-sm ms-2"></span></>
                  ) : (
                    <>Send Message <FaPaperPlane className="ms-2" /></>
                  )}
                </Button>
              </Form>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default Contact;