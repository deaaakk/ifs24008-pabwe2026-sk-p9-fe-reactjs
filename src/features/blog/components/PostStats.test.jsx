import { it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PostStats from './PostStats'

it('menampilkan 3 kartu, dengan & tanpa data', () => {
  const { unmount } = render(<PostStats stats={{ total: 5, published: 3, draft: 2 }} />)
  expect(screen.getByText('Total Artikel').nextSibling).toHaveTextContent('5')
  expect(screen.getByText('Belum Selesai/Draf').nextSibling).toHaveTextContent('2')
  unmount()
  render(<PostStats />)
  expect(screen.getByText('Total Terbit').nextSibling).toHaveTextContent('0')
})
