import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { getProjects, createProject, updateProject, deleteProject, updateSiteInfo, uploadImage, getSiteInfo } from '../services/api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [siteInfo, setSiteInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [projectsRes, siteInfoRes] = await Promise.all([
      getProjects(),
      getSiteInfo(),
    ]);
    setProjects(projectsRes.data);
    setSiteInfo(siteInfoRes.data);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setValue('imageUrl', res.data.url);
      setMessage('Image uploaded successfully');
    } catch (error) {
      setMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmitProject = async (data) => {
    try {
      if (editingProject) {
        await updateProject(editingProject._id, data);
        setMessage('Project updated');
      } else {
        await createProject(data);
        setMessage('Project created');
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      setMessage('Operation failed');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      await deleteProject(id);
      fetchData();
      setMessage('Project deleted');
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setValue('title', project.title);
    setValue('description', project.description);
    setValue('technologies', project.technologies.join(', '));
    setValue('imageUrl', project.imageUrl);
    setValue('liveUrl', project.liveUrl);
    setValue('githubUrl', project.githubUrl);
    setValue('featured', project.featured);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    reset();
  };

  const handleSiteInfoUpdate = async (section, data) => {
    const updated = { ...siteInfo, [section]: { ...siteInfo[section], ...data } };
    await updateSiteInfo(updated);
    fetchData();
    setMessage('Site info updated');
  };

  return (
    <Container className="py-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="section-title">Admin Dashboard</h1>
        
        {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
        
        {/* Projects Management */}
        <div className="glass-card p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Projects</h2>
            <Button onClick={() => setShowModal(true)} className="btn-gradient">
              <FaPlus /> Add Project
            </Button>
          </div>
          
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr><th>Image</th><th>Title</th><th>Technologies</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project._id}>
                  <td><img src={project.imageUrl} alt={project.title} style={{ width: '50px', height: '50px', objectFit: 'cover' }} /></td>
                  <td>{project.title}</td>
                  <td>{project.technologies.join(', ')}</td>
                  <td>
                    <Button variant="info" size="sm" onClick={() => handleEditProject(project)} className="me-2">
                      <FaEdit />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteProject(project._id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
        {/* Site Info Management */}
        <Row>
          <Col lg={6} className="mb-4">
            <div className="glass-card p-4">
              <h3>Hero Section</h3>
              <Form onSubmit={handleSubmit((data) => handleSiteInfoUpdate('hero', data))}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control defaultValue={siteInfo?.hero?.name} name="name" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control defaultValue={siteInfo?.hero?.title} name="title" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control as="textarea" rows={3} defaultValue={siteInfo?.hero?.bio} name="bio" />
                </Form.Group>
                <Button type="submit" className="btn-gradient">Update Hero</Button>
              </Form>
            </div>
          </Col>
          
          <Col lg={6} className="mb-4">
            <div className="glass-card p-4">
              <h3>Add Skill</h3>
              <Form onSubmit={handleSubmit((data) => {
                const newSkills = [...(siteInfo?.skills || []), { name: data.skillName, level: parseInt(data.skillLevel) }];
                updateSiteInfo({ skills: newSkills });
              })}>
                <Form.Group className="mb-3">
                  <Form.Label>Skill Name</Form.Label>
                  <Form.Control name="skillName" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Level (1-100)</Form.Label>
                  <Form.Control type="number" name="skillLevel" min="1" max="100" required />
                </Form.Group>
                <Button type="submit" className="btn-gradient">Add Skill</Button>
              </Form>
            </div>
          </Col>
        </Row>
        
        {/* Project Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>{editingProject ? 'Edit Project' : 'Add Project'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark">
            <Form onSubmit={handleSubmit(onSubmitProject)}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control {...register('title')} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('description')} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Technologies (comma separated)</Form.Label>
                <Form.Control {...register('technologies')} placeholder="React, Node.js, MongoDB" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control {...register('imageUrl')} required />
                <Form.Control type="file" onChange={handleImageUpload} className="mt-2" />
                {uploading && <p>Uploading...</p>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Live URL</Form.Label>
                <Form.Control {...register('liveUrl')} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>GitHub URL</Form.Label>
                <Form.Control {...register('githubUrl')} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="Featured" {...register('featured')} />
              </Form.Group>
              <Button type="submit" className="btn-gradient">Save Project</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </motion.div>
    </Container>
  );
};

export default AdminDashboard;