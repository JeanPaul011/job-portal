import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center">
        <div className="container">
          <h1 className="display-4">Find Your Dream Job</h1>
          <p className="lead">Explore thousands of job opportunities across various industries.</p>
          <form className="search-form d-flex justify-content-center mt-4">
            <input type="text" className="form-control me-2" placeholder="Job title or keyword" />
            <input type="text" className="form-control me-2" placeholder="Location" />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <i className="bi bi-briefcase-fill feature-icon"></i>
              <h3>Wide Range of Jobs</h3>
              <p>Browse jobs from various sectors and industries.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-building feature-icon"></i>
              <h3>Top Companies</h3>
              <p>Connect with leading companies and organizations.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-person-check-fill feature-icon"></i>
              <h3>Easy Application</h3>
              <p>Apply to jobs with a simple and intuitive process.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
