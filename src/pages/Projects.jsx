import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { getProjects } from '../services/api';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [allTechs, setAllTechs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      setProjects(res.data);
      setFilteredProjects(res.data);
      const techs = new Set();
      res.data.forEach(p => p.technologies.forEach(t => techs.add(t)));
      setAllTechs(Array.from(techs));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = projects;
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedTech) {
      filtered = filtered.filter(p => p.technologies.includes(selectedTech));
    }
    setFilteredProjects(filtered);
  }, [searchTerm, selectedTech, projects]);

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-5">
          <h1 className="section-title-glow">My Projects</h1>
          <p className="lead text-white-50">Explore my latest work and side projects. Each one built with passion and purpose.</p>
        </div>

        {/* Animated Filter Bar */}
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
                  <option value="">All Technologies</option>
                  {allTechs.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
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

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner"></div>
            <p className="mt-3">Loading projects...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-5 glass-card p-5"
              >
                <h3>No projects found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </motion.div>
            ) : (
              <Row>
                {filteredProjects.map((project, idx) => (
                  <Col lg={4} md={6} key={project._id} className="mb-4">
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