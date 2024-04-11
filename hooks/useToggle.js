import { useState, useCallback } from 'react'

/**
 * Hook para aplicar efecto de `turn on/off`
 * @param initialState {boolean}
 * @returns {[boolean, function(): void]} Estado y callback con {@link  React.useCallback}
 */
const useToggle = (initialState) => {
  /**
   * @type {[boolean, React.Dispatch<SetStateAction<boolean>>]}
   */
	const [state, setState] = useState(initialState)

	const toggle = useCallback(() => setState((state) => !state), [])

	return [state, toggle]
}

export default useToggle
