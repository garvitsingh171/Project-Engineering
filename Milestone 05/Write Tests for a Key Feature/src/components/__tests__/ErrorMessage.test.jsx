import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorMessage from '../ErrorMessage'

describe('ErrorMessage', () => {
  describe('happy path', () => {
    test('renders the message prop text', () => {
      render(<ErrorMessage message="Something went wrong" />)

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })

    test('renders a Try again button when onRetry is provided and calls onRetry when clicked', async () => {
      const user = userEvent.setup()
      const onRetry = jest.fn()

      render(<ErrorMessage message="Could not load data" onRetry={onRetry} />)

      await user.click(screen.getByRole('button', { name: /try again/i }))

      expect(onRetry).toHaveBeenCalledTimes(1)
    })
  })

  describe('failure cases', () => {})

  describe('edge cases', () => {
    test('does not render a retry button when onRetry is not provided', () => {
      render(<ErrorMessage message="Could not load data" />)

      expect(
        screen.queryByRole('button', { name: /try again/i })
      ).not.toBeInTheDocument()
    })
  })
})
