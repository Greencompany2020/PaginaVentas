import React from 'react';
import Select from './Select'

export default function SelectYear(props) {
    const currentYear = new Date().getFullYear();
    return (
        <Select {...props}>
            {
                (()=>{
                    if(currentYear){
                    const Items = []
                    for(let dem = currentYear; dem >= 2000; dem--){
                        Items.push(<option value={dem} key={dem}>{dem}</option>)
                    }
                    return Items;
                    }
                })()
            }
        </Select>
    )
}
