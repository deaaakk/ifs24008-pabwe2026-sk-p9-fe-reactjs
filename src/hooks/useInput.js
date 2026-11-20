import { useState } from 'react'

export default function useInput(initial = {}) {
  const [values, setValues] = useState(initial)
  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
  const reset = () => setValues(initial)
  return { values, setValues, onChange, reset }
}
