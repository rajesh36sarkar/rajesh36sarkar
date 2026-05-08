import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProjects, getSiteInfo } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import Typewriter from 'typewriter-effect';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [siteInfo, setSiteInfo] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="text-center text-lg-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="display-3 fw-bold mb-3">
                  Hi, I'm {siteInfo?.hero?.name || 'Developer'}
                </h1>
                <h2 className="display-5 mb-4" style={{ minHeight: '80px' }}>
                  <Typewriter
                    options={{
                      strings: siteInfo?.hero?.title || ['Full Stack Developer', 'UI/UX Enthusiast', 'Problem Solver'],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                </h2>
                <p className="lead mb-4 text-white-50">
                  {siteInfo?.hero?.bio || 'Passionate developer creating amazing web experiences'}
                </p>
                <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                  <Button as={Link} to="/projects" className="btn-gradient">
                    View Projects
                  </Button>
                  <Button as={Link} to="/contact" variant="outline-light">
                    Contact Me
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={6} className="text-center mt-5 mt-lg-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                {siteInfo?.hero?.profileImage && (
                  <img
                    src={siteInfo.hero.profileImage}
                    alt="Profile"
                    className="rounded-circle img-fluid"
                    style={{ width: '300px', height: '300px', objectFit: 'cover', border: '4px solid white' }}
                  />
                )}
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Projects */}
      <section className="section-padding">
        <Container>
          <h2 className="section-title">Featured Projects</h2>
          <Row>
            {projects.map((project) => (
              <Col lg={4} md={6} key={project._id} className="mb-4">
                <ProjectCard project={project} />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button as={Link} to="/projects" variant="outline-light" size="lg">
              View All Projects
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Home;