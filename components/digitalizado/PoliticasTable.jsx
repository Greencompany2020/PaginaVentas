import React from 'react';
import { v4 } from 'uuid';

export default function PoliticasTable({ items }) {
    return (
        <table className={"table-politicas"}>
            <thead>
                <tr>
                    <th>Clave</th>
                    <th>Descripcion</th>
                    <th>F.Actualizacion</th>
                    <th>F.Carga</th>
                    <th>Empresa</th>
                    <th>Opc</th>
                </tr>
            </thead>
            <tbody>
                {
                    items && 
                    items.map(item => (
                        <tr key={v4()}>
                            <td>{item.clave}</td>
                            <td>{item.descripcion}</td>
                            <td>{item.fechaVigencia}</td>
                            <td>{item.fechaCarga}</td> 
                            <td>{item.empresa}</td> 
                            <td>hola</td> 
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
