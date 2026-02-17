import { render, screen } from '@testing-library/react';
import Navigation from '../../components/common/Navigation';

const mockTopics = [
  { id: 'broadband', label: '🌐 Broadband Competition' },
  { id: 'cord_cutting', label: '📺 Cord Cutting' },
  { id: 'mobile', label: '📱 Mobile & Bundling' },
];

describe('Navigation', () => {
  it('renders Charter logo', () => {
    render(<Navigation topics={mockTopics} />);
    expect(screen.getByAltText('Charter Communications')).toBeInTheDocument();
  });

  it('renders Insights text', () => {
    render(<Navigation topics={mockTopics} />);
    expect(screen.getByText('Insights')).toBeInTheDocument();
  });

  it('renders timeframe dropdown', () => {
    render(<Navigation topics={mockTopics} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders all topic tabs', () => {
    render(<Navigation topics={mockTopics} />);
    expect(screen.getByText('🌐 Broadband Competition')).toBeInTheDocument();
    expect(screen.getByText('📺 Cord Cutting')).toBeInTheDocument();
    expect(screen.getByText('📱 Mobile & Bundling')).toBeInTheDocument();
  });
});