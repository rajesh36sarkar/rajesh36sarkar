import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
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
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/contact`, data);
      setSuccess('Message sent successfully! I will get back to you soon.');
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <FaEnvelope size={24} />, title: 'Email', value: 'rajesh36.sarkar@gmail.com', link: 'mailto:rajesh36.sarkar@gmail.com' },
    { icon: <FaPhone size={24} />, title: 'Phone', value: '+91 (736) 392-0402', link: 'tel:+917363920402' },
    { icon: <FaMapMarkerAlt size={24} />, title: 'Location', value: 'Kolkata, India', link: null },
    { icon: <FaClock size={24} />, title: 'Response Time', value: 'Within 24 hours', link: null },
  ];

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="section-title">Get In Touch</h1>
        
        <Row>
          <Col lg={5} className="mb-4">
            <div className="glass-card p-4 h-100">
              <h3 className="mb-4">Let's Connect</h3>
              <p className="text-white-50 mb-4">
                Have a project in mind or just want to say hello? I'd love to hear from you.
                Fill out the form and I'll get back to you as soon as possible.
              </p>
              
              {contactInfo.map((info, idx) => (
                <div key={idx} className="d-flex align-items-center mb-4">
                  <div className="me-3 text-primary">{info.icon}</div>
                  <div>
                    <h6 className="mb-0">{info.title}</h6>
                    {info.link ? (
                      <a href={info.link} className="text-white-50 text-decoration-none">
                        {info.value}
                      </a>
                    ) : (
                      <span className="text-white-50">{info.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Col>
          
          <Col lg={7}>
            <div className="glass-card p-4">
              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('name', { required: true })}
                      className="bg-transparent text-white border-light"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      {...register('email', { required: true })}
                      className="bg-transparent text-white border-light"
                    />
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('subject', { required: true })}
                    className="bg-transparent text-white border-light"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    {...register('message', { required: true })}
                    className="bg-transparent text-white border-light"
                  />
                </Form.Group>
                <Button type="submit" className="btn-gradient" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default Contact;