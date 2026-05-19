import React, { useState, useCallback, useMemo } from 'react';
import { Card, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaInfoCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProjectModal from './ProjectModal';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const imageSliderVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }
  })
};

const ProjectCard = ({ project }) => {
  const [showModal, setShowModal] = useState(false);
  const [[page, direction], setPage] = useState([0, 0]);

  // Merges imageUrl and galleryImages smoothly
  const allImages = useMemo(() => {
    const imagesArray = [project?.imageUrl, ...(project?.galleryImages || [])];
    return imagesArray.filter(Boolean);
  }, [project?.imageUrl, project?.galleryImages]);

  const activeIndex = useMemo(() => {
    if (allImages.length === 0) return 0;
    return ((page % allImages.length) + allImages.length) % allImages.length;
  }, [page, allImages.length]);

  const paginate = useCallback((newDirection) => {
    setPage(([currentPage]) => [currentPage + newDirection, newDirection]);
  }, []);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50; 
    if (info.offset.x < -swipeThreshold) {
      paginate(1); 
    } else if (info.offset.x > swipeThreshold) {
      paginate(-1); 
    }
  };

  const toggleModal = useCallback((state) => () => setShowModal(state), []);

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
        className="h-100"
      >
        <Card className="glass-card h-100">
          
          {/* Main Card Touch Slider Image Wrapper */}
          <div className="position-relative overflow-hidden w-100 card-slider-wrapper" style={{ height: '220px' }}>
            {allImages.length > 0 ? (
              <>
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={page}
                    src={allImages[activeIndex]}
                    alt={`${project.title || "Snapshot"} - Slide ${activeIndex + 1}`}
                    custom={direction}
                    variants={imageSliderVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={handleDragEnd}
                    className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover cursor-grab"
                    style={{ 
                      zIndex: 1,
                      touchAction: 'pan-y' // FIX: Allows vertical scrolling while unlocking horizontal swiping
                    }}
                  />
                </AnimatePresence>

                {allImages.length > 1 && (
                  <>
                    <button 
                      type="button"
                      className="slider-nav-btn left-btn"
                      onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                      aria-label="Previous image"
                      style={{ zIndex: 10 }}
                    >
                      <FaChevronLeft />
                    </button>
                    <button 
                      type="button"
                      className="slider-nav-btn right-btn"
                      onClick={(e) => { e.stopPropagation(); paginate(1); }}
                      aria-label="Next image"
                      style={{ zIndex: 10 }}
                    >
                      <FaChevronRight />
                    </button>

                    <div className="slider-dots" style={{ zIndex: 10 }}>
                      {allImages.map((_, index) => (
                        <span 
                          key={index} 
                          className={`slider-dot ${index === activeIndex ? 'active' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const newDirection = index > activeIndex ? 1 : -1;
                            setPage([index, newDirection]);
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark text-white-50">
                No Preview Image Available
              </div>
            )}
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
            
            <div className="d-flex gap-2 justify-content-between align-items-center mt-auto">
              <div className="d-flex gap-2">
                {project.githubUrl && (
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    href={project.githubUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} source code`}
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