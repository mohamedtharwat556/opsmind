import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../contexts/ThemeContext'
import SkeletonLoader from './SkeletonLoader'

// Create a wrapper for testing
const Wrapper = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('SkeletonLoader', () => {
  it('renders the correct number of skeleton items', () => {
    render(<SkeletonLoader count={3} />, { wrapper: Wrapper })
    const container = document.querySelector('div[style*="flex-direction: column"]')
    expect(container.children.length).toBe(3 + 1) // 3 skeletons + style element
  })

  it('renders table skeletons when type is table', () => {
    render(<SkeletonLoader type="table" count={2} />, { wrapper: Wrapper })
    const tableContainer = document.querySelector('div[style*="grid-template-columns: repeat(5, 1fr)"]')
    expect(tableContainer).toBeInTheDocument()
  })
})
