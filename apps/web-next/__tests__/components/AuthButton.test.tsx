import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { AuthButton } from '../../components/AuthButton'

describe('AuthButton', () => {
  it('renders login button when unauthenticated', () => {
    const onLogin = vi.fn()
    const { getByText } = render(<AuthButton isAuthenticated={false} onLogin={onLogin} onLogout={() => {}} />)
    fireEvent.click(getByText('Log in'))
    expect(onLogin).toHaveBeenCalled()
  })

  it('shows menu and triggers logout', () => {
    const onLogout = vi.fn()
    const { getByRole, getByText } = render(<AuthButton isAuthenticated={true} onLogin={() => {}} onLogout={onLogout} />)
    fireEvent.click(getByRole('button'))
    fireEvent.click(getByText('Log out'))
    expect(onLogout).toHaveBeenCalled()
  })
})
