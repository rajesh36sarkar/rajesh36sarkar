import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    const apiUrl = import.meta.env.VITE_API_URL || 'https://rajesh36sarkar-backend.onrender.com/api';
    
    try {
      const response = await axios.post(`${apiUrl}/contact`, data);
      if (response.status === 201) {
        setSuccess('✅ Message sent! I will get back to you soon.');
        reset();
      } else {
        setError('⚠️ Unexpected response from server. Please try again.');
      }
    } catch (err) {
      console.error('Contact error:', err);
      // Show a user-friendly message even on 500
      setError('❌ Failed to send message. The server encountered an error. Please try again later or contact me directly via email.');
    } finally {
      setSubmitting(false);
      // Auto-clear messages after 6 seconds
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 6000);
    }
  };

  const contactMethods = [
    { icon: <FaEnvelope size={26} />, title: 'Email', value: 'rajesh36.sarkar@gmail.com', link: 'mailto:rajesh36.sarkar@gmail.com', color: '#ea4335' },
    { icon: <FaPhone size={26} />, title: 'Phone', value: '+91 73639 20402', link: 'tel:+917363920402', color: '#34a853' },
    { icon: <FaWhatsapp size={26} />, title: 'WhatsApp', value: '+91 73639 20402', link: 'https://wa.me/917363920402', color: '#25D366' },
    { icon: <FaLinkedin size={26} />, title: 'LinkedIn', value: 'rajesh36sarkar', link: 'https://www.linkedin.com/in/rajesh36sarkar/', color: '#0077b5' },
  ];

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
          <Col lg={5} className="mb-4">
            <div className="glass-card p-4 h-100">
              <h3 className="mb-4">Let's Connect</h3>
              <p className="text-white-50 mb-4">
                Have a project in mind, need a developer, or just want to say hello? Feel free to reach out through any of the channels below.
              </p>
              {contactMethods.map((method, idx) => (
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
                    <Form.Control type="text" {...register('name', { required: true })} className="custom-input" />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control type="email" {...register('email', { required: true })} className="custom-input" />
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control type="text" {...register('subject', { required: true })} className="custom-input" />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Message *</Form.Label>
                  <Form.Control as="textarea" rows={5} {...register('message', { required: true })} className="custom-input" />
                </Form.Group>
                <Button type="submit" className="btn-primary-glow w-100" disabled={submitting}>
                  {submitting ? (
                    <>Sending <span className="spinner-border spinner-border-sm ms-2"></span></>
                  ) : (
                    <>Send Message <FaLinkedin className="ms-2" /></>
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