import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

export default function SubMenuItem(props) {
    const {title, description, action, icon} = props;
    return (
        <div
            className="flex flex-row  h-[5rem] rounded-md shadow-md shadow-gray-300 border cursor-pointer p-2  "
            onClick={action}
        >
           <div className='flex flex-col justify-start w-full h-full'>
                <h5 className='font-semibold'>{title}</h5>
                <p className='text-sm text-gray-500 '>{description}</p>
           </div>
           <figure>
                <Image src={icon} width={24} alt={'icon'}/>
           </figure>
        </div>
    )
}

SubMenuItem.defaultProps = {
    title: 'Sub menu item',
    description: 'Nothing to see here yay',
    icon: ''
}

SubMenuItem.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    action: PropTypes.func,
    icon: PropTypes.any
}