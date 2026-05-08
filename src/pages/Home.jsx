import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, ProgressBar } from 'react-bootstrap';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaDownload, FaCode, FaLaptopCode, FaUsers, FaProjectDiagram, FaArrowRight } from 'react-icons/fa';
import { getProjects, getSiteInfo } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import defaultProfileImage from '/dp-rajesh.png';

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / target));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [siteInfo, setSiteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, siteInfoRes] = await Promise.all([
          getProjects(),
          getSiteInfo(),
        ]);
        setProjects(projectsRes.data.slice(0, 3));
        setSiteInfo(siteInfoRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="spinner"></div>
        <p className="loader-text">Loading your experience...</p>
      </div>
    );
  }

  const heroName = 'Rajesh Kumar Sarkar';
  const heroTitles = ['Full Stack Developer', 'MERN Stack Expert', 'Problem Solver', 'UI/UX Enthusiast'];
  const heroBio = 'Building scalable web applications with MERN stack, Next.js, and modern frontend technologies. Passionate about clean code and great user experiences.';
  const profileImage = siteInfo?.hero?.profileImage || defaultProfileImage;

  const experience = siteInfo?.about?.experience || 2;
  const projectsDone = siteInfo?.about?.projects || 15;
  const clients = siteInfo?.about?.clients || 8;

  const defaultSkills = [
    { name: 'React / Next.js', level: 88 },
    { name: 'Node.js / Express', level: 85 },
    { name: 'MongoDB / Mongoose', level: 82 },
    { name: 'JavaScript (ES6+)', level: 90 },
    { name: 'Tailwind / Bootstrap', level: 87 },
    { name: 'Git & GitHub', level: 85 },
  ];
  const skills = siteInfo?.skills?.length ? siteInfo.skills : defaultSkills;

  const social = siteInfo?.social || {
    github: 'https://github.com/rajesh36sarkar',
    linkedin: 'https://linkedin.com/in/rajesh36sarkar',
    twitter: 'https://twitter.com/rajesh36sarkar',
    email: 'mailto:rajesh36.sarkar@gmail.com',
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <Container className="hero-container">
          <Row className="align-items-center min-vh-100">
            <Col lg={7} className="text-center text-lg-start">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="hero-badge">👋 WELCOME TO MY PORTFOLIO</div>
                <h1 className="hero-title">
                  Hi, I'm <span className="highlight">{heroName}</span>
                </h1>
                <div className="hero-typewriter">
                  <Typewriter
                    options={{
                      strings: heroTitles,
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 50,
                      delay: 80,
                    }}
                  />
                </div>
                <p className="hero-description">{heroBio}</p>
                <div className="hero-buttons">
                  <Button as={Link} to="/projects" className="btn-primary-glow">
                    <FaLaptopCode className="me-2" /> View Projects
                  </Button>
                  <Button as={Link} to="/contact" variant="outline-light" className="ms-3">
                    Contact Me <FaEnvelope className="ms-2" />
                  </Button>
                </div>
                <div className="hero-social">
                  <a href={social.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                  <a href={social.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                  <a href={social.email}><FaEnvelope /></a>
                </div>
              </motion.div>
            </Col>
            <Col lg={5} className="text-center mt-5 mt-lg-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="profile-wrapper"
              >
                <div className="profile-glow"></div>
                <img src={profileImage} alt="Rajesh" className="profile-image" />
                <div className="floating-badge top-right">
                  <FaCode /> Available for work
                </div>
                <div className="floating-badge bottom-left">
                  <FaUsers /> 24/7 Support
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Container>
          <Row>
            <Col md={4} className="text-center mb-4">
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="stat-card"
              >
                <div className="stat-icon"><FaProjectDiagram /></div>
                <h3 className="stat-number"><AnimatedCounter target={projectsDone} suffix="+" /></h3>
                <p>Projects Completed</p>
              </motion.div>
            </Col>
            <Col md={4} className="text-center mb-4">
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="stat-card"
              >
                <div className="stat-icon"><FaCode /></div>
                <h3 className="stat-number"><AnimatedCounter target={experience} suffix="+" /></h3>
                <p>Years Experience</p>
              </motion.div>
            </Col>
            <Col md={4} className="text-center mb-4">
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="stat-card"
              >
                <div className="stat-icon"><FaUsers /></div>
                <h3 className="stat-number"><AnimatedCounter target={clients} suffix="+" /></h3>
                <p>Happy Clients</p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Skills Section */}
      <section className="skills-section">
        <Container>
          <h2 className="section-title-glow">Technical Expertise</h2>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="skills-container">
                {skills.slice(0, 6).map((skill, idx) => (
                  <motion.div
                    key={idx}
                    className="skill-item"
                    whileInView={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="skill-header">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <ProgressBar now={skill.level} variant="info" className="skill-progress" />
                  </motion.div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Projects */}
      <section className="projects-section">
        <Container>
          <h2 className="section-title-glow">Featured Work</h2>
          <Row>
            {projects.length > 0 ? (
              projects.map((project, idx) => (
                <Col lg={4} md={6} key={project._id} className="mb-4">
                  <ProjectCard project={project} index={idx} />
                </Col>
              ))
            ) : (
              <Col>
                <div className="text-center glass-card p-5">
                  <h4>No projects yet</h4>
                  <p>Add your projects from the admin panel.</p>
                </div>
              </Col>
            )}
          </Row>
          <div className="text-center mt-4">
            <Button as={Link} to="/projects" variant="outline-light" size="lg" className="btn-glow">
              Browse All Work <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <Container>
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="cta-card"
          >
            <h3>Let's Build Something Amazing Together</h3>
            <p>Have a project in mind? Let's collaborate and create something great.</p>
            <Button as={Link} to="/contact" className="btn-primary-glow btn-lg">
              Start a Conversation <FaArrowRight className="ms-2" />
            </Button>
          </motion.div>
        </Container>
      </section>
    </>
  );
};

export default Home;