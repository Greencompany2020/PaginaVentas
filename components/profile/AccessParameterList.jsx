import React,{useState} from 'react'
import ParameterAccesItem from './ParameterAccesItem';
import { groupBykey } from '../../utils/functions';
import { v4 } from 'uuid';

export default function AccessParameterList(props) {
    const {items} = props;
    const [selected, setSelected] = useState(undefined);
    
    if(items){
        const groups = groupBykey(items, "Clase");
        const Items = Object.keys(groups).map((group)=>(
            <li key={v4()} className='list-none'>
                <div key={v4()} className='mb-6 border-l-2 pl-2'>
                    <span className="font-semibold text-xl">{group}</span>
                    <ul className='list-none space-y-2 mt-2'>
                        {groups[group].map((item) => (
                            <ParameterAccesItem
                                key={item.IdDashboardUsr}
                                id={item.IdDashboardUsr}
                                name={item.Nombre}
                                linkTo={item.Endpoint}
                                setSelected = {setSelected}
                                isSelected= {selected == item.IdDashboardUsr}
                                idAccess = {item.IdProyectAcceso}
                            />
                        ))}
                    </ul>
                </div>
            </li>
        ));
        return <ul>{Items}</ul>
    }
    return null
}
