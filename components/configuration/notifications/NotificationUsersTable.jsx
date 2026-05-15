import generateKey from '../../paginate/generateKey'
import { PlusIcon, MinusIcon } from '@heroicons/react/outline'

/**
 * @typedef {Object} UserNotificationAssignment
 * @property {number} id - User ID
 * @property {string} nombre - User's first name
 * @property {string} apellidos - User's last name
 * @property {string} userCode - User's code / username
 * @property {number} noEmpleado - Employee number
 * @property {boolean} activo - Whether the user has the current notification assigned
 */

/**
 * @typedef {Object} NotificationUsersTableProps
 * @property {Array<UserNotificationAssignment>} items - The list of users and their assignment status
 * @property {(item: UserNotificationAssignment) => void} toggleNotificationToUser - Function to toggle notification assignment for a user
 */

/**
 * Table for assigning a specific notification to multiple users.
 * @param {NotificationUsersTableProps} props - The component props
 * @returns {JSX.Element} The rendered table component
 */
export default function NotificationUsersTable(props) {
	const { items, toggleNotificationToUser } = props

	return (
		<div className="h-[330px] md:h-[420px] overflow-y-auto">
			<table className="w-full">
				<thead className="text-left">
					<tr>
						<th className="bg-slate-300 rounded-l-md lg:table-cell p-1">No. Empleado</th>
						<th className="bg-slate-300 p-1">Usuario</th>
						<th className="bg-slate-300 p-1">Nombre</th>
						<th className="bg-slate-300 text-center rounded-r-md p-1">Acciones</th>
					</tr>
				</thead>
				<tbody>
					{items.map((item, index) => (
						<tr key={generateKey(index)} className="cursor-pointer border-b hover:bg-slate-50">
							<td className="py-2 p-1">{item.noEmpleado}</td>
							<td className="py-2 p-1">{item.userCode}</td>
							<td className="py-2 p-1">{`${item.nombre || ''} ${item.apellidos || ''}`.trim()}</td>
							<td className="flex justify-center space-x-1 py-1">
								<button
									onClick={() => toggleNotificationToUser(item)}
									className={`flex items-center border w-24 px-2 py-1 rounded text-sm ${
										item.activo
											? 'border-red-500 text-red-500 hover:bg-red-50'
											: 'border-green-500 text-green-500 hover:bg-green-50'
									}`}
								>
									{item.activo ? (
										<>
											<MinusIcon width={16} className="mr-1" />
											Quitar
										</>
									) : (
										<>
											<PlusIcon width={16} className="mr-1" />
											Asignar
										</>
									)}
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
