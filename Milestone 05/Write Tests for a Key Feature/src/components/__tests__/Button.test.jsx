import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
  describe('happy path', () => {
    test('renders the correct label text from the label prop', () => {
      render(<Button label="Save changes" />)

      expect(
        screen.getByRole('button', { name: /save changes/i })
      ).toBeInTheDocument()
    })

    test('calls the onClick handler exactly once when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()

      render(<Button label="Submit" onClick={handleClick} />)

      await user.click(screen.getByRole('button', { name: /submit/i }))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('failure cases', () => {})

  describe('edge cases', () => {
    test('is disabled and does not call onClick when disabled is true', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()

      render(<Button label="Submit" onClick={handleClick} disabled />)

      const button = screen.getByRole('button', { name: /submit/i })
      expect(button).toBeDisabled()

      await user.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })
})
