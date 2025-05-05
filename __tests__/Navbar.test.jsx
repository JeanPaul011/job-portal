import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '@/components/Navbar';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

import { useAuth } from '@/contexts/AuthContext';

const customRender = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar role-based link rendering', () => {
  beforeEach(() => {
    cleanup();
  });

  it('shows Account for guests', () => {
    useAuth.mockReturnValue({ token: null });
    customRender();

    expect(screen.getByText(/Account/i)).toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
  });

  it('shows links for JobSeeker', () => {
    useAuth.mockReturnValue({
      token: '123',
      role: 'JobSeeker',
      user: { fullName: 'Jane Doe' },
      logout: vi.fn()
    });

    customRender();

    expect(screen.getByText(/Saved Jobs/i)).toBeInTheDocument();
    expect(screen.getByText(/My Applications/i)).toBeInTheDocument();
    expect(screen.getByText(/Post Jobs/i)).toBeInTheDocument(); // ✅ visible for all
  });

  it('shows links for Recruiter', () => {
    useAuth.mockReturnValue({
      token: '456',
      role: 'Recruiter',
      user: { fullName: 'Bob Boss' },
      logout: vi.fn()
    });

    customRender();

    expect(screen.getByText(/Post Jobs/i)).toBeInTheDocument();
    expect(screen.getByText(/Saved Jobs/i)).toBeInTheDocument(); // ✅ also visible
  });

  it('shows links for Admin', () => {
    useAuth.mockReturnValue({
      token: 'admin-token',
      role: 'Admin',
      user: { fullName: 'Super Admin' },
      logout: vi.fn()
    });

    customRender();

    expect(screen.getByText(/Post Jobs/i)).toBeInTheDocument();
  });
});
