import { describe, it, expect, vi } from 'vitest'
import Swal from 'sweetalert2'
import { alertSuccess, alertError, confirmDialog, formatDate } from './toolsHelper'

vi.mock('sweetalert2', () => ({ default: { fire: vi.fn() } }))

describe('toolsHelper', () => {
  it('alert', () => {
    alertSuccess('ok'); alertError('no')
    expect(Swal.fire).toHaveBeenCalledTimes(2)
  })
  it('confirmDialog', async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true }); expect(await confirmDialog('?')).toBe(true)
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false }); expect(await confirmDialog('?')).toBe(false)
  })
  it('formatDate', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate('2026-01-05T00:00:00Z')).toContain('2026')
  })
})
