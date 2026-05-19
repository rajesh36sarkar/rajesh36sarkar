import React, { useState, useMemo, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const modalImageVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { 
      x: { type: 'spring', stiffness: 300, damping: 30 }, 
      opacity: { duration: 0.2 } 
    }
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: { 
      x: { type: 'spring', stiffness: 300, damping: 30 }, 
      opacity: { duration: 0.2 } 
    }
  })
};

const ProjectModal = ({ show, onHide, project }) => {
  if (!project) return null;

  const [[page, direction], setPage] = useState([0, 0]);

  // Combine primary image and gallery images into a single clean list
  const allImages = useMemo(() => {
    return [project.imageUrl, ...(project.galleryImages || [])].filter(Boolean);
  }, [project.imageUrl, project.galleryImages]);

  // Calculate the infinite looping index mathematically
  const activeIndex = useMemo(() => {
    if (allImages.length === 0) return 0;
    return ((page % allImages.length) + allImages.length) % allImages.length;
  }, [page, allImages.length]);

  // Handle slide transitions
  const paginate = useCallback((newDirection) => {
    setPage(([currentPage]) => [currentPage + newDirection, newDirection]);
  }, []);

  // Detect swipe gestures on mobile
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50; 
    if (info.offset.x < -swipeThreshold) {
      paginate(1); 
    } else if (info.offset.x > swipeThreshold) {
      paginate(-1); 
    }
  };

  const handleClose = () => {
    setPage([0, 0]);
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
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
        
        {/* Swipeable Custom Image Slider Section */}
        {allImages.length > 0 && (
          <div className="position-relative overflow-hidden w-100 modal-carousel-wrapper mb-4">
            <div className="position-relative w-100 h-100" style={{ minHeight: '400px' }}>
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={page}
                  src={allImages[activeIndex]}
                  alt={`${project.title || 'Project'} snapshot ${activeIndex + 1}`}
                  custom={direction}
                  variants={modalImageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={handleDragEnd}
                  className="position-absolute top-0 start-0 w-100 h-100 modal-carousel-img cursor-grab"
                  style={{ 
                    touchAction: 'pan-y' // FIX: Gives mobile viewports clear clearance context to swipe safely
                  }}
                />
              </AnimatePresence>
            </div>

            {/* Left and Right Chevron Navigation Buttons */}
            {allImages.length > 1 && (
              <>
                <button 
                  type="button"
                  className="modal-nav-btn left-btn"
                  onClick={() => paginate(-1)}
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  type="button"
                  className="modal-nav-btn right-btn"
                  onClick={() => paginate(1)}
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>

                {/* Dot Navigation Indicators */}
                <div className="modal-slider-dots">
                  {allImages.map((_, index) => (
                    <span 
                      key={index} 
                      className={`modal-dot ${index === activeIndex ? 'active' : ''}`}
                      onClick={() => {
                        const newDirection = index > activeIndex ? 1 : -1;
                        setPage([index, newDirection]);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <h5 className="fs-5 mb-2">Description</h5>
        <p className="text-white-50 long-text-wrapper mb-4">
          {project.description || "No detailed description provided."}
        </p>

        <h5 className="fs-5 mb-2">Technologies</h5>
        <div className="mb-4" role="list" aria-label="Technologies used">
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
              className="d-inline-flex align-items-center border-secondary"
            >
              <FaGithub className="me-2" /> Source Code
            </Button>
          )}
        </div>
      </Modal.Body>
      
      <Modal.Footer className="bg-dark border-secondary">
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProjectModal;