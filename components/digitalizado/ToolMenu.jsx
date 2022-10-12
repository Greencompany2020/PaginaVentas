import React from 'react'
import { CogIcon, DocumentTextIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function ToolMenu() {
    const router = useRouter();
    const { user } = useSelector(state => state);
    return (
        <aside className="toolmenu">
            <DocumentTextIcon width={32} className='text-white cursor-pointer' onClick={() => router.push("/digitalizacion/politicas")}/>
            {user.isAdmin && <CogIcon width={32} className='text-white cursor-pointer' onClick={() => router.push("/digitalizacion/grupos")}/>}
        </aside>
    )
}
