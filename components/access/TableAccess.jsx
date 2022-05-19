import {PlusCircleIcon,CogIcon} from '@heroicons/react/outline';
import Pagination from '../Pagination';
import TooggleSwitch from '../inputs/TooggleSwitch';

const TableRows = ({items,updateUserAccess, handleAssign}) => {
    if(!items) return <></>
    const rows = items.map((item, index)=> {
        const handleSwitch = () => handleAssign(item.idDashboard,item.acceso)
        return(
            <tr key={index}>
                <td className='hidden lg:table-cell'>{item.menu}</td>
                <td className='hidden lg:table-cell'>{item.reporte}</td>
                <td >{item.nombreReporte}</td>
                <td className='flex justify-center'> <CogIcon width={32}/></td>
                <td > <TooggleSwitch key={index} id={item.idDashboard} value={item.acceso} onChange={handleSwitch}/> </td>
            </tr>
        )
    });
    return rows;
}


const TableAccess = ({data, handleSearch, pages, current, next, updateUserAccess, handleAssign}) => {
    return(
        <div className="flex items-start space-x-1">
            <div className="flex-1 space-y-8 overflow-hidden">
                <div className=' overflow-y-auto '>
                    <table className='min-w-full'>
                        <thead className="text-left">
                            <tr>
                                <th className='bg-slate-300 rounded-l-md p-1 hidden  lg:table-cell'>Menu</th>
                                <th className='bg-slate-300 p-1 hidden lg:table-cell'>Reporte</th>
                                <th className='bg-slate-300 rounded-l-md  p-1 lg:rounded-l-none'>Nombre reporte</th>
                                <th className='bg-slate-300 p-1 text-center'>Configuracion</th>
                                <th className='bg-slate-300 rounded-r-md p-1'>Acceso</th>
                            </tr>
                            <tr>
                                <th colSpan={5}>
                                    <input
                                        className=" bg-yellow-100 w-full rounded-md border-2 h-8 pl-2"
                                        placeholder='Buscar...'
                                        onChange={handleSearch}
                                    />
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <TableRows items={data} updateUserAccess={updateUserAccess} handleAssign={handleAssign}/>
                        </tbody>
                    </table>
                </div>
                <Pagination pages={pages} current={current} next={next}/>
            </div>
            <PlusCircleIcon 
                width={32} 
                className="block cursor-pointer"
            />
        </div>
    )
}

export default TableAccess;