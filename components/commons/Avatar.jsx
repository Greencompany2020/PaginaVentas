import React from 'react';
import Image from 'next/image';
import rana from '../../public/images/rana10.png'

export default function Avatar(props) {
    const {image} = props;
    return (
       <figure className='relative rounded-full bg-white overflow-hidden h-full w-full'>
            <Image src={image || rana} layout='fill' alt='Avatar' objectFit="cover" objectPosition="center" />
       </figure>
    )
}
