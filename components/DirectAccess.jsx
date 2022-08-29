import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function DirectAccess({name, link, image}) {
  return (
    <Link href={link}>
        <a className='flex flex-col h-36 rounded-md bg-gray-100 overflow-hidden shadow-md transform ease-in-out duration-100 hover:p-4'>
           <div className='flex-[3] p-4'>
                <figure className='relative h-full w-full'>
                    <Image src={image} alt={'Acceso directo'} layout='fill' objectFit={'contain'} objectPosition={'center'}/>
                </figure>
           </div>
           <div className='flex-1'>
                <p className='text-center font-semibold'>{name}</p>
           </div>
        </a>
    </Link>
  )
}
