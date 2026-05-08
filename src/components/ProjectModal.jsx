import React from 'react';
import { Modal, Button, Carousel } from 'react-bootstrap';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectModal = ({ show, onHide, project }) => {
  if (!project) return null;

  // All images: main image + gallery
  const allImages = [project.imageUrl, ...(project.galleryImages || [])];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="project-modal">
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title className="fs-3">{project.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        {/* Carousel for multiple images */}
        <Carousel interval={null} className="mb-4">
          {allImages.map((img, idx) => (
            <Carousel.Item key={idx}>
              <img
                src={img}
                alt={`${project.title} - ${idx + 1}`}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <h5>Description</h5>
        <p className="text-white-50">{project.description}</p>

        <h5>Technologies</h5>
        <div className="mb-3">
          {project.technologies.map((tech, idx) => (
            <span key={idx} className="badge bg-primary me-2 mb-2">{tech}</span>
          ))}
        </div>

        <div className="d-flex gap-3 mt-4">
          {project.liveUrl && (
            <Button href={project.liveUrl} target="_blank" variant="success">
              <FaExternalLinkAlt className="me-2" /> Live Demo
            </Button>
          )}
          {project.githubUrl && (
            <Button href={project.githubUrl} target="_blank" variant="dark">
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