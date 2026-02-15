import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../../App'

describe('App Component', () => {

  test('renders Spectrum Insights heading', () => {
    render(<App />)
    expect(screen.getByText('Spectrum')).toBeInTheDocument()
    expect(screen.getByText('Insights')).toBeInTheDocument()
  })

  test('renders competitive intelligence badge', () => {
    render(<App />)
    expect(screen.getByText('Competitive Intelligence')).toBeInTheDocument()
  })

  test('renders Charter Communications logo', () => {
    render(<App />)
    const logo = screen.getByAltText('Charter Communications')
    expect(logo).toBeInTheDocument()
  })

  test('renders all three topic buttons', () => {
    render(<App />)
    expect(screen.getByText('🌐 Broadband Competition')).toBeInTheDocument()
    expect(screen.getByText('📺 Cord Cutting')).toBeInTheDocument()
    expect(screen.getByText('📱 Mobile & Bundling')).toBeInTheDocument()
  })

  test('renders live data indicator', () => {
    render(<App />)
    expect(screen.getByText('Live Google Trends Data')).toBeInTheDocument()
  })

})