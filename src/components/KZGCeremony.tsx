import { AsBind } from 'as-bind'
import 'module-workers-polyfill.min.js'
import { useEffect, useState } from 'react'

export const useWasm = () => {
	const worker = new Worker('wasm-worker.js', {
		type: 'module',
	})

	const [state, setState] = useState(null)
	useEffect(() => {
		const fetchWasm = async () => {
			const wasm = await fetch('../lib/wasm/pkg/kate_ptau_rs_bg.wasm')
			const instance = await AsBind.instantiate(wasm, {})
			setState(instance)
		}
		fetchWasm()
	}, [])
	return state
}
