import useAuthStore from '@/store/authStore'

export const api = <R extends Record<string, unknown>>(
	path: string,
	method: string = 'GET',
	body?: Record<string, unknown>
): Promise<R> => {
	const token = useAuthStore.getState().authResponse?.session_id

	return fetch(`${process.env.NEXT_PUBLIC_COORDINATOR_URL}${path}`, {
		method,
		headers: {
			'Content-Type': 'application/json',
			Authorization: token ? `Bearer ${token}` : undefined,
		},
		body: body ? JSON.stringify(body) : undefined,
	}).then(response => response.json())
}
