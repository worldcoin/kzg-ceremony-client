import useSWR from 'swr'
import { FC, useCallback, useEffect } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useRouter } from 'next/router'
import useAuthStore, { AuthResponse, AuthStore } from '@/store/authStore'
import { api } from '@/lib/api'
import useContributionStore, { ContributionStore, CONTRIBUTION_STATE } from '@/store/contributionStore'

const getAuthParams = (store: AuthStore) => ({
	setAuthResponse: store.setAuthResponse,
	session_id: store.authResponse?.session_id,
	isAuthenticated: !!store.authResponse?.session_id,
})

const getContributionParams = (store: ContributionStore) => ({ setStatus: store.setStatus })

const Home: FC = () => {
	const router = useRouter()
	const { data: status, isLoading } = useSWR('/info/status')
	const { setStatus } = useContributionStore(getContributionParams)
	const { isAuthenticated, session_id, setAuthResponse } = useAuthStore(getAuthParams)

	const { data: auth_urls, isLoading: isLoadingAuth } = useSWRImmutable(
		() => `/auth/request_link?redirect_to=${window.location.href}`,
		{ revalidateOnMount: true, isPaused: () => isAuthenticated }
	)

	const onContribute = useCallback(
		(res: { code: CONTRIBUTION_STATE; message: string }) => {
			setStatus(res.code)
			console.log('contribute response:', res)
		},
		[setStatus]
	)

	useEffect(() => {
		if (!router.query.session_id || isAuthenticated) return

		setAuthResponse(router.query as AuthResponse)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query])

	useEffect(() => {
		if (!session_id) return

		const tryContribute = async () => {
			onContribute(
				await api<{ code: CONTRIBUTION_STATE; message: string }>('/lobby/try_contribute', 'POST', {
					session_id,
				})
			)
		}

		tryContribute()

		const interval = setInterval(tryContribute, 30000)
		return () => clearInterval(interval)
	}, [onContribute, session_id])

	return (
		<div className="space-y-10 p-10">
			<div>
				<h2 className="mb-1 text-2xl font-medium">Status:</h2>
				{isLoading ? (
					<span>Loading...</span>
				) : (
					<div>
						<p>Lobby size: {status.lobby_size}</p>
						<p>Number of contributions: {status.num_contributions}</p>
						<p>Sequencer Address: {status.sequencer_address}</p>
					</div>
				)}
			</div>
			<div>
				<h2 className="mb-1 text-2xl font-medium">Authentication:</h2>
				{isLoadingAuth || !auth_urls ? (
					<span>Loading...</span>
				) : (
					<div className="space-x-3">
						<a className="border py-1 px-2" href={auth_urls?.eth_auth_url}>
							Log in with Ethereum
						</a>
						<a className="border py-1 px-2" href={auth_urls?.github_auth_url}>
							Log in with GitHub
						</a>
					</div>
				)}
			</div>
		</div>
	)
}

export default Home
