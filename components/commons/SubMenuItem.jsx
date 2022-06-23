import React from 'react';
import PropTypes from 'prop-types';

export default function SubMenuItem(props) {
    const {title, description, action} = props;
    return (
        <div 
            className="col-auto h-[5rem] rounded-md shadow-md shadow-gray-300 border cursor-pointer p-2  "
            onClick={action}
        >
           <div className='flex flex-col justify-center w-full h-full pl-4'>
                <h5 className='text-lg font-semibold'>{title}</h5>
                <p className='text-sm text-gray-500 '>{description}</p>
           </div>
        </div>
    )
}

SubMenuItem.defaultProps = {
    title: 'Sub menu item',
    description: 'Nothing to see here yay'
}

SubMenuItem.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    action: PropTypes.func
}