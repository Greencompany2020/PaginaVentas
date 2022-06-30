import React, { useState } from 'react';
import { v4 } from 'uuid';
import SubMenuItem from '../../components/commons/SubMenuItem';
import Drawer from '../../components/commons/Drawer';
import useToggle from '../../hooks/useToggle';
import FavoritesContainer from './FavoritesContainer';
import ParameterContainers from './ParameterContainers';

export default function ConfigurationItems() {
    const [expand, setExpand] = useToggle();
    const [selectOption, setSelectOption] = useState('');

    const handleSelectOption = container => {
        setSelectOption(container);
        setExpand();
    }

    const SelectContainer = () => {
        switch(selectOption){
            case 'Favoritos':
                return <FavoritesContainer/>
            case 'Parametros':
                return <ParameterContainers/>
            default:
                return <p>IDK</p>
        }
    }

    return (
        <>
            <div className='grid xs:grid-cols-1 grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4'>
                <SubMenuItem
                    key={v4()}
                    title="Favoritos"
                    description="Selecciona tus accesos favoritos"
                    action={()=> handleSelectOption('Favoritos')}
                />
                <SubMenuItem
                    key={v4()}
                    title="Parametrizaciones"
                    description="Parametriza las opciones de reporte"
                    action={()=> handleSelectOption('Parametros')}
                />
            </div>
            {/*Drawer*/}
            <Drawer expand={expand} handleExpand={setExpand}>
               {SelectContainer()}
            </Drawer>
        </>
    )
}
