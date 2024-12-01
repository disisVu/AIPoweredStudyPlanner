import { useCallback, useState } from 'react'

export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState<boolean>(initialValue)

  const toggle = useCallback(() => {
    setValue((prevValue) => !prevValue)
  }, [])

  return { value, toggle }
}
