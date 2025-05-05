import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FindJobs from '@/pages/FindJobs';
import { AuthProvider } from '@/contexts/AuthContext';

// Custom wrapper with both Router and Auth
const customRender = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
};

describe('FindJobs Page', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    localStorage.clear(); // clean between tests
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading initially', () => {
    fetch.mockReturnValue(new Promise(() => {})); // never resolves
    customRender(<FindJobs />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders jobs on successful fetch', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: 'Frontend Developer',
          location: 'Remote',
          jobType: 'Full-time',
          salary: 80000,
          description: 'Build cool stuff',
          companyName: 'DevCo'
        }
      ]
    });

    customRender(<FindJobs />);

    await waitFor(() => {
      expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
      expect(screen.getByText(/DevCo/i)).toBeInTheDocument();
      expect(screen.getByText(/Apply Now/i)).toBeInTheDocument();
    });
  });

  it('renders error message on fetch failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized'
    });

    customRender(<FindJobs />);

    await waitFor(() => {
      expect(screen.getByText(/Error loading jobs/i)).toBeInTheDocument();
    });
  });
});
