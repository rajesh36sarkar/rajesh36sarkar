import React, { useMemo } from 'react';
import { Modal, Button, Carousel } from 'react-bootstrap';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectModal = ({ show, onHide, project }) => {
  if (!project) return null;

  // Memoize composite image array using serialized array elements to avoid unnecessary reference invalidations
  const allImages = useMemo(() => {
    return [project.imageUrl, ...(project.galleryImages || [])].filter(Boolean);
  }, [project.imageUrl, project.galleryImages?.join(',')]);

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered 
      className="project-modal"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title id="contained-modal-title-vcenter" className="fs-3">
          {project.title || "Project Overview"}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-dark text-white">
        {/* Carousel for multiple images */}
        {allImages.length > 0 && (
          <Carousel 
            interval={null} 
            className="mb-4 modal-carousel-wrapper"
            indicators={allImages.length > 1}
            controls={allImages.length > 1}
          >
            {allImages.map((img, idx) => (
              <Carousel.Item key={`${project._id || 'project'}-gallery-${idx}`}>
                <img
                  src={img}
                  alt={`${project.title || 'Project'} screenshot gallery item ${idx + 1} of ${allImages.length}`}
                  className="modal-carousel-img d-block w-100" 
                  loading="lazy" 
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}

        <h5 className="fs-5 mb-2">Description</h5>
        <p className="text-white-50 long-text-wrapper mb-4">
          {project.description || "No detailed description provided for this project."}
        </p>

        <h5 className="fs-5 mb-2">Technologies</h5>
        <div className="mb-4" role="list" aria-label="Technologies used in this project">
          {project.technologies?.map((tech) => (
            <span 
              key={`${project._id || 'tech'}-${tech}`} 
              className="badge bg-primary me-2 mb-2"
              role="listitem"
            >
              {tech}
            </span>
          )) || <span className="text-white-50">Not specified</span>}
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
              aria-label={`Open ${project.title || 'Project'} Live Demo in a new tab`}
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
              className="d-inline-flex align-items-center border-secondary"
              aria-label={`Open ${project.title || 'Project'} source code repository on GitHub in a new tab`}
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