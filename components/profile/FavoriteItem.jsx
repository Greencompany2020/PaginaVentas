import React from 'react';
import Link from 'next/link';
import {LockClosedIcon, LockOpenIcon, EyeIcon, EyeOffIcon} from '@heroicons/react/solid';

export default function FavoriteItem(props) {
    const {id, name, isFavorite, hasAccess, linkTo, setFavorite} = props;

    const handleSetFavorite = () =>{
        setFavorite(id, isFavorite);
    }
    return (
        <li>
            <div className='h-[5rem] mt-4 border rounded-md bg-gray-100'>
                <div className='h-full w-full p-2 flex justify-between items-center'>
                    <Link href={linkTo}>
                        <a className='text-lg truncate text-blue-500'>{name}</a>
                    </Link>
                    <div className='space-y-2'>
                        {
                            hasAccess == 'Y' ? 
                            <LockOpenIcon width={26} className='text-gray-500'/> : 
                            <LockClosedIcon width={26}/>
                        }
                        {
                            isFavorite == 'Y' ? 
                            <EyeIcon width={26} onClick={handleSetFavorite} className='text-blue-500 cursor-pointer'/> : 
                            <EyeOffIcon width={26} onClick={handleSetFavorite} className={`text-gray-500 cursor-pointer ${hasAccess=='Y' && 'hover:text-blue-500'}`}/> 
                        }
                    </div>
                </div>
            </div>
        </li>
    )
}
