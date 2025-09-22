import { useEffect, useState } from 'react'
import withAuth from '../components/withAuth'
import { getBaseLayout } from '../components/layout/BaseLayout'
import { useSelector } from 'react-redux'
import DirectAccess from '../components/DirectAccess'
import { v4 } from 'uuid'
import { dashboardButtons } from '../utils/data/dashboardButtons'

const Dashboard = () => {
	const [filteredMenu, setFilteredMenu] = useState(dashboardButtons)
	const { user, access, parameters } = useSelector((state) => state)

	const FavoriteItem = () => {
		if (Array.isArray(access) && access.length) {
			const favoriteItem = access.filter((item) => String(item.Selected).toUpperCase() === 'Y')
			return favoriteItem.map((item) => (
				<DirectAccess key={v4()} name={item.Nombre} link={item.Endpoint} image={'/images/dashboard-icon.png'} />
			))
		}
		return null
	}

	useEffect(() => {
		;(async () => {
			try {
				/** @type {Set<string>} */
				let allow = new Set()

				if (Array.isArray(access) && access.length) {
					const norm = (s) =>
						String(s || '')
							.trim()
							.replace(/\/+$/, '')
							.toLowerCase()

					allow = new Set(
						access
							.filter(
								(a) =>
									String(a?.Enabled).toUpperCase() === 'Y' &&
									typeof a?.Endpoint === 'string' &&
									a.Endpoint.trim().length > 0
							)
							.map((a) => norm(a.Endpoint))
					)

					const isExternal = (href) => /^https?:\/\//i.test(href)
					const normLink = (l) => norm(l)

					const nextMenu = dashboardButtons.filter(({ link }) => (isExternal(link) ? true : allow.has(normLink(link))))

					setFilteredMenu(nextMenu)
				} else {
					setFilteredMenu([])
				}
			} catch (e) {
				setFilteredMenu([])
			}
		})()
	}, [access])

	return (
		<div className="p-8">
			<section>
				<h2 className="text-xl md:text-3xl">
					Bienvenido, <span className="font-semibold">{`${user.Nombre} ${user.Apellidos}`}</span>
				</h2>
			</section>

			<section className="flex flex-col md:flex-row ">
				<div className="flex-1 mt-4 md:mt-0">
					<div className="mb-4">
						<p className="text-right font-bold">Menu</p>
						<hr />
					</div>

					<section className="grid grid-cols-2 xl:grid-cols-4 content-center gap-8">
						{/* Siempre visible */}
						<DirectAccess
							link={parameters?.point || '/diarias/grupo'}
							name={'Estadisticas de ventas'}
							image={'/icons/sales-forecast.svg'}
						/>

						{/* Visible SOLO si el usuario tiene permiso */}
						{filteredMenu.map(({ link, name, image }) => (
							<DirectAccess key={link} link={link} name={name} image={image} />
						))}
					</section>
				</div>

				<div className="flex-1 mt-8 md:mt-0 md:ml-12">
					<div className="mb-4">
						<p className="text-right font-bold">Dashboards</p>
						<hr />
					</div>
					<section className="grid grid-cols-2 xl:grid-cols-4 content-center gap-8">
						<FavoriteItem />
					</section>
				</div>
			</section>
		</div>
	)
}

const DashboardWithAuth = withAuth(Dashboard)
DashboardWithAuth.getLayout = getBaseLayout
export default DashboardWithAuth
