// src/utils/localStorageUtils.js

export const getSavedJobs = (userEmail) => {
    if (!userEmail) return [];
    const savedKey = `savedJobs_${userEmail}`;
    return JSON.parse(localStorage.getItem(savedKey)) || [];
  };
  
  export const saveJobs = (userEmail, jobs) => {
    if (!userEmail) return;
    const savedKey = `savedJobs_${userEmail}`;
    localStorage.setItem(savedKey, JSON.stringify(jobs));
  };
  