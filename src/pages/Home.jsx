import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Stars } from '@react-three/drei';
import { 
  FaGithub, FaLinkedin, FaTwitter, FaEnvelope, 
  FaCode, FaLaptopCode, FaUsers, FaProjectDiagram, FaArrowRight 
} from 'react-icons/fa';
import { getProjects, getSiteInfo } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import defaultProfileImage from '/dp-rajesh.png';

// ==========================================================================
// STATIC CONSTANTS & RENDER OUTSIDE HELPERS
// ==========================================================================
const HERO_TITLES = ['Full Stack Developer', 'MERN Stack Expert', 'Problem Solver', 'UI/UX Enthusiast'];

const DEFAULT_SKILLS = [
  { name: 'React / Next.js', level: 88 },
  { name: 'Node.js / Express', level: 85 },
  { name: 'MongoDB / Mongoose', level: 82 },
  { name: 'JavaScript (ES6+)', level: 90 },
  { name: 'Tailwind / Bootstrap', level: 87 },
  { name: 'Git & GitHub', level: 85 },
];

const DEFAULT_SOCIAL = {
  github: 'https://github.com/rajesh36sarkar',
  linkedin: 'https://linkedin.com/in/rajesh36sarkar',
  twitter: 'https://twitter.com/rajesh36sarkar'
};

// Framer Rate Stable Counter Component
const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!target) return;
    let startTime = null;
    const duration = 1500;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target]);

  return <span>{count}{suffix}</span>;
};

// ==========================================================================
// THREE.JS ANIMATED OBJECTS (Delta-timed for high refresh monitors)
// ==========================================================================
const RotatingCube = () => {
  const meshRef = useRef();
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.3 * delta;
      meshRef.current.rotation.y += 0.6 * delta;
    }
  });
  return (
    <Box ref={meshRef} args={[1, 1, 1]} position={[-2.5, 1, 0]}>
      <meshStandardMaterial color="#667eea" wireframe />
    </Box>
  );
};

const RotatingSphere = () => {
  const sphereRef = useRef();
  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.3 * delta;
    }
  });
  return (
    <Sphere ref={sphereRef} args={[0.8, 32, 32]} position={[2.5, -1, -1]}>
      <meshStandardMaterial color="#764ba2" roughness={0.3} metalness={0.7} />
    </Sphere>
  );
};

const FloatingTorus = () => {
  const torusRef = useRef();
  
  useFrame((state) => {
    if (!torusRef.current) return;
    
    // Safely reads elapsed time across different R3F/Three ecosystem versions
    const elapsedTime = state.timer ? state.timer.getElapsed() : state.clock.getElapsedTime();
    
    torusRef.current.rotation.x = Math.sin(elapsedTime) * 0.5;
    torusRef.current.rotation.y = Math.cos(elapsedTime) * 0.5;
    torusRef.current.position.y = Math.sin(elapsedTime) * 0.3 + 1.5; // Offset higher to balance navbar
  });

  return (
    <mesh ref={torusRef} position={[0, 1.5, -2]}>
      <torusGeometry args={[0.7, 0.18, 12, 64]} />
      <meshStandardMaterial color="#f093fb" emissive="#4a00e0" emissiveIntensity={0.5} />
    </mesh>
  );
};

// ==========================================================================
// MAIN COMPONENT EXPORT
// ==========================================================================
const Home = () => {
  const [projects, setProjects] = useState([]);
  const [siteInfo, setSiteInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [projectsRes, siteInfoRes] = await Promise.all([
          getProjects(),
          getSiteInfo(),
        ]);
        if (isMounted) {
          setProjects(projectsRes.data?.slice(0, 3) || []);
          setSiteInfo(siteInfoRes.data || null);
        }
      } catch (error) {
        console.error('Error loading portfolio assets:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const computedData = useMemo(() => {
    return {
      profileImage: siteInfo?.hero?.profileImage || defaultProfileImage,
      experience: siteInfo?.about?.experience || 2,
      projectsDone: siteInfo?.about?.projects || 15,
      clients: siteInfo?.about?.clients || 8,
      skills: siteInfo?.skills?.length ? siteInfo.skills.slice(0, 6) : DEFAULT_SKILLS,
      social: siteInfo?.social || DEFAULT_SOCIAL
    };
  }, [siteInfo]);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="spinner"></div>
        <p className="loader-text">Loading your experience...</p>
      </div>
    );
  }

  return (
    <>
      {/* INTEGRATED HERO SECTION WITH THREE.JS BACKGROUND CONTAINER */}
      <section className="hero-fullscreen-container">
        
        {/* Three.js Canvas Layer */}
        <div className="canvas-absolute-layer">
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 75 }}
            gl={{ powerPreference: "high-performance", antialias: false }}
          >
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.2} />
            <Stars radius={100} depth={50} count={2500} factor={4} fade speed={1} />
            <RotatingCube />
            <RotatingSphere />
            <FloatingTorus />
          </Canvas>
        </div>

        {/* Traditional HTML Text Overlay Content */}
        <div className="hero-overlay-shading"></div>
        <Container className="position-relative z-index-content">
          <Row className="align-items-center min-vh-100 py-5">
            <Col lg={7} className="text-center text-lg-start mt-5 mt-lg-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="hero-badge">👋 WELCOME TO MY PORTFOLIO</div>
                <h1 className="hero-title">
                  Hi, I'm <span className="highlight">Rajesh</span>
                </h1>
                <div className="hero-typewriter">
                  <Typewriter
                    options={{
                      strings: HERO_TITLES,
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 50,
                      delay: 80,
                    }}
                  />
                </div>
                <p className="hero-description">
                  Building scalable web applications with MERN stack, Next.js, and modern frontend technologies. Passionate about clean code and great user experiences.
                </p>
                <div className="hero-buttons">
                  <Button as={Link} to="/projects" className="btn-primary-glow">
                    <FaLaptopCode className="me-2" /> View Projects
                  </Button>
                  <Button as={Link} to="/contact" variant="outline-light" className="ms-3 rounded-pill px-4 py-2">
                    Contact Me <FaEnvelope className="me-2" />
                  </Button>
                </div>
                <div className="hero-social">
                  <a href={computedData.social.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                  <a href={computedData.social.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                  <a href={computedData.social.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                </div>
              </motion.div>
            </Col>
            
            <Col lg={5} className="text-center mt-5 mt-lg-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="profile-wrapper"
              >
                <div className="profile-glow"></div>
                <img src={computedData.profileImage} alt="Rajesh" className="profile-image" />
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
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="stat-card"
              >
                <div className="stat-icon"><FaProjectDiagram /></div>
                <h3 className="stat-number">
                  <AnimatedCounter target={computedData.projectsDone} suffix="+" />
                </h3>
                <p className="mb-0 text-white-50">Projects Completed</p>
              </motion.div>
            </Col>
            
            <Col md={4} className="text-center mb-4">
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                viewport={{ once: true }}
                className="stat-card"
              >
                <div className="stat-icon"><FaCode /></div>
                <h3 className="stat-number">
                  <AnimatedCounter target={computedData.experience} suffix="+" />
                </h3>
                <p className="mb-0 text-white-50">Years Experience</p>
              </motion.div>
            </Col>
            
            <Col md={4} className="text-center mb-4">
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="stat-card"
              >
                <div className="stat-icon"><FaUsers /></div>
                <h3 className="stat-number">
                  <AnimatedCounter target={computedData.clients} suffix="+" />
                </h3>
                <p className="mb-0 text-white-50">Happy Clients</p>
              </motion.div>
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
                <Col lg={4} md={6} key={project._id || idx} className="mb-4">
                  <ProjectCard project={project} index={idx} />
                </Col>
              ))
            ) : (
              <Col>
                <div className="text-center glass-card p-5">
                  <h4>No projects yet</h4>
                  <p className="mb-0 text-white-50">Add your projects from the admin panel.</p>
                </div>
              </Col>
            )}
          </Row>
          <div className="text-center mt-4">
            <Button as={Link} to="/projects" variant="outline-light" size="lg" className="btn-glow rounded-pill px-4">
              Browse All Work <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.98 }}
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