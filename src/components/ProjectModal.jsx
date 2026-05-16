import React, { useMemo } from 'react';
import { Modal, Button, Carousel } from 'react-bootstrap';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectModal = ({ show, onHide, project }) => {
  if (!project) return null;

  // 1. Memoize composite image array to protect structural lifecycle frames
  const allImages = useMemo(() => {
    return [project.imageUrl, ...(project.galleryImages || [])].filter(Boolean);
  }, [project.imageUrl, project.galleryImages]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="project-modal">
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title className="fs-3">{project.title}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-dark text-white">
        {/* Carousel for multiple images */}
        {allImages.length > 0 && (
          <Carousel interval={null} className="mb-4 modal-carousel-wrapper">
            {allImages.map((img, idx) => (
              <Carousel.Item key={`${project._id || 'project'}-gallery-${idx}`}>
                <img
                  src={img}
                  alt={`${project.title || 'Screenshot'} preview ${idx + 1}`}
                  className="modal-carousel-img" // Abstracted inline styling elements
                  loading="lazy" // Defers loading asset until modal hits visible layout view
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}

        <h5>Description</h5>
        <p className="text-white-50 long-text-wrapper">{project.description}</p>

        <h5>Technologies</h5>
        <div className="mb-3">
          {project.technologies?.map((tech) => (
            <span 
              key={`${project._id || 'tech'}-${tech}`} 
              className="badge bg-primary me-2 mb-2"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Anchor Elements */}
        <div className="d-flex gap-3 mt-4">
          {project.liveUrl && (
            <Button 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              variant="success"
              className="d-inline-flex align-items-center"
            >
              <FaExternalLinkAlt className="me-2" /> Live Demo
            </Button>
          )}
          {project.githubUrl && (
            <Button 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              variant="dark"
              className="d-inline-flex align-items-center"
            >
              <FaGithub className="me-2" /> Source Code
            </Button>
          )}
        </div>
      </Modal.Body>
      
      <Modal.Footer className="bg-dark border-secondary">
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProjectModal;