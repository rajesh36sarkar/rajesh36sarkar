import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { getProjects } from '../services/api';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch data on component mount with cleanup to prevent memory leaks
  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await getProjects();
        if (isMounted) {
          setProjects(res.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProjects();
    return () => { isMounted = false; };
  }, []);

  // 2. Compute unique technologies & filtered list cleanly using useMemo
  const { allTechs, filteredProjects } = useMemo(() => {
    const techsSet = new Set();
    
    // Extract unique technologies from all base projects
    projects.forEach(p => {
      if (Array.isArray(p.technologies)) {
        p.technologies.forEach(t => techsSet.add(t));
      }
    });

    // Run filter passes efficiently
    const filtered = projects.filter(project => {
      const matchesSearch = !searchTerm ? true : (
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesTech = !selectedTech ? true : project.technologies?.includes(selectedTech);

      return matchesSearch && matchesTech;
    });

    return {
      allTechs: Array.from(techsSet),
      filteredProjects: filtered
    };
  }, [projects, searchTerm, selectedTech]);

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-5">
          <h1 className="section-title-glow">My Projects</h1>
          <p className="lead text-white-50">
            Explore my latest work and side projects. Each one built with passion and purpose.
          </p>
        </div>

        {/* Filter Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="filter-bar glass-card p-3 mb-5"
        >
          <Row className="align-items-center g-3">
            <Col md={6} lg={5}>
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-light text-white">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-white border-light"
                />
              </InputGroup>
            </Col>
            
            <Col md={6} lg={4}>
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-light text-white">
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="bg-transparent text-white border-light"
                >
                  {/* Kept text dark for default operating system dropdown readability */}
                  <option value="" className="text-dark">All Technologies</option>
                  {allTechs.map(tech => (
                    <option key={tech} value={tech} className="text-dark">{tech}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>

            <Col lg={3} className="text-center text-lg-end">
              <span className="text-white-50">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
              </span>
            </Col>
          </Row>
        </motion.div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner"></div>
            <p className="mt-3">Loading projects...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredProjects.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-5 glass-card p-5"
              >
                <h3>No projects found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </motion.div>
            ) : (
              <Row key="grid">
                {filteredProjects.map((project, idx) => (
                  <Col lg={4} md={6} key={project._id || idx} className="mb-4">
                    <ProjectCard project={project} index={idx} />
                  </Col>
                ))}
              </Row>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </Container>
  );
};

export default Projects;