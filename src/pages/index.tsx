import useSWR from 'swr'
import { FC } from 'react'
import useSWRImmutable from 'swr/immutable'

const Home: FC = () => {
	const { data: status, isLoading } = useSWR('/api/info/status')
	const { data: auth_urls, isLoading: isLoadingAuth } = useSWRImmutable(
		() => `/api/auth/request_link?redirect_to=${window.location.href}`,
		{
			revalidateOnMount: true,
		}
	)

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
