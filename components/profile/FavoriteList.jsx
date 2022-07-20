import React from 'react';
import { groupBykey } from '../../utils/functions';
import FavoriteItem from './FavoriteItem';
import { v4 } from 'uuid';

export default function FavoriteList(props) {
    const {items, setFavorite} = props;
    if(items){
        const groups = groupBykey(items, "Clase");
        const Items = Object.keys(groups).map((group, index)=>(
            <li key={v4()} className='list-none'>
                <div className='mb-6 border-l-2 pl-2'>
                    <span className="font-semibold text-xl">{group}</span>
                    <ul className='list-none space-y-2 mt-2'>
                        {groups[group].map((item) => (
                            <FavoriteItem 
                                key={item.IdDashboardUsr}
                                id={item.IdDashboardUsr}
                                name={item.Nombre}
                                isFavorite={item.Selected}
                                hasAccess={item.Enabled}
                                linkTo={item.Endpoint}
                                setFavorite={setFavorite}
                            />
                        ))}
                    </ul>
            </div>
           </li>
        ));
        return <ul>{Items}</ul>
        
    }
    return null;
   
}
