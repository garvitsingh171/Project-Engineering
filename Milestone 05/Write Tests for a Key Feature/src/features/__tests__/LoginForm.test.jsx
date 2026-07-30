import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginForm from '../LoginForm'
import { loginUser } from '../../api/auth'

jest.mock('../../api/auth')

const renderLoginForm = () => {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LoginForm />
    </MemoryRouter>
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('happy path', () => {
    test('renders the email input, password input, and submit button', () => {
      renderLoginForm()

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    test('calls the API with the correct email and password values', async () => {
      const user = userEvent.setup()
      loginUser.mockResolvedValue({ user: { id: 1, email: 'person@example.com' } })

      renderLoginForm()

      await user.type(screen.getByLabelText(/email/i), 'person@example.com')
      await user.type(screen.getByLabelText(/password/i), 'pass123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(loginUser).toHaveBeenCalledWith({
          email: 'person@example.com',
          password: 'pass123',
        })
      })
    })
  })

  describe('failure cases', () => {
    test('shows an error message when the API rejects', async () => {
      const user = userEvent.setup()
      loginUser.mockRejectedValue(new Error('Invalid credentials'))

      renderLoginForm()

      await user.type(screen.getByLabelText(/email/i), 'person@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrong-password')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })

    test('shows a loading state while the API call is in progress', async () => {
      const user = userEvent.setup()
      loginUser.mockImplementation(() => new Promise(() => {}))

      renderLoginForm()

      await user.type(screen.getByLabelText(/email/i), 'person@example.com')
      await user.type(screen.getByLabelText(/password/i), 'pass123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled()
    })
  })

  describe('edge cases', () => {
    test('does not call the API when submit is clicked with empty fields', async () => {
      const user = userEvent.setup()

      renderLoginForm()

      await user.click(screen.getByRole('button', { name: /sign in/i }))

      expect(loginUser).not.toHaveBeenCalled()
    })
  })
})
