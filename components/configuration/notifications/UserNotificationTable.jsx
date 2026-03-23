import generateKey from "../../paginate/generateKey";
import {PlusIcon, MinusIcon} from "@heroicons/react/outline";

/**
 * @typedef {Object} NotificationUserItem
 * @property {number} id - Notification ID
 * @property {string} nombre - The notification name
 * @property {string} medio - The notification medium
 * @property {boolean} activo - Whether the user has this notification assigned
 */

/**
 * @typedef {Object} UserNotificationTableProps
 * @property {Array<NotificationUserItem>} items - The list of notifications
 * @property {(item: NotificationUserItem) => void} assignNotificationToUser - Function to toggle notification assignment
 */

/**
 * Table for assigning notifications to a user.
 * @param {UserNotificationTableProps} props - The component props
 * @returns {JSX.Element} The rendered table component
 */
export default function UserNotificationTable(props) {
  const { items, assignNotificationToUser } = props;

  return (
    <div className="h-[330px] md:h-[420px] overflow-y-auto">
      <table className="w-full">
        <thead className="text-left">
          <tr>
            <th className="bg-slate-300 rounded-l-md lg:table-cell p-1">Nombre</th>
            <th className="bg-slate-300 p-1">Medio</th>
            <th className="bg-slate-300 text-center rounded-r-md p-1">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={generateKey(index)} className="cursor-pointer border-b">
              <td className="py-2 p-1">{item.nombre}</td>
              <td className="py-2 p-1">{item.medio}</td>
              <td className="flex justify-center space-x-1 py-1">
               <button
                 onClick={() => assignNotificationToUser(item)}
                 className={`flex items-center border w-20 px-1 ${item.activo ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500' }`}
               >
                 { item.activo ?
                   <>
                     <MinusIcon width={19}/>
                     Quitar
                   </> :
                   <>
                     <PlusIcon width={19}/>
                     Asignar
                   </>
                 }
               </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
