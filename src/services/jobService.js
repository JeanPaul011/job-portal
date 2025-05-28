// src/services/jobService.js// Post Jobs 

export const postJob = async (form, token) => { 

    const response = await fetch('https://localhost:5276/api/jobs', { 

      method: 'POST', 

      headers: { 

        'Content-Type': 'application/json', 

        Authorization: `Bearer ${token}` 

      }, 

      body: JSON.stringify({ 

        title: form.title, 

        description: form.description, 

        location: form.location, 

        salary: parseFloat(form.salary), 

        jobType: form.jobType, 

        companyName: form.companyName 

      }) 

    }); 

   

    if (!response.ok) { 

      const fallback = 'Failed to post job'; 

      try { 

        const errData = await response.json(); 

        throw new Error(errData.message || fallback); 

      } catch { 

        throw new Error(fallback); 

      } 

    } 

   

    return await response.json(); 

  }; 

   

 

  // src/services/jobService.js// Find Jobs 

export const fetchAllJobs = async (token) => { 

    const response = await fetch('https://localhost:5276/api/jobs', { 

      headers: { 

        Authorization: `Bearer ${token}` 

      } 

    }); 

   

    if (!response.ok) { 

      throw new Error('Failed to fetch jobs'); 

    } 

   

    return await response.json(); 

  }; 