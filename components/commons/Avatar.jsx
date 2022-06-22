import React from 'react';
import Image from 'next/image';
import PropTypes from "prop-types";
import rana from '../../public/images/rana10.png'

export default function Avatar(props) {
    const {image, size} = props;
    let url = null;
    if(!image){
        url = rana
    }else{
        url = image
    }
    return (
        <figure className={`bg-slate-100 rounded-full border border-gray-200 w-[${size || 12}rem] h-[[${size || 12}rem]  overflow-hidden`}>
           <div className=' overflow-hidden grid place-items-center'>
            <Image 
                    src={url} 
                    width={size} 
                    height={size} 
                    layout="fixed"
                    alt='user avatar' 
                    objectFit='fill' 
                />
           </div>
        </figure>
    )
}

Avatar.defaultProps = {
    image: '',
    size: 12
}

Avatar.propTypes = {
    urlImage: PropTypes.any,
    size: PropTypes.number
}