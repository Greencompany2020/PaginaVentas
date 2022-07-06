import React from 'react';
import Image from 'next/image';
import PropTypes from "prop-types";
import rana from '../../public/images/rana10.png'

export default function Avatar(props) {
    const {image, size} = props;
    let url = null;
    if(!image || image.includes('null')){
        url = rana;
    }else{
        url = image
    }

    return (
       <figure className={`relative rounded-full border-2 border-gray-200 bg-white overflow-hidden w-[${size || 3}rem] h-[${size || 3}rem]`}>
        <Image src={url} layout='fill' alt='Avatar' objectFit="contain" objectPosition="center" />
       </figure>
    )
}

Avatar.defaultProps = {
    image: '',
    size: 3
}

Avatar.propTypes = {
    urlImage: PropTypes.any,
    size: PropTypes.number
}