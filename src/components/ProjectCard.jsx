import React, { useState, useCallback, useMemo } from 'react';
import { Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';
import ProjectModal from './ProjectModal';

// Extracted animation variants to avoid reallocation on every render pass
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const ProjectCard = ({ project }) => {
  const [showModal, setShowModal] = useState(false);

  // Consolidated state controls to protect layout re-render pipelines
  const toggleModal = useCallback((state) => () => setShowModal(state), []);

  // Compute description text safely 
  const processedDescription = useMemo(() => {
    if (!project?.description) return 'No overview provided.';
    return project.description.length > 100 
      ? `${project.description.substring(0, 100)}...` 
      : project.description;
  }, [project?.description]);

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={cardVariants}
        viewport={{ once: true, margin: "-20px" }}
      >
        <Card className="glass-card h-100">
          <div 
            role="button"
            tabIndex={0}
            onClick={toggleModal(true)}
            onKeyDown={(e) => e.key === 'Enter' && toggleModal(true)()}
            className="cursor-pointer overflow-hidden"
            aria-label={`View details for ${project.title || 'project'}`}
            aria-haspopup="dialog"
          >
            <Card.Img 
              variant="top" 
              src={project.imageUrl} 
              alt={project.title || "Project Snapshot"}
              className="card-img-cover"
            />
          </div>
          
          <Card.Body className="d-flex flex-column">
            <Card.Title 
              className="fs-4 mb-3 cursor-pointer" 
              onClick={toggleModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleModal(true)()}
              aria-haspopup="dialog"
            >
              {project.title}
            </Card.Title>
            
            <Card.Text className="text-white-50 flex-grow-1">
              {processedDescription}
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
                    aria-label={`View ${project.title} source code on GitHub`}
                  >
                    <FaGithub />
                  </Button>
                )}
                {project.liveUrl && (
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    href={project.liveUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Launch ${project.title} live site`}
                  >
                    <FaExternalLinkAlt />
                  </Button>
                )}
              </div>
              
              <Button 
                variant="primary" 
                size="sm" 
                onClick={toggleModal(true)}
                aria-haspopup="dialog"
              >
                <FaInfoCircle className="me-1" /> Details
              </Button>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Conditionally mount modal context wrapper elements to conserve idle rendering tree memory */}
      {showModal && (
        <ProjectModal 
          show={showModal} 
          onHide={toggleModal(false)} 
          project={project} 
        />
      )}
    </>
  );
};

export default ProjectCard;