import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ❌ no BrowserRouter here
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import FindJobs from './pages/FindJobs';
import Applications from './pages/Applications';
import ViewCompanies from './pages/ViewCompanies';
import PostJob from './pages/PostJob';
import Account from './pages/Account';
import Footer from './components/Footer';
import SavedJobs from './pages/SavedJobs';

const App = () => {
  return (
    <>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<FindJobs />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/companies" element={<ViewCompanies />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/account" element={<Account />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
