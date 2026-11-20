import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useInput from './useInput'
import useTheme from './useTheme'

beforeEach(() => { localStorage.clear(); document.documentElement.className = '' })

describe('useInput', () => {
  it('onChange & reset, serta default', () => {
    const { result } = renderHook(() => useInput({ a: '' }))
    act(() => result.current.onChange({ target: { name: 'a', value: 'x' } }))
    expect(result.current.values.a).toBe('x')
    act(() => result.current.reset()); expect(result.current.values.a).toBe('')
    expect(renderHook(() => useInput()).result.current.values).toEqual({})
  })
})

describe('useTheme', () => {
  it('default, toggle, dan aksen', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    act(() => result.current.toggleTheme()); expect(document.documentElement.classList.contains('dark')).toBe(true)
    act(() => result.current.toggleTheme()); expect(result.current.theme).toBe('light')
    act(() => result.current.setAccent('#ff0000')); expect(localStorage.getItem('accent')).toBe('#ff0000')
  })
  it('membaca nilai tersimpan', () => {
    localStorage.setItem('theme', 'dark'); localStorage.setItem('accent', '#00ff00')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark'); expect(result.current.accent).toBe('#00ff00')
  })
})
