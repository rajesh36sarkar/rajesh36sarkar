import React, { useState, useCallback } from 'react';
import { Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';
import ProjectModal from './ProjectModal';

const ProjectCard = ({ project }) => {
  const [showModal, setShowModal] = useState(false);

  // 1. Memoize modal state controls to protect layout re-render pipelines
  const handleShowModal = useCallback(() => setShowModal(true), []);
  const handleCloseModal = useCallback(() => setShowModal(false), []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }} // Reduced travel offset for smoother performance
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true, margin: "-20px" }}
      >
        <Card className="glass-card h-100">
          <Card.Img 
            variant="top" 
            src={project.imageUrl} 
            alt={project.title || "Project Snapshot"}
            onClick={handleShowModal}
            className="card-img-cover" // Extracted styles to CSS rule
          />
          
          <Card.Body className="d-flex flex-column">
            <Card.Title className="fs-4 mb-3 cursor-pointer" onClick={handleShowModal}>
              {project.title}
            </Card.Title>
            
            {/* Optional chaining protects layout constraints if description string is dropped */}
            <Card.Text className="text-white-50 flex-grow-1">
              {project.description ? `${project.description.substring(0, 100)}...` : 'No overview provided.'}
            </Card.Text>
            
            {/* Badges Container */}
            <div className="mb-3">
              {project.technologies?.slice(0, 3).map((tech) => (
                <span 
                  key={`${project._id || project.title}-${tech}`} 
                  className="badge bg-primary me-2 mb-2"
                >
                  {tech}
                </span>
              ))}
              {project.technologies?.length > 3 && (
                <span className="badge bg-secondary mb-2">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
            
            {/* Action Bar */}
            <div className="d-flex gap-2 justify-content-between align-items-center mt-auto">
              <div className="d-flex gap-2">
                {project.githubUrl && (
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    href={project.githubUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub aria-label="View Source on GitHub" />
                  </Button>
                )}
                {project.liveUrl && (
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    href={project.liveUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaExternalLinkAlt aria-label="Launch Live Site" />
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

      {/* Conditionally mount modal context wrapper elements to conserve idle rendering tree memory */}
      {showModal && (
        <ProjectModal show={showModal} onHide={handleCloseModal} project={project} />
      )}
    </>
  );
};

export default ProjectCard;