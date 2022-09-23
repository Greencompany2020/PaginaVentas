import React from 'react';
import Navbar from '../Navbar';
import ToolMenu from '../digitalizado/ToolMenu';

function DigitalizadoLayout({ children }) {
    return (
        <div className="layout-digitalizado">
            <section className="layout-digitalizado-navbar">
                <Navbar/>
            </section>
            <section className="layout-digitalizado-toolmenu">
               <ToolMenu/>
            </section>
            <main className="layout-digitalizado-main">
                {children}
            </main>
        </div>
    )
}

export const getDigitalizadoLayout = page => (
    <DigitalizadoLayout>
        {page}
    </DigitalizadoLayout>
)