import React from 'react'
import { render } from '@testing-library/react'
import { ImageCard } from '../../components/ImageCard'

const item = {
  id: 't1',
  type: 'image' as const,
  thumbnailUrl: 'https://example.com/thumb.jpg',
  fullUrl: 'https://example.com/full.jpg',
  model: 'Test',
  prompt: 'Prompt',
  width: 800,
  height: 600,
}

describe('ImageCard', () => {
  it('renders skeleton before in-view', () => {
    const { container } = render(<ImageCard item={item} onClick={() => {}} />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton).toBeTruthy()
  })
})
