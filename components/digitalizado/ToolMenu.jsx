import React from 'react'
import { PlusIcon, CogIcon, DocumentTextIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';

export default function ToolMenu() {
    const router = useRouter();

    return (
        <aside className="toolmenu">
            <DocumentTextIcon width={32} className='text-white' onClick={() => router.push("/digitalizacion/politicas")}/>
            <CogIcon width={32} className='text-white' onClick={() => router.push("/digitalizacion/grupos")}/>
        </aside>
    )
}
