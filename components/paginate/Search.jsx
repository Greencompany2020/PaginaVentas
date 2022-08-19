import React from 'react'
import styles from './style.module.css';
import PropTypes from 'prop-types';

export default function Search(props) {
    const {handleSearch} = props;
    
    const handleChange  = evt => {
        const {value} = evt.target;
        handleSearch(value);
    }

    return (
    <input 
            type='search' 
            placeholder='Search...'
            className={styles.Search}
            onChange={handleChange}
        />
    )
}


//Props obligatiores del componente
Search.propTypes = {
    handleSearch: PropTypes.func.isRequired,
}
