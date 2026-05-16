import React, { useEffect, useState, useRef } from 'react';
import {
  Container, Row, Col, Table, Button, Modal, Form, Alert,
  Card, Tabs, Tab, Badge, Spinner
} from 'react-bootstrap';
import { 
  getProjects, createProject, updateProject, deleteProject, 
  updateSiteInfo, uploadImage, getSiteInfo 
} from '../services/api';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [siteInfo, setSiteInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', variant: '' });
  
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const isMounted = useRef(true);
  const alertTimeoutRef = useRef(null);

  // Purpose-built Isolated Form Controllers
  const projectForm = useForm();
  const aboutForm = useForm();
  const skillForm = useForm();
  const socialForm = useForm();

  // Unified Status Flash System
  const triggerAlert = (text, variant = 'success') => {
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    if (isMounted.current) {
      setMessage({ text, variant });
      alertTimeoutRef.current = setTimeout(() => {
        setMessage({ text: '', variant: '' });
      }, 4000);
    }
  };

  const fetchData = async () => {
    if (!isMounted.current) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const requests = [getProjects(), getSiteInfo()];
      
      if (token) {
        requests.push(
          axios.get(`${import.meta.env.VITE_API_URL}/contact`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
      }

      const responses = await Promise.all(requests);
      
      if (isMounted.current) {
        setProjects(responses[0].data || []);
        setSiteInfo(responses[1].data || null);
        if (responses[2]) setMessages(responses[2].data || []);
      }
    } catch (error) {
      triggerAlert('Failed to synchronize dashboard telemetry', 'danger');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchData();
    return () => {
      isMounted.current = false;
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      projectForm.setValue('imageUrl', res.data.url);
      triggerAlert('Project placeholder thumbnail mapped!', 'success');
    } catch (error) {
      triggerAlert('Asset hosting target integration dropped', 'danger');
    } finally {
      if (isMounted.current) setUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadingGallery(true);
    
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload/multiple`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data', 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
      const currentGallery = projectForm.watch('galleryImages') || [];
      projectForm.setValue('galleryImages', [...currentGallery, ...res.data.urls]);
      triggerAlert(`${res.data.urls.length} gallery assets stacked successfully`, 'success');
    } catch (error) {
      triggerAlert('Multi-upload synchronization processing drop', 'danger');
    } finally {
      if (isMounted.current) setUploadingGallery(false);
    }
  };

  const onSubmitProject = async (data) => {
    try {
      const techArray = typeof data.technologies === 'string' 
        ? data.technologies.split(',').map(t => t.trim()) 
        : data.technologies;
        
      const projectData = { ...data, technologies: techArray, galleryImages: data.galleryImages || [] };
      
      if (editingProject) {
        await updateProject(editingProject._id, projectData);
        triggerAlert('Project configurations revised', 'success');
      } else {
        await createProject(projectData);
        triggerAlert('New system workspace target established', 'success');
      }
      fetchData();
      handleCloseProjectModal();
    } catch (error) {
      triggerAlert('Database schema sync rejection', 'danger');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Purge this project permanently?')) return;
    try {
      await deleteProject(id);
      fetchData();
      triggerAlert('Project removed from indices', 'success');
    } catch (error) {
      triggerAlert('Rejection received from collection operator', 'danger');
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    projectForm.setValue('title', project.title);
    projectForm.setValue('description', project.description);
    projectForm.setValue('technologies', project.technologies.join(', '));
    projectForm.setValue('imageUrl', project.imageUrl);
    projectForm.setValue('galleryImages', project.galleryImages || []);
    projectForm.setValue('liveUrl', project.liveUrl || '');
    projectForm.setValue('githubUrl', project.githubUrl || '');
    projectForm.setValue('featured', !!project.featured);
    setShowProjectModal(true);
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    setEditingProject(null);
    projectForm.reset();
  };

  const updateAbout = async (data) => {
    try {
      const updated = { 
        ...siteInfo, 
        about: { 
          description: data.description,
          experience: parseInt(data.experience),
          projects: parseInt(data.projects),
          clients: parseInt(data.clients)
        } 
      };
      await updateSiteInfo(updated);
      fetchData();
      triggerAlert('Biographical metric updates compiled', 'success');
    } catch (error) {
      triggerAlert('Core metrics re-write failed', 'danger');
    }
  };

  const updateSocial = async (socialData) => {
    try {
      const updated = { ...siteInfo, social: { ...siteInfo?.social, ...socialData } };
      await updateSiteInfo(updated);
      fetchData();
      triggerAlert('Social route mappings initialized', 'success');
    } catch (error) {
      triggerAlert('Social route table drop', 'danger');
    }
  };

  const addSkill = async (skillData) => {
    const newSkill = { name: skillData.skillName, level: parseInt(skillData.skillLevel) };
    const newSkills = [...(siteInfo?.skills || []), newSkill];
    try {
      await updateSiteInfo({ skills: newSkills });
      skillForm.reset();
      fetchData();
      triggerAlert('Skill record registry mapped', 'success');
    } catch (error) {
      triggerAlert('Failed to modify stack parameters', 'danger');
    }
  };

  const deleteSkill = async (index) => {
    const newSkills = siteInfo.skills.filter((_, i) => i !== index);
    try {
      await updateSiteInfo({ skills: newSkills });
      fetchData();
      triggerAlert('Skill removed from profile schema', 'success');
    } catch (error) {
      triggerAlert('Failure executing record collection rewrite', 'danger');
    }
  };

  const handleProfilePhotoUpload = async () => {
    if (!profileImageFile) return triggerAlert('Select file target directly', 'warning');
    setUploading(true);
    try {
      const res = await uploadImage(profileImageFile);
      const updated = { ...siteInfo, hero: { ...siteInfo?.hero, profileImage: res.data.url } };
      await updateSiteInfo(updated);
      setProfileImageFile(null);
      fetchData();
      triggerAlert('System profile avatar rewritten', 'success');
    } catch (error) {
      triggerAlert('Identity imagery mapping rejected', 'danger');
    } finally {
      if (isMounted.current) setUploading(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return triggerAlert('Target file path empty', 'warning');
    setUploading(true);
    try {
      const res = await uploadImage(resumeFile);
      const updated = { ...siteInfo, hero: { ...siteInfo?.hero, resumeUrl: res.data.url } };
      await updateSiteInfo(updated);
      setResumeFile(null);
      fetchData();
      triggerAlert('Binary document pointer parsed', 'success');
    } catch (error) {
      triggerAlert('Target compilation drop', 'danger');
    } finally {
      if (isMounted.current) setUploading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete message entry point?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/contact/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchData();
      triggerAlert('Message purged from server ledger', 'success');
    } catch (error) {
      triggerAlert('Message processing mutation rejected', 'danger');
    }
  };

  const viewMessage = async (msg) => {
    setSelectedMessage(msg);
    setShowMessageModal(true);
    if (!msg.read) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/contact/${msg._id}/read`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchData();
      } catch (e) {
        console.error('Failed to flag record status modifications', e);
      }
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="light" /></div>;

  return (
    <Container fluid className="py-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="section-title">Admin Dashboard</h1>
        {message.text && <Alert variant={message.variant} dismissible onClose={() => setMessage({ text: '', variant: '' })}>{message.text}</Alert>}

        <Tabs defaultActiveKey="projects" className="mb-4" fill variant="tabs">
          {/* Projects Tab */}
          <Tab eventKey="projects" title="Projects">
            <Card className="glass-card p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>All Projects</h3>
                <Button onClick={() => setShowProjectModal(true)} className="btn-gradient"><FaPlus /> Add Project</Button>
              </div>
              <div className="table-responsive">
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Image</th><th>Title</th><th>Technologies</th><th>Featured</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => (
                      <tr key={project._id}>
                        <td><img src={project.imageUrl} alt="" width="50" height="50" style={{ objectFit: 'cover' }} /></td>
                        <td>{project.title}</td>
                        <td>{Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}</td>
                        <td>{project.featured ? <Badge bg="success">Yes</Badge> : <Badge bg="secondary">No</Badge>}</td>
                        <td>
                          <Button variant="info" size="sm" onClick={() => handleEditProject(project)} className="me-2"><FaEdit /></Button>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteProject(project._id)}><FaTrash /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Tab>

          {/* Hero & Profile Tab */}
          <Tab eventKey="hero" title="Hero & Profile">
            <Row>
              <Col md={6} className="mb-3">
                <Card className="glass-card p-4 h-100">
                  <h3>Profile Photo</h3>
                  {siteInfo?.hero?.profileImage && (
                    <img src={siteInfo.hero.profileImage} alt="" width="120" height="120" className="rounded-circle mb-3" style={{ objectFit: 'cover' }} />
                  )}
                  <Form.Group className="mb-3">
                    <Form.Control type="file" onChange={(e) => setProfileImageFile(e.target.files[0])} accept="image/*" />
                  </Form.Group>
                  <Button onClick={handleProfilePhotoUpload} disabled={uploading} className="btn-gradient mt-auto">
                    {uploading ? 'Processing Image...' : 'Upload Photo'}
                  </Button>
                </Card>
              </Col>
              <Col md={6} className="mb-3">
                <Card className="glass-card p-4 h-100">
                  <h3>Resume (PDF)</h3>
                  {siteInfo?.hero?.resumeUrl && (
                    <a href={siteInfo.hero.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light mb-3 w-50">
                      View Current Resume
                    </a>
                  )}
                  <Form.Group className="mb-3">
                    <Form.Control type="file" onChange={(e) => setResumeFile(e.target.files[0])} accept=".pdf" />
                  </Form.Group>
                  <Button onClick={handleResumeUpload} disabled={uploading} className="btn-gradient mt-auto">
                    {uploading ? 'Processing Binary File...' : 'Upload Resume'}
                  </Button>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* About Tab */}
          <Tab eventKey="about" title="About & Stats">
            <Card className="glass-card p-4">
              <h3>About Section</h3>
              <Form onSubmit={aboutForm.handleSubmit(updateAbout)}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={5} defaultValue={siteInfo?.about?.description || ''} {...aboutForm.register('description')} />
                </Form.Group>
                <Row>
                  <Col md={4} className="mb-2">
                    <Form.Label>Experience (years)</Form.Label>
                    <Form.Control type="number" defaultValue={siteInfo?.about?.experience || 0} {...aboutForm.register('experience')} />
                  </Col>
                  <Col md={4} className="mb-2">
                    <Form.Label>Projects Count</Form.Label>
                    <Form.Control type="number" defaultValue={siteInfo?.about?.projects || 0} {...aboutForm.register('projects')} />
                  </Col>
                  <Col md={4} className="mb-2">
                    <Form.Label>Clients Count</Form.Label>
                    <Form.Control type="number" defaultValue={siteInfo?.about?.clients || 0} {...aboutForm.register('clients')} />
                  </Col>
                </Row>
                <Button type="submit" className="btn-gradient mt-3">Update About</Button>
              </Form>
            </Card>
          </Tab>

          {/* Skills Tab */}
          <Tab eventKey="skills" title="Skills">
            <Row>
              <Col md={5} className="mb-3">
                <Card className="glass-card p-4">
                  <h3>Add New Skill</h3>
                  <Form onSubmit={skillForm.handleSubmit(addSkill)}>
                    <Form.Group className="mb-3">
                      <Form.Label>Skill Name</Form.Label>
                      <Form.Control {...skillForm.register('skillName')} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Level (1-100)</Form.Label>
                      <Form.Control type="number" min="1" max="100" {...skillForm.register('skillLevel')} required />
                    </Form.Group>
                    <Button type="submit" className="btn-gradient">Add Skill</Button>
                  </Form>
                </Card>
              </Col>
              <Col md={7} className="mb-3">
                <Card className="glass-card p-4">
                  <h3>Existing Skills</h3>
                  <div className="d-flex flex-wrap gap-2">
                    {siteInfo?.skills?.map((skill, idx) => (
                      <div key={skill.name || idx} className="glass-card p-2 d-flex align-items-center gap-2">
                        <strong>{skill.name}</strong> ({skill.level}%)
                        <Button variant="danger" size="sm" className="py-0 px-2" onClick={() => deleteSkill(idx)}>×</Button>
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
              <Form onSubmit={socialForm.handleSubmit(updateSocial)}>
                <Form.Group className="mb-3"><Form.Label>GitHub</Form.Label><Form.Control defaultValue={siteInfo?.social?.github || ''} {...socialForm.register('github')} /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>LinkedIn</Form.Label><Form.Control defaultValue={siteInfo?.social?.linkedin || ''} {...socialForm.register('linkedin')} /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>Twitter</Form.Label><Form.Control defaultValue={siteInfo?.social?.twitter || ''} {...socialForm.register('twitter')} /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control defaultValue={siteInfo?.social?.email || ''} {...socialForm.register('email')} /></Form.Group>
                <Button type="submit" className="btn-gradient">Update Social Links</Button>
              </Form>
            </Card>
          </Tab>

          {/* Messages Tab */}
          <Tab eventKey="messages" title={`Messages (${messages.filter(m => !m.read).length})`}>
            <Card className="glass-card p-3">
              <div className="table-responsive">
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Date</th><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map(msg => (
                      <tr key={msg._id} className={!msg.read ? 'fw-bold border-start border-warning border-3' : ''}>
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
              </div>
            </Card>
          </Tab>
        </Tabs>

        {/* Project Handling Modal */}
        <Modal show={showProjectModal} onHide={handleCloseProjectModal} size="lg" centered>
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>{editingProject ? '✏️ Edit Project' : '➕ Add New Project'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            <Form onSubmit={projectForm.handleSubmit(onSubmitProject)}>
              <Form.Group className="mb-3"><Form.Label>📌 Title *</Form.Label><Form.Control {...projectForm.register('title')} required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>📝 Description *</Form.Label><Form.Control as="textarea" rows={4} {...projectForm.register('description')} required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>⚙️ Technologies (comma separated)</Form.Label><Form.Control {...projectForm.register('technologies')} required /></Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>🖼️ Thumbnail Image *</Form.Label>
                <Form.Control {...projectForm.register('imageUrl')} placeholder="Image URL String" required />
                <Form.Control type="file" onChange={handleImageUpload} className="mt-2" accept="image/*" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>🖼️ Gallery Images (optional, max 10)</Form.Label>
                <Form.Control type="file" multiple accept="image/*" onChange={handleGalleryUpload} disabled={uploadingGallery} />
                {uploadingGallery && <Spinner animation="border" size="sm" className="mt-2" />}
              </Form.Group>
              <Form.Group className="mb-3"><Form.Label>🌐 Live URL</Form.Label><Form.Control {...projectForm.register('liveUrl')} /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>💻 GitHub URL</Form.Label><Form.Control {...projectForm.register('githubUrl')} /></Form.Group>
              <Form.Group className="mb-3"><Form.Check type="checkbox" label="⭐ Featured Project Workspace" {...projectForm.register('featured')} /></Form.Group>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={handleCloseProjectModal}>Cancel</Button>
                <Button type="submit" className="btn-gradient">Save Project Data</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Message Viewer Modal */}
        <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered>
          <Modal.Header closeButton><Modal.Title>Inbound Transmission Details</Modal.Title></Modal.Header>
          <Modal.Body>
            <p><strong>From:</strong> {selectedMessage?.name}</p>
            <p><strong>Email:</strong> {selectedMessage?.email}</p>
            <p><strong>Subject:</strong> {selectedMessage?.subject}</p>
            <hr />
            <p><strong>Message Body:</strong></p>
            <div className="p-3 bg-light rounded" style={{ whiteSpace: 'pre-wrap' }}>{selectedMessage?.message}</div>
            <p className="mt-3"><small className="text-muted">Timestamp: {selectedMessage && new Date(selectedMessage.createdAt).toLocaleString()}</small></p>
          </Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={() => setShowMessageModal(false)}>Close</Button></Modal.Footer>
        </Modal>
      </motion.div>
    </Container>
  );
};

export default AdminDashboard;