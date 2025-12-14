import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { ImageDetailModal } from '../../components/ImageDetailModal'

const item = {
  id: 't2',
  type: 'image' as const,
  thumbnailUrl: 'https://example.com/thumb.jpg',
  fullUrl: 'https://example.com/full.jpg',
  model: 'Test',
  prompt: 'A'.repeat(200),
  width: 800,
  height: 600,
}

describe('ImageDetailModal', () => {
  it('toggles prompt expand/collapse', () => {
    const onClose = vi.fn()
    const { getByText } = render(<ImageDetailModal item={item} onClose={onClose} />)
    fireEvent.click(getByText('Show More'))
    fireEvent.click(getByText('Show Less'))
  })

  it('closes on backdrop click', () => {
    const onClose = vi.fn()
    const { container } = render(<ImageDetailModal item={item} onClose={onClose} />)
    const backdrop = container.querySelector('.bg-black')!
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })
})
