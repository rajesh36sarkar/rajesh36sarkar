import React, { useEffect, useState, useMemo } from 'react';
import { Container, Row, Col, ProgressBar, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { getSiteInfo } from '../services/api';
import { 
  FaCode, FaMobile, FaServer, FaCloud, FaDownload, 
  FaAward, FaGraduationCap, FaCertificate, FaBriefcase, FaLanguage 
} from 'react-icons/fa';
import { HiOutlineLightBulb } from 'react-icons/hi';

// 1. Move Static Data OUTSIDE the component to prevent re-creation on every render
const DEFAULT_SKILLS = [
  { name: 'JavaScript (ES6+)', level: 88 },
  { name: 'React.js / Next.js', level: 90 },
  { name: 'Node.js / Express.js', level: 85 },
  { name: 'MongoDB / Mongoose', level: 82 },
  { name: 'Tailwind CSS / Bootstrap', level: 92 },
  { name: 'RESTful APIs / JWT', level: 85 },
  { name: 'Git / GitHub', level: 88 },
  { name: 'SEO / Performance', level: 80 },
];

const SERVICES = [
  { icon: <FaCode size={36} />, title: 'Frontend Dev', desc: 'React, Next.js, Tailwind, Bootstrap, Framer Motion' },
  { icon: <FaServer size={36} />, title: 'Backend Dev', desc: 'Node.js, Express.js, REST APIs, JWT, WebSockets' },
  { icon: <FaMobile size={36} />, title: 'Responsive Design', desc: 'Mobile-first, cross-browser, PWA ready' },
  { icon: <FaCloud size={36} />, title: 'DevOps & Tools', desc: 'Git, Docker, Vercel, Netlify, Render, Postman' },
];

const DEFAULT_ABOUT = "Detail-oriented Full Stack Developer with 2+ years of experience building scalable web applications using the MERN stack, Next.js, and modern frontend technologies. I've successfully delivered eCommerce platforms, digital service portals, and creative portfolio websites. My passion lies in writing clean, maintainable code and creating seamless user experiences.";

// Framer motion variants to avoid rebuilding objects inline
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const About = () => {
  const [siteInfo, setSiteInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchInfo = async () => {
      try {
        const res = await getSiteInfo();
        if (isMounted) setSiteInfo(res.data);
      } catch (error) {
        console.error('Error fetching site info:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchInfo();
    return () => { isMounted = false; }; // Cleanup prevents memory leaks
  }, []);

  // 2. Use Memoization for dynamic fallbacks so it only recalcs when siteInfo changes
  const { skills, aboutText, experienceYears, projectsCount, clientsCount } = useMemo(() => {
    return {
      skills: siteInfo?.skills?.length ? siteInfo.skills.slice(0, 6) : DEFAULT_SKILLS.slice(0, 6),
      aboutText: siteInfo?.about?.description || DEFAULT_ABOUT,
      experienceYears: siteInfo?.about?.experience || 2,
      projectsCount: siteInfo?.about?.projects || 15,
      clientsCount: siteInfo?.about?.clients || 8
    };
  }, [siteInfo]);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        
        {/* Hero About Section */}
        <div className="text-center mb-5">
          <h1 className="section-title-glow">About Me</h1>
          <p className="lead text-white-50 mx-auto" style={{ maxWidth: '700px' }}>
            Get to know me, my journey, and what drives me to build exceptional digital experiences.
          </p>
        </div>

        {/* Bio and Stats Row */}
        <Row className="align-items-center g-5 mb-5">
          <Col lg={7}>
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-card p-4 p-lg-5"
            >
              <h3 className="mb-4">👨‍💻 Who Am I?</h3>
              <p className="text-white-50 lead" style={{ lineHeight: 1.7 }}>{aboutText}</p>
              
              <Row className="mt-5 text-center">
                <Col>
                  <div className="stat-icon-sm"><FaBriefcase /></div>
                  <h3 className="gradient-number">{experienceYears}+</h3>
                  <p>Years Experience</p>
                </Col>
                <Col>
                  <div className="stat-icon-sm"><FaCode /></div>
                  <h3 className="gradient-number">{projectsCount}+</h3>
                  <p>Projects Completed</p>
                </Col>
                <Col>
                  <div className="stat-icon-sm"><FaAward /></div>
                  <h3 className="gradient-number">{clientsCount}+</h3>
                  <p>Happy Clients</p>
                </Col>
              </Row>

              <div className="text-center mt-4">
                <Button
                  variant="outline-light"
                  href={siteInfo?.hero?.resumeUrl || '/Rajesh36.sarkar_resume.pdf'}
                  download
                  className="btn-gradient"
                >
                  <FaDownload className="me-2" /> Download Resume
                </Button>
              </div>
            </motion.div>
          </Col>

          <Col lg={5}>
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card p-4"
            >
              <h3 className="mb-4 text-center">⚡ Core Skills</h3>
              {skills.map((skill, idx) => (
                <div key={skill.name || idx} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{skill.name}</span>
                    <span className="text-accent">{skill.level}%</span>
                  </div>
                  <ProgressBar now={skill.level} variant="info" className="skill-progress" />
                </div>
              ))}
            </motion.div>
          </Col>
        </Row>

        {/* Services Section */}
        <div className="mt-5">
          <h2 className="section-title-glow">What I Do</h2>
          <Row>
            {SERVICES.map((service, idx) => (
              <Col lg={3} md={6} key={idx} className="mb-4">
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="service-card"
                >
                  <div className="service-icon">{service.icon}</div>
                  <h4>{service.title}</h4>
                  <p>{service.desc}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Journey (Education + Certifications) */}
        <Row className="mt-5">
          <Col lg={6} className="mb-4">
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card p-4 h-100"
            >
              <h3><FaGraduationCap className="me-2" /> Education</h3>
              <div className="timeline-item">
                <div className="timeline-year">2017 - 2020</div>
                <h5>Bachelor of Arts (B.A.)</h5>
                <p className="text-white-50">Kalna College, University of Burdwan, West Bengal</p>
              </div>
            </motion.div>
          </Col>

          <Col lg={6} className="mb-4">
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card p-4 h-100"
            >
              <h3><FaCertificate className="me-2" /> Certifications</h3>
              <div className="timeline-item">
                <div className="timeline-year">2024 - 2025</div>
                <h5>Full Stack Development Post Graduate Certification</h5>
                <p className="text-white-50">Internshala | Specialized in MERN, JavaScript, DSA, Bootstrap, Tailwind</p>
              </div>
              <div className="timeline-item mt-3">
                <div className="timeline-year">2023 - 2024 </div>
                <h5>Web Development Post Graduate Certification</h5>
                <p className="text-white-50">Apna Collage | Specialized in JAVA, DSA </p>
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* Languages & Hobbies */}
        <Row className="justify-content-center mt-3">
          <Col md={8}>
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card p-4 text-center"
            >
              <h3><FaLanguage className="me-2" /> Languages</h3>
              <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
                <span className="language-badge">Bengali (Native)</span>
                <span className="language-badge">English (Professional)</span>
                <span className="language-badge">Hindi (Fluent)</span>
              </div>
              <hr className="my-4" />
              <h3><HiOutlineLightBulb className="me-2" /> Beyond Coding</h3>
              <p className="text-white-50">Tech Enthusiast | Photographer | Guitarist | Swimmer | Chess Enthusiast | Traveler</p>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default About;