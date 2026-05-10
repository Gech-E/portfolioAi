import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditorSidebar } from '../EditorSidebar';

describe('EditorSidebar', () => {
  const mockOnSectionChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with sections', () => {
    render(<EditorSidebar activeSection="basics" onSectionChange={mockOnSectionChange} />);
    
    expect(screen.getByText('Sections')).toBeInDocument();
    expect(screen.getByText('Basic Info')).toBeInDocument();
    expect(screen.getByText('Experience')).toBeInDocument();
  });

  it('calls onSectionChange when a section is clicked', () => {
    render(<EditorSidebar activeSection="basics" onSectionChange={mockOnSectionChange} />);
    
    const experienceBtn = screen.getByText('Experience');
    fireEvent.click(experienceBtn);
    
    expect(mockOnSectionChange).toHaveBeenCalledWith('experience');
  });

  it('highlights the active section', () => {
    render(<EditorSidebar activeSection="experience" onSectionChange={mockOnSectionChange} />);
    
    const experienceBtn = screen.getByText('Experience').closest('button');
    // Active section has specific text color
    expect(experienceBtn).toHaveClass('text-blue-600');
  });
});
