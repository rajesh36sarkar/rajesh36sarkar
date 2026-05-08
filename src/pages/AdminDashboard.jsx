import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Table, Button, Modal, Form, Alert,
  Card, Tabs, Tab, Badge, Spinner
} from 'react-bootstrap';
import { getProjects, createProject, updateProject, deleteProject, updateSiteInfo, uploadImage, getSiteInfo } from '../services/api';
import { FaEdit, FaTrash, FaPlus, FaEnvelope, FaCheckCircle, FaEye } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminDashboard = () => {
  // State
  const [projects, setProjects] = useState([]);
  const [siteInfo, setSiteInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', variant: '' });
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const { register, handleSubmit, reset, setValue } = useForm();

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectsRes, siteInfoRes] = await Promise.all([
        getProjects(),
        getSiteInfo(),
      ]);
      setProjects(projectsRes.data);
      setSiteInfo(siteInfoRes.data);
      // Fetch messages if token exists
      const token = localStorage.getItem('token');
      if (token) {
        const messagesRes = await axios.get(`${import.meta.env.VITE_API_URL}/contact`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(messagesRes.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage({ text: 'Failed to load data', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ========== PROJECTS CRUD ==========
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setValue('imageUrl', res.data.url);
      setMessage({ text: 'Image uploaded successfully', variant: 'success' });
    } catch (error) {
      setMessage({ text: 'Image upload failed', variant: 'danger' });
    } finally {
      setUploading(false);
    }
  };

  const onSubmitProject = async (data) => {
    try {
      // Convert technologies string to array
      const techArray = data.technologies.split(',').map(t => t.trim());
      const projectData = { ...data, technologies: techArray };
      
      if (editingProject) {
        await updateProject(editingProject._id, projectData);
        setMessage({ text: 'Project updated', variant: 'success' });
      } else {
        await createProject(projectData);
        setMessage({ text: 'Project created', variant: 'success' });
      }
      fetchData();
      handleCloseProjectModal();
    } catch (error) {
      setMessage({ text: 'Operation failed', variant: 'danger' });
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await deleteProject(id);
        fetchData();
        setMessage({ text: 'Project deleted', variant: 'success' });
      } catch (error) {
        setMessage({ text: 'Delete failed', variant: 'danger' });
      }
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setValue('title', project.title);
    setValue('description', project.description);
    setValue('technologies', project.technologies.join(', '));
    setValue('imageUrl', project.imageUrl);
    setValue('liveUrl', project.liveUrl || '');
    setValue('githubUrl', project.githubUrl || '');
    setValue('featured', project.featured);
    setShowProjectModal(true);
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    setEditingProject(null);
    reset();
  };

  // ========== SITE INFO UPDATE ==========
  const updateHero = async (heroData) => {
    try {
      const updated = { ...siteInfo, hero: { ...siteInfo.hero, ...heroData } };
      await updateSiteInfo(updated);
      fetchData();
      setMessage({ text: 'Hero section updated', variant: 'success' });
    } catch (error) {
      setMessage({ text: 'Update failed', variant: 'danger' });
    }
  };

  const updateAbout = async (aboutData) => {
    try {
      const updated = { ...siteInfo, about: { ...siteInfo.about, ...aboutData } };
      await updateSiteInfo(updated);
      fetchData();
      setMessage({ text: 'About section updated', variant: 'success' });
    } catch (error) {
      setMessage({ text: 'Update failed', variant: 'danger' });
    }
  };

  const updateSocial = async (socialData) => {
    try {
      const updated = { ...siteInfo, social: { ...siteInfo.social, ...socialData } };
      await updateSiteInfo(updated);
      fetchData();
      setMessage({ text: 'Social links updated', variant: 'success' });
    } catch (error) {
      setMessage({ text: 'Update failed', variant: 'danger' });
    }
  };

  const addSkill = async (skillData) => {
    const newSkill = { name: skillData.skillName, level: parseInt(skillData.skillLevel) };
    const newSkills = [...(siteInfo?.skills || []), newSkill];
    try {
      await updateSiteInfo({ skills: newSkills });
      fetchData();
      setMessage({ text: 'Skill added', variant: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to add skill', variant: 'danger' });
    }
  };

  const deleteSkill = async (index) => {
    const newSkills = siteInfo.skills.filter((_, i) => i !== index);
    try {
      await updateSiteInfo({ skills: newSkills });
      fetchData();
      setMessage({ text: 'Skill deleted', variant: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to delete skill', variant: 'danger' });
    }
  };

  const handleProfileImageUpload = async () => {
    if (!profileImageFile) {
      setMessage({ text: 'Select a file first', variant: 'warning' });
      return;
    }
    setUploading(true);
    try {
      const res = await uploadImage(profileImageFile);
      setProfileImageUrl(res.data.url);
      // Update hero with new profile image
      await updateHero({ profileImage: res.data.url });
      setProfileImageFile(null);
      setMessage({ text: 'Profile image updated', variant: 'success' });
    } catch (error) {
      setMessage({ text: 'Upload failed', variant: 'danger' });
    } finally {
      setUploading(false);
    }
  };

  // ========== CONTACT MESSAGES ==========
  const markAsRead = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/contact/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchData();
      setMessage({ text: 'Marked as read', variant: 'success' });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/contact/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchData();
        setMessage({ text: 'Message deleted', variant: 'success' });
      } catch (error) {
        setMessage({ text: 'Delete failed', variant: 'danger' });
      }
    }
  };

  const viewMessage = (msg) => {
    setSelectedMessage(msg);
    setShowMessageModal(true);
    if (!msg.read) markAsRead(msg._id);
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="light" /></div>;

  return (
    <Container fluid className="py-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="section-title">Admin Dashboard</h1>
        {message.text && (
          <Alert variant={message.variant} dismissible onClose={() => setMessage({ text: '', variant: '' })}>
            {message.text}
          </Alert>
        )}

        <Tabs defaultActiveKey="projects" className="mb-4" fill variant="tabs">
          {/* Projects Tab */}
          <Tab eventKey="projects" title="Projects">
            <Card className="glass-card p-3">
              <div className="d-flex justify-content-between mb-3">
                <h3>All Projects</h3>
                <Button onClick={() => setShowProjectModal(true)} className="btn-gradient">
                  <FaPlus /> Add Project
                </Button>
              </div>
              <Table striped bordered hover variant="dark" responsive>
                <thead>
                  <tr><th>Image</th><th>Title</th><th>Technologies</th><th>Featured</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project._id}>
                      <td><img src={project.imageUrl} alt={project.title} width="50" height="50" style={{ objectFit: 'cover' }} /></td>
                      <td>{project.title}</td>
                      <td>{project.technologies.join(', ')}</td>
                      <td>{project.featured ? <Badge bg="success">Yes</Badge> : <Badge bg="secondary">No</Badge>}</td>
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
            </Card>
          </Tab>

          {/* Hero & Profile Tab */}
          <Tab eventKey="hero" title="Hero & Profile">
            <Row>
              <Col md={6}>
                <Card className="glass-card p-4 mb-3">
                  <h3>Hero Section</h3>
                  <Form onSubmit={handleSubmit(updateHero)}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control defaultValue={siteInfo?.hero?.name || ''} name="name" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control defaultValue={siteInfo?.hero?.title || ''} name="title" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control as="textarea" rows={3} defaultValue={siteInfo?.hero?.bio || ''} name="bio" />
                    </Form.Group>
                    <Button type="submit" className="btn-gradient">Update Hero</Button>
                  </Form>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="glass-card p-4 mb-3">
                  <h3>Profile Image</h3>
                  {siteInfo?.hero?.profileImage && (
                    <img src={siteInfo.hero.profileImage} alt="Profile" width="150" height="150" className="rounded-circle mb-3" />
                  )}
                  <Form.Group className="mb-3">
                    <Form.Label>Upload new image</Form.Label>
                    <Form.Control type="file" onChange={(e) => setProfileImageFile(e.target.files[0])} />
                  </Form.Group>
                  <Button onClick={handleProfileImageUpload} disabled={uploading} className="btn-gradient">
                    {uploading ? 'Uploading...' : 'Upload & Update'}
                  </Button>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* About & Stats Tab */}
          <Tab eventKey="about" title="About & Stats">
            <Card className="glass-card p-4">
              <h3>About Section</h3>
              <Form onSubmit={handleSubmit(updateAbout)}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={5} defaultValue={siteInfo?.about?.description || ''} name="description" />
                </Form.Group>
                <Row>
                  <Col><Form.Label>Experience (years)</Form.Label><Form.Control type="number" name="experience" defaultValue={siteInfo?.about?.experience || 1} /></Col>
                  <Col><Form.Label>Projects Count</Form.Label><Form.Control type="number" name="projects" defaultValue={siteInfo?.about?.projects || 10} /></Col>
                  <Col><Form.Label>Clients Count</Form.Label><Form.Control type="number" name="clients" defaultValue={siteInfo?.about?.clients || 5} /></Col>
                </Row>
                <Button type="submit" className="btn-gradient mt-3">Update About</Button>
              </Form>
            </Card>
          </Tab>

          {/* Skills Tab */}
          <Tab eventKey="skills" title="Skills">
            <Row>
              <Col md={5}>
                <Card className="glass-card p-4">
                  <h3>Add New Skill</h3>
                  <Form onSubmit={handleSubmit(addSkill)}>
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
                </Card>
              </Col>
              <Col md={7}>
                <Card className="glass-card p-4">
                  <h3>Existing Skills</h3>
                  <div className="d-flex flex-wrap gap-2">
                    {siteInfo?.skills?.map((skill, idx) => (
                      <div key={idx} className="glass-card p-2 d-flex align-items-center gap-2">
                        <strong>{skill.name}</strong> ({skill.level}%)
                        <Button variant="danger" size="sm" onClick={() => deleteSkill(idx)}>×</Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* Social Links Tab */}
          <Tab eventKey="social" title="Social Links">
            <Card className="glass-card p-4">
              <h3>Social Media Links</h3>
              <Form onSubmit={handleSubmit(updateSocial)}>
                <Form.Group className="mb-3"><Form.Label>GitHub</Form.Label><Form.Control name="github" defaultValue={siteInfo?.social?.github || ''} /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>LinkedIn</Form.Label><Form.Control name="linkedin" defaultValue={siteInfo?.social?.linkedin || ''} /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>Twitter</Form.Label><Form.Control name="twitter" defaultValue={siteInfo?.social?.twitter || ''} /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control name="email" defaultValue={siteInfo?.social?.email || ''} /></Form.Group>
                <Button type="submit" className="btn-gradient">Update Social Links</Button>
              </Form>
            </Card>
          </Tab>

          {/* Contact Messages Tab */}
          <Tab eventKey="messages" title={`Messages (${messages.filter(m => !m.read).length})`}>
            <Card className="glass-card p-3">
              <Table striped bordered hover variant="dark" responsive>
                <thead>
                  <tr><th>Date</th><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {messages.map(msg => (
                    <tr key={msg._id} className={!msg.read ? 'fw-bold' : ''}>
                      <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                      <td>{msg.name}</td>
                      <td>{msg.email}</td>
                      <td>{msg.subject}</td>
                      <td>{msg.read ? <Badge bg="success">Read</Badge> : <Badge bg="warning">Unread</Badge>}</td>
                      <td>
                        <Button variant="info" size="sm" onClick={() => viewMessage(msg)} className="me-2"><FaEye /></Button>
                        <Button variant="danger" size="sm" onClick={() => deleteMessage(msg._id)}><FaTrash /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Tab>
        </Tabs>

        {/* Project Modal */}
        <Modal show={showProjectModal} onHide={handleCloseProjectModal} size="lg">
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>{editingProject ? 'Edit Project' : 'Add Project'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark">
            <Form onSubmit={handleSubmit(onSubmitProject)}>
              <Form.Group className="mb-3"><Form.Label>Title</Form.Label><Form.Control {...register('title')} required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} {...register('description')} required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Technologies (comma separated)</Form.Label><Form.Control {...register('technologies')} placeholder="React, Node.js, MongoDB" required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Image URL</Form.Label><Form.Control {...register('imageUrl')} required /><Form.Control type="file" onChange={handleImageUpload} className="mt-2" /></Form.Group>
              {uploading && <p>Uploading...</p>}
              <Form.Group className="mb-3"><Form.Label>Live URL</Form.Label><Form.Control {...register('liveUrl')} /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>GitHub URL</Form.Label><Form.Control {...register('githubUrl')} /></Form.Group>
              <Form.Group className="mb-3"><Form.Check type="checkbox" label="Featured" {...register('featured')} /></Form.Group>
              <Button type="submit" className="btn-gradient">Save Project</Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Message Detail Modal */}
        <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
          <Modal.Header closeButton><Modal.Title>Message from {selectedMessage?.name}</Modal.Title></Modal.Header>
          <Modal.Body>
            <p><strong>Email:</strong> {selectedMessage?.email}</p>
            <p><strong>Subject:</strong> {selectedMessage?.subject}</p>
            <p><strong>Message:</strong><br/>{selectedMessage?.message}</p>
            <small>Received: {new Date(selectedMessage?.createdAt).toLocaleString()}</small>
          </Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={() => setShowMessageModal(false)}>Close</Button></Modal.Footer>
        </Modal>
      </motion.div>
    </Container>
  );
};

export default AdminDashboard;