import React from 'react';
import Image from 'next/image';
import PropTypes from "prop-types";
import rana from '../../public/images/rana10.png'

export default function Avatar(props) {
    const {image, size} = props;
    console.log(image);
    const url = (image !== '') ? image : rana
    return (
        <figure className={`bg-slate-100 rounded-full w-[${size}rem] h-[[${size}rem] grid place-items-center overflow-hidden`}>
           <Image 
                src={url} 
                width={size} 
                height={size} 
                layout={"intrinsic"}  
                alt='user avatar' 
                objectFit='cover' 
            />
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