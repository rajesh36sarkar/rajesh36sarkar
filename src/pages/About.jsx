import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ProgressBar, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { getSiteInfo } from '../services/api';
import { FaCode, FaMobile, FaServer, FaCloud, FaDownload } from 'react-icons/fa';

const About = () => {
  const [siteInfo, setSiteInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getSiteInfo();
        setSiteInfo(res.data);
      } catch (error) {
        console.error('Error fetching site info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  // Hardcoded skills from resume (will be overridden by siteInfo if available)
  const defaultSkills = [
    { name: 'JavaScript (ES6+)', level: 85 },
    { name: 'React.js / Next.js', level: 85 },
    { name: 'Node.js / Express.js', level: 80 },
    { name: 'MongoDB / Mongoose', level: 75 },
    { name: 'Tailwind CSS / Bootstrap', level: 90 },
    { name: 'RESTful APIs / JWT', level: 80 },
    { name: 'Git / GitHub', level: 85 },
    { name: 'SEO (React Helmet)', level: 75 },
  ];

  const skills = siteInfo?.skills?.length ? siteInfo.skills : defaultSkills;

  // Hardcoded about info
  const aboutText = siteInfo?.about?.description || 
    "Detail-oriented Full Stack Developer with 1+ year of experience building scalable web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js). Skilled in Next.js, Tailwind CSS, Bootstrap, and Material UI. Proven track record of delivering business-critical platforms, from eCommerce and digital services to creative portfolio websites. Passionate about writing clean code, optimizing performance, and integrating SEO best practices.";

  const experienceYears = siteInfo?.about?.experience || 1;
  const projectsCount = siteInfo?.about?.projects || 10;
  const clientsCount = siteInfo?.about?.clients || 5;

  const services = [
    { icon: <FaCode size={40} />, title: 'Frontend Dev', desc: 'React, Next.js, Tailwind, Bootstrap, Material UI' },
    { icon: <FaServer size={40} />, title: 'Backend Dev', desc: 'Node.js, Express.js, REST APIs, JWT' },
    { icon: <FaMobile size={40} />, title: 'Responsive Design', desc: 'Mobile-first, Cross-browser' },
    { icon: <FaCloud size={40} />, title: 'DevOps & Tools', desc: 'Git, Vercel, Netlify, Postman' },
  ];

  if (loading) return <div className="text-center py-5">Loading...</div>;

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
              <p className="text-white-50">{aboutText}</p>
              <Row className="mt-4 text-center">
                <Col>
                  <h2 className="text-primary">{experienceYears}+</h2>
                  <p>Years Experience</p>
                </Col>
                <Col>
                  <h2 className="text-primary">{projectsCount}+</h2>
                  <p>Projects Completed</p>
                </Col>
                <Col>
                  <h2 className="text-primary">{clientsCount}+</h2>
                  <p>Happy Clients</p>
                </Col>
              </Row>
              <div className="text-center mt-4">
                <Button 
                  variant="outline-light" 
                  href="/Rajesh_Kumar_Sarkar_Resume.pdf" 
                  download
                  className="btn-gradient"
                >
                  <FaDownload className="me-2" /> Download Resume
                </Button>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="glass-card p-4">
              <h3 className="mb-4">Technical Skills</h3>
              {skills.map((skill, idx) => (
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

        {/* Education & Certifications */}
        <h2 className="section-title mt-5">Education & Certifications</h2>
        <Row>
          <Col md={6} className="mb-4">
            <div className="glass-card p-4 h-100">
              <h4>🎓 Education</h4>
              <p className="mb-1"><strong>Bachelor of Arts (B.A.)</strong></p>
              <p className="text-white-50">Kalna College, Kalna, West Bengal | 2017 - 2020</p>
            </div>
          </Col>
          <Col md={6} className="mb-4">
            <div className="glass-card p-4 h-100">
              <h4>📜 Certification</h4>
              <p className="mb-1"><strong>Full Stack Development Post Graduate Certification</strong></p>
              <p className="text-white-50">Internshala | Expected: 2025</p>
            </div>
          </Col>
        </Row>

        {/* Languages */}
        <h2 className="section-title mt-3">Languages</h2>
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="glass-card p-4 text-center">
              <div className="d-flex justify-content-around flex-wrap">
                <span className="badge bg-primary fs-6 m-2">Bengali (Native)</span>
                <span className="badge bg-primary fs-6 m-2">English (Professional)</span>
                <span className="badge bg-primary fs-6 m-2">Hindi (Professional)</span>
              </div>
            </div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default About;