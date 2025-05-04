import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import Button from '../common/Button';
import { Editor } from '@tinymce/tinymce-react';

const withRTE = (Component) => (props) => {
  return <Component {...props} RTEComponent={Editor} />;
};

const RichTextEditor = withRTE(({ value, onChange, RTEComponent }) => (
  <RTEComponent
    apiKey="your-api-key-here" // Replace with your TinyMCE API key or remove for development
    value={value}
    onEditorChange={onChange}
    init={{
      height: 300,
      menubar: false,
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'charmap',
        'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'table', 'help', 'wordcount'
      ],
      toolbar: 'undo redo | blocks | ' +
        'bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | ' +
        'removeformat help',
      blocks: 'h1 h2 h3 h4 h5 h6 p',
    }}
  />
));

const JobForm = ({ jobId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expiresAt: '',
    status: 'active'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (jobId) {
      const fetchJobDetails = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          const response = await jobService.getJob(jobId);
          const job = response.data.job;
          
          let expiresAtValue = '';
          if (job.expiresAt) {
            const date = new Date(job.expiresAt);
            expiresAtValue = date.toISOString().split('T')[0];
          }
          
          setFormData({
            title: job.title,
            description: job.description,
            expiresAt: expiresAtValue,
            status: job.status
          });
        } catch (err) {
          setError('Failed to load job details. Please try again.');
          console.error('Error fetching job:', err);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchJobDetails();
    }
  }, [jobId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');
    
    const payload = {
      ...formData,
      expiresAt: formData.expiresAt || null
    };
    
    try {
      let response;
      if (jobId) {
        response = await jobService.updateJob(jobId, payload);
        setSuccessMessage('Job updated successfully!');
      } else {
        response = await jobService.createJob(payload);
        setSuccessMessage('Job created successfully!');
        setFormData({
          title: '',
          description: '',
          expiresAt: '',
          status: 'active'
        });
      }
      
      if (onSuccess) {
        onSuccess(response.data.job);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to save project. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-4">Loading project details...</div>;
  }
  
  return (
    <div className="job-form card">
      <div className="card-body">
        <h3 className="card-title">{jobId ? 'Edit Project' : 'Create New Projects'}</h3>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <RichTextEditor
              value={formData.description}
              onChange={handleDescriptionChange}
            />
            <small className="form-text text-muted">
              Use formatting tools above for your description.
            </small>
          </div>
          
          <div className="mb-3">
            <label htmlFor="expiresAt" className="form-label">Expiration Date (Optional)</label>
            <input
              type="date"
              className="form-control"
              id="expiresAt"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              className="form-select"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <div className="d-flex gap-2 mt-5">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => onSuccess ? onSuccess() : null}
              className="flex-grow-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-grow-1"
            >
              {isSubmitting 
                ? (jobId ? 'Updating...' : 'Creating...') 
                : (jobId ? 'Update Project' : 'Create Project')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
