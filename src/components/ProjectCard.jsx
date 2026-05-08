import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';
import ProjectModal from './ProjectModal';

const ProjectCard = ({ project }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Card className="glass-card h-100">
          <Card.Img 
            variant="top" 
            src={project.imageUrl} 
            style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', cursor: 'pointer' }}
            onClick={handleShowModal}
          />
          <Card.Body>
            <Card.Title className="fs-4 mb-3" style={{ cursor: 'pointer' }} onClick={handleShowModal}>
              {project.title}
            </Card.Title>
            <Card.Text className="text-white-50">
              {project.description.substring(0, 100)}...
            </Card.Text>
            <div className="mb-3">
              {project.technologies.slice(0, 3).map((tech, idx) => (
                <span key={idx} className="badge bg-primary me-2 mb-2">{tech}</span>
              ))}
              {project.technologies.length > 3 && (
                <span className="badge bg-secondary">+{project.technologies.length - 3}</span>
              )}
            </div>
            <div className="d-flex gap-2 justify-content-between align-items-center">
              <div className="d-flex gap-2">
                {project.githubUrl && (
                  <Button variant="outline-light" size="sm" href={project.githubUrl} target="_blank">
                    <FaGithub />
                  </Button>
                )}
                {project.liveUrl && (
                  <Button variant="outline-light" size="sm" href={project.liveUrl} target="_blank">
                    <FaExternalLinkAlt />
                  </Button>
                )}
              </div>
              <Button variant="primary" size="sm" onClick={handleShowModal}>
                <FaInfoCircle className="me-1" /> Details
              </Button>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      <ProjectModal show={showModal} onHide={handleCloseModal} project={project} />
    </>
  );
};

export default ProjectCard;