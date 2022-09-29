import { SWRConfig } from 'swr'
import 'tailwindcss/tailwind.css'
import { ThemeProvider } from 'next-themes'
import Web3Provider from '@/components/Web3Provider'

const swrConfig = {
	fetcher: url => fetch(url).then(res => res.json()),
}

const App = ({ Component, pageProps }) => {
	return (
		<ThemeProvider attribute="class">
			<SWRConfig value={swrConfig}>
				<Web3Provider>
					<Component {...pageProps} />
				</Web3Provider>
			</SWRConfig>
		</ThemeProvider>
	)
}

export default App
