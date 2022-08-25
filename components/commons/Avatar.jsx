import React from 'react';
import Image from 'next/image';

export default function Avatar(props) {
    const {image} = props;

    const getImage = () => {
        if(!image || String(image).includes('null')) return '/images/rana10.png';
        else return image;
    }

    return (
       <figure className='relative rounded-full bg-white overflow-hidden h-full w-full'>
            <Image src={getImage()} layout='fill' alt='Avatar' objectFit="cover" objectPosition="center" />
       </figure>
    )
}
