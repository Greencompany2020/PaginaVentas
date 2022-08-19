import React from 'react'
import styles from './style.module.css'

export default function ShowSelector(props) {
    const {labelSelector, optionRange, handleChangeRange} = props;
    const handleChange = evt => {
        const {value} = evt.target;
        handleChangeRange(value);
    }
    
    return (
        <div className={styles.Selector}>
            <label>{labelSelector}</label>
            <select onChange={handleChange}>
               {optionRange.map((item, index) => (
                   <option key={index} value={item}>{item}</option>
               ))}
            </select>
        </div>
    )
}
