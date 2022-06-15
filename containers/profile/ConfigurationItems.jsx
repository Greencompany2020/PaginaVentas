import React from 'react';
import SubMenuItem from '../../components/commons/SubMenuItem';
import Drawer from '../../components/commons/Drawer';
import useToggle from '../../hooks/useToggle';
import FavoritesContainer from './FavoritesContainer';

export default function ConfigurationItems() {
    const [expand, setExpand] = useToggle();
    return (
        <>
            <div className='grid xs:grid-cols-1 grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4'>
                <SubMenuItem
                    title="Favoritos"
                    description="Selecciona tus accesos favoritos "
                    action={setExpand}
                />
            </div>
            {/*Drawer*/}
            <Drawer expand={expand} handleExpand={setExpand}>
                <FavoritesContainer/>
            </Drawer>
        </>
    )
}
