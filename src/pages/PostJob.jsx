import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/PostJobs.css';
import { postJob } from '../services/jobService';


const PostJobs = () => {
    const { token, role } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        location: '',
        salary: '',
        jobType: '',
        companyName: ''
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Redirect unauthorized users
    if (!token || !['Recruiter', 'Admin'].includes(role)) {
        navigate('/account');
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = 'Title is required';
        if (!form.description.trim()) newErrors.description = 'Description is required';
        if (!form.location.trim()) newErrors.location = 'Location is required';
        if (!form.salary || isNaN(form.salary)) newErrors.salary = 'Valid salary is required';
        if (!form.jobType.trim()) newErrors.jobType = 'Job type is required';
        if (!form.companyName.trim()) newErrors.companyName = 'Company name is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      
        setSubmitting(true);
        try {
          console.log('🔐 Token being sent:', token);
          await postJob(form, token);
      
          setForm({
            title: '',
            description: '',
            location: '',
            salary: '',
            jobType: '',
            companyName: ''
          });
      
          navigate('/jobs');
        } catch (error) {
          console.error('Error posting job:', error);
          alert(error.message);
        } finally {
          setSubmitting(false);
        }
      };
      
    return (
        <div className="post-job-container container py-5">
            <h2 className="text-center fw-bold mb-4">Post a New Job</h2>
            <form onSubmit={handleSubmit} className="post-job-form mx-auto" style={{ maxWidth: '600px' }}>
                <div className="mb-3">
                    <label className="form-label">Job Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        rows="4"
                    ></textarea>
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                    />
                    {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Salary</label>
                    <input
                        type="number"
                        name="salary"
                        value={form.salary}
                        onChange={handleChange}
                        className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                    />
                    {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Job Type</label>
                    <select
                        name="jobType"
                        value={form.jobType}
                        onChange={handleChange}
                        className={`form-select ${errors.jobType ? 'is-invalid' : ''}`}
                    >
                        <option value="">Select job type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                    {errors.jobType && <div className="invalid-feedback">{errors.jobType}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                    />
                    {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                    {submitting ? 'Posting...' : 'Post Job'}
                </button>
            </form>
        </div>
    );
};

export default PostJobs;
