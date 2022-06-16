import React from 'react';
import { groupBykey } from '../../utils/functions';
import FavoriteItem from './FavoriteItem';
export default function FavoriteList(props) {
    const {items, setFavorite} = props;
    if(items){
        const groups = groupBykey(items, "Clase");
        const Items = Object.keys(groups).map((group, index)=>(
           <div key={index} className='mt-4 border-l-2 pl-2'>
            <span className="sticky font-bold text md:text-xl">{group}</span>
            {groups[group].map((item, indexItem) => (
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
           </div>
        ));
        return Items;
    }
    return null;
   
}
