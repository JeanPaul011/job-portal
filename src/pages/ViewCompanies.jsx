import React, { useState, useEffect } from 'react'; 

import { FaMapMarkerAlt } from 'react-icons/fa'; 

import AOS from 'aos'; 

import 'aos/dist/aos.css'; 

import '../styles/ViewCompanies.css'; 

import { useAuth } from '../contexts/AuthContext'; 

 

const ViewCompanies = () => { 

  const [companies, setCompanies] = useState([]); 

  const [loading, setLoading] = useState(true); 

  const [error, setError] = useState(null); 

  const [currentPage, setCurrentPage] = useState(1); 

  const companiesPerPage = 4; 

  const { token } = useAuth(); 

 

  useEffect(() => { 

    AOS.init({ duration: 800, easing: 'ease-in-out', once: true }); 

    fetchCompanies(); 

  }, []); 

 

  const fetchCompanies = async () => { 

    try { 

      const response = await fetch('https://localhost:5276/api/companies', { 

        headers: { 

          'Authorization': `Bearer ${token}` 

        } 

      }); 

 

      if (!response.ok) throw new Error('Failed to fetch companies'); 

       

      const data = await response.json(); 

      setCompanies(data); 

    } catch (err) { 

      setError(err.message); 

      console.error('Error fetching companies:', err); 

    } finally { 

      setLoading(false); 

    } 

  }; 

 

  // Pagination calculations 

  const indexOfLastCompany = currentPage * companiesPerPage; 

  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage; 

  const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany); 

  const totalPages = Math.ceil(companies.length / companiesPerPage); 

 

  const handlePageChange = (pageNumber) => { 

    setCurrentPage(pageNumber); 

    window.scrollTo(0, 0); // Scroll to top on page change 

  }; 

 

  if (loading) { 

    return ( 

      <div className="container py-5 text-center"> 

        <div className="spinner-border text-primary" role="status"> 

          <span className="visually-hidden">Loading...</span> 

        </div> 

      </div> 

    ); 

  } 

 

  if (error) { 

    return ( 

      <div className="container py-5 text-center text-danger"> 

        <p>Error loading companies: {error}</p> 

        <button className="btn btn-primary" onClick={fetchCompanies}> 

          Retry 

        </button> 

      </div> 

    ); 

  } 

 

  if (companies.length === 0) { 

    return ( 

      <div className="container py-5 text-center"> 

        <p>No companies found</p> 

      </div> 

    ); 

  } 

 

  return ( 

    <div className="companies-page container py-5"> 

      <h1 className="text-center fw-bold mb-4">Discover Companies</h1> 

      <p className="text-center mb-5 text-muted"> 

        Explore top companies hiring on JobFinder 

      </p> 

 

      <div className="row g-4"> 

        {currentCompanies.map((company, index) => ( 

          <div 

            key={company.id} 

            className="col-md-6 col-lg-3" // 4 items per row (12/3=4) 

            data-aos={index % 2 === 0 ? 'fade-up' : 'fade-right'} 

          > 

            <div className="company-card shadow-sm p-4 h-100"> 

              <div className="d-flex align-items-center mb-3"> 

                <div className="company-logo me-3 d-flex align-items-center justify-content-center bg-light rounded"> 

                  {company.name.charAt(0)} 

                </div> 

                <div> 

                  <h5 className="mb-1">{company.name}</h5> 

                  {company.location && ( 

                    <p className="mb-0 text-muted"> 

                      <FaMapMarkerAlt className="me-1" /> 

                      {company.location} 

                    </p> 

                  )} 

                </div> 

              </div> 

              {company.description && ( 

                <p className="company-description">{company.description}</p> 

              )} 

            </div> 

          </div> 

        ))} 

      </div> 

 

      {/* Pagination Controls */} 

      {totalPages > 1 && ( 

        <nav className="mt-5"> 

          <ul className="pagination justify-content-center"> 

            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}> 

              <button 

                className="page-link" 

                onClick={() => handlePageChange(currentPage - 1)} 

                disabled={currentPage === 1} 

              > 

                Previous 

              </button> 

            </li> 

 

            {Array.from({ length: totalPages }, (_, i) => ( 

              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}> 

                <button 

                  className="page-link" 

                  onClick={() => handlePageChange(i + 1)} 

                > 

                  {i + 1} 

                </button> 

              </li> 

            ))} 

 

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}> 

              <button 

                className="page-link" 

                onClick={() => handlePageChange(currentPage + 1)} 

                disabled={currentPage === totalPages} 

              > 

                Next 

              </button> 

            </li> 

          </ul> 

        </nav> 

      )} 

    </div> 

  ); 

}; 

 

export default ViewCompanies; 