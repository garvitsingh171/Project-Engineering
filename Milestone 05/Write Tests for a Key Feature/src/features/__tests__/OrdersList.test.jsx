import { render, screen, waitFor } from '@testing-library/react'
import OrdersList from '../OrdersList'
import { fetchOrders } from '../../api/orders'

jest.mock('../../api/orders')

describe('OrdersList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('happy path', () => {
    test("renders each order's name when the API returns orders", async () => {
      fetchOrders.mockResolvedValue([
        { id: 1, name: 'Desk Lamp', date: '2026-07-01', status: 'Delivered' },
        { id: 2, name: 'Office Chair', date: '2026-07-02', status: 'In Transit' },
      ])

      render(<OrdersList />)

      expect(await screen.findByText(/desk lamp/i)).toBeInTheDocument()
      expect(screen.getByText(/office chair/i)).toBeInTheDocument()
    })
  })

  describe('failure cases', () => {
    test('renders an error message when the API rejects', async () => {
      fetchOrders.mockRejectedValue(new Error('Failed to fetch orders'))

      render(<OrdersList />)

      expect(
        await screen.findByText(/something went wrong loading your orders/i)
      ).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    test('renders the empty state when the API returns an empty array', async () => {
      fetchOrders.mockResolvedValue([])

      render(<OrdersList />)

      expect(await screen.findByText(/no orders yet/i)).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByRole('list')).not.toBeInTheDocument()
      })
    })
  })
})
