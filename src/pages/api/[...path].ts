import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const response = await fetch(buildPath(req), {
		method: req.method,
	})

	res.status(response.status).json(await response.json())
}

const buildPath = (req: NextApiRequest) => {
	const query = Object.entries(req.query)
		.filter(([key]) => key !== 'path')
		.map(([key, value]) => `${key}=${value}`)
		.join('&')

	return `${process.env.NEXT_PUBLIC_COORDINATOR_URL}/${(req.query.path as string[]).join('/')}${
		query ? `?${query}` : ''
	}`
}

export default handler
