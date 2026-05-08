import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { getSiteInfo } from '../services/api';
import { FaCode, FaMobile, FaServer, FaCloud } from 'react-icons/fa';

const About = () => {
  const [siteInfo, setSiteInfo] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const res = await getSiteInfo();
      setSiteInfo(res.data);
    };
    fetchInfo();
  }, []);

  const services = [
    { icon: <FaCode size={40} />, title: 'Frontend Dev', desc: 'React, Vue, Angular' },
    { icon: <FaServer size={40} />, title: 'Backend Dev', desc: 'Node.js, Python, PHP' },
    { icon: <FaMobile size={40} />, title: 'Mobile Dev', desc: 'React Native, Flutter' },
    { icon: <FaCloud size={40} />, title: 'Cloud Services', desc: 'AWS, Firebase, MongoDB' },
  ];

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">About Me</h1>
        <Row className="align-items-center">
          <Col lg={6} className="mb-4">
            <div className="glass-card p-4">
              <h3 className="mb-3">Who Am I?</h3>
              <p className="text-white-50">
                {siteInfo?.about?.description || 'I am a passionate full stack developer with expertise in modern web technologies...'}
              </p>
              <Row className="mt-4 text-center">
                <Col>
                  <h2 className="text-primary">{siteInfo?.about?.experience || 5}+</h2>
                  <p>Years Experience</p>
                </Col>
                <Col>
                  <h2 className="text-primary">{siteInfo?.about?.projects || 50}+</h2>
                  <p>Projects Completed</p>
                </Col>
                <Col>
                  <h2 className="text-primary">{siteInfo?.about?.clients || 30}+</h2>
                  <p>Happy Clients</p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg={6}>
            <div className="glass-card p-4">
              <h3 className="mb-4">Technical Skills</h3>
              {siteInfo?.skills?.map((skill, idx) => (
                <div key={idx} className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <ProgressBar 
                    now={skill.level} 
                    variant="info" 
                    style={{ height: '8px', borderRadius: '4px' }}
                  />
                </div>
              ))}
            </div>
          </Col>
        </Row>

        <h2 className="section-title mt-5">What I Do</h2>
        <Row>
          {services.map((service, idx) => (
            <Col lg={3} md={6} key={idx} className="mb-4">
              <div className="glass-card p-4 text-center h-100">
                <div className="mb-3 text-primary">{service.icon}</div>
                <h4>{service.title}</h4>
                <p className="text-white-50 mt-2">{service.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </motion.div>
    </Container>
  );
};

export default About;