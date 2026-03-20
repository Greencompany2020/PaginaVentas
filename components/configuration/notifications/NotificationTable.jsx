import { PencilAltIcon } from "@heroicons/react/outline";
import { v4 } from "uuid";

/**
 * @typedef {Object} NotificationItem
 * @property {number} id
 * @property {string} nombre
 * @property {string} medio
 */

/**
 * @typedef {Object} NotificationTableProps
 * @property {Array<NotificationItem>} items
 * @property {(item: NotificationItem) => void} handleSelect
 * @property {() => void} handleShowModal
 */

export default function NotificationTable(props) {
  const { items, handleSelect, handleShowModal } = props;
  return (
    <div className="h-[500px] w-full overflow-auto">
      <table className="w-full overflow-auto">
        <thead className="text-left">
          <tr>
            <th className="bg-slate-300 rounded-l-md p-1">Nombre</th>
            <th className="bg-slate-300 p-1">Medio</th>
            <th className="bg-slate-300 text-center rounded-r-md p-1">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={v4()} className="cursor-pointer border-b" onClick={() => handleSelect(item)}>
              <td className="p-2">{item.nombre}</td>
              <td className="p-2">{item.medio}</td>
              <td className="flex justify-center space-x-1 p-2">
                <PencilAltIcon
                  width={26}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={handleShowModal}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
