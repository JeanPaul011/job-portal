// src/pages/FindJobs.jsx 

import React, { useEffect, useState } from 'react'; 

import '../styles/FindJobs.css'; 

import { FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaHeart, FaRegHeart, FaFilter } from 'react-icons/fa'; 

import AOS from 'aos'; 

import 'aos/dist/aos.css'; 

import { useNavigate } from 'react-router-dom'; 

import { useAuth } from '../contexts/AuthContext'; 

import { fetchAllJobs } from '../services/jobService'; 

 

const FindJobs = () => { 

    const navigate = useNavigate(); 

    const { token, user } = useAuth(); 

    const [jobs, setJobs] = useState([]); 

    const [filteredJobs, setFilteredJobs] = useState([]); 

    const [loading, setLoading] = useState(true); 

    const [error, setError] = useState(null); 

    const [saved, setSaved] = useState([]); 

    const [currentPage, setCurrentPage] = useState(1); 

    const [showFilters, setShowFilters] = useState(false); 

    const [lastUpdateTime, setLastUpdateTime] = useState(new Date().toLocaleTimeString()); 

    const jobsPerPage = 4; 

 

    // Filter states 

    const [filters, setFilters] = useState({ 

        location: '', 

        jobType: '', 

        minSalary: '', 

        maxSalary: '', 

        companyName: '' 

    }); 

 

    // AUTO-REFRESH FUNCTIONALITY 

    useEffect(() => { 

        AOS.init({ duration: 800 }); 

        fetchJobs(); 

         

        if (!token) navigate('/account'); 

 

        const savedKey = `savedJobs_${user?.email}`; 

        const savedJobs = JSON.parse(localStorage.getItem(savedKey)) || []; 

        setSaved(savedJobs.map(job => job.id)); 

 

        // Set up auto-refresh every 10 seconds 

        const autoRefreshInterval = setInterval(() => { 

            console.log('🔄 Auto-refreshing jobs...'); 

            fetchJobs(false); // false = don't show loading spinner 

        }, 10000); // 10 seconds 

 

        // Cleanup interval on component unmount 

        return () => { 

            clearInterval(autoRefreshInterval); 

        }; 

    }, [token, navigate, user?.email]); 

 

    useEffect(() => { 

        applyFilters(); 

    }, [filters, jobs]); 

 

    const fetchJobs = async (showLoadingSpinner = true) => { 

        try { 

            if (showLoadingSpinner) { 

                setLoading(true); 

            } 

             

            const data = await fetchAllJobs(token); 

             

            // Only update if data actually changed 

            if (JSON.stringify(data) !== JSON.stringify(jobs)) { 

                setJobs(data); 

                setFilteredJobs(data); 

                setLastUpdateTime(new Date().toLocaleTimeString()); 

                console.log('✅ Jobs updated at:', new Date().toLocaleTimeString()); 

            } 

        } catch (err) { 

            setError(err.message); 

            console.error('Error fetching jobs:', err); 

        } finally { 

            if (showLoadingSpinner) { 

                setLoading(false); 

            } 

        } 

    }; 

 

    const toggleSave = (job) => { 

        if (!user?.email) return; 

       

        const savedKey = `savedJobs_${user.email}`; 

        let updated = JSON.parse(localStorage.getItem(savedKey)) || []; 

       

        const exists = saved.includes(job.id); 

       

        if (exists) { 

            updated = updated.filter(j => j.id !== job.id); 

        } else { 

            updated.push(job); 

        } 

       

        setSaved(updated.map(j => j.id)); 

        localStorage.setItem(savedKey, JSON.stringify(updated)); 

    }; 

 

    const handleFilterChange = (e) => { 

        const { name, value } = e.target; 

        setFilters(prev => ({ 

            ...prev, 

            [name]: value 

        })); 

        setCurrentPage(1); 

    }; 

 

    const applyFilters = () => { 

        let result = [...jobs]; 

         

        if (filters.location) { 

            result = result.filter(job =>  

                job.location.toLowerCase().includes(filters.location.toLowerCase()) 

            ); 

        } 

         

        if (filters.jobType) { 

            result = result.filter(job =>  

                job.jobType.toLowerCase() === filters.jobType.toLowerCase() 

            ); 

        } 

         

        if (filters.minSalary) { 

            result = result.filter(job =>  

                job.salary >= Number(filters.minSalary) 

            ); 

        } 

         

        if (filters.maxSalary) { 

            result = result.filter(job =>  

                job.salary <= Number(filters.maxSalary) 

            ); 

        } 

         

        if (filters.companyName) { 

            result = result.filter(job =>  

                job.companyName.toLowerCase().includes(filters.companyName.toLowerCase()) 

            ); 

        } 

         

        setFilteredJobs(result); 

    }; 

 

    const resetFilters = () => { 

        setFilters({ 

            location: '', 

            jobType: '', 

            minSalary: '', 

            maxSalary: '', 

            companyName: '' 

        }); 

    }; 

 

    // Manual refresh button 

    const handleManualRefresh = () => { 

        fetchJobs(true); 

    }; 

 

    // Get unique values for filter options 

    const locations = [...new Set(jobs.map(job => job.location))]; 

    const jobTypes = [...new Set(jobs.map(job => job.jobType))]; 

    const companyNames = [...new Set(jobs.map(job => job.companyName))]; 

 

    // Pagination logic 

    const indexOfLast = currentPage * jobsPerPage; 

    const indexOfFirst = indexOfLast - jobsPerPage; 

    const currentJobs = filteredJobs.slice(indexOfFirst, indexOfLast); 

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage); 

 

    if (loading) { 

        return ( 

            <div className="find-jobs-page container py-5 text-center"> 

                <div className="spinner-border text-primary" role="status"> 

                    <span className="visually-hidden">Loading...</span> 

                </div> 

            </div> 

        ); 

    } 

 

    if (error) { 

        return ( 

            <div className="find-jobs-page container py-5 text-center text-danger"> 

                <p>Error loading jobs: {error}</p> 

                <button className="btn btn-primary" onClick={() => fetchJobs(true)}> 

                    Retry 

                </button> 

            </div> 

        ); 

    } 

 

    return ( 

        <div className="find-jobs-page container py-5"> 

            <div className="d-flex justify-content-between align-items-center mb-4"> 

                <div> 

                    <h2 className="fw-bold mb-1">Find Your Next Opportunity</h2> 

                    <p className="text-muted mb-0">Browse job openings from top employers around the world</p> 

                </div> 

                <div className="text-end"> 

                    <button  

                        className="btn btn-outline-primary btn-sm me-2"  

                        onClick={handleManualRefresh} 

                        title="Refresh jobs manually" 

                    > 

                         

                    </button> 

                    <small className="text-muted d-block"> 

                        Last updated: {lastUpdateTime} 

                    </small> 

                    <small className="text-success d-block"> 

                        

                    </small> 

                </div> 

            </div> 

 

            {/* Filter Section */} 

            <div className="mb-4"> 

                <button  

                    className="btn btn-outline-primary mb-3 d-md-none" 

                    onClick={() => setShowFilters(!showFilters)} 

                > 

                    <FaFilter className="me-2" /> 

                    {showFilters ? 'Hide Filters' : 'Show Filters'} 

                </button> 

 

                <div className={`filter-section ${showFilters ? 'show' : ''}`}> 

                    <div className="row g-3"> 

                        <div className="col-md-3"> 

                            <label htmlFor="location" className="form-label">Location</label> 

                            <select  

                                className="form-select" 

                                id="location" 

                                name="location" 

                                value={filters.location} 

                                onChange={handleFilterChange} 

                            > 

                                <option value="">All Locations</option> 

                                {locations.map((loc, i) => ( 

                                    <option key={i} value={loc}>{loc}</option> 

                                ))} 

                            </select> 

                        </div> 

                         

                        <div className="col-md-3"> 

                            <label htmlFor="jobType" className="form-label">Job Type</label> 

                            <select  

                                className="form-select" 

                                id="jobType" 

                                name="jobType" 

                                value={filters.jobType} 

                                onChange={handleFilterChange} 

                            > 

                                <option value="">All Types</option> 

                                {jobTypes.map((type, i) => ( 

                                    <option key={i} value={type}>{type}</option> 

                                ))} 

                            </select> 

                        </div> 

                         

                        <div className="col-md-2"> 

                            <label htmlFor="minSalary" className="form-label">Min Salary ($)</label> 

                            <input 

                                type="number" 

                                className="form-control" 

                                id="minSalary" 

                                name="minSalary" 

                                placeholder="Min" 

                                value={filters.minSalary} 

                                onChange={handleFilterChange} 

                            /> 

                        </div> 

                         

                        <div className="col-md-2"> 

                            <label htmlFor="maxSalary" className="form-label">Max Salary ($)</label> 

                            <input 

                                type="number" 

                                className="form-control" 

                                id="maxSalary" 

                                name="maxSalary" 

                                placeholder="Max" 

                                value={filters.maxSalary} 

                                onChange={handleFilterChange} 

                            /> 

                        </div> 

                         

                        <div className="col-md-2 d-flex align-items-end"> 

                            <button  

                                className="btn btn-outline-secondary w-100" 

                                onClick={resetFilters} 

                            > 

                                Reset 

                            </button> 

                        </div> 

                    </div> 

                </div> 

            </div> 

 

            {/* Results Count */} 

            <div className="mb-4"> 

                <p className="text-muted"> 

                    Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} 

                </p> 

            </div> 

 

            {/* Jobs List */} 

            <div className="row g-4"> 

                {currentJobs.length > 0 ? ( 

                    currentJobs.map((job) => ( 

                        <div key={job.id} className="col-md-6" data-aos="fade-up"> 

                            <div className="job-card shadow-sm p-4 bg-white rounded position-relative"> 

                                <button  

                                    className="heart-btn position-absolute top-0 end-0 m-2 btn"  

                                    onClick={() => toggleSave(job)} 

                                > 

                                    {saved.includes(job.id) ?  

                                        <FaHeart className="text-danger" /> :  

                                        <FaRegHeart className="text-secondary" /> 

                                    } 

                                </button> 

                                <h4 className="text-primary fw-bold">{job.title}</h4> 

                                <p className="text-muted"><FaMapMarkerAlt className="me-1" /> {job.location}</p> 

                                <p className="text-muted"><FaClock className="me-1" /> {job.jobType}</p> 

                                <p className="text-muted"> 

                                    <FaMoneyBillWave className="me-1" /> ${job.salary.toLocaleString()} 

                                </p> 

                                {job.companyName && ( 

                                    <p className="text-muted"><small>Company: {job.companyName}</small></p> 

                                )} 

                                <p className="job-desc">{job.description}</p> 

                                <button className="btn btn-outline-primary w-100">Apply Now</button> 

                            </div> 

                        </div> 

                    )) 

                ) : ( 

                    <div className="col-12 text-center py-5"> 

                        <p className="text-muted">No jobs match your filters. Try adjusting your criteria.</p> 

                        <button className="btn btn-primary" onClick={resetFilters}> 

                            Reset Filters 

                        </button> 

                    </div> 

                )} 

            </div> 

 

            {/* Pagination Controls */} 

            {totalPages > 1 && filteredJobs.length > 0 && ( 

                <div className="d-flex justify-content-center mt-4"> 

                    <ul className="pagination"> 

                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}> 

                            <button  

                                className="page-link"  

                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 

                                disabled={currentPage === 1} 

                            > 

                                Previous 

                            </button> 

                        </li> 

 

                        {Array.from({ length: totalPages }).map((_, i) => ( 

                            <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}> 

                                <button  

                                    className="page-link"  

                                    onClick={() => setCurrentPage(i + 1)} 

                                > 

                                    {i + 1} 

                                </button> 

                            </li> 

                        ))} 

 

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}> 

                            <button  

                                className="page-link"  

                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 

                                disabled={currentPage === totalPages} 

                            > 

                                Next 

                            </button> 

                        </li> 

                    </ul> 

                </div> 

            )} 

        </div> 

    ); 

}; 

 

export default FindJobs; 