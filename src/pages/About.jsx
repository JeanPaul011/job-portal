import React from 'react';
import '../styles/About.css';
import { FaRocket, FaUsers, FaBriefcase, FaGlobe, FaHandshake } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about-wrapper">
      {/* Hero Section */}
      <section className="about-hero text-center text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Empowering Careers, Connecting Talent</h1>
          <p className="lead mt-3">We’re on a mission to help people find better jobs and help companies hire top talent — globally.</p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="about-section py-5">
        <div className="container">
          <h2 className="text-center mb-4">Who We Are</h2>
          <p className="text-center mb-5">
            JobFinder is a passionate team of engineers, designers, and dreamers dedicated to reshaping how people find jobs and how companies find talent.
          </p>
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <FaUsers className="about-icon text-primary mb-2" />
              <h5>Human-Centered</h5>
              <p>We prioritize people. Our platform is designed to make career growth accessible and simple for everyone.</p>
            </div>
            <div className="col-md-4 mb-4">
              <FaBriefcase className="about-icon text-primary mb-2" />
              <h5>Job Matching</h5>
              <p>Using intelligent algorithms, we connect candidates to the right jobs and employers to the right people.</p>
            </div>
            <div className="col-md-4 mb-4">
              <FaGlobe className="about-icon text-primary mb-2" />
              <h5>Global Reach</h5>
              <p>We help connect opportunities beyond borders. Remote? Hybrid? On-site? We cover it all.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-4">Our Impact</h2>
          <div className="row">
            <div className="col-md-3 mb-4">
              <h3 className="fw-bold">120K+</h3>
              <p>Jobs Listed</p>
            </div>
            <div className="col-md-3 mb-4">
              <h3 className="fw-bold">85K+</h3>
              <p>Happy Hires</p>
            </div>
            <div className="col-md-3 mb-4">
              <h3 className="fw-bold">5K+</h3>
              <p>Partner Companies</p>
            </div>
            <div className="col-md-3 mb-4">
              <h3 className="fw-bold">24/7</h3>
              <p>Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team / Culture Image */}
      <section className="about-image py-5 text-center">
        <div className="container">
         
          <p className="mt-3 text-muted"></p>
        </div>
      </section>
    </div>
  );
};

export default About;
