import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { getProjects } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [allTechs, setAllTechs] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await getProjects();
    setProjects(res.data);
    setFilteredProjects(res.data);
    // Extract unique technologies
    const techs = new Set();
    res.data.forEach(p => p.technologies.forEach(t => techs.add(t)));
    setAllTechs(Array.from(techs));
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
        <h1 className="section-title">My Projects</h1>
        
        {/* Filters */}
        <Row className="mb-5 justify-content-center">
          <Col md={6} lg={4}>
            <Form.Control
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-white border-light"
            />
          </Col>
          <Col md={6} lg={4}>
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
          </Col>
        </Row>

        <AnimatePresence>
          <Row>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-5">
                <h3>No projects found</h3>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <Col lg={4} md={6} key={project._id} className="mb-4">
                  <ProjectCard project={project} />
                </Col>
              ))
            )}
          </Row>
        </AnimatePresence>
      </motion.div>
    </Container>
  );
};

export default Projects; 