import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
  return (
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
          style={{ height: '250px', objectFit: 'cover', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}
        />
        <Card.Body>
          <Card.Title className="fs-4 mb-3">{project.title}</Card.Title>
          <Card.Text className="text-white-50">
            {project.description.substring(0, 120)}...
          </Card.Text>
          <div className="mb-3">
            {project.technologies.map((tech, idx) => (
              <span key={idx} className="badge bg-primary me-2 mb-2">{tech}</span>
            ))}
          </div>
          <div className="d-flex gap-2">
            {project.githubUrl && (
              <Button variant="outline-light" size="sm" href={project.githubUrl} target="_blank">
                <FaGithub /> Code
              </Button>
            )}
            {project.liveUrl && (
              <Button variant="outline-light" size="sm" href={project.liveUrl} target="_blank">
                <FaExternalLinkAlt /> Live Demo
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;