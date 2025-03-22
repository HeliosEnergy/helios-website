import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { router } from './routes.tsx'
import { RouterProvider } from 'react-router-dom'
import { Helmet } from 'react-helmet'

createRoot(document.getElementById('root')!).render(
	<StrictMode>

<Helmet>
				<meta charSet="utf-8" />
				<title>Helios | Monopolizing Optimal AI Territory</title>
			</Helmet>
		<RouterProvider router={router} />
	</StrictMode>,
)
